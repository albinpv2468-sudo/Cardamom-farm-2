import React, { useState } from "react";
import { BarChart3, Download, FileText, PieChart, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { FarmState } from "../types/farm";
import { generateFarmPDFReport } from "../lib/pdfExport";
import { exportHarvestsCSV, exportExpensesCSV } from "../lib/excelExport";

interface FinancialReportsProps {
  state: FarmState;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({ state }) => {
  const [reportPeriod, setReportPeriod] = useState<"ThisMonth" | "Quarter" | "Annual">("Annual");

  const totalIncome = state.harvests.reduce((acc, h) => acc + h.totalIncome, 0);
  const totalExpense = state.expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMarginPercent = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  const totalDryKg = state.harvests.reduce((acc, h) => acc + h.dryWeightKg, 0);
  const costPerKgProduced = totalDryKg > 0 ? (totalExpense / totalDryKg).toFixed(1) : "0";
  const revenuePerKg = totalDryKg > 0 ? (totalIncome / totalDryKg).toFixed(1) : "0";

  // Category Expense Breakdown
  const expenseByCategory = state.expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  // Plot Revenue Breakdown
  const revenueByPlot = state.harvests.reduce((acc, h) => {
    const plotName = state.plots.find((p) => p.id === h.plotId)?.name || "General Block";
    acc[plotName] = (acc[plotName] || 0) + h.totalIncome;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Cardamom Farm Profit & Loss Audit Reports</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Comprehensive P&L analysis, cost per kg, plot ROI, and print-ready PDF financial statements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportExpensesCSV(state)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span>CSV Data</span>
          </button>

          <button
            onClick={() => generateFarmPDFReport(state)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Export PDF Audit</span>
          </button>
        </div>
      </div>

      {/* Main P&L Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold uppercase">
            <span>Gross Cardamom Revenue</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">₹{totalIncome.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 block mt-1">Avg ₹{revenuePerKg} / kg cured</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold uppercase">
            <span>Total Plantation Expenses</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300 mt-1">₹{totalExpense.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 block mt-1">Cost: ₹{costPerKgProduced} / kg dry</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold uppercase">
            <span>Net Plantation Profit</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">₹{netProfit.toLocaleString()}</div>
          <span className="text-[10px] text-amber-300 block mt-1">Profit Margin: {profitMarginPercent}%</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold uppercase">
            <span>Cured Yield Harvested</span>
            <PieChart className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{totalDryKg.toFixed(1)} kg</div>
          <span className="text-[10px] text-emerald-300 block mt-1">High Range Quality Cured</span>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Expenses Breakdown */}
        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 shadow-md">
          <h3 className="font-extrabold text-sm text-white mb-3 flex items-center justify-between pb-2 border-b border-emerald-800">
            <span>Operational Cost Breakdown</span>
            <span className="text-xs text-amber-400 font-semibold">By Category</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {Object.entries(expenseByCategory).map(([cat, amt]) => {
              const amountVal = Number(amt);
              const pct = totalExpense > 0 ? ((amountVal / totalExpense) * 100).toFixed(1) : "0";
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-emerald-200">
                    <span className="font-semibold">{cat}</span>
                    <span className="font-bold text-white">
                      ₹{amountVal.toLocaleString()} <span className="text-[10px] text-emerald-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plot Revenue Breakdown */}
        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 shadow-md">
          <h3 className="font-extrabold text-sm text-white mb-3 flex items-center justify-between pb-2 border-b border-emerald-800">
            <span>Harvest Yield Revenue</span>
            <span className="text-xs text-emerald-300 font-semibold">By Plot</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {Object.entries(revenueByPlot).map(([plotName, rev]) => {
              const revVal = Number(rev);
              const pct = totalIncome > 0 ? ((revVal / totalIncome) * 100).toFixed(1) : "0";
              return (
                <div key={plotName} className="space-y-1">
                  <div className="flex items-center justify-between text-emerald-200">
                    <span className="font-semibold">{plotName}</span>
                    <span className="font-bold text-amber-300">
                      ₹{revVal.toLocaleString()} <span className="text-[10px] text-emerald-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
