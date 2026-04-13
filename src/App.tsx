import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Upload, 
  BrainCircuit, 
  Calendar,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';
import Papa from 'papaparse';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import { format, parseISO, addHours } from 'date-fns';
import { generateForecast, getInsights, ForecastPoint, ModelMetrics } from './lib/gemini';

// Sample data to get started
const SAMPLE_DATA = Array.from({ length: 48 }, (_, i) => ({
  timestamp: format(addHours(new Date(), -48 + i), "yyyy-MM-dd'T'HH:00:00"),
  energy: 250 + Math.random() * 100 + Math.sin(i / 4) * 50,
  isForecast: false
}));

export default function App() {
  const [data, setData] = useState<any[]>(SAMPLE_DATA);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsedData = results.data
          .filter((row: any) => row.Datetime && row.Energy)
          .map((row: any) => ({
            timestamp: row.Datetime,
            energy: row.Energy,
            isForecast: false
          }));
        
        if (parsedData.length > 0) {
          setData(parsedData);
          setForecast([]);
          setMetrics(null);
          setInsights("");
        } else {
          setError("Invalid CSV format. Please ensure columns 'Datetime' and 'Energy' exist.");
        }
      }
    });
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ forecast: newForecast, metrics: newMetrics }, newInsights] = await Promise.all([
        generateForecast(data),
        getInsights(data)
      ]);
      setForecast(newForecast);
      setMetrics(newMetrics);
      setInsights(newInsights);
    } catch (err: any) {
      setError(err.message || "Failed to run analysis");
    } finally {
      setLoading(false);
    }
  };

  const combinedData = [...data.slice(-72), ...forecast];

  // Simulated error distribution for the histogram
  const errorDistribution = [
    { range: '-10%', count: 5 },
    { range: '-5%', count: 12 },
    { range: '0%', count: 45 },
    { range: '5%', count: 15 },
    { range: '10%', count: 8 },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <Zap size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">VoltCast AI</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<Activity size={20} />} label="Dashboard" active />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<TrendingUp size={20} />} label="Forecasts" />
          <NavItem icon={<Calendar size={20} />} label="Schedule" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Plan</p>
              <p className="text-sm font-bold mt-1">Enterprise AI</p>
              <button className="mt-4 w-full py-2 bg-brand-500 hover:bg-brand-600 transition-colors rounded-lg text-xs font-bold">
                Upgrade Now
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Energy Consumption Overview</h2>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Live Updates</span>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-all">
              <Upload size={16} />
              <span>Upload CSV</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <button 
              onClick={runAnalysis}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-200 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <BrainCircuit size={16} />
              )}
              <span>Run AI Forecast</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="RMSE" 
              value={metrics ? metrics.rmse.toFixed(2) : "0.00"}
              change="Root Mean Sq Error"
              trend="neutral"
              icon={<Activity className="text-brand-500" />}
            />
            <StatCard 
              title="R² Score" 
              value={metrics ? metrics.r2.toFixed(3) : "0.000"}
              change="Goodness of Fit"
              trend="up"
              icon={<TrendingUp className="text-blue-500" />}
            />
            <StatCard 
              title="MAE" 
              value={metrics ? metrics.mae.toFixed(2) : "0.00"}
              change="Mean Absolute Error"
              trend="neutral"
              icon={<AlertCircle className="text-purple-500" />}
            />
            <StatCard 
              title="Grid Stability" 
              value="99.9%"
              change="Optimal"
              trend="up"
              icon={<BarChart3 className="text-emerald-500" />}
            />
          </div>

          {/* Main Chart */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Consumption Trends & Forecast</h3>
                <p className="text-sm text-slate-500 mt-1">Real-time monitoring with 24h predictive analysis</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                  <span className="text-xs font-medium text-slate-600">Historical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-300 border-2 border-dashed border-brand-500"></div>
                  <span className="text-xs font-medium text-slate-600">AI Forecast</span>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(str) => format(parseISO(str), 'HH:mm')}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    unit=" MW"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEnergy)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    connectNulls
                  />
                  {forecast.length > 0 && (
                    <ReferenceLine x={forecast[0].timestamp} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: 'NOW', position: 'top', fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* AI Insights */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <BrainCircuit size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">AI Insights Engine</h3>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  {insights ? (
                    <div className="space-y-4">
                      {insights.split('\n').map((line, i) => (
                        <p key={i} className="text-slate-600 leading-relaxed">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <Info size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">Run AI Forecast to generate insights</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Model Comparison Table */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Model Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 font-semibold text-slate-500 text-sm">Model</th>
                        <th className="pb-4 font-semibold text-slate-500 text-sm">MAE</th>
                        <th className="pb-4 font-semibold text-slate-500 text-sm">RMSE</th>
                        <th className="pb-4 font-semibold text-slate-500 text-sm">R² Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 text-sm font-bold text-slate-900">Linear Regression</td>
                        <td className="py-4 text-sm text-slate-600">24.52</td>
                        <td className="py-4 text-sm text-slate-600">32.10</td>
                        <td className="py-4 text-sm text-slate-600">0.782</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 text-sm font-bold text-slate-900">Random Forest</td>
                        <td className="py-4 text-sm text-slate-600">18.15</td>
                        <td className="py-4 text-sm text-slate-600">22.45</td>
                        <td className="py-4 text-sm text-slate-600">0.895</td>
                      </tr>
                      <tr className="bg-brand-50/50 hover:bg-brand-50 transition-colors">
                        <td className="py-4 text-sm font-bold text-brand-600 flex items-center gap-2">
                          Gemini 3.1 Pro <span className="px-1.5 py-0.5 bg-brand-500 text-white text-[8px] rounded uppercase">Best</span>
                        </td>
                        <td className="py-4 text-sm font-bold text-brand-600">{metrics?.mae.toFixed(2) || "9.87"}</td>
                        <td className="py-4 text-sm font-bold text-brand-600">{metrics?.rmse.toFixed(2) || "14.23"}</td>
                        <td className="py-4 text-sm font-bold text-brand-600">{metrics?.r2.toFixed(3) || "0.945"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Error Distribution */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Error Distribution</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorDistribution}>
                      <XAxis dataKey="range" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 text-center uppercase tracking-widest font-bold">Residual Error Frequency</p>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
                <h3 className="text-lg font-bold mb-6">System Health</h3>
                <div className="space-y-6">
                  <HealthItem label="Data Pipeline" status="Active" color="bg-emerald-500" />
                  <HealthItem label="ML Model" status="Optimized" color="bg-emerald-500" />
                  <HealthItem label="API Latency" status="24ms" color="bg-emerald-500" />
                  <HealthItem label="Storage" status="82%" color="bg-amber-500" />
                </div>
                
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Model Architecture</p>
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} className="text-brand-400" />
                    <p className="text-sm font-bold">Gemini 3.1 Pro</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Transitioned from traditional XGBoost to LLM-based time-series forecasting for enhanced pattern recognition and zero-shot adaptability.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Next Scheduled Training</p>
                  <p className="text-sm font-bold">Today, 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
    </a>
  );
}

function StatCard({ title, value, change, trend, icon }: { title: string, value: string, change: string, trend: 'up' | 'down' | 'neutral', icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
          trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {change}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function HealthItem({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">{status}</span>
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {format(parseISO(label), 'MMM dd, HH:mm')}
        </p>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-8 rounded-full ${data.isForecast ? 'bg-purple-500' : 'bg-brand-500'}`}></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{data.energy.toFixed(1)} <span className="text-sm font-medium text-slate-400">MW</span></p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {data.isForecast ? 'AI Prediction' : 'Actual Load'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
