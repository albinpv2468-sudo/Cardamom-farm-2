import React, { useState } from "react";
import {
  LayoutDashboard,
  Wheat,
  MapPin,
  CircleDollarSign,
  SprayCan,
  MoreHorizontal,
  Users,
  Boxes,
  Bug,
  Droplets,
  Calendar,
  FileSpreadsheet,
  X,
  Bot,
} from "lucide-react";
import { UserRole } from "../types/farm";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onOpenAIAssistant: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  onOpenAIAssistant,
}) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const mainTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "harvest", label: "Harvest", icon: Wheat },
    { id: "farms", label: "Plots", icon: MapPin },
    ...(userRole === "owner" ? [{ id: "expenses", label: "Expenses", icon: CircleDollarSign }] : []),
    { id: "spray", label: "Sprays", icon: SprayCan },
  ];

  const moreTabs = [
    { id: "fertilizer", label: "Fertilizer Log", icon: SprayCan, desc: "Application records & NPK schedules" },
    { id: "pest", label: "Pest & Disease", icon: Bug, desc: "Azhukal, Thrips, Katte history & photos" },
    { id: "irrigation", label: "Rain & Irrigation", icon: Droplets, desc: "Rainfall logger & water schedules" },
    { id: "labour", label: "Labour & Wages", icon: Users, desc: "Attendance, wage roll & picking labor" },
    { id: "inventory", label: "Inventory Stock", icon: Boxes, desc: "Fertilizer, chemicals, tools & bags" },
    { id: "calendar", label: "Farm Calendar", icon: Calendar, desc: "Upcoming sprays, harvests & reminders" },
    ...(userRole === "owner"
      ? [{ id: "reports", label: "Financial Reports", icon: FileSpreadsheet, desc: "P&L, cost per kg & PDF exports" }]
      : []),
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setShowMoreDrawer(false);
  };

  return (
    <>
      {/* Mobile & Tablet Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-emerald-950 text-emerald-100 border-t border-emerald-800 shadow-lg px-2 py-1.5 md:hidden">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "text-amber-400 bg-emerald-900/80 font-semibold"
                    : "text-emerald-300 hover:text-emerald-100"
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-amber-400 scale-110" : ""}`} />
                <span className="text-[10px] leading-tight">{tab.label}</span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-xs font-medium transition ${
              moreTabs.some((t) => t.id === activeTab)
                ? "text-amber-400 bg-emerald-900/80 font-semibold"
                : "text-emerald-300 hover:text-emerald-100"
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Desktop Top Sub-Header Navigation */}
      <nav className="hidden md:block bg-emerald-900/90 text-emerald-100 border-b border-emerald-800/60 shadow-sm px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-medium">
          {mainTabs.concat(moreTabs).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? "bg-amber-500 text-emerald-950 font-bold shadow-sm"
                    : "hover:bg-emerald-800 text-emerald-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* More Modules Android Drawer Sheet */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end md:hidden animate-fade-in">
          <div className="w-4/5 max-w-sm bg-emerald-950 text-white h-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-emerald-800">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300 font-bold">
                    E
                  </div>
                  <h2 className="font-bold text-sm text-emerald-100">All Farm Modules</h2>
                </div>
                <button
                  onClick={() => setShowMoreDrawer(false)}
                  className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {moreTabs.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeTab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectTab(m.id)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                        isActive
                          ? "bg-amber-500 text-emerald-950 font-bold"
                          : "hover:bg-emerald-900/90 text-emerald-100"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? "bg-emerald-950 text-amber-400" : "bg-emerald-900 text-emerald-300"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{m.label}</div>
                        <div className={`text-[10px] line-clamp-1 ${isActive ? "text-emerald-900" : "text-emerald-400"}`}>
                          {m.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-800 mt-4 space-y-2">
              <button
                onClick={() => {
                  setShowMoreDrawer(false);
                  onOpenAIAssistant();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow"
              >
                <Bot className="w-4 h-4 text-emerald-200" />
                <span>Launch Elaichi AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
