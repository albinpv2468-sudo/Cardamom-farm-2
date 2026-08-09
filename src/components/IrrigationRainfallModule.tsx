import React, { useState } from "react";
import { Droplets, CloudRain, Plus, Check } from "lucide-react";
import { IrrigationRainfallRecord, Plot } from "../types/farm";

interface IrrigationRainfallModuleProps {
  records: IrrigationRainfallRecord[];
  plots: Plot[];
  onAddRecord: (record: Omit<IrrigationRainfallRecord, "id">) => void;
}

export const IrrigationRainfallModule: React.FC<IrrigationRainfallModuleProps> = ({
  records,
  plots,
  onAddRecord,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [plotId, setPlotId] = useState(plots[0]?.id || "plot-1");
  const [rainfallMm, setRainfallMm] = useState<number | "">(22.5);
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationRainfallRecord["irrigationMethod"]>("Drip");
  const [waterSource, setWaterSource] = useState("Monsoon Stream Catchment Dam");
  const [soilMoistureNotes, setSoilMoistureNotes] = useState("Optimal soil moisture (85%). Leaf mulch intact.");

  const totalRainfall = records.reduce((acc, r) => acc + r.rainfallMm, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      date,
      plotId,
      rainfallMm: Number(rainfallMm) || 0,
      irrigationMethod,
      waterSource,
      soilMoistureNotes,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-teal-400" />
            <span>Monsoon Rainfall & Irrigation Log</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Record rain gauge readings in mm, drip/sprinkler schedules, water catchment sources & soil moisture
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Rain / Irrigation</span>
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-teal-950 to-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-900/60 text-teal-300 border border-teal-800">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Total Recorded Rain</span>
            <div className="text-2xl font-black text-white">{totalRainfall.toFixed(1)} mm</div>
          </div>
        </div>

        <div className="text-right text-xs text-emerald-300">
          <div>High Range Monsoon Station</div>
          <div className="text-[10px] text-emerald-400">{records.length} Rain Gauge Entries</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Plot / Block</th>
                <th className="py-3 px-3 text-right">Rainfall (mm)</th>
                <th className="py-3 px-3">Irrigation Method</th>
                <th className="py-3 px-3">Water Source & Moisture Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {records.map((r) => {
                const plot = plots.find((p) => p.id === r.plotId);
                return (
                  <tr key={r.id} className="hover:bg-emerald-900/50 transition">
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-emerald-200">{r.date}</td>
                    <td className="py-3 px-3 font-semibold text-white">{plot?.name || "All Plots"}</td>
                    <td className="py-3 px-3 text-right font-black text-amber-300">{r.rainfallMm} mm</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-teal-900 text-teal-200 font-bold text-[10px]">
                        {r.irrigationMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-300">
                      <div className="font-semibold text-white">{r.waterSource}</div>
                      <div className="text-[10px] text-emerald-400">{r.soilMoistureNotes}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <Droplets className="w-5 h-5 text-teal-400" />
              <span>Log Rainfall or Irrigation Schedule</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Target Plot</label>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Rainfall Reading (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rainfallMm}
                    onChange={(e) => setRainfallMm(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Irrigation Method</label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value as IrrigationRainfallRecord["irrigationMethod"])}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Drip">Micro Drip Line</option>
                    <option value="Sprinkler">Overhead Micro Sprinkler</option>
                    <option value="Gravity">Gravity Stream Channel</option>
                    <option value="None">Natural Rain Only (None)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Water Source</label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Soil Moisture Notes</label>
                <textarea
                  value={soilMoistureNotes}
                  onChange={(e) => setSoilMoistureNotes(e.target.value)}
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
