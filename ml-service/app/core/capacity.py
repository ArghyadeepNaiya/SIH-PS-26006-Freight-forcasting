def compute_capacity(candidate, cargo_quantity):
    port = candidate["port_details"]
    vessel = candidate["vessel_details"]
    
    nominal_dwt = vessel["dwt_max"]
    typical_draft = vessel["typical_laden_draft_m"]
    max_port_draft = port["max_draft_m"]
    
    requires_lightering = False
    deliverable_tonnes = nominal_dwt
    
    if typical_draft > max_port_draft:
        if port["lightering_available"]:
            requires_lightering = True
            # They lighter at anchorage to get down to max_port_draft
            # Then they berth. But total delivered is still nominal_dwt if they lightered into barges
        else:
            # Short load at origin (TPC approximation, 1cm draft = X tonnes)
            # Roughly assuming proportional draft to dwt:
            draft_ratio = max_port_draft / typical_draft
            deliverable_tonnes = nominal_dwt * draft_ratio
            
    # Cap by requested cargo quantity
    deliverable_tonnes = min(deliverable_tonnes, cargo_quantity)
    load_percentage = round((deliverable_tonnes / nominal_dwt) * 100, 2)
    
    return {
        "deliverable_tonnes": deliverable_tonnes,
        "requires_lightering": requires_lightering,
        "load_percentage": load_percentage
    }
