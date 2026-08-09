import React, { useState } from "react";
import { Wheat, Plus, Download, Filter, Trash2, Calendar, DollarSign, Calculator } from "lucide-react";
import { HarvestRecord, Plot } from "../types/farm";
import { exportHarvestsCSV } from "../lib/excelExport";

interface HarvestModuleProps {
  harvests: HarvestRecord[];
  plots: Plot[];
  onAddHarvest: (record: Omit<HarvestRecord, "id">) => void;
  onDeleteHarvest: (id: string) => void;
  state: any;
}

export const HarvestModule: React.FC<HarvestModuleProps> = ({
  harvests,
  plots,
  onAddHarvest,
  onDeleteHarvest,
  state,
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [plotId, setPlotId] = useState(plots[0]?.id || "plot-1");
  const [pickerName, setPickerName] = useState("Ramaswamy Labour Team");
  const [freshWeightKg, setFreshWeightKg] = useState<number | "">(250);
  const [dryWeightKg, setDryWeightKg] = useState<number | "">(55);
  const [bagsCount, setBagsCount] = useState<number | "">(2);
  const [batchNo, setBatchNo] = useState(`BATCH-${new Date().toISOString().slice(5, 7)}-01`);
  const [buyerName, setBuyerName] = useState("Spices Board Auction - Bodinayakanur");
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number | "">(2520);
  const [notes, setNotes] = useState("Grade 8mm Bold green capsules dried at 48°C");

  const filteredHarvests =
    selectedPlotId === "all" ? harvests : harvests.filter((h) => h.plotId === selectedPlotId);

  const totalFresh = filteredHarvests.reduce((acc, h) => acc + h.freshWeightKg, 0);
  const totalDry = filteredHarvests.reduce((acc, h) => acc + h.dryWeightKg, 0);
  const totalIncome = filteredHarvests.reduce((acc, h) => acc + h.totalIncome, 0);
  const avgPrice = totalDry > 0 ? (totalIncome / totalDry).toFixed(0) : "0";
  const avgDryingRatio = totalFresh > 0 ? ((totalDry / totalFresh) * 100).toFixed(1) : "22.0";

  const handleFreshKgChange = (val: number) => {
    setFreshWeightKg(val);
    if (val > 0) {
      setDryWeightKg(Number((val * 0.22).toFixed(1)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fresh = Number(freshWeightKg) || 0;
    const dry = Number(dryWeightKg) || Number((fresh * 0.22).toFixed(1));
    const ratio = fresh > 0 ? Number(((dry / fresh) * 100).toFixed(1)) : 22;
    const price = Number(sellingPricePerKg) || 0;
    const income = Number((dry * price).toFixed(0));

    onAddHarvest({
      date,
      plotId,
      pickerName,
      freshWeightKg: fresh,
      dryWeightKg: dry,
      dryingPercentage: ratio,
      bagsCount: Number(bagsCount) || 1,
      batchNo: batchNo || `BATCH-${Date.now().toString().slice(-4)}`,
      buyerName,
      sellingPricePerKg: price,
      totalIncome: income,
      notes,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wheat className="w-5 h-5 text-amber-400" />
            <span>Cardamom Harvest & Curing Log</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Record picking rounds, green capsule weights, cured dry yield, batch numbers, and auction prices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportHarvestsCSV(state)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Harvest Batch</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Total Fresh Green Harvest</span>
          <span className="text-xl font-black text-emerald-300">{totalFresh.toFixed(1)} kg</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Cured Dry Yield</span>
          <span className="text-xl font-black text-amber-300">{totalDry.toFixed(1)} kg</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Avg Curing Ratio: {avgDryingRatio}%</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Total Harvest Revenue</span>
          <span className="text-xl font-black text-white">₹{totalIncome.toLocaleString()}</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Avg Selling Price</span>
          <span className="text-xl font-black text-emerald-200">₹{avgPrice} / kg</span>
        </div>
      </div>

      {/* Plot Filter Bar */}
      <div className="flex items-center justify-between bg-emerald-950 p-3 rounded-2xl border border-emerald-800">
        <div className="flex items-center gap-2 text-xs text-emerald-200">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filter Plot:</span>
          <select
            value={selectedPlotId}
            onChange={(e) => setSelectedPlotId(e.target.value)}
            className="p-1.5 rounded-lg bg-emerald-900 border border-emerald-700 text-white text-xs font-medium focus:outline-none"
          >
            <option value="all">All Farm Plots ({plots.length})</option>
            {plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-emerald-400">{filteredHarvests.length} Batches Recorded</span>
      </div>

      {/* Harvest Batches Log Table */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Plot / Block</th>
                <th className="py-3 px-3">Batch & Picker</th>
                <th className="py-3 px-3 text-right">Fresh Green</th>
                <th className="py-3 px-3 text-right">Cured Dry</th>
                <th className="py-3 px-3 text-center">Ratio %</th>
                <th className="py-3 px-3 text-right">Auction Rate</th>
                <th className="py-3 px-3 text-right">Total Income</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {filteredHarvests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-emerald-400">
                    No harvest records found for selected filter.
                  </td>
                </tr>
              ) : (
                filteredHarvests.map((h) => {
                  const plot = plots.find((p) => p.id === h.plotId);
                  return (
                    <tr key={h.id} className="hover:bg-emerald-900/50 transition">
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-emerald-200">
                        {h.date}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {plot?.name || "General Block"}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-amber-300">{h.batchNo}</div>
                        <div className="text-[10px] text-emerald-400">{h.pickerName}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-300">
                        {h.freshWeightKg} kg
                      </td>
                      <td className="py-3 px-3 text-right font-black text-amber-300">
                        {h.dryWeightKg} kg
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 text-[10px] font-bold">
                          {h.dryingPercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-200">
                        ₹{h.sellingPricePerKg} /kg
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-white">
                        ₹{h.totalIncome.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onDeleteHarvest(h.id)}
                          className="p-1.5 rounded hover:bg-rose-900/80 text-rose-300 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Harvest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <Wheat className="w-5 h-5 text-amber-400" />
              <span>Record New Harvest Batch</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Plot / Block</label>
                  <select
                    value={plotId}
                    onChange={(e) => setPlotId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Picker / Labour Team</label>
                <input
                  type="text"
                  value={pickerName}
                  onChange={(e) => setPickerName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Fresh Green Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={freshWeightKg}
                    onChange={(e) => handleFreshKgChange(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Cured Dry Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dryWeightKg}
                    onChange={(e) => setDryWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-emerald-200 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Bags / Batches</label>
                  <input
                    type="number"
                    value={bagsCount}
                    onChange={(e) => setBagsCount(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Buyer / Auction Center</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Selling Rate (₹ / kg)</label>
                  <input
                    type="number"
                    value={sellingPricePerKg}
                    onChange={(e) => setSellingPricePerKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Batch Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-emerald-900 text-emerald-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold shadow"
                >
                  Save Harvest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
