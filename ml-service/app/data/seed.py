import os
import json
import pandas as pd
from pymongo import MongoClient

def seed_database():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    db_name = os.getenv("DB_NAME", "freight_decision_system")
    client = MongoClient(mongo_uri)
    db = client[db_name]

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
    reference_dir = os.path.join(base_dir, "reference")
    raw_dir = os.path.join(base_dir, "raw")

    print(f"Connecting to MongoDB at {mongo_uri}")
    print(f"Seeding database: {db_name}")

    # 1. Ports
    with open(os.path.join(reference_dir, "ports.json")) as f:
        ports_data = json.load(f)
        db.ports.delete_many({})
        db.ports.insert_many(ports_data)
        print(f"Inserted {len(ports_data)} ports.")

    # 2. Vessel Classes
    with open(os.path.join(reference_dir, "vessel_classes.json")) as f:
        vessel_data = json.load(f)
        db.vessel_classes.delete_many({})
        db.vessel_classes.insert_many(vessel_data)
        print(f"Inserted {len(vessel_data)} vessel classes.")

    # 3. Routes
    with open(os.path.join(reference_dir, "routes.json")) as f:
        routes_data = json.load(f)
        db.routes.delete_many({})
        db.routes.insert_many(routes_data)
        print(f"Inserted {len(routes_data)} routes.")

    # 4. Cost Assumptions
    with open(os.path.join(reference_dir, "cost_assumptions.json")) as f:
        cost_data = json.load(f)
        db.cost_assumptions.delete_many({})
        db.cost_assumptions.insert_many(cost_data)
        print(f"Inserted {len(cost_data)} cost assumptions.")

    # 5. Rate History
    rates_file = os.path.join(raw_dir, "baltic_indices.csv")
    if os.path.exists(rates_file):
        df = pd.read_csv(rates_file)
        records = df.to_dict(orient="records")
        db.rate_history.delete_many({})
        # Insert in chunks to avoid document size limits
        chunk_size = 5000
        for i in range(0, len(records), chunk_size):
            db.rate_history.insert_many(records[i:i+chunk_size])
        print(f"Inserted {len(records)} rate history records.")
    else:
        print(f"Warning: {rates_file} not found. Skipping rate history.")

if __name__ == "__main__":
    seed_database()
