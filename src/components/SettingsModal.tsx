import React, { useRef } from "react";
import { Settings, X, Download, Upload, RefreshCw, Database, CheckCircle2 } from "lucide-react";
import { FarmState } from "../types/farm";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: FarmState;
  onExportState: () => void;
  onImportState: (newState: FarmState) => void;
  onSync: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onExportState,
  onImportState,
  onSync,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.plots && json.harvests) {
          onImportState(json);
          alert("Cardamom Farm Database successfully restored from backup file!");
          onClose();
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Farm Settings & Offline Sync</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-emerald-800 text-emerald-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs mt-4">
          {/* Plantation Details */}
          <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800 space-y-1">
            <h4 className="font-bold text-amber-300 text-sm">{state.farmName}</h4>
            <div className="text-emerald-300">Location: {state.location}</div>
            <div className="text-[10px] text-emerald-400">
              Total Plots: {state.plots.length} • Total Harvest Logs: {state.harvests.length}
            </div>
          </div>

          {/* Sync status */}
          <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Offline Auto-Sync Engine</span>
              <span className="text-[10px] text-emerald-300">
                Last Synced: {new Date(state.lastSyncedAt).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                onSync();
                alert("Cloud database sync initiated successfully!");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Now</span>
            </button>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-200">Database Backup & Recovery</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExportState}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-bold shadow"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export JSON Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-bold shadow"
              >
                <Upload className="w-4 h-4 text-teal-400" />
                <span>Restore Backup</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800 text-[11px] text-emerald-300">
            <div className="font-bold text-emerald-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Commercial Field Mode Active</span>
            </div>
            <span>
              All records are stored directly on device storage and will automatically synchronize whenever an internet connection is established in the field.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
