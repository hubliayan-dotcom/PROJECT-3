import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const getForecastingModel = () => {
  return ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: "Initialize",
  });
};

export interface ForecastPoint {
  timestamp: string;
  energy: number;
  isForecast: boolean;
  error?: number;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  r2: number;
}

const engineerFeatures = (data: any[]) => {
  return data.map((d, i) => {
    const prev = data[i - 1];
    const prevDay = data[i - 24];
    
    // Simple rolling mean (3-period)
    const window = data.slice(Math.max(0, i - 2), i + 1);
    const rollingMean = window.reduce((acc, curr) => acc + curr.energy, 0) / window.length;

    return {
      ...d,
      lag_1h: prev ? prev.energy : d.energy,
      lag_24h: prevDay ? prevDay.energy : d.energy,
      rolling_mean: rollingMean
    };
  });
};

export const generateForecast = async (historicalData: any[]): Promise<{ forecast: ForecastPoint[], metrics: ModelMetrics }> => {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const enrichedData = engineerFeatures(historicalData);

  const prompt = `
    You are an expert energy consumption forecasting system. 
    I will provide you with historical hourly energy consumption data enriched with features (lag_1h, lag_24h, rolling_mean).
    Your task is to:
    1. Analyze the patterns (daily, weekly, seasonality).
    2. Forecast the next 24 hours of energy consumption.
    3. Calculate simulated performance metrics (MAE, RMSE, R2) based on the last 24 hours of historical data.

    Historical Data (Last 48 hours with features):
    ${JSON.stringify(enrichedData.slice(-48))}

    Return ONLY a JSON object with:
    - forecast: array of 24 objects { timestamp: ISO string, energy: number }
    - metrics: { mae: number, rmse: number, r2: number }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                energy: { type: Type.NUMBER },
              },
              required: ["timestamp", "energy"],
            },
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              mae: { type: Type.NUMBER },
              rmse: { type: Type.NUMBER },
              r2: { type: Type.NUMBER },
            },
            required: ["mae", "rmse", "r2"],
          },
        },
        required: ["forecast", "metrics"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  const forecast = (result.forecast || []).map((p: any) => ({ ...p, isForecast: true }));
  return { forecast, metrics: result.metrics };
};

export const getInsights = async (data: any[]): Promise<string> => {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const prompt = `
    Analyze this energy consumption data and provide 3 key insights:
    1. Peak usage periods.
    2. Efficiency recommendations.
    3. Potential anomalies.

    Data Summary:
    ${JSON.stringify(data.slice(-100))}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });

  return response.text || "No insights available.";
};
