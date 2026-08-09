import React, { useState } from "react";
import { Boxes, Plus, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { InventoryItem, InventoryCategory } from "../types/farm";

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onAddInventory: (item: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  onUpdateStock: (id: string, newQty: number) => void;
  onDeleteInventory: (id: string) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onAddInventory,
  onUpdateStock,
  onDeleteInventory,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  // Form State
  const [category, setCategory] = useState<InventoryCategory>("Fertilizers");
  const [name, setName] = useState("Factamfos (20:20:0:13)");
  const [brand, setBrand] = useState("FACT");
  const [stockQuantity, setStockQuantity] = useState<number | "">(20);
  const [unit, setUnit] = useState<InventoryItem["unit"]>("Bags");
  const [reorderThreshold, setReorderThreshold] = useState<number | "">(5);
  const [costPerUnit, setCostPerUnit] = useState<number | "">(1850);

  const filteredItems =
    filterCat === "all" ? inventory : inventory.filter((item) => item.category === filterCat);

  const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.reorderThreshold);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInventory({
      category,
      name,
      brand,
      stockQuantity: Number(stockQuantity) || 0,
      unit,
      reorderThreshold: Number(reorderThreshold) || 1,
      costPerUnit: Number(costPerUnit) || 0,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <span>Farm Inputs & Equipment Inventory</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Monitor fertilizers, fungicides, insecticides, micronutrients, tools, and curing bags with low stock alerts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Stock Item</span>
        </button>
      </div>

      {/* Low Stock Reorder Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-500/15 border border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-200 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300">Low Stock Alert: </span>
              <span>
                {lowStockItems.map((i) => `${i.name} (${i.stockQuantity} ${i.unit})`).join(", ")} below threshold.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {["all", "Fertilizers", "Fungicides", "Insecticides", "Herbicides", "Micronutrients", "Tools", "Bags"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-xl border font-semibold shrink-0 transition ${
              filterCat === cat
                ? "bg-amber-500 text-emerald-950 border-amber-400 shadow"
                : "bg-emerald-950 text-emerald-200 border-emerald-800 hover:bg-emerald-900"
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-emerald-950 border border-emerald-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/80 text-emerald-200 font-bold uppercase text-[10px] tracking-wider border-b border-emerald-800">
              <tr>
                <th className="py-3 px-3">Item & Brand</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">In Stock Quantity</th>
                <th className="py-3 px-3 text-right">Reorder Level</th>
                <th className="py-3 px-3 text-right">Unit Price (₹)</th>
                <th className="py-3 px-3 text-center">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/60">
              {filteredItems.map((item) => {
                const isLow = item.stockQuantity <= item.reorderThreshold;
                return (
                  <tr key={item.id} className="hover:bg-emerald-900/50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400">{item.brand}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-semibold text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-black text-sm ${isLow ? "text-amber-400" : "text-emerald-200"}`}>
                        {item.stockQuantity} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-medium">
                      {item.reorderThreshold} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-white">
                      ₹{item.costPerUnit.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, Math.max(0, item.stockQuantity - 1))}
                          className="px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold"
                          title="Decrease Stock (-1)"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, item.stockQuantity + 1)}
                          className="px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold"
                          title="Increase Stock (+1)"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onDeleteInventory(item.id)}
                          className="p-1 rounded hover:bg-rose-900 text-rose-300 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
              <Boxes className="w-5 h-5 text-amber-400" />
              <span>Add Stock Item to Inventory</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Fungicides">Fungicides</option>
                    <option value="Insecticides">Insecticides</option>
                    <option value="Herbicides">Herbicides</option>
                    <option value="Micronutrients">Micronutrients</option>
                    <option value="Tools">Tools</option>
                    <option value="Bags">Bags / Curing Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Item Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Stock Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as InventoryItem["unit"])}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="L">L (Litres)</option>
                    <option value="Packs">Packs</option>
                    <option value="Units">Units</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Current Stock Qty</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Reorder Alert Qty</label>
                  <input
                    type="number"
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-white font-bold"
                  />
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
                  Save Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
