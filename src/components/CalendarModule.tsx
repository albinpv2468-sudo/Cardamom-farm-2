import React, { useState } from "react";
import { Calendar as CalendarIcon, Check, Plus, Clock, AlertCircle } from "lucide-react";
import { FarmTask, Plot } from "../types/farm";

interface CalendarModuleProps {
  tasks: FarmTask[];
  plots: Plot[];
  onAddTask: (task: Omit<FarmTask, "id" | "completed">) => void;
  onToggleTask: (id: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  tasks,
  plots,
  onAddTask,
  onToggleTask,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("Post-monsoon NPK Fertilizer Round 2");
  const [dueDate, setDueDate] = useState("2026-09-15");
  const [category, setCategory] = useState<FarmTask["category"]>("Fertilizer");
  const [priority, setPriority] = useState<FarmTask["priority"]>("High");
  const [plotId, setPlotId] = useState(plots[0]?.id || "");
  const [notes, setNotes] = useState("Ring application of 200g Factamfos per clump.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title,
      date: dueDate,
      dueDate,
      type: (category || "Fertilizer") as FarmTask["type"],
      category,
      priority,
      plotId,
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
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <span>Cardamom Cultivation Task Schedule</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Plan fertilizer rounds, spray intervals, shade regulation, and harvest picking cycles
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Farm Task</span>
        </button>
      </div>

      {/* Task Checklist */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="font-extrabold text-sm text-white border-b border-emerald-800 pb-2">
          Upcoming Scheduled Plantation Tasks
        </h3>

        <div className="space-y-2 text-xs">
          {tasks.map((task) => {
            const plot = plots.find((p) => p.id === task.plotId);
            return (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  task.completed
                    ? "bg-emerald-900/30 border-emerald-800/40 text-emerald-400 opacity-70"
                    : "bg-emerald-900/70 border-emerald-700 text-white hover:border-amber-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      task.completed
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "border-emerald-500 hover:border-amber-400"
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <h4 className={`font-bold text-xs ${task.completed ? "line-through" : "text-white"}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-300 mt-0.5">
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span>{plot?.name || "All Blocks"}</span>
                      {task.notes && <span>• "{task.notes}"</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === "High"
                        ? "bg-rose-900/80 text-rose-200"
                        : task.priority === "Medium"
                        ? "bg-amber-900/80 text-amber-200"
                        : "bg-emerald-900 text-emerald-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 text-[10px] font-semibold">
                    {task.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-100 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-800">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              <span>Schedule Plantation Task</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
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
                    <option value="">All Estate Blocks</option>
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
                  <label className="block text-emerald-300 font-medium mb-1">Task Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FarmTask["category"])}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Fertilizer">Fertilizer Application</option>
                    <option value="Spray">Chemical Spray</option>
                    <option value="Harvest">Harvest Round</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Maintenance">Weeding & Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as FarmTask["priority"])}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Instructions / Notes</label>
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
