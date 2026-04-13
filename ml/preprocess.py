import pandas as pd

def engineer_features(data):
    """
    Performs feature engineering:
    - Time features (hour, day, month)
    - Lag features (previous hour, previous day)
    - Rolling window features
    """
    df = data.copy()
    
    # Time features
    df['hour'] = df.index.hour
    df['day_of_week'] = df.index.dayofweek
    df['month'] = df.index.month
    df['is_weekend'] = (df.index.dayofweek >= 5).astype(int)
    
    # Lag features (The "Smart" part)
    df['lag_1h'] = df['Energy'].shift(1)
    df['lag_24h'] = df['Energy'].shift(24)
    
    # Rolling features
    df['rolling_mean_24h'] = df['Energy'].rolling(window=24).mean()
    df['rolling_std_24h'] = df['Energy'].rolling(window=24).std()
    
    # Drop rows with NaN values created by shifts/rolling
    df = df.dropna()
    
    return df

if __name__ == "__main__":
    pass
