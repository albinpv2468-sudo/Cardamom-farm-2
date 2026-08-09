import React, { useState } from "react";
import { Users, Plus, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { LabourRecord, Plot } from "../types/farm";

interface LabourModuleProps {
  labourRecords: LabourRecord[];
  plots: Plot[];
  onAddLabour: (record: Omit<LabourRecord, "id">) => void;
  onTogglePaymentStatus: (id: string) => void;
}

export const LabourModule: React.FC<LabourModuleProps> = ({
  labourRecords,
  plots,
  onAddLabour,
  onTogglePaymentStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [workerName, setWorkerName] = useState("Ramaswamy");
  const [role, setRole] = useState<LabourRecord["role"]>("Picker");
  const [workPerformed, setWorkPerformed] = useState("Harvesting green capsules in Block A");
  const [dailyWage, setDailyWage] = useState<number | "">(850);
  const [hoursWorked, setHoursWorked] = useState<number | "">(8);
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">("Paid");
  const [plotId, setPlotId] = useState(plots[0]?.id || "");

  const totalWages = labourRecords.reduce((acc, l) => acc + l.dailyWage, 0);
  const pendingWages = labourRecords.filter((l) => l.paymentStatus === "Pending").reduce((acc, l) => acc + l.dailyWage, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLabour({
      date,
      workerName,
      role,
      workPerformed,
      dailyWage: Number(dailyWage) || 800,
      hoursWorked: Number(hoursWorked) || 8,
      paymentStatus,
      plotId,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Cardamom Field Labour & Wage Roll</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Track daily picking labor attendance, shade trimming, weeding, daily rates & payment statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Attendance</span>
        </button>
      </div>

      {/* Wage Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Total Wage Roll Logged</span>
          <span className="text-xl font-black text-white">₹{totalWages.toLocaleString()}</span>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Pending Payments</span>
          <span className="text-xl font-black text-rose-300">₹{pendingWages.toLocaleString()}</span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Worker & Role</th>
                <th className="py-3 px-3">Work Performed</th>
                <th className="py-3 px-3">Plot</th>
                <th className="py-3 px-3 text-right">Daily Wage (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {labourRecords.map((l) => {
                const plot = plots.find((p) => p.id === l.plotId);
                return (
                  <tr key={l.id} className="hover:bg-emerald-900/50 transition">
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-emerald-200">{l.date}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{l.workerName}</div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        {l.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-200">{l.workPerformed}</td>
                    <td className="py-3 px-3 text-emerald-300">{plot?.name || "General Estate"}</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-200">₹{l.dailyWage}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onTogglePaymentStatus(l.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 mx-auto ${
                          l.paymentStatus === "Paid"
                            ? "bg-emerald-800 text-emerald-200"
                            : "bg-rose-900/80 text-rose-200 hover:bg-emerald-800"
                        }`}
                      >
                        {l.paymentStatus === "Paid" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-rose-300" />}
                        <span>{l.paymentStatus}</span>
                      </button>
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
              <Users className="w-5 h-5 text-amber-400" />
              <span>Record Labour Attendance & Wage</span>
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
                  <label className="block text-emerald-300 font-medium mb-1">Worker Name</label>
                  <input
                    type="text"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as LabourRecord["role"])}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Picker">Picker / Harvest Labour</option>
                    <option value="Weeder">Weeder / Mulching</option>
                    <option value="Sprayer">Sprayer Operator</option>
                    <option value="Trimmer">Trimmer / Shade Regulation</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="General">General Plantation Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={dailyWage}
                    onChange={(e) => setDailyWage(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Work Performed Description</label>
                <input
                  type="text"
                  value={workPerformed}
                  onChange={(e) => setWorkPerformed(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Target Plot</label>
                  <select
                    value={plotId}
                    onChange={(e) => setPlotId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="">General Estate</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as "Paid" | "Pending")}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Paid">Paid Immediately</option>
                    <option value="Pending">Pending Payment</option>
                  </select>
                </div>
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
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
