"use client";

import { LayoutDashboard, Lock, Database, Terminal, Shield, Network, Folder, Compass, Ruler, Database as DbIcon, Zap, Target, Users, TrendingUp, BarChart, Code, Cpu, Globe, Rocket } from "lucide-react";
import { jetbrainsMono } from "@/app/fonts/fonts";
import Link from "next/link";

const ARSENAL_CATEGORIES = [
    { name: "Acquisition Engines", icon: <Zap size={18} /> },
    { name: "Lethal SOPs", icon: <Folder size={18} /> },
    { name: "Sales Architectures", icon: <Target size={18} /> },
    { name: "Fulfillment Systems", icon: <Cpu size={18} /> },
    { name: "Team Infrastructure", icon: <Users size={18} /> },
];

const ARSENAL_ITEMS = [
    "Proprietary Outreach SOP", "Lethal VSL Script", "High-Ticket Pipeline Blueprint", "Lead Overflow System",
    "7-Figure Agency Architecture", "Client Onboarding Automation", "Med Spa Lead Gen Engine", "Pest Control Sales Script",
    "Automated Appointment Setter", "Real Estate ISA System", "USC Alumni Prospecting Script", "Case Study Asset Kit",
    "Closing Logic V2", "Objection Handling Matrix", "Advanced LinkedIn Scraper", "Cold Calling High-Speed Pipeline",
    "White-Label Fulfillment Guide", "Scaling to 50 Clients SOP", "The Motherload CRM Setup", "Elite Team Hiring Filter",
    "Global Talent Pipeline", "Automated Reporting Suite", "Client Retention Architecture", "Referral Loop System",
    "Viral Ad Script Library", "Creative Testing Matrix", "High-Ticket Offer Designer", "Niche Deep-Dive Analysis",
    "Strategic Partnership Protocol", "Live Event Sales System", "Evergreen Webinar Blueprint", "AI Agent Development KIT",
    "Custom LLM Fine-Tuning SOP", "Data-Driven Scaling Engine", "Market Saturation Tracker", "Competitor Intel Lab",
    "Pricing Optimization Model", "Contract & Legal Vault", "Financial Mastery Dashboard", "Tax Optimization Strategy",
    "Personal Branding Mastery", "Keynote Positioning Guide", "Podcast Outreach Engine", "Ghostwriting Workflow",
    "X (Twitter) Growth System", "YouTube Organic Funnel", "Community Building Blueprint", "Retention-First Backend",
    "Premium Mastermind Workflow", "Legacy Agency Exit Plan", "Private Equity Prep Kit", "Lethal Agency Operating System"
];

export default function PlatinumArsenalPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8 pb-32">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className={`${jetbrainsMono.variable} font-mono text-xs text-amber-600 tracking-widest uppercase font-semibold flex items-center gap-2`}>
                            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            PLATINUM STATUS REQUIRED
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                            The Platinum Arsenal
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                            The proprietary infrastructure for agencies scaling past $10k/mo. High-ticket pipelines, lead overflow, and professional-grade agency assets.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/settings"
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95 flex items-center gap-2 w-fit"
                    >
                        Upgrade to Platinum <Shield size={16} />
                    </Link>
                </div>
            </div>

            {/* Curiosity Gap Message */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl shrink-0 border border-amber-500/20">
                        🔒
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                            "Ghosting the Motherload"
                        </h3>
                        <p className="text-slate-500 font-medium">
                            Silver Partners have access to the Systems Vault. Platinum Partners operate from the Arsenal. This is where the lethal architecture lives.
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid of Ghosted Cards */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ARSENAL_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className="group relative bg-white border border-slate-200 rounded-2xl p-5 opacity-40 grayscale pointer-events-none transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Terminal size={18} />
                                </div>
                                <Lock size={14} className="text-slate-300" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{item}</h4>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Vault Asset #{100 + i}</p>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="h-2 w-16 bg-slate-100 rounded-full" />
                                <div className="h-2 w-8 bg-slate-100 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Upsell for extra punch */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold italic shadow-lg shadow-amber-500/20">
                            P
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">Unlock the Arsenal</div>
                            <div className="text-xs text-slate-500 font-semibold">Move from Silver to Platinum Status</div>
                        </div>
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-black transition-all active:scale-95">
                        Upgrade Now →
                    </button>
                </div>
            </div>
        </div>
    );
}
