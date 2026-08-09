export type UserRole = "owner" | "worker";

export interface GPSLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Plot {
  id: string;
  name: string;
  areaAcres: number;
  maturePlants: number;
  youngPlants: number;
  newlyPlanted: number;
  plantingYear: number;
  variety: "Njallani Green Gold" | "Malabar" | "Mysore" | "Vazhukka" | "Avinash" | "Custom";
  gpsLocation?: GPSLocation;
  photos: string[];
  notes: string;
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  date: string;
  plotId: string;
  pickerName: string;
  freshWeightKg: number;
  dryWeightKg: number; // Cured dry weight
  dryingPercentage: number; // (dryWeight / freshWeight) * 100
  bagsCount: number;
  batchNo: string;
  buyerName: string;
  sellingPricePerKg: number;
  totalIncome: number;
  notes?: string;
}

export type ExpenseCategory =
  | "Labour"
  | "Fertilizers"
  | "Chemicals"
  | "Fuel"
  | "Machinery"
  | "Irrigation"
  | "Transport"
  | "Miscellaneous";

export interface ExpenseRecord {
  id: string;
  date: string;
  plotId?: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  invoicePhotoUrl?: string;
  paidTo?: string;
}

export interface FertilizerRecord {
  id: string;
  date: string;
  productName: string;
  company: string;
  quantityKg: number;
  cost: number;
  targetPlotId: string;
  applicationType: "Soil" | "Foliar";
  applicationMethod: string;
  reminderDate?: string;
  inventoryDeducted?: boolean;
}

export interface SprayRecord {
  id: string;
  date: string;
  productName: string;
  activeIngredient: string;
  dosePerLitreMl: number;
  tankSizeLitres: number;
  compatibleChemicals?: string;
  targetPestDisease: string;
  weather: string;
  operatorName: string;
  targetPlotId: string;
  notes?: string;
  inventoryDeducted?: boolean;
}

export type CardamomDisease =
  | "Capsule Rot (Azhukal)"
  | "Stem Rot"
  | "Fusarium Wilt"
  | "Root Grub"
  | "Nematodes"
  | "Cardamom Thrips"
  | "Shoot Borer"
  | "Katte Virus"
  | "Chenthal (Bacterial Spot)";

export interface PestDiseaseLog {
  id: string;
  date: string;
  plotId: string;
  conditionName: CardamomDisease;
  severity: "Low" | "Medium" | "High" | "Critical";
  photosBefore: string[];
  photosAfter?: string[];
  treatmentApplied: string;
  resolved: boolean;
  notes?: string;
}

export interface IrrigationRainfallRecord {
  id: string;
  date: string;
  plotId: string;
  rainfallMm: number;
  irrigationMethod: "Drip" | "Sprinkler" | "Gravity" | "None";
  waterSource: string;
  soilMoistureNotes: string;
}

export interface LabourRecord {
  id: string;
  date: string;
  workerName: string;
  role: "Picker" | "Weeder" | "Sprayer" | "Trimmer" | "Supervisor" | "General";
  workPerformed: string;
  dailyWage: number;
  hoursWorked: number;
  paymentStatus: "Paid" | "Pending";
  plotId?: string;
}

export type InventoryCategory =
  | "Fertilizers"
  | "Fungicides"
  | "Insecticides"
  | "Herbicides"
  | "Micronutrients"
  | "Tools"
  | "Bags";

export interface InventoryItem {
  id: string;
  category: InventoryCategory;
  name: string;
  brand: string;
  stockQuantity: number;
  unit: "kg" | "L" | "Packs" | "Units" | "Bags";
  reorderThreshold: number;
  costPerUnit: number;
  lastUpdated: string;
}

export interface CardamomMarketData {
  updatedAt: string;
  location: string;
  averagePrice: number;
  grade8mm: number;
  grade7to8mm: number;
  unassorted: number;
  dailyArrivalsKg: number;
  priceChangePct: number;
  trend: "up" | "down" | "stable";
  history: { date: string; price: number }[];
}

export type TaskType = "Spray" | "Fertilizer" | "Harvest" | "Labour" | "Maintenance" | "Bill Payment" | "Irrigation";

export interface CalendarTask {
  id: string;
  date: string;
  dueDate?: string;
  type: TaskType;
  category?: TaskType;
  title: string;
  plotId?: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  notes?: string;
}

export interface FarmState {
  farmName: string;
  ownerName: string;
  location: string;
  totalAreaAcres: number;
  userRole: UserRole;
  plots: Plot[];
  harvests: HarvestRecord[];
  expenses: ExpenseRecord[];
  fertilizers: FertilizerRecord[];
  sprays: SprayRecord[];
  pestDiseaseLogs: PestDiseaseLog[];
  irrigationRainfall: IrrigationRainfallRecord[];
  labourRecords: LabourRecord[];
  inventory: InventoryItem[];
  tasks: CalendarTask[];
  marketData: CardamomMarketData;
  lastSyncedAt: string;
}

export type FarmTask = CalendarTask;
