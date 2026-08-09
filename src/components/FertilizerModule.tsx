import React, { useState } from "react";
import { SprayCan, Plus, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { FertilizerRecord, Plot, InventoryItem } from "../types/farm";

interface FertilizerModuleProps {
  fertilizers: FertilizerRecord[];
  plots: Plot[];
  inventory: InventoryItem[];
  onAddFertilizer: (record: Omit<FertilizerRecord, "id">) => void;
}

export const FertilizerModule: React.FC<FertilizerModuleProps> = ({
  fertilizers,
  plots,
  onAddFertilizer,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [productName, setProductName] = useState("Factamfos (20:20:0:13)");
  const [company, setCompany] = useState("FACT Ltd");
  const [quantityKg, setQuantityKg] = useState<number | "">(200);
  const [cost, setCost] = useState<number | "">(14800);
  const [targetPlotId, setTargetPlotId] = useState(plots[0]?.id || "plot-1");
  const [applicationType, setApplicationType] = useState<"Soil" | "Foliar">("Soil");
  const [applicationMethod, setApplicationMethod] = useState("Ring placement around tillers covered with organic leaf mulch");
  const [reminderDate, setReminderDate] = useState("2026-09-15");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFertilizer({
      date,
      productName,
      company,
      quantityKg: Number(quantityKg) || 0,
      cost: Number(cost) || 0,
      targetPlotId,
      applicationType,
      applicationMethod,
      reminderDate,
      inventoryDeducted: true,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SprayCan className="w-5 h-5 text-amber-400" />
            <span>Cardamom Fertilizer & NPK Application Records</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Log soil ring placement & foliar NPK sprays, dosage, reminder dates, and costs
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Fertilizer Log</span>
        </button>
      </div>

      {/* Recommended NPK Guidelines Info Card */}
      <div className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-4 text-xs text-emerald-200">
        <h3 className="font-bold text-amber-300 mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>IISR Cardamom Recommended NPK Schedule</span>
        </h3>
        <p className="text-emerald-300/90 leading-relaxed">
          Standard NPK requirement per mature yielding cardamom plant: <span className="text-white font-bold">75 : 75 : 150 kg NPK / hectare</span>. 
          Split into 2 equal rounds: Pre-monsoon (May/June) and Post-monsoon (September/October).
        </p>
      </div>

      {/* Fertilizer Logs List */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Product & Company</th>
                <th className="py-3 px-3">Type & Plot</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Cost (₹)</th>
                <th className="py-3 px-3">Method & Reminder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {fertilizers.map((f) => {
                const plot = plots.find((p) => p.id === f.targetPlotId);
                return (
                  <tr key={f.id} className="hover:bg-emerald-900/50 transition">
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-emerald-200">{f.date}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{f.productName}</div>
                      <div className="text-[10px] text-emerald-400">{f.company}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.applicationType === "Foliar" ? "bg-teal-900 text-teal-200" : "bg-amber-900/80 text-amber-200"}`}>
                        {f.applicationType}
                      </span>
                      <div className="text-[10px] text-emerald-300 mt-0.5">{plot?.name || "All Plots"}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300">{f.quantityKg} kg</td>
                    <td className="py-3 px-3 text-right font-extrabold text-white">₹{f.cost.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[11px] text-emerald-300">
                      <div>{f.applicationMethod}</div>
                      {f.reminderDate && (
                        <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> Next Round: {f.reminderDate}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <SprayCan className="w-5 h-5 text-amber-400" />
              <span>Record Fertilizer Application</span>
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

              <div className="grid grid-cols-2 gap-2">
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
                  <label className="block text-emerald-300 font-medium mb-1">Company / Brand</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Quantity Used (kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Application Type</label>
                  <select
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value as "Soil" | "Foliar")}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Soil">Soil Application (Ring)</option>
                    <option value="Foliar">Foliar Spray Application</option>
                  </select>
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Next Application Reminder</label>
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Placement Method & Notes</label>
                <textarea
                  value={applicationMethod}
                  onChange={(e) => setApplicationMethod(e.target.value)}
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
                  Save Fertilizer Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
