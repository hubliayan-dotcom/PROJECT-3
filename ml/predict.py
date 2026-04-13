import joblib
import pandas as pd

def make_prediction(input_features):
    """
    Loads the trained model and makes a prediction.
    """
    model = joblib.load("models/energy_model.pkl")
    # input_features should be a DataFrame with correct columns
    prediction = model.predict(input_features)
    return prediction

if __name__ == "__main__":
    pass
