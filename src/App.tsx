import React, { useState, useEffect } from "react";
import {
  loadFarmState,
  saveFarmState,
  addPlot,
  updatePlot,
  deletePlot,
  addHarvest,
  deleteHarvest,
  addExpense,
  deleteExpense,
  addFertilizer,
  addSpray,
  addPestDiseaseLog,
  addIrrigationRainfall,
  addLabour,
  toggleLabourPaymentStatus,
  addInventory,
  updateInventoryStock,
  deleteInventory,
  addTask,
  toggleTask,
} from "./lib/storage";
import { FarmState } from "./types/farm";
import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { QuickAddModal } from "./components/QuickAddModal";
import { Dashboard } from "./components/Dashboard";
import { FarmsManager } from "./components/FarmsManager";
import { HarvestModule } from "./components/HarvestModule";
import { ExpenseModule } from "./components/ExpenseModule";
import { FertilizerModule } from "./components/FertilizerModule";
import { SprayModule } from "./components/SprayModule";
import { PestDiseaseModule } from "./components/PestDiseaseModule";
import { IrrigationRainfallModule } from "./components/IrrigationRainfallModule";
import { LabourModule } from "./components/LabourModule";
import { InventoryModule } from "./components/InventoryModule";
import { FinancialReports } from "./components/FinancialReports";
import { CalendarModule } from "./components/CalendarModule";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { SettingsModal } from "./components/SettingsModal";
import { InstallApkModal } from "./components/InstallApkModal";

export default function App() {
  const [state, setState] = useState<FarmState>(loadFarmState());
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showInstallApk, setShowInstallApk] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save changes to localStorage
  const handleStateUpdate = (updater: (prev: FarmState) => FarmState) => {
    setState((prev) => {
      const next = updater(prev);
      saveFarmState(next);
      return next;
    });
  };

  // Handlers for state updates
  const handleAddPlot = (plotData: any) => {
    handleStateUpdate((prev) => addPlot(prev, plotData));
  };

  const handleUpdatePlot = (plot: any) => {
    handleStateUpdate((prev) => updatePlot(prev, plot));
  };

  const handleDeletePlot = (plotId: string) => {
    handleStateUpdate((prev) => deletePlot(prev, plotId));
  };

  const handleAddHarvest = (record: any) => {
    handleStateUpdate((prev) => addHarvest(prev, record));
  };

  const handleDeleteHarvest = (id: string) => {
    handleStateUpdate((prev) => deleteHarvest(prev, id));
  };

  const handleAddExpense = (record: any) => {
    handleStateUpdate((prev) => addExpense(prev, record));
  };

  const handleDeleteExpense = (id: string) => {
    handleStateUpdate((prev) => deleteExpense(prev, id));
  };

  const handleAddFertilizer = (record: any) => {
    handleStateUpdate((prev) => addFertilizer(prev, record));
  };

  const handleAddSpray = (record: any) => {
    handleStateUpdate((prev) => addSpray(prev, record));
  };

  const handleAddPestDiseaseLog = (log: any) => {
    handleStateUpdate((prev) => addPestDiseaseLog(prev, log));
  };

  const handleAddIrrigation = (record: any) => {
    handleStateUpdate((prev) => addIrrigationRainfall(prev, record));
  };

  const handleAddLabour = (record: any) => {
    handleStateUpdate((prev) => addLabour(prev, record));
  };

  const handleToggleLabourPayment = (id: string) => {
    handleStateUpdate((prev) => toggleLabourPaymentStatus(prev, id));
  };

  const handleAddInventory = (item: any) => {
    handleStateUpdate((prev) => addInventory(prev, item));
  };

  const handleUpdateStock = (id: string, qty: number) => {
    handleStateUpdate((prev) => updateInventoryStock(prev, id, qty));
  };

  const handleDeleteInventory = (id: string) => {
    handleStateUpdate((prev) => deleteInventory(prev, id));
  };

  const handleAddTask = (task: any) => {
    handleStateUpdate((prev) => addTask(prev, task));
  };

  const handleToggleTask = (id: string) => {
    handleStateUpdate((prev) => toggleTask(prev, id));
  };

  const handleSync = () => {
    handleStateUpdate((prev) => ({
      ...prev,
      lastSyncedAt: new Date().toISOString(),
    }));
  };

  const handleExportState = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cardamom_farm_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportState = (newState: FarmState) => {
    setState(newState);
    saveFarmState(newState);
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        userRole={state.userRole}
        setUserRole={(role) => handleStateUpdate((prev) => ({ ...prev, userRole: role }))}
        isOnline={isOnline}
        lastSyncedAt={state.lastSyncedAt}
        onOpenQuickAdd={() => setShowQuickAdd(true)}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenInstallApk={() => setShowInstallApk(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
        {activeTab === "dashboard" && (
          <Dashboard
            state={state}
            setActiveTab={setActiveTab}
            onOpenQuickAdd={() => setShowQuickAdd(true)}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
          />
        )}

        {activeTab === "farms" && (
          <FarmsManager
            plots={state.plots}
            onAddPlot={handleAddPlot}
            onUpdatePlot={handleUpdatePlot}
            onDeletePlot={handleDeletePlot}
          />
        )}

        {activeTab === "harvest" && (
          <HarvestModule
            harvests={state.harvests}
            plots={state.plots}
            onAddHarvest={handleAddHarvest}
            onDeleteHarvest={handleDeleteHarvest}
            state={state}
          />
        )}

        {activeTab === "expenses" && (
          <ExpenseModule
            expenses={state.expenses}
            plots={state.plots}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            state={state}
          />
        )}

        {activeTab === "fertilizers" && (
          <FertilizerModule
            fertilizers={state.fertilizerRecords}
            plots={state.plots}
            inventory={state.inventory}
            onAddFertilizer={handleAddFertilizer}
          />
        )}

        {activeTab === "sprays" && (
          <SprayModule
            sprays={state.sprayRecords}
            plots={state.plots}
            onAddSpray={handleAddSpray}
          />
        )}

        {activeTab === "pestDisease" && (
          <PestDiseaseModule
            pestDiseaseLogs={state.pestDiseaseLogs}
            plots={state.plots}
            onAddLog={handleAddPestDiseaseLog}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
          />
        )}

        {activeTab === "irrigation" && (
          <IrrigationRainfallModule
            records={state.irrigationRainfallRecords}
            plots={state.plots}
            onAddRecord={handleAddIrrigation}
          />
        )}

        {activeTab === "labour" && (
          <LabourModule
            labourRecords={state.labourRecords}
            plots={state.plots}
            onAddLabour={handleAddLabour}
            onTogglePaymentStatus={handleToggleLabourPayment}
          />
        )}

        {activeTab === "inventory" && (
          <InventoryModule
            inventory={state.inventory}
            onAddInventory={handleAddInventory}
            onUpdateStock={handleUpdateStock}
            onDeleteInventory={handleDeleteInventory}
          />
        )}

        {activeTab === "reports" && <FinancialReports state={state} />}

        {activeTab === "calendar" && (
          <CalendarModule
            tasks={state.tasks}
            plots={state.plots}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
          />
        )}
      </main>

      {/* Mobile Floating Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setShowQuickAdd(true)}
      />

      {/* Modals */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        plots={state.plots}
        onAddHarvest={handleAddHarvest}
        onAddExpense={handleAddExpense}
      />

      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        state={state}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        state={state}
        onExportState={handleExportState}
        onImportState={handleImportState}
        onSync={handleSync}
      />

      <InstallApkModal
        isOpen={showInstallApk}
        onClose={() => setShowInstallApk(false)}
      />
    </div>
  );
}
