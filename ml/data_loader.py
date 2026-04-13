import pandas as pd

def load_data(filepath):
    """
    Loads energy consumption data from a CSV file.
    Expected columns: 'Datetime', 'Energy'
    """
    data = pd.read_csv(filepath, parse_dates=['Datetime'], index_col='Datetime')
    # Resample to hourly and take the mean
    data = data.resample('H').mean()
    # Fill missing values
    data = data.fillna(method='ffill')
    print(f"Loaded data: {data.shape[0]} rows")
    return data

if __name__ == "__main__":
    # Example usage
    # df = load_data('data/raw/PJME_hourly.csv')
    pass
