import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

def train_and_evaluate(df):
    """
    Trains multiple models and compares performance.
    """
    FEATURES = ['hour', 'day_of_week', 'month', 'is_weekend', 
                'lag_1h', 'lag_24h', 'rolling_mean_24h', 'rolling_std_24h']
    TARGET = 'Energy'
    
    X = df[FEATURES]
    y = df[TARGET]
    
    # Split data (No shuffle for time-series)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(n_estimators=100),
        "XGBoost": XGBRegressor(n_estimators=200, learning_rate=0.05)
    }
    
    results = {}
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        
        results[name] = {"MAE": mae, "RMSE": rmse, "R2": r2}
        print(f"{name} - MAE: {mae:.2f}, RMSE: {rmse:.2f}, R2: {r2:.2f}")
    
    # Save the best model (XGBoost)
    joblib.dump(models["XGBoost"], "models/energy_model.pkl")
    return results

if __name__ == "__main__":
    pass
