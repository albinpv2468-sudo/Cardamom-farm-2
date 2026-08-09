import React, { useState } from "react";
import { Bug, Plus, ShieldAlert, CheckCircle, Image as ImageIcon, Camera } from "lucide-react";
import { PestDiseaseLog, CardamomDisease, Plot } from "../types/farm";

interface PestDiseaseModuleProps {
  pestDiseaseLogs: PestDiseaseLog[];
  plots: Plot[];
  onAddLog: (log: Omit<PestDiseaseLog, "id">) => void;
  onOpenAIAssistant: () => void;
}

export const PestDiseaseModule: React.FC<PestDiseaseModuleProps> = ({
  pestDiseaseLogs,
  plots,
  onAddLog,
  onOpenAIAssistant,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [plotId, setPlotId] = useState(plots[0]?.id || "plot-1");
  const [conditionName, setConditionName] = useState<CardamomDisease>("Capsule Rot (Azhukal)");
  const [severity, setSeverity] = useState<PestDiseaseLog["severity"]>("Medium");
  const [photoBefore, setPhotoBefore] = useState("https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80");
  const [treatmentApplied, setTreatmentApplied] = useState("Copper Oxychloride 3g/L + Streptocycline 6g per 200L spray + soil drenching");
  const [resolved, setResolved] = useState(true);
  const [notes, setNotes] = useState("Removed affected panicles and cleared shade canopy.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      date,
      plotId,
      conditionName,
      severity,
      photosBefore: photoBefore ? [photoBefore] : [],
      treatmentApplied,
      resolved,
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
            <Bug className="w-5 h-5 text-rose-400" />
            <span>Cardamom Pest & Disease Diagnostic Log</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Monitor Capsule Rot (Azhukal), Thrips, Root Grub, Stem Borer & Fusarium wilt with before/after photos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow transition"
          >
            <Camera className="w-4 h-4 text-emerald-200" />
            <span>AI Disease Photo Scan</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Symptom</span>
          </button>
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pestDiseaseLogs.map((log) => {
          const plot = plots.find((p) => p.id === log.plotId);
          return (
            <div
              key={log.id}
              className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-emerald-800 pb-2 mb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{plot?.name || "Plot Block"}</span>
                    <h3 className="font-extrabold text-sm text-white">{log.conditionName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === "Critical"
                          ? "bg-rose-900 text-rose-200"
                          : log.severity === "High"
                          ? "bg-amber-900 text-amber-200"
                          : "bg-emerald-900 text-emerald-200"
                      }`}
                    >
                      {log.severity} Severity
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.resolved ? "bg-emerald-800 text-emerald-200" : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {log.resolved ? "Resolved" : "Under Treatment"}
                    </span>
                  </div>
                </div>

                {log.photosBefore.length > 0 && (
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-emerald-900 mb-3 border border-emerald-800">
                    <img
                      src={log.photosBefore[0]}
                      alt={log.conditionName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-emerald-200">
                  <div>
                    <span className="text-emerald-400 font-semibold">Treatment Applied: </span>
                    <span>{log.treatmentApplied}</span>
                  </div>
                  {log.notes && (
                    <p className="text-[11px] text-emerald-300/80 italic bg-emerald-900/30 p-2 rounded-lg border border-emerald-800/60">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[10px] text-emerald-400">
                <span>Recorded: {log.date}</span>
                <span className="font-bold text-amber-300">Commercial Cardamom Diagnostic</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <Bug className="w-5 h-5 text-rose-400" />
              <span>Log Pest or Disease Observation</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Date Observed</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Affected Plot</label>
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
                  <label className="block text-emerald-300 font-medium mb-1">Disease / Pest Condition</label>
                  <select
                    value={conditionName}
                    onChange={(e) => setConditionName(e.target.value as CardamomDisease)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Capsule Rot (Azhukal)">Capsule Rot (Azhukal)</option>
                    <option value="Stem Rot">Stem Rot</option>
                    <option value="Fusarium Wilt">Fusarium Wilt</option>
                    <option value="Root Grub">Root Grub</option>
                    <option value="Nematodes">Nematodes</option>
                    <option value="Cardamom Thrips">Cardamom Thrips</option>
                    <option value="Shoot Borer">Shoot Borer</option>
                    <option value="Katte Virus">Katte Virus (Mosaic)</option>
                    <option value="Chenthal (Bacterial Spot)">Chenthal (Bacterial Spot)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as PestDiseaseLog["severity"])}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={photoBefore}
                  onChange={(e) => setPhotoBefore(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Treatment Applied</label>
                <input
                  type="text"
                  value={treatmentApplied}
                  onChange={(e) => setTreatmentApplied(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="resolved"
                  checked={resolved}
                  onChange={(e) => setResolved(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="resolved" className="text-emerald-200 font-medium">
                  Symptom Resolved / Under Control
                </label>
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
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
