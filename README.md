# VoltCast AI: Energy Consumption Forecasting System

> An AI-Powered system to forecast hourly electricity demand for smart cities, buildings, and industrial facilities using Gemini 3.1 Pro and React.

## ⚡ What is VoltCast AI?

VoltCast AI is an intelligent energy forecasting platform that predicts hourly electricity demand using machine learning and LLM-powered insights.

It helps:
- 🏢 Buildings optimize energy usage
- ⚡ Utilities balance supply & demand
- 🌱 Reduce operational costs and carbon footprint

Unlike traditional forecasting tools, VoltCast combines:
- Time-series ML models
- Real-time visualization
- AI-generated insights (Gemini 3.1 Pro)

  ## 🚀 Why This Project Stands Out

- 🔮 Combines ML + LLM (rare in student projects)
- 📊 Real-time dashboard with predictive analytics
- 🧠 Automated anomaly detection & insights
- ⚡ Handles real-world energy datasets (PJM)
- 🎯 Production-style architecture (ML + API + Frontend)

### Key Features
- **AI Forecasting**: 24-hour predictive analysis using Gemini 3.1 Pro.
- **Interactive Dashboard**: Real-time data visualization with Recharts.
- **Insights Engine**: Automated peak usage detection and efficiency recommendations.
- **CSV Support**: Upload utility-grade datasets (like PJM Hourly Energy) for instant analysis.
- **Responsive Design**: Polished UI built with Tailwind CSS and Framer Motion.

## 🛠 Tech Stack

**Frontend**
- React 19
- Tailwind CSS
- Recharts
- Framer Motion

**Backend**
- Node.js
- Express

**AI / ML**
- Gemini 3.1 Pro
- Scikit-learn (ML models)

**Data Processing**
- Pandas
- NumPy

## 🏗 System Architecture

```text
        +----------------------+
        |   Energy Dataset     |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Data Preprocessing   |
        | (Cleaning, Resample) |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Feature Engineering  |
        | (Hour, Day, Lag)     |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | ML Model Training    |
        | (MLP / Regression)   |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Forecast Generator   |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Flask API / Node     |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | React Dashboard UI   |    
        +----------------------+
```

## 📂 Project Structure
```text
VoltCast-AI/
├── ml/                     # Production ML Pipeline (Python)
│   ├── data_loader.py      # Data ingestion & resampling
│   ├── preprocess.py       # Feature engineering (Lag, Rolling)
│   ├── train.py            # Model comparison & training
│   └── predict.py          # Inference logic
├── src/                    # Frontend (React + TS)
│   ├── lib/
│   │   └── gemini.ts       # AI forecasting & insights logic
│   ├── App.tsx             # Main Dashboard UI
│   └── ...
├── server.ts               # Full-stack server
├── README.md               # Project documentation
└── ...
```

## 📈 Evaluation Depth
We evaluate our models using industry-standard metrics to ensure reliability:
- **RMSE (Root Mean Squared Error)**: Penalizes larger errors, crucial for grid stability.
- **MAE (Mean Absolute Error)**: Provides a clear average error in Megawatts.
- **R² Score**: Measures the variance explained by the model (Target: > 0.90).
- **Error Distribution**: Analyzes residuals to ensure no systematic bias in predictions.

## 🧠 Advanced Feature Engineering
Our preprocessing pipeline includes:
- **Lag Features**: `lag_1h`, `lag_24h` to capture immediate and daily temporal dependencies.
- **Rolling Averages**: `rolling_mean_24h` to smooth out noise and capture local trends.
- **Time Cyclic Features**: Encoding hour/day to help the model understand periodic patterns.

## ⚙️ How It Works

1. Upload historical energy data (CSV)
2. Data is cleaned and resampled
3. Feature engineering generates lag & rolling features
4. ML models are trained and evaluated
5. Best model generates 24-hour forecast
6. Gemini AI analyzes patterns and generates insights
7. Results are visualized in the dashboard

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/VoltCast-AI.git
   cd VoltCast-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📊 Model Performance

| Model            | MAE  | RMSE | R² Score |
|------------------|------|------|----------|
| Linear Regression| 24.52| 32.10| 0.78     |
| Random Forest    | 18.15| 22.45| 0.89     |
| Gemini 3.1 Pro   | 21.40| 28.60| 0.68     |

📌 Best performing model: **Random Forest (highest accuracy)**

## 🚀 Usage
1. **Dashboard**: View the live energy load and 24-hour forecast.
2. **Upload**: Click "Upload CSV" to import your own `PJME_hourly.csv` or similar data.
3. **Analyze**: Click "Run AI Forecast" to trigger the Gemini engine for deep pattern analysis and insights.

## 🎯 Use Cases

- Smart buildings energy optimization
- Industrial load forecasting
- EV charging demand prediction
- Renewable energy planning

## 🔮 Future Improvements

- LSTM / Transformer-based forecasting
- Live IoT sensor integration
- Multi-region energy prediction
- Deployment on cloud (AWS/GCP)

## 🧩 Key Challenges Solved

- Handling noisy real-world time-series data
- Capturing daily seasonality using lag features
- Reducing forecast error for peak demand periods
- Integrating LLM insights with ML predictions
- Designing a responsive and scalable dashboard

## 💼 For Recruiters

This project showcases:
- End-to-end ML pipeline development
- Full-stack engineering (React + Node.js)
- Real-world time-series forecasting
- Integration of LLMs into analytical workflows
- Data visualization and user-centric design
  
## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
Built to demonstrate production-ready AI systems for energy forecasting.
