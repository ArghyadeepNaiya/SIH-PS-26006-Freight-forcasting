def compute_cost(candidate, capacity_info, assumptions, forecast_rate):
    port = candidate["port_details"]
    vessel = candidate["vessel_details"]
    
    deliverable_tonnes = capacity_info["deliverable_tonnes"]
    
    # Costs
    freight_rate = forecast_rate # USD per day roughly, or per tonne. For Baltic Exchange, usually TCE in USD/day
    voyage_days = 20 # Mock based on route
    for route in assumptions.get("routes", []):
        if route["origin"] == candidate["origin"] and route["discharge_port"] == port["code"]:
            voyage_days = route["typical_voyage_days"]
            
    freight_total = freight_rate * voyage_days
    
    port_charge_per_tonne = port["port_charge_per_tonne"]
    port_total = port_charge_per_tonne * deliverable_tonnes
    
    demurrage_rate = 15000
    for a in assumptions.get("cost_assumptions", []):
        if a["key"] == "demurrage_rate_per_day":
            demurrage_rate = a["value"]
    
    expected_wait_days = 2 # mock congestion
    demurrage_total = demurrage_rate * expected_wait_days
    
    lightering_total = 0
    if capacity_info["requires_lightering"]:
        lightering_total = port["lightering_cost_per_tonne"] * deliverable_tonnes
        
    inland_total = 0 # simple mock for now
    
    total_voyage_cost = freight_total + port_total + demurrage_total + lightering_total + inland_total
    landed_cost_per_tonne = total_voyage_cost / deliverable_tonnes if deliverable_tonnes > 0 else 0
    
    return {
        "landed_cost_per_tonne": round(landed_cost_per_tonne, 2),
        "cost_breakdown": {
            "freight": round(freight_total, 2),
            "port_charges": round(port_total, 2),
            "expected_demurrage": round(demurrage_total, 2),
            "lightering": round(lightering_total, 2),
            "inland": round(inland_total, 2)
        }
    }
