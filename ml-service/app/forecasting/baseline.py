def get_mock_forecast(vessel_class, date_str):
    # Mocking forecast based on vessel class
    rates = {
        'Capesize': 25000,
        'Panamax': 18000,
        'Supramax': 14000,
        'Handysize': 10000
    }
    base = rates.get(vessel_class, 15000)
    return {
        "point": base,
        "lower": base * 0.9,
        "upper": base * 1.1,
        "skill_score": 0.15 # 15% better than persistence
    }
