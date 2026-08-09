import React, { useState } from "react";
import { CircleDollarSign, Plus, Download, Trash2, Tag, FileText, Image as ImageIcon } from "lucide-react";
import { ExpenseRecord, ExpenseCategory, Plot } from "../types/farm";
import { exportExpensesCSV } from "../lib/excelExport";

interface ExpenseModuleProps {
  expenses: ExpenseRecord[];
  plots: Plot[];
  onAddExpense: (record: Omit<ExpenseRecord, "id">) => void;
  onDeleteExpense: (id: string) => void;
  state: any;
}

export const ExpenseModule: React.FC<ExpenseModuleProps> = ({
  expenses,
  plots,
  onAddExpense,
  onDeleteExpense,
  state,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<ExpenseCategory>("Labour");
  const [amount, setAmount] = useState<number | "">(4500);
  const [description, setDescription] = useState("Weekly weeding and shade trimming wages");
  const [plotId, setPlotId] = useState<string>(plots[0]?.id || "");
  const [paidTo, setPaidTo] = useState("Ramaswamy Labour Team");
  const [invoicePhotoUrl, setInvoicePhotoUrl] = useState("");

  const filteredExpenses =
    selectedCat === "all" ? expenses : expenses.filter((e) => e.category === selectedCat);

  const totalExpenseSum = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      date,
      category,
      amount: Number(amount) || 0,
      description,
      plotId,
      paidTo,
      invoicePhotoUrl,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-amber-400" />
            <span>Farm Expense & Input Cost Tracker</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Log labour wages, fertilizer & chemical purchases, fuel, equipment & irrigation costs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportExpensesCSV(state)}
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
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Category Expense Summary Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {["Labour", "Fertilizers", "Chemicals", "Fuel", "Machinery", "Irrigation", "Transport", "Miscellaneous"].map(
          (cat) => {
            const sum = categoryTotals[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(selectedCat === cat ? "all" : cat)}
                className={`px-3 py-2 rounded-xl border text-left shrink-0 transition ${
                  selectedCat === cat
                    ? "bg-amber-500 text-emerald-950 border-amber-400 font-bold"
                    : "bg-emerald-950 text-emerald-200 border-emerald-800 hover:border-emerald-700"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{cat}</div>
                <div className="font-extrabold text-sm">₹{sum.toLocaleString()}</div>
              </button>
            );
          }
        )}
      </div>

      {/* Expense List Table */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="p-3 bg-emerald-900/60 border-b border-emerald-800 flex items-center justify-between text-xs text-emerald-200">
          <span className="font-semibold text-emerald-100">
            Showing {filteredExpenses.length} Expense Items ({selectedCat === "all" ? "All Categories" : selectedCat})
          </span>
          <span className="font-bold text-amber-300">Total: ₹{totalExpenseSum.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Description & Paid To</th>
                <th className="py-3 px-3">Plot</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-emerald-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((e) => {
                  const plot = plots.find((p) => p.id === e.plotId);
                  return (
                    <tr key={e.id} className="hover:bg-emerald-900/50 transition">
                      <td className="py-3 px-3 font-medium text-emerald-200 whitespace-nowrap">{e.date}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-900 text-amber-300 font-bold text-[10px]">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{e.description}</div>
                        {e.paidTo && <div className="text-[10px] text-emerald-400">Paid to: {e.paidTo}</div>}
                      </td>
                      <td className="py-3 px-3 text-emerald-300">{plot?.name || "General Estate"}</td>
                      <td className="py-3 px-3 text-right font-black text-rose-300">
                        ₹{e.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onDeleteExpense(e.id)}
                          className="p-1.5 rounded hover:bg-rose-900/80 text-rose-300 transition"
                          title="Delete Expense"
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

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <CircleDollarSign className="w-5 h-5 text-amber-400" />
              <span>Record Operational Expense</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Labour">Labour</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Transport">Transport</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Particulars / Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Factamfos purchase / Pickers labor payment"
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Paid To / Vendor</label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Target Plot (Optional)</label>
                  <select
                    value={plotId}
                    onChange={(e) => setPlotId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="">General Plantation Cost</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Invoice / Receipt Photo URL</label>
                <input
                  type="text"
                  value={invoicePhotoUrl}
                  onChange={(e) => setInvoicePhotoUrl(e.target.value)}
                  placeholder="https://..."
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
