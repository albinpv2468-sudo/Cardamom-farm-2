import React from "react";
import {
  Sprout,
  Wifi,
  WifiOff,
  UserCheck,
  User,
  Plus,
  Bot,
  Settings,
  Sun,
  Moon,
  Smartphone,
} from "lucide-react";
import { UserRole } from "../types/farm";

interface NavbarProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  lastSyncedAt: string;
  onOpenQuickAdd: () => void;
  onOpenAIAssistant: () => void;
  onOpenSettings: () => void;
  onOpenInstallApk: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  setUserRole,
  isOnline,
  lastSyncedAt,
  onOpenQuickAdd,
  onOpenAIAssistant,
  onOpenSettings,
  onOpenInstallApk,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Estate Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-inner font-bold text-xl">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none text-emerald-50">
                Elaichi Plantation
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                Cardamom Pro
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 hidden sm:block">
              Commercial Farm Management • Android Field Edition
            </p>
          </div>
        </div>

        {/* Sync Status & Action Bar */}
        <div className="flex items-center gap-2">
          {/* Sync Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Cloud Synced</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200">Offline Ready</span>
              </>
            )}
            <span className="text-[10px] text-emerald-400/60 pl-1 border-l border-emerald-800">
              {new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Install APK / App Button */}
          <button
            onClick={onOpenInstallApk}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm transition"
            title="Install App / Download APK"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Install APK</span>
          </button>

          {/* Role Pill Switcher */}
          <button
            onClick={() => setUserRole(userRole === "owner" ? "worker" : "owner")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              userRole === "owner"
                ? "bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30"
                : "bg-blue-500/20 text-blue-200 border-blue-500/40 hover:bg-blue-500/30"
            }`}
            title="Toggle Owner / Worker Mode"
          >
            {userRole === "owner" ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Owner</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Worker</span>
              </>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-100" />}
          </button>

          {/* AI Mitra Assistant Trigger */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md border border-teal-400/30 transition"
          >
            <Bot className="w-4 h-4 text-emerald-200 animate-bounce" />
            <span className="hidden sm:inline">AI Mitra</span>
          </button>

          {/* Quick Add (+) Field Button */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-md transition"
            title="Quick Field Record"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Record</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 transition"
            title="Farm Settings & Backup"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
