def check_constraints(candidate):
    port = candidate["port_details"]
    vessel = candidate["vessel_details"]
    
    # 1. Draft
    if vessel["typical_laden_draft_m"] > port["max_draft_m"] and not port["lightering_available"]:
        return {"feasible": False, "failed_constraint": "draft", "limit_value": port["max_draft_m"], "required_value": vessel["typical_laden_draft_m"], "source_citation": port["citations"]["max_draft_m"]}
    
    # 2. LOA
    if vessel["typical_loa_m"] > port["max_loa_m"]:
        return {"feasible": False, "failed_constraint": "loa", "limit_value": port["max_loa_m"], "required_value": vessel["typical_loa_m"], "source_citation": port["citations"]["max_loa_m"]}
    
    # 3. Beam
    if vessel["typical_beam_m"] > port["max_beam_m"]:
        return {"feasible": False, "failed_constraint": "beam", "limit_value": port["max_beam_m"], "required_value": vessel["typical_beam_m"], "source_citation": port["citations"]["max_beam_m"]}
        
    # 4. DWT
    if vessel["dwt_max"] > port["max_dwt"]:
        # If lightering is available, maybe they can come in partially?
        # But if DWT is strictly enforced:
        return {"feasible": False, "failed_constraint": "dwt", "limit_value": port["max_dwt"], "required_value": vessel["dwt_max"], "source_citation": port["citations"]["max_dwt"]}
        
    return {"feasible": True}
