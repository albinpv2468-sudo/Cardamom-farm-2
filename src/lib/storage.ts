import {
  Plot,
  HarvestRecord,
  ExpenseRecord,
  FertilizerRecord,
  SprayRecord,
  PestDiseaseLog,
  IrrigationRainfallRecord,
  LabourRecord,
  InventoryItem,
  CalendarTask,
  UserRole,
  FarmState,
  CardamomMarketData,
} from "../types/farm";

export type { FarmState };

const defaultMarketData: CardamomMarketData = {
  updatedAt: "2026-08-07",
  location: "Spices Board e-Auction (Bodinayakanur / Puttady)",
  averagePrice: 2380,
  grade8mm: 2850,
  grade7to8mm: 2420,
  unassorted: 1980,
  dailyArrivalsKg: 64500,
  priceChangePct: 3.4,
  trend: "up",
  history: [
    { date: "Aug 01", price: 2280 },
    { date: "Aug 02", price: 2310 },
    { date: "Aug 03", price: 2300 },
    { date: "Aug 04", price: 2340 },
    { date: "Aug 05", price: 2350 },
    { date: "Aug 06", price: 2365 },
    { date: "Aug 07", price: 2380 },
  ],
};

import {
  initialPlots,
  initialHarvests,
  initialExpenses,
  initialFertilizers,
  initialSprays,
  initialPestDiseaseLogs,
  initialIrrigationRainfall,
  initialLabourRecords,
  initialInventory,
  initialTasks,
} from "../data/initialData";

const STORAGE_KEYS = {
  PLOTS: "cardamom_farm_plots",
  HARVESTS: "cardamom_farm_harvests",
  EXPENSES: "cardamom_farm_expenses",
  FERTILIZERS: "cardamom_farm_fertilizers",
  SPRAYS: "cardamom_farm_sprays",
  PEST_DISEASE: "cardamom_farm_pest_disease",
  IRRIGATION: "cardamom_farm_irrigation",
  LABOUR: "cardamom_farm_labour",
  INVENTORY: "cardamom_farm_inventory",
  TASKS: "cardamom_farm_tasks",
  USER_ROLE: "cardamom_farm_user_role",
  LAST_SYNC: "cardamom_farm_last_sync",
};

export function loadFarmState(): FarmState {
  try {
    const plots = getItem<Plot[]>(STORAGE_KEYS.PLOTS, initialPlots);
    const harvests = getItem<HarvestRecord[]>(STORAGE_KEYS.HARVESTS, initialHarvests);
    const expenses = getItem<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, initialExpenses);
    const fertilizers = getItem<FertilizerRecord[]>(STORAGE_KEYS.FERTILIZERS, initialFertilizers);
    const sprays = getItem<SprayRecord[]>(STORAGE_KEYS.SPRAYS, initialSprays);
    const pestDiseaseLogs = getItem<PestDiseaseLog[]>(STORAGE_KEYS.PEST_DISEASE, initialPestDiseaseLogs);
    const irrigationRainfall = getItem<IrrigationRainfallRecord[]>(STORAGE_KEYS.IRRIGATION, initialIrrigationRainfall);
    const labourRecords = getItem<LabourRecord[]>(STORAGE_KEYS.LABOUR, initialLabourRecords);
    const inventory = getItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, initialInventory);
    const tasks = getItem<CalendarTask[]>(STORAGE_KEYS.TASKS, initialTasks);
    const userRole = getItem<UserRole>(STORAGE_KEYS.USER_ROLE, "owner");
    const lastSyncedAt = getItem<string>(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    return {
      farmName: "Green Gold Cardamom Estate",
      ownerName: "George Varghese",
      location: "Vandanmedu, Idukki, Kerala",
      totalAreaAcres: 7.7,
      plots,
      harvests,
      expenses,
      fertilizers,
      sprays,
      pestDiseaseLogs,
      irrigationRainfall,
      labourRecords,
      inventory,
      tasks,
      userRole,
      marketData: defaultMarketData,
      lastSyncedAt,
    };
  } catch (error) {
    console.error("Error loading farm state from localStorage", error);
    return {
      farmName: "Green Gold Cardamom Estate",
      ownerName: "George Varghese",
      location: "Vandanmedu, Idukki, Kerala",
      totalAreaAcres: 7.7,
      plots: initialPlots,
      harvests: initialHarvests,
      expenses: initialExpenses,
      fertilizers: initialFertilizers,
      sprays: initialSprays,
      pestDiseaseLogs: initialPestDiseaseLogs,
      irrigationRainfall: initialIrrigationRainfall,
      labourRecords: initialLabourRecords,
      inventory: initialInventory,
      tasks: initialTasks,
      userRole: "owner",
      marketData: defaultMarketData,
      lastSyncedAt: new Date().toISOString(),
    };
  }
}

function getItem<T>(key: string, defaultValue: T): T {
  const val = localStorage.getItem(key);
  if (!val) return defaultValue;
  try {
    return JSON.parse(val) as T;
  } catch {
    return defaultValue;
  }
}

export function saveFarmState(state: Partial<FarmState>): void {
  try {
    if (state.plots) localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(state.plots));
    if (state.harvests) localStorage.setItem(STORAGE_KEYS.HARVESTS, JSON.stringify(state.harvests));
    if (state.expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(state.expenses));
    if (state.fertilizers) localStorage.setItem(STORAGE_KEYS.FERTILIZERS, JSON.stringify(state.fertilizers));
    if (state.sprays) localStorage.setItem(STORAGE_KEYS.SPRAYS, JSON.stringify(state.sprays));
    if (state.pestDiseaseLogs) localStorage.setItem(STORAGE_KEYS.PEST_DISEASE, JSON.stringify(state.pestDiseaseLogs));
    if (state.irrigationRainfall) localStorage.setItem(STORAGE_KEYS.IRRIGATION, JSON.stringify(state.irrigationRainfall));
    if (state.labourRecords) localStorage.setItem(STORAGE_KEYS.LABOUR, JSON.stringify(state.labourRecords));
    if (state.inventory) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(state.inventory));
    if (state.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(state.tasks));
    if (state.userRole) localStorage.setItem(STORAGE_KEYS.USER_ROLE, JSON.stringify(state.userRole));
    
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(now));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
}

export function exportFarmDataJSON(state: FarmState): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `cardamom_farm_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetToDemoData(): FarmState {
  localStorage.clear();
  const demoState: FarmState = {
    farmName: "Green Gold Cardamom Estate",
    ownerName: "George Varghese",
    location: "Vandanmedu, Idukki, Kerala",
    totalAreaAcres: 7.7,
    plots: initialPlots,
    harvests: initialHarvests,
    expenses: initialExpenses,
    fertilizers: initialFertilizers,
    sprays: initialSprays,
    pestDiseaseLogs: initialPestDiseaseLogs,
    irrigationRainfall: initialIrrigationRainfall,
    labourRecords: initialLabourRecords,
    inventory: initialInventory,
    tasks: initialTasks,
    userRole: "owner",
    marketData: defaultMarketData,
    lastSyncedAt: new Date().toISOString(),
  };
  saveFarmState(demoState);
  return demoState;
}

// State Mutation Helpers

export function addPlot(state: FarmState, plotData: Omit<Plot, "id" | "createdAt">): FarmState {
  const newPlot: Plot = {
    ...plotData,
    id: `plot-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  return { ...state, plots: [newPlot, ...state.plots] };
}

export function updatePlot(state: FarmState, updatedPlot: Plot): FarmState {
  return {
    ...state,
    plots: state.plots.map((p) => (p.id === updatedPlot.id ? updatedPlot : p)),
  };
}

export function deletePlot(state: FarmState, plotId: string): FarmState {
  return {
    ...state,
    plots: state.plots.filter((p) => p.id !== plotId),
  };
}

export function addHarvest(state: FarmState, record: Omit<HarvestRecord, "id">): FarmState {
  const newRecord: HarvestRecord = {
    ...record,
    id: `harv-${Date.now()}`,
  };
  return { ...state, harvests: [newRecord, ...state.harvests] };
}

export function deleteHarvest(state: FarmState, id: string): FarmState {
  return { ...state, harvests: state.harvests.filter((h) => h.id !== id) };
}

export function addExpense(state: FarmState, record: Omit<ExpenseRecord, "id">): FarmState {
  const newRecord: ExpenseRecord = {
    ...record,
    id: `exp-${Date.now()}`,
  };
  return { ...state, expenses: [newRecord, ...state.expenses] };
}

export function deleteExpense(state: FarmState, id: string): FarmState {
  return { ...state, expenses: state.expenses.filter((e) => e.id !== id) };
}

export function addFertilizer(state: FarmState, record: Omit<FertilizerRecord, "id">): FarmState {
  const newRecord: FertilizerRecord = {
    ...record,
    id: `fert-${Date.now()}`,
  };
  return { ...state, fertilizers: [newRecord, ...state.fertilizers] };
}

export function addSpray(state: FarmState, record: Omit<SprayRecord, "id">): FarmState {
  const newRecord: SprayRecord = {
    ...record,
    id: `spray-${Date.now()}`,
  };
  return { ...state, sprays: [newRecord, ...state.sprays] };
}

export function addPestDiseaseLog(state: FarmState, log: Omit<PestDiseaseLog, "id">): FarmState {
  const newLog: PestDiseaseLog = {
    ...log,
    id: `pd-${Date.now()}`,
  };
  return { ...state, pestDiseaseLogs: [newLog, ...state.pestDiseaseLogs] };
}

export function addIrrigationRainfall(state: FarmState, record: Omit<IrrigationRainfallRecord, "id">): FarmState {
  const newRecord: IrrigationRainfallRecord = {
    ...record,
    id: `irri-${Date.now()}`,
  };
  return { ...state, irrigationRainfall: [newRecord, ...state.irrigationRainfall] };
}

export function addLabour(state: FarmState, record: Omit<LabourRecord, "id">): FarmState {
  const newRecord: LabourRecord = {
    ...record,
    id: `lab-${Date.now()}`,
  };
  return { ...state, labourRecords: [newRecord, ...state.labourRecords] };
}

export function toggleLabourPaymentStatus(state: FarmState, id: string): FarmState {
  return {
    ...state,
    labourRecords: state.labourRecords.map((l) =>
      l.id === id ? { ...l, paymentStatus: l.paymentStatus === "Paid" ? "Pending" : "Paid" } : l
    ),
  };
}

export function addInventory(state: FarmState, item: Omit<InventoryItem, "id" | "lastUpdated">): FarmState {
  const newItem: InventoryItem = {
    ...item,
    id: `inv-${Date.now()}`,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
  return { ...state, inventory: [newItem, ...state.inventory] };
}

export function updateInventoryStock(state: FarmState, id: string, newQty: number): FarmState {
  return {
    ...state,
    inventory: state.inventory.map((item) =>
      item.id === id ? { ...item, stockQuantity: newQty, lastUpdated: new Date().toISOString().slice(0, 10) } : item
    ),
  };
}

export function deleteInventory(state: FarmState, id: string): FarmState {
  return { ...state, inventory: state.inventory.filter((i) => i.id !== id) };
}

export function addTask(state: FarmState, task: Omit<CalendarTask, "id" | "completed">): FarmState {
  const newTask: CalendarTask = {
    ...task,
    id: `task-${Date.now()}`,
    completed: false,
  };
  return { ...state, tasks: [newTask, ...state.tasks] };
}

export function toggleTask(state: FarmState, id: string): FarmState {
  return {
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  };
}
