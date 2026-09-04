# ARCHITECTURE.md

Intelligent Freight Forecasting and Charter Decision System

---

## 1. Architectural principle

Split the work into what runs overnight and what runs when the user clicks.

Overnight, we pull data, engineer features, retrain models and pre compute forecasts
for every vessel class at every horizon. On click, we do lookups and arithmetic only.

This is the decision that makes the demo instant instead of laggy, and it is worth
stating explicitly during judging.

---

## 2. Services

There are three services and one database.

1. Web. React. Talks only to the Express gateway.
2. API. Node and Express. Handles requests, persistence, and calls the ML service.
3. ML. Python and FastAPI. Holds forecasting, constraints, capacity and cost logic.
4. Database. MongoDB.

Why React does not call Python directly. A single entry point keeps request logging,
scenario saving and future authentication in one place. Say this in one sentence at
judging and a security minded evaluator will notice.

---

## 3. Nightly batch pipeline

Runs on a schedule. Also runnable manually by command.

1. Ingest freight rate history for each vessel class from the configured source file
   or API.
2. Ingest commodity prices, bunker prices and economic indicators.
3. Ingest published port position reports to derive a congestion proxy.
4. Validate and deduplicate. Reject rows outside plausible ranges.
5. Build the feature matrix. Lags, rolling means, rolling volatility, day of week,
   month, and exogenous series.
6. Train the naive baseline, the statistical model and the gradient boosted model.
7. Evaluate with expanding window time series cross validation. Compute skill score
   against naive persistence at every horizon.
8. Persist trained models to disk and forecasts to MongoDB.
9. Write a run record with timestamps, row counts and metric values.

---

## 4. Request time pipeline

Target latency under one second.

Step 1. Candidate generation.
Take the cargo quantity and origin. Build every combination of vessel class and East
Coast discharge port. Four classes by seven ports gives under thirty candidates.

Step 2. Hard constraint filtering.
For each candidate, check maximum draft, length overall, beam and deadweight against
the port constraint record. Mark infeasible candidates as rejected with a stated
reason. Do not silently drop them. The rejections are useful output.

Step 3. Capacity adjustment.
For each surviving candidate, compute the tonnes actually deliverable given the draft
limit, and flag whether lightering at anchorage is required.

Step 4. Cost assembly.
Look up the pre computed forecast rate for that vessel class over the required
arrival window. Add port charges, expected demurrage derived from current congestion,
lightering cost where required, and inland movement cost to the destination plant.
Divide the total by deliverable tonnes to obtain landed cost per tonne.

Step 5. Ranking.
Sort surviving candidates by landed cost per tonne ascending.

Step 6. Timing decision.
Compare the cost of fixing today against the forecast distribution of cost across the
acceptable window. If the expected saving from waiting exceeds the downside risk by
the configured margin, recommend waiting. Otherwise recommend fixing now. If a split
parcel beats every single vessel option, recommend splitting.

Step 7. Explanation assembly.
Attach the two or three factors that most influenced the answer, plus the assumption
set used.

Step 8. Response.
Return one JSON payload containing recommendation, ranked options, rejected options,
forecast summary and assumptions.

---

## 5. API contracts

### 5.1 Express gateway, public

POST /api/recommend

Request body fields.
1. cargo_type. String. One of coking_coal, thermal_coal, limestone.
2. quantity_tonnes. Number.
3. origin. String. One of australia, usa, mozambique, russia, indonesia.
4. earliest_arrival. ISO date string.
5. latest_arrival. ISO date string.
6. destination_plant. Optional string.
7. destination_port. Optional string. If absent, the system selects.
8. overrides. Optional object of assumption overrides.

Response body fields.
1. recommendation. Object with action, headline, reason and confidence_label.
   Action is one of fix_now, wait, split.
2. options. Array of option objects, ranked.
3. rejected. Array of rejected candidate objects with reason.
4. forecast_summary. Object with horizon days, forecast band and skill score.
5. assumptions. Object listing every assumption value used and whether it was
   defaulted or overridden.
6. generated_at. ISO timestamp.

Option object fields.
1. vessel_class.
2. discharge_port.
3. nominal_capacity_tonnes.
4. deliverable_tonnes.
5. load_percentage.
6. requires_lightering. Boolean.
7. landed_cost_per_tonne.
8. cost_breakdown. Object with freight, port_charges, expected_demurrage,
   lightering, inland.
9. reason. One line string.

Rejected object fields.
1. vessel_class.
2. discharge_port.
3. failed_constraint. One of draft, loa, beam, dwt.
4. limit_value.
5. required_value.
6. source_citation.

Other endpoints.
1. GET /api/ports. Reference data with citations.
2. GET /api/vessels. Vessel class reference data.
3. GET /api/rates. Historical series with forecast band, filtered by vessel class.
4. POST /api/scenarios. Save a scenario.
5. GET /api/scenarios. List saved scenarios.

### 5.2 ML service, internal only

1. POST /ml/recommend. Full pipeline. Called by Express.
2. POST /ml/forecast. Forecast only, for a vessel class and horizon.
3. GET /ml/skill. Skill scores by vessel class and horizon.
4. GET /ml/health.

---

## 6. MongoDB collections

1. rate_history. One document per vessel class per date. Fields are vessel_class,
   date, index_value, tce_usd_per_day, source.
2. commodity_history. Date, series name, value, source.
3. congestion_history. Port, date, vessels_at_berth, vessels_at_anchorage,
   estimated_wait_days, source.
4. ports. Port code, name, max_draft_m, max_loa_m, max_beam_m, max_dwt,
   lightering_available, lightering_cost_per_tonne, port_charge_per_tonne,
   and a citations object holding a source URL for every numeric field.
5. vessel_classes. Class name, dwt_min, dwt_max, typical_loa_m, typical_beam_m,
   typical_laden_draft_m.
6. routes. Origin, discharge port, distance_nm, typical_voyage_days.
7. cost_assumptions. Key, value, unit, source, editable flag.
8. forecasts. Vessel class, generated_at, horizon_days, point, lower, upper.
9. model_runs. Run timestamp, row counts, metrics, skill scores.
10. scenarios. Saved user inputs and the response returned.
11. decision_log. Phase two. Recommendation, user decision, later outcome.

Indexes. Compound index on rate_history by vessel_class and date. Index on forecasts
by vessel_class and generated_at.

---

## 7. Reference data strategy

Port constraints, vessel classes and routes live as version controlled JSON files in
the repository and are loaded into MongoDB by a seed script.

Reason. These values are small, rarely change, and every number needs a source
citation that must be reviewable in a pull request. Storing them only in a database
hides the provenance.

Rule. Every numeric field in ports.json carries a matching entry in its citations
object. A value without a citation must not be merged.

---

## 8. Model layer design

Three models, always compared, never one alone.

1. Baseline. Naive persistence. Tomorrow equals today. This is the number every
   other model must beat.
2. Statistical. Seasonal decomposition plus an autoregressive model. Interpretable,
   fast, and often competitive.
3. Learned. Gradient boosting on lagged and exogenous features.

Evaluation is expanding window time series cross validation. Never a random split.

Reported metrics.
1. Mean absolute error at each horizon.
2. Skill score, defined as one minus the model error divided by the baseline error.
   Positive means better than doing nothing. Zero or negative means no skill.
3. Coverage of the prediction interval, meaning how often reality fell inside the
   band we drew.

Rule. If skill score is not positive at a horizon, the interface must show a no skill
banner for that horizon rather than a confident forecast.

---

## 9. File tree

```
freight-decision-system/
├── README.md
├── docker-compose.yml
├── .env.example
│
├── docs/
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   ├── REQUIREMENTS.md
│   └── ROADMAP.md
│
├── data/
│   ├── raw/
│   │   ├── baltic_indices.csv
│   │   └── commodity_prices.csv
│   ├── reference/
│   │   ├── ports.json
│   │   ├── vessel_classes.json
│   │   ├── routes.json
│   │   └── cost_assumptions.json
│   └── processed/
│       └── .gitkeep
│
├── ml-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   │   ├── routes_recommend.py
│   │   │   ├── routes_forecast.py
│   │   │   └── routes_health.py
│   │   ├── core/
│   │   │   ├── candidates.py
│   │   │   ├── constraints.py
│   │   │   ├── capacity.py
│   │   │   ├── cost_model.py
│   │   │   └── decision.py
│   │   ├── forecasting/
│   │   │   ├── baseline.py
│   │   │   ├── features.py
│   │   │   ├── train.py
│   │   │   ├── predict.py
│   │   │   └── evaluate.py
│   │   ├── data/
│   │   │   ├── loaders.py
│   │   │   ├── synthetic.py
│   │   │   └── seed.py
│   │   └── schemas/
│   │       ├── request.py
│   │       └── response.py
│   ├── models/
│   │   └── .gitkeep
│   ├── tests/
│   │   ├── test_constraints.py
│   │   ├── test_capacity.py
│   │   ├── test_cost_model.py
│   │   └── test_evaluate.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── api/
│   ├── src/
│   │   ├── server.js
│   │   ├── config.js
│   │   ├── routes/
│   │   │   ├── recommend.js
│   │   │   ├── reference.js
│   │   │   ├── rates.js
│   │   │   └── scenarios.js
│   │   ├── controllers/
│   │   ├── models/
│   │   │   ├── Port.js
│   │   │   ├── RateHistory.js
│   │   │   └── Scenario.js
│   │   └── services/
│   │       └── mlClient.js
│   ├── package.json
│   └── Dockerfile
│
└── web/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── DecisionConsole.jsx
    │   │   ├── MarketForecast.jsx
    │   │   └── PortIntelligence.jsx
    │   ├── components/
    │   │   ├── CargoInputForm.jsx
    │   │   ├── RecommendationBanner.jsx
    │   │   ├── OptionCard.jsx
    │   │   ├── RejectedOptionCard.jsx
    │   │   ├── CostBreakdown.jsx
    │   │   ├── ForecastChart.jsx
    │   │   ├── SkillPanel.jsx
    │   │   └── AssumptionsPanel.jsx
    │   ├── api/
    │   │   └── client.js
    │   └── styles/
    ├── package.json
    └── Dockerfile
```

---

## 10. Deployment

Local development runs three processes plus MongoDB.

Production demo runs docker compose with four containers. Everything must work with
no internet connection once data is seeded, because a live API call during a
presentation is an unnecessary way to fail.
