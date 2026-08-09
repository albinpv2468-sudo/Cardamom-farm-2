import React, { useState } from "react";
import { X, Wheat, SprayCan, CircleDollarSign, CalendarPlus, Check, Sparkles } from "lucide-react";
import {
  Plot,
  HarvestRecord,
  SprayRecord,
  ExpenseRecord,
  CalendarTask,
  ExpenseCategory,
  InventoryItem,
} from "../types/farm";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  plots: Plot[];
  inventory: InventoryItem[];
  onAddHarvest: (record: Omit<HarvestRecord, "id">) => void;
  onAddSpray: (record: Omit<SprayRecord, "id">) => void;
  onAddExpense: (record: Omit<ExpenseRecord, "id">) => void;
  onAddTask: (record: Omit<CalendarTask, "id">) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  plots,
  inventory,
  onAddHarvest,
  onAddSpray,
  onAddExpense,
  onAddTask,
}) => {
  const [activeType, setActiveType] = useState<"harvest" | "spray" | "expense" | "task">("harvest");
  const [successMsg, setSuccessMsg] = useState("");

  // Harvest state
  const [harvDate, setHarvDate] = useState(new Date().toISOString().slice(0, 10));
  const [harvPlotId, setHarvPlotId] = useState(plots[0]?.id || "");
  const [harvPicker, setHarvPicker] = useState("Ramaswamy Labour Group");
  const [harvFreshKg, setHarvFreshKg] = useState<number | "">(120);
  const [harvDryKg, setHarvDryKg] = useState<number | "">(26.4);
  const [harvBags, setHarvBags] = useState<number | "">(1);
  const [harvPricePerKg, setHarvPricePerKg] = useState<number | "">(2480);

  // Spray state
  const [sprayDate, setSprayDate] = useState(new Date().toISOString().slice(0, 10));
  const [sprayPlotId, setSprayPlotId] = useState(plots[0]?.id || "");
  const [sprayProduct, setSprayProduct] = useState("Copper Oxychloride (Blitox 50)");
  const [sprayActive, setSprayActive] = useState("Copper Oxychloride 50% WP");
  const [sprayDose, setSprayDose] = useState<number | "">(3);
  const [sprayTank, setSprayTank] = useState<number | "">(200);
  const [sprayTarget, setSprayTarget] = useState("Capsule Rot (Azhukal)");
  const [sprayOperator, setSprayOperator] = useState("Santhosh");

  // Expense state
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("Labour");
  const [expAmount, setExpAmount] = useState<number | "">(4500);
  const [expDesc, setExpDesc] = useState("Daily harvesting labor wages");
  const [expPlotId, setExpPlotId] = useState(plots[0]?.id || "");

  // Task state
  const [taskTitle, setTaskTitle] = useState("3rd Picking Round - Block A");
  const [taskType, setTaskType] = useState<CalendarTask["type"]>("Harvest");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().slice(0, 10));
  const [taskPriority, setTaskPriority] = useState<CalendarTask["priority"]>("High");

  if (!isOpen) return null;

  // Auto calculate dry weight at ~22% standard curing yield for Cardamom
  const handleFreshKgChange = (val: number) => {
    setHarvFreshKg(val);
    if (val > 0) {
      setHarvDryKg(Number((val * 0.22).toFixed(1)));
    }
  };

  const handleHarvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fresh = Number(harvFreshKg) || 0;
    const dry = Number(harvDryKg) || Number((fresh * 0.22).toFixed(1));
    const ratio = fresh > 0 ? Number(((dry / fresh) * 100).toFixed(1)) : 22;
    const price = Number(harvPricePerKg) || 0;
    const income = Number((dry * price).toFixed(0));

    onAddHarvest({
      date: harvDate,
      plotId: harvPlotId || plots[0]?.id || "plot-1",
      pickerName: harvPicker,
      freshWeightKg: fresh,
      dryWeightKg: dry,
      dryingPercentage: ratio,
      bagsCount: Number(harvBags) || 1,
      batchNo: `BATCH-${harvDate.replace(/-/g, "").slice(2)}-${Math.floor(Math.random() * 90 + 10)}`,
      buyerName: "Spices Board Auction / Exporter",
      sellingPricePerKg: price,
      totalIncome: income,
    });

    triggerSuccess("Harvest entry logged successfully!");
  };

  const handleSpraySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSpray({
      date: sprayDate,
      plotId: sprayPlotId || plots[0]?.id || "plot-1",
      productName: sprayProduct,
      activeIngredient: sprayActive,
      dosePerLitreMl: Number(sprayDose) || 2,
      tankSizeLitres: Number(sprayTank) || 200,
      targetPestDisease: sprayTarget,
      weather: "Field conditions recorded",
      operatorName: sprayOperator,
      inventoryDeducted: true,
    });
    triggerSuccess("Spray application logged & inventory deducted!");
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      date: expDate,
      category: expCategory,
      amount: Number(expAmount) || 0,
      description: expDesc,
      plotId: expPlotId,
      paidTo: "Vendor / Labor",
    });
    triggerSuccess("Expense transaction recorded!");
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      date: taskDate,
      type: taskType,
      title: taskTitle,
      plotId: harvPlotId,
      completed: false,
      priority: taskPriority,
    });
    triggerSuccess("Farm task added to schedule!");
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full sm:max-w-lg bg-emerald-950 text-white rounded-t-2xl sm:rounded-2xl border border-emerald-800 shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-emerald-950 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="font-bold text-base text-emerald-100">Quick Field Record</h2>
              <p className="text-[11px] text-emerald-300/80">One-tap entry for cardamom field activities</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="my-3 p-3 rounded-xl bg-emerald-600/90 text-white flex items-center gap-2 text-xs font-semibold animate-bounce">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Record Type Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 my-4 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800">
          <button
            type="button"
            onClick={() => setActiveType("harvest")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition ${
              activeType === "harvest" ? "bg-amber-500 text-emerald-950 shadow" : "text-emerald-300 hover:text-white"
            }`}
          >
            <Wheat className="w-4 h-4 mb-0.5" />
            <span>Harvest</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("spray")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition ${
              activeType === "spray" ? "bg-amber-500 text-emerald-950 shadow" : "text-emerald-300 hover:text-white"
            }`}
          >
            <SprayCan className="w-4 h-4 mb-0.5" />
            <span>Spray</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("expense")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition ${
              activeType === "expense" ? "bg-amber-500 text-emerald-950 shadow" : "text-emerald-300 hover:text-white"
            }`}
          >
            <CircleDollarSign className="w-4 h-4 mb-0.5" />
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("task")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-semibold transition ${
              activeType === "task" ? "bg-amber-500 text-emerald-950 shadow" : "text-emerald-300 hover:text-white"
            }`}
          >
            <CalendarPlus className="w-4 h-4 mb-0.5" />
            <span>Task</span>
          </button>
        </div>

        {/* Tab 1: Harvest Form */}
        {activeType === "harvest" && (
          <form onSubmit={handleHarvestSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Harvest Date</label>
                <input
                  type="date"
                  value={harvDate}
                  onChange={(e) => setHarvDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Plot / Block</label>
                <select
                  value={harvPlotId}
                  onChange={(e) => setHarvPlotId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
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
                value={harvPicker}
                onChange={(e) => setHarvPicker(e.target.value)}
                placeholder="e.g. Ramaswamy & Team"
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Fresh Green Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={harvFreshKg}
                  onChange={(e) => handleFreshKgChange(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Dry Cured Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={harvDryKg}
                  onChange={(e) => setHarvDryKg(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-emerald-200 font-bold focus:outline-none focus:border-amber-400"
                  required
                />
                <p className="text-[10px] text-emerald-400/80 mt-0.5">
                  Est. Ratio: {harvFreshKg ? (((Number(harvDryKg) || 0) / Number(harvFreshKg)) * 100).toFixed(1) : "22.0"}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Bags / Batches</label>
                <input
                  type="number"
                  value={harvBags}
                  onChange={(e) => setHarvBags(parseInt(e.target.value) || 1)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Selling Price (₹ / kg)</label>
                <input
                  type="number"
                  value={harvPricePerKg}
                  onChange={(e) => setHarvPricePerKg(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-emerald-200 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-900/50 border border-emerald-800 flex items-center justify-between">
              <span className="text-emerald-300 font-semibold">Estimated Gross Income:</span>
              <span className="text-amber-400 font-extrabold text-sm">
                ₹{((Number(harvDryKg) || 0) * (Number(harvPricePerKg) || 0)).toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition"
            >
              Save Harvest Entry
            </button>
          </form>
        )}

        {/* Tab 2: Spray Form */}
        {activeType === "spray" && (
          <form onSubmit={handleSpraySubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Spray Date</label>
                <input
                  type="date"
                  value={sprayDate}
                  onChange={(e) => setSprayDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Target Plot</label>
                <select
                  value={sprayPlotId}
                  onChange={(e) => setSprayPlotId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
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
              <label className="block text-emerald-300 font-medium mb-1">Chemical / Product Name</label>
              <input
                type="text"
                value={sprayProduct}
                onChange={(e) => setSprayProduct(e.target.value)}
                placeholder="e.g. Copper Oxychloride 50 WP / Confidor"
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Dose per Litre (ml or g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sprayDose}
                  onChange={(e) => setSprayDose(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Tank Capacity (Litres)</label>
                <input
                  type="number"
                  value={sprayTank}
                  onChange={(e) => setSprayTank(parseInt(e.target.value) || 200)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Target Disease / Pest</label>
              <select
                value={sprayTarget}
                onChange={(e) => setSprayTarget(e.target.value)}
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Capsule Rot (Azhukal)">Capsule Rot (Azhukal)</option>
                <option value="Cardamom Thrips">Cardamom Thrips</option>
                <option value="Stem Rot / Fusarium">Stem Rot / Fusarium</option>
                <option value="Shoot Borer">Shoot Borer</option>
                <option value="Root Grub">Root Grub</option>
                <option value="Prophylactic Foliar Spray">Prophylactic Foliar Spray</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Operator Name</label>
              <input
                type="text"
                value={sprayOperator}
                onChange={(e) => setSprayOperator(e.target.value)}
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition"
            >
              Log Spray & Deduct Inventory
            </button>
          </form>
        )}

        {/* Tab 3: Expense Form */}
        {activeType === "expense" && (
          <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
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
                value={expAmount}
                onChange={(e) => setExpAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Description / Particulars</label>
              <input
                type="text"
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="e.g. Purchase ofFactamfos / Labour wages"
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition"
            >
              Record Expense
            </button>
          </form>
        )}

        {/* Tab 4: Task Form */}
        {activeType === "task" && (
          <form onSubmit={handleTaskSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-emerald-300 font-medium mb-1">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Apply Trichoderma drenching"
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Task Category</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as CalendarTask["type"])}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Harvest">Harvest</option>
                  <option value="Spray">Spray</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Labour">Labour</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as CalendarTask["priority"])}
                className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition"
            >
              Schedule Task
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
