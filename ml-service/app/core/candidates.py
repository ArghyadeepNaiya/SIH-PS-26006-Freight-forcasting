def generate_candidates(cargo_quantity: float, origin: str, ports: list, vessel_classes: list):
    candidates = []
    for p in ports:
        for v in vessel_classes:
            candidates.append({
                "discharge_port": p["code"],
                "vessel_class": v["name"],
                "nominal_capacity_tonnes": v["dwt_max"], # simple approximation
                "port_details": p,
                "vessel_details": v,
                "origin": origin
            })
    return candidates
