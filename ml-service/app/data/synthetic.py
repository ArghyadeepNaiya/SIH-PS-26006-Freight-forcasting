import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_mock_baltic_indices(output_path: str):
    np.random.seed(42)
    start_date = datetime.now() - timedelta(days=365 * 3)
    dates = pd.date_range(start=start_date, end=datetime.now(), freq='D')
    
    classes = ['Capesize', 'Panamax', 'Supramax', 'Handysize']
    base_rates = {'Capesize': 20000, 'Panamax': 15000, 'Supramax': 12000, 'Handysize': 9000}
    volatility = {'Capesize': 500, 'Panamax': 300, 'Supramax': 200, 'Handysize': 150}
    
    records = []
    for cls in classes:
        current_rate = base_rates[cls]
        for date in dates:
            # Random walk
            current_rate += np.random.normal(0, volatility[cls])
            # Keep it positive
            current_rate = max(current_rate, 2000)
            
            records.append({
                'date': date.strftime('%Y-%m-%d'),
                'vessel_class': cls,
                'index_value': round(current_rate / 10, 2),
                'tce_usd_per_day': round(current_rate, 2),
                'source': 'synthetic_mock_data'
            })
            
    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} synthetic records at {output_path}")

if __name__ == "__main__":
    generate_mock_baltic_indices("../../data/raw/baltic_indices.csv")
