"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { jetbrainsMono } from "@/app/fonts/fonts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Mission Control", path: "/dashboard", icon: "🚀" },
    { name: "Agency Vault", path: "/dashboard/resources", icon: "💎" },
    { name: "30-Day Sprint", path: "#", icon: "🔒", locked: true },
  ];

  return (
    <div className="font-[family-name:var(--font-figtree)] min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row text-gray-800 overflow-hidden">
      {/* Left Navigation Sidebar */}
      <aside className="w-full md:w-64 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 relative z-20 h-screen shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/assets/newlogo.png"
              alt="Kingstone Systems"
              style={{ height: "36px", width: "auto", borderRadius: "6px" }}
            />
            <span className="font-semibold text-base text-gray-800 tracking-tight leading-tight">
              Kingstone<br />
              <span className="text-blue-700 font-bold">AI Sprint</span>
            </span>
          </Link>
          <p className={`${jetbrainsMono.variable} font-mono text-[10px] text-emerald-600 mt-3 tracking-widest uppercase flex items-center gap-1.5`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Online
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className={`${jetbrainsMono.variable} font-mono text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-4 mt-2`}>
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return item.locked ? (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-300 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl opacity-40">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md font-mono uppercase">Soon</span>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 no-underline ${isActive
                  ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              K
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-800 truncate">Sprint Member</div>
              <div className={`${jetbrainsMono.variable} font-mono text-[10px] text-gray-400 uppercase tracking-widest`}>5-Day Free Sprint</div>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-blue-700 transition-colors no-underline"
          >
            ← Back to kingstonesystems.com
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative w-full bg-[#FAFAFA]">
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
