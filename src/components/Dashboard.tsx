import React, { useState, useEffect } from "react";
import {
  Sprout,
  Wheat,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CloudRain,
  Calculator,
  ArrowUpRight,
  Plus,
  Bot,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FarmState } from "../lib/storage";
import { CardamomMarketData } from "../types/farm";

interface DashboardProps {
  state: FarmState;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
  onOpenAIAssistant: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  onNavigateTab,
  onOpenQuickAdd,
  onOpenAIAssistant,
}) => {
  const [marketData, setMarketData] = useState<CardamomMarketData | null>(null);
  const [calcFreshKg, setCalcFreshKg] = useState<number>(100);

  // Fetch market auction price from express backend
  useEffect(() => {
    fetch("/api/market-price")
      .then((res) => res.json())
      .then((data) => setMarketData(data))
      .catch((err) => console.log("Market price fetch offline fallback:", err));
  }, []);

  // Aggregation math
  const totalMature = state.plots.reduce((acc, p) => acc + p.maturePlants, 0);
  const totalYoung = state.plots.reduce((acc, p) => acc + p.youngPlants, 0);
  const totalNew = state.plots.reduce((acc, p) => acc + p.newlyPlanted, 0);
  const totalPlantCount = totalMature + totalYoung + totalNew;

  const totalFreshHarvestKg = state.harvests.reduce((acc, h) => acc + h.freshWeightKg, 0);
  const totalDryHarvestKg = state.harvests.reduce((acc, h) => acc + h.dryWeightKg, 0);

  const totalIncome = state.harvests.reduce((acc, h) => acc + h.totalIncome, 0);
  const totalExpenses = state.expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Chart data formatting
  const harvestChartData = state.harvests.map((h) => ({
    date: h.date.slice(5),
    FreshKg: h.freshWeightKg,
    DryKg: h.dryWeightKg,
    Income: h.totalIncome,
  }));

  const calcDryKg = (calcFreshKg * 0.22).toFixed(1);
  const currentPrice = marketData?.averagePrice || 2485;
  const estVal = (Number(calcDryKg) * currentPrice).toLocaleString();

  return (
    <div className="space-y-5 animate-fade-in pb-16 md:pb-6">
      {/* Field Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-6 rounded-2xl shadow-xl border border-emerald-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-extrabold uppercase tracking-wide">
                Season Harvest Peak
              </span>
              <span className="text-xs text-emerald-300">• Idukki High Ranges</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Elaichi Commercial Plantation Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5">
              {state.plots.length} Active Plots • {totalPlantCount.toLocaleString()} Total Plants • Real-time Yield Analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-lg transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Record Harvest / Spray</span>
            </button>

            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-emerald-100 font-semibold text-xs border border-emerald-600 shadow transition"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>Ask AI Mitra</span>
            </button>
          </div>
        </div>
      </div>

      {/* Market Price Ticker Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl border border-emerald-800/80 p-3.5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-900 text-amber-400 border border-emerald-800">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Spices Board India Auction Price
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                {marketData?.location || "Bodinayakanur"}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-black text-amber-300">
                ₹{currentPrice.toLocaleString()} <span className="text-xs font-normal text-emerald-400">/ kg avg</span>
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4% today
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs border-t md:border-t-0 md:border-l border-emerald-800/80 pt-2 md:pt-0 md:pl-4 overflow-x-auto">
          <div>
            <span className="text-emerald-400 text-[10px] block uppercase">Grade 8mm Bold</span>
            <span className="font-bold text-white">₹{marketData?.grade8mm.toLocaleString() || "2,950"} /kg</span>
          </div>
          <div className="h-6 w-px bg-emerald-800" />
          <div>
            <span className="text-emerald-400 text-[10px] block uppercase">Grade 7.5mm</span>
            <span className="font-bold text-white">₹{marketData?.grade7to8mm.toLocaleString() || "2,520"} /kg</span>
          </div>
          <div className="h-6 w-px bg-emerald-800" />
          <div>
            <span className="text-emerald-400 text-[10px] block uppercase">Daily Arrivals</span>
            <span className="font-bold text-amber-300">{(marketData?.dailyArrivalsKg || 48200).toLocaleString()} kg</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Plants */}
        <div className="bg-emerald-900/40 dark:bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 shadow-sm hover:border-emerald-600 transition">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Plants</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalPlantCount.toLocaleString()}</div>
          <div className="mt-2 text-[11px] text-emerald-300/80 flex items-center gap-2">
            <span className="text-emerald-200 font-semibold">{totalMature.toLocaleString()} Mature</span>
            <span>•</span>
            <span>{totalYoung} Young</span>
            <span>•</span>
            <span>{totalNew} New</span>
          </div>
        </div>

        {/* Card 2: Harvest Cured Yield */}
        <div className="bg-emerald-900/40 dark:bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 shadow-sm hover:border-emerald-600 transition">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cured Harvest</span>
            <Wheat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">{totalDryHarvestKg.toFixed(1)} kg</div>
          <div className="mt-2 text-[11px] text-emerald-300/80">
            Fresh Green: <span className="text-white font-semibold">{totalFreshHarvestKg.toFixed(1)} kg</span> (22.0% ratio)
          </div>
        </div>

        {/* Card 3: Current Income */}
        <div className="bg-emerald-900/40 dark:bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 shadow-sm hover:border-emerald-600 transition">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Harvest Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">₹{totalIncome.toLocaleString()}</div>
          <div className="mt-2 text-[11px] text-emerald-300/80">
            Avg Auction: <span className="text-emerald-200 font-semibold">₹2,485 / kg</span>
          </div>
        </div>

        {/* Card 4: Net Profit (Owner View) */}
        {state.userRole === "owner" ? (
          <div className="bg-emerald-900/40 dark:bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 shadow-sm hover:border-emerald-600 transition">
            <div className="flex items-center justify-between text-emerald-300 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Net Profit</span>
              <DollarSign className="w-4 h-4 text-emerald-300" />
            </div>
            <div className={`text-xl sm:text-2xl font-black ${netProfit >= 0 ? "text-emerald-300" : "text-rose-400"}`}>
              ₹{netProfit.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] text-emerald-300/80">
              Total Expenses: <span className="text-rose-300 font-semibold">₹{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-900/40 dark:bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 shadow-sm hover:border-emerald-600 transition">
            <div className="flex items-center justify-between text-emerald-300 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Worker Operations</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-200">Field Duty Active</div>
            <div className="mt-2 text-[11px] text-emerald-300/80">
              {state.tasks.filter((t) => !t.completed).length} Tasks Scheduled
            </div>
          </div>
        )}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): Harvest & Revenue Trends Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80 mb-4">
              <div>
                <h3 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-amber-400" />
                  <span>Harvest & Cured Yield Trends (Kg)</span>
                </h3>
                <p className="text-[11px] text-emerald-400/80">Fresh green vs Dry cured cardamom ratio history</p>
              </div>
              <button
                onClick={() => onNavigateTab("harvest")}
                className="text-xs text-amber-400 font-semibold hover:underline"
              >
                View Log →
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={harvestChartData}>
                  <defs>
                    <linearGradient id="freshGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#065f46" />
                  <XAxis dataKey="date" stroke="#a7f3d0" fontSize={11} />
                  <YAxis stroke="#a7f3d0" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#022c22", borderColor: "#065f46", color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="FreshKg"
                    name="Fresh Green (kg)"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#freshGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="DryKg"
                    name="Cured Dry (kg)"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#dryGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Green to Cured Yield Converter Calculator */}
          <div className="bg-emerald-900/60 border border-emerald-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-emerald-100">Green Capsule Curing Yield Estimator</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-[11px] text-emerald-300 mb-1 font-medium">Fresh Green Weight (kg)</label>
                <input
                  type="number"
                  value={calcFreshKg}
                  onChange={(e) => setCalcFreshKg(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full p-2 rounded-xl bg-emerald-950 border border-emerald-700 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Estimated Cured Dry Weight</span>
                <span className="text-lg font-black text-emerald-200">{calcDryKg} kg</span>
                <span className="text-[10px] text-emerald-400 block">@ 22% Curing Ratio</span>
              </div>

              <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Gross Market Value</span>
                <span className="text-lg font-black text-amber-400">₹{estVal}</span>
                <span className="text-[10px] text-emerald-400 block">@ ₹{currentPrice}/kg rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Weather & Upcoming Tasks */}
        <div className="space-y-4">
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-emerald-950 to-teal-950 border border-emerald-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80 mb-3">
              <h3 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-teal-400" />
                <span>Monsoon Weather & Moisture</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900 text-teal-200 font-semibold">
                Idukki High Ranges
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-black text-white">23.5° C</div>
                <div className="text-xs text-teal-200">Overcast & High Humidity</div>
              </div>
              <div className="text-right text-xs text-emerald-300 space-y-1">
                <div>Humidity: <span className="font-bold text-white">88%</span></div>
                <div>24h Rain: <span className="font-bold text-amber-300">28.5 mm</span></div>
              </div>
            </div>

            <p className="text-[11px] bg-emerald-900/60 p-2 rounded-xl text-emerald-200 border border-emerald-800/80">
              💡 <span className="font-semibold text-amber-300">Agronomy Tip:</span> High humidity (85%+) requires preventive Azhukal/Capsule Rot spray on flowering tillers.
            </p>
          </div>

          {/* Upcoming Schedule Tasks */}
          <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80 mb-3">
              <h3 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Upcoming Field Schedule</span>
              </h3>
              <button
                onClick={() => onNavigateTab("calendar")}
                className="text-xs text-amber-400 font-semibold hover:underline"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-2">
              {state.tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-emerald-100 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${task.priority === "High" ? "bg-rose-400" : "bg-amber-400"}`} />
                      <span>{task.title}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      {task.date} • <span className="text-emerald-300">{task.type}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.completed ? "bg-emerald-800 text-emerald-200" : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
