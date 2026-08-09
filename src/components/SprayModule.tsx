import React, { useState } from "react";
import { SprayCan, Plus, ShieldAlert, Cloud, UserCheck } from "lucide-react";
import { SprayRecord, Plot } from "../types/farm";

interface SprayModuleProps {
  sprays: SprayRecord[];
  plots: Plot[];
  onAddSpray: (record: Omit<SprayRecord, "id">) => void;
}

export const SprayModule: React.FC<SprayModuleProps> = ({ sprays, plots, onAddSpray }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [productName, setProductName] = useState("Copper Oxychloride 50 WP");
  const [activeIngredient, setActiveIngredient] = useState("Copper Oxychloride 50%");
  const [dosePerLitreMl, setDosePerLitreMl] = useState<number | "">(3);
  const [tankSizeLitres, setTankSizeLitres] = useState<number | "">(200);
  const [compatibleChemicals, setCompatibleChemicals] = useState("Streptocycline 6g");
  const [targetPestDisease, setTargetPestDisease] = useState("Capsule Rot (Azhukal)");
  const [weather, setWeather] = useState("Overcast, High humidity (88%)");
  const [operatorName, setOperatorName] = useState("Santhosh (Licensed Operator)");
  const [targetPlotId, setTargetPlotId] = useState(plots[0]?.id || "plot-1");
  const [notes, setNotes] = useState("Applied on flowering panicles and collar region.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSpray({
      date,
      productName,
      activeIngredient,
      dosePerLitreMl: Number(dosePerLitreMl) || 2,
      tankSizeLitres: Number(tankSizeLitres) || 200,
      compatibleChemicals,
      targetPestDisease,
      weather,
      operatorName,
      targetPlotId,
      notes,
      inventoryDeducted: true,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SprayCan className="w-5 h-5 text-amber-400" />
            <span>Fungicide & Chemical Spray Management</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Track active ingredients, dosages per litre, tank capacities, target pests, and applicator records
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Chemical Spray</span>
        </button>
      </div>

      {/* Spray History List */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Product & Active Ingredient</th>
                <th className="py-3 px-3">Target Pest / Disease</th>
                <th className="py-3 px-3 text-center">Dosage / Tank</th>
                <th className="py-3 px-3">Plot & Weather</th>
                <th className="py-3 px-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {sprays.map((s) => {
                const plot = plots.find((p) => p.id === s.targetPlotId);
                const totalQuantity = ((s.dosePerLitreMl * s.tankSizeLitres) / 1000).toFixed(2);
                return (
                  <tr key={s.id} className="hover:bg-emerald-900/50 transition">
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-emerald-200">{s.date}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{s.productName}</div>
                      <div className="text-[10px] text-emerald-400">{s.activeIngredient}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        {s.targetPestDisease}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="font-bold text-amber-300">{s.dosePerLitreMl} ml/L</div>
                      <div className="text-[10px] text-emerald-300">
                        {s.tankSizeLitres}L Tank ({totalQuantity} kg/L used)
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-emerald-200">{plot?.name || "General Plot"}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-teal-400" /> {s.weather}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-200">
                      <div className="font-medium flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-400" /> {s.operatorName}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Spray Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <SprayCan className="w-5 h-5 text-amber-400" />
              <span>Record Chemical Spray Application</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Spray Date</label>
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
                    value={targetPlotId}
                    onChange={(e) => setTargetPlotId(e.target.value)}
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
                <label className="block text-emerald-300 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Active Ingredient</label>
                <input
                  type="text"
                  value={activeIngredient}
                  onChange={(e) => setActiveIngredient(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Dosage per Litre (ml or g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dosePerLitreMl}
                    onChange={(e) => setDosePerLitreMl(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Tank Capacity (Litres)</label>
                  <input
                    type="number"
                    value={tankSizeLitres}
                    onChange={(e) => setTankSizeLitres(parseInt(e.target.value) || 200)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Target Pest or Disease</label>
                <input
                  type="text"
                  value={targetPestDisease}
                  onChange={(e) => setTargetPestDisease(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Weather Conditions</label>
                  <input
                    type="text"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Operator Name</label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Spray Notes</label>
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
                  Save Spray Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
