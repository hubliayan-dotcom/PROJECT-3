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
}

export const generateForecast = async (historicalData: any[]): Promise<ForecastPoint[]> => {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const prompt = `
    You are an expert energy consumption forecasting system. 
    I will provide you with historical hourly energy consumption data (timestamp and Energy in MW).
    Your task is to:
    1. Analyze the patterns (daily, weekly, seasonality).
    2. Forecast the next 24 hours of energy consumption.
    3. Return the forecast in a structured JSON format.

    Historical Data (Last 48 hours):
    ${JSON.stringify(historicalData.slice(-48))}

    Return ONLY a JSON array of 24 objects, each with:
    - timestamp: ISO string for the next hour
    - energy: predicted value in MW (number)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
    },
  });

  const forecast = JSON.parse(response.text || "[]");
  return forecast.map((p: any) => ({ ...p, isForecast: true }));
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
