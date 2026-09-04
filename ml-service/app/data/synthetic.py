import random
from datetime import datetime, timedelta
import os
import csv

def generate_mock_baltic_indices(output_path: str):
    random.seed(42)
    start_date = datetime.now() - timedelta(days=365 * 3)
    dates = [start_date + timedelta(days=x) for x in range((365 * 3) + 1)]
    
    classes = ['Capesize', 'Panamax', 'Supramax', 'Handysize']
    base_rates = {'Capesize': 20000, 'Panamax': 15000, 'Supramax': 12000, 'Handysize': 9000}
    volatility = {'Capesize': 500, 'Panamax': 300, 'Supramax': 200, 'Handysize': 150}
    
    records = []
    for cls in classes:
        current_rate = base_rates[cls]
        for date in dates:
            # Random walk
            current_rate += random.gauss(0, volatility[cls])
            # Keep it positive
            current_rate = max(current_rate, 2000)
            
            records.append({
                'date': date.strftime('%Y-%m-%d'),
                'vessel_class': cls,
                'index_value': round(current_rate / 10, 2),
                'tce_usd_per_day': round(current_rate, 2),
                'source': 'synthetic_mock_data'
            })
            
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['date', 'vessel_class', 'index_value', 'tce_usd_per_day', 'source'])
        writer.writeheader()
        writer.writerows(records)
    print(f"Generated {len(records)} synthetic records at {output_path}")

if __name__ == "__main__":
    generate_mock_baltic_indices("../../data/raw/baltic_indices.csv")
