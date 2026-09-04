# Intelligent Freight Forecasting and Charter Decision System

**Smart India Hackathon 2026. Problem Statement SIH26006.**
**Organisation:** Ministry of Steel | **Department:** SAIL

## Overview

This project is an advanced Intelligent Freight Forecasting and Charter Decision System designed to optimize chartering operations for dry bulk cargo. The system answers four critical questions for a chartering manager:

1. Which East Coast discharge port should this cargo come into?
2. Which vessel class should be chartered?
3. Should the charter be fixed today, or should we wait?
4. Should this be a single spot fix or part of a longer-term contract?

By incorporating a complex constraint engine (Draft, LOA, Beam, DWT) and calculating the **delivered cost per tonne**, the system avoids the trap of deceptively low freight rates that mask high landed costs due to draft-restricted partial loading.

## Architecture

The system follows a modern microservices architecture designed for both extreme low-latency response and robust machine learning capabilities:

- **ML Service (Python & FastAPI):** Houses the deterministic constraint filtering, capacity adjustment logic, cost model, and forecast engine.
- **API Gateway (Node.js & Express):** Serves as a secure unified entry point and handles request persistence.
- **Frontend (React, Vite & Tailwind CSS):** A visually stunning, highly responsive UI employing modern aesthetics (glassmorphism) with three main screens:
  - Decision Console
  - Market & Forecast
  - Port Intelligence
- **Database (MongoDB):** Persists scenario data, generated forecasts, reference data, and constraints.

## Honesty Commitments

1. Freight indices behave close to a random walk at short horizons. We report a **skill score** against naive persistence. Where the model has no predictive skill, we explicitly state it rather than display a false confidence band.
2. Port cost, demurrage, and inland cost figures are assumptions drawn from public tariffs, clearly labeled as such, and user editable.
3. Every port constraint value carries a clickable source citation because published sources frequently disagree.
4. We do not claim real-time vessel tracking or licensed broker data. Synthetic Baltic Index data is used for this prototype demo.

## Running the Application Locally

The entire stack is containerized for offline demonstration capability, ensuring no live external API calls are required during judging.

### Prerequisites
- Docker and Docker Compose

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArghyadeepNaiya/SIH-PS-26006-Freight-forcasting.git
   cd SIH-PS-26006-Freight-forcasting
   ```

2. **Start the containers:**
   ```bash
   docker-compose up -d --build
   ```

3. **Seed the Database:**
   Wait 5-10 seconds for MongoDB to start, then run the seed script:
   ```bash
   docker-compose exec ml-service python app/data/seed.py
   ```

4. **Access the Application:**
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **API Gateway:** [http://localhost:3000](http://localhost:3000)
   - **ML Service Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

## Documentation

Full detailed documentation is available in the `docs/` directory:
- [PROJECT.md](docs/PROJECT.md)
- [REQUIREMENTS.md](docs/REQUIREMENTS.md)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [ROADMAP.md](docs/ROADMAP.md)