def make_decision(ranked_options, forecast_skill):
    if not ranked_options:
        return {
            "action": "wait",
            "headline": "No feasible options",
            "reason": "All vessel and port combinations were rejected.",
            "confidence_label": "high"
        }
        
    best_option = ranked_options[0]
    
    if forecast_skill.get(best_option["vessel_class"], 0) <= 0:
        return {
            "action": "fix_now",
            "headline": "Fix Now (No Forecast Skill)",
            "reason": "Our model shows no predictive skill at this horizon. Fixing spot is recommended to avoid unmanaged risk.",
            "confidence_label": "medium"
        }
        
    # Mock decision logic
    return {
        "action": "fix_now",
        "headline": "Fix Now",
        "reason": f"Expected costs are rising. {best_option['vessel_class']} to {best_option['discharge_port']} is the most economical.",
        "confidence_label": "high"
    }
