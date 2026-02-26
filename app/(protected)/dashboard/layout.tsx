"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LayoutDashboard, Database, Lock, Crown } from "lucide-react";
import { jetbrainsMono } from "@/app/fonts/fonts";
import { TimeRangeProvider } from "./automate/components/TimeRangeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState<any>("7d");

  const navItems = [
    { name: "Mission Control", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Agency Vault", path: "/dashboard/resources", icon: <Database size={20} /> },
    { name: "Automation", path: "/dashboard/automate", icon: <Crown size={20} /> },
    { name: "30-Day Sprint", path: "#", icon: <Lock size={20} />, locked: true },
  ];

  return (
    <div className="font-[family-name:var(--font-figtree)] min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 overflow-hidden">
      {/* Left Navigation Sidebar */}
      <aside
        className={`${isCollapsed ? "w-20" : "w-64"} border-r border-slate-200 bg-white flex flex-col flex-shrink-0 relative z-20 h-screen transition-all duration-300 ease-in-out shadow-sm`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-30 shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className={`p-6 border-b border-slate-200 ${isCollapsed ? "items-center px-4" : ""}`}>
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/assets/newlogo.png"
              alt="Kingstone Systems"
              className="transition-all duration-300 border border-slate-200 shadow-sm"
              style={{ height: "32px", width: "auto", borderRadius: "6px" }}
            />
            {!isCollapsed && (
              <span className="font-semibold text-base text-slate-900 tracking-tight leading-tight whitespace-nowrap">
                Kingstone<br />
                <span className="text-blue-600 font-bold">AI Sprint</span>
              </span>
            )}
          </Link>
          {!isCollapsed && (
            <p className={`${jetbrainsMono.variable} font-mono text-[10px] text-emerald-600 mt-3 tracking-widest uppercase flex items-center gap-1.5`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className={`${jetbrainsMono.variable} font-mono text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-4 mt-2 font-medium`}>
              Main Menu
            </div>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return item.locked ? (
              <div
                key={item.name}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 cursor-not-allowed ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
              >
                <div className="flex items-center gap-3">
                  <span className="opacity-40 text-slate-400">{item.icon}</span>
                  {!isCollapsed && <span className="text-sm font-semibold">{item.name}</span>}
                </div>
                {!isCollapsed && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-mono uppercase">Locked</span>}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 no-underline ${isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-blue-600"}>{item.icon}</span>
                  {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
              K
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">Sprint Member</div>
                <div className={`${jetbrainsMono.variable} font-mono text-[10px] text-slate-500 uppercase tracking-widest`}>5-Day Free Sprint</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Link
              href="/"
              className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-blue-600 transition-colors no-underline font-medium"
            >
              ← Back to kingstonesystems.com
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative w-full bg-slate-50 transition-all duration-300">
        <div className="relative z-10 w-full h-full">
          <TimeRangeProvider timeRange={timeRange} setTimeRange={setTimeRange}>
            {children}
          </TimeRangeProvider>
        </div>
      </main>
    </div>
  );
}
