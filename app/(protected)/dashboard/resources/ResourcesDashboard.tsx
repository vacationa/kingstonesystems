"use client";

import { useState } from "react";
import { aeonik, jetbrainsMono } from "@/app/fonts/fonts";

const RESOURCES_BY_DAY: Record<number, { title: string, type: string, icon: string, dayTitle: string, locked?: boolean, link?: string, unlockType?: string }[]> = {
    1: [
        { title: "6 Months Free Notion", type: "Link", icon: "🎁", dayTitle: "Workspace Setup", locked: true, unlockType: "notion", link: "https://ntn.so/kingstonesystems" },
    ],
    2: [
        { title: "CloserGPT", type: "AI", icon: "🎁", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2b8a86fc81918dfe62b4f01b68b3-ai-sprint-closergpt" },
        { title: "PromptGPT", type: "AI", icon: "🎁", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2f9f5d5c8191b0e089a16c29a22d-ai-sprint-promptgpt" },
        { title: "ScriptGPT", type: "AI", icon: "🎁", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2e98d6d481919e00ae5a2ffc7af3-ai-sprint-scriptgpt" },
        { title: "OfferGPT", type: "AI", icon: "🎁", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2dc6329c819186957a8000a2b31c-ai-sprint-offergpt" },
        { title: "LaunchGPT", type: "AI", icon: "🎁", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2d48995c8191ac6f58bd22e97858-ai-sprint-launchgpt" },
        { title: "AdGPT", type: "AI", icon: "🎁", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2e63cdc4819186a41a83891ee6bb-ai-sprint-adgpt" },
    ],
};

function LockedResource({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm opacity-90">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <span className={`${aeonik.variable} font-aeonik text-sm text-slate-600 font-medium`}>{title}</span>
        </div>
    );
}

interface ResourcesDashboardProps {
    initialPrizes?: Record<number, boolean>;
}

export default function ResourcesDashboard({ initialPrizes = {} }: ResourcesDashboardProps) {
    const [unlockedAI, setUnlockedAI] = useState(!!initialPrizes[2]);
    const [unlockedNotion, setUnlockedNotion] = useState(!!initialPrizes[1]);
    const [showUnlockFor, setShowUnlockFor] = useState<{ id: string, type?: string } | null>(null);
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    const handleUnlock = () => {
        const normalizedCode = code.trim().toUpperCase();
        if (showUnlockFor?.type === "notion") {
            if (normalizedCode === "AILAUNCH2026") {
                setUnlockedNotion(true);
                setShowUnlockFor(null);
                setError(false);
            } else {
                setError(true);
            }
        } else {
            if (normalizedCode === "AILAUNCH2026") {
                setUnlockedAI(true);
                setShowUnlockFor(null);
                setError(false);
            } else {
                setError(true);
            }
        }
    };

    return (
        <div className={`${aeonik.variable} font-aeonik w-full min-h-full bg-slate-50 text-slate-900 relative`}>
            {/* Background gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.03)_0%,transparent_100%)] pointer-events-none z-0" />
            <div className="fixed top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] z-0 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 lg:px-12 py-10 relative z-10 space-y-12">

                {/* Header */}
                <div className="space-y-2">
                    <div className={`${jetbrainsMono.variable} font-mono text-xs text-blue-600 tracking-widest uppercase font-semibold`}>
                        ● Resource Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900">
                        The Agency Vault
                    </h1>
                    <p className={`${jetbrainsMono.variable} font-mono text-slate-600 font-medium text-sm max-w-xl leading-relaxed mt-2`}>
                        All the master templates, SOPs, and guides you need to build, launch, and scale your AI agency efficiently.
                    </p>
                </div>

                {/* 5-Day Resources Grid */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xl border border-emerald-500/20 shadow-sm">
                            ⚡️
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            5-Day Sprint Assets
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(RESOURCES_BY_DAY).map(([day, items]) => (
                            items.map((res, i) => {
                                const isLocked = res.locked && (res.unlockType === 'notion' ? !unlockedNotion : !unlockedAI);
                                const isUnlocking = showUnlockFor?.id === `${day}-${i}`;
                                const isLinkInteractive = !isLocked && res.link;

                                const CardContent = (
                                    <>
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-black/[0.01] rounded-bl-full group-hover:scale-150 group-hover:bg-blue-500/[0.02] transition-transform duration-500`} />

                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className="flex gap-4 items-start">
                                                <div className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm ${isLocked ? 'shadow-blue-500/10' : ''}`}>
                                                    {res.icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`${jetbrainsMono.variable} font-mono text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold border border-emerald-200`}>
                                                            Day {day}
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-semibold ml-1">{res.dayTitle}</span>
                                                    </div>
                                                    <h3 className={`font-bold text-slate-900 text-[15px] group-hover:text-emerald-600 transition-colors`}>
                                                        {res.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        {isUnlocking ? (
                                            <div className="relative z-10 mt-4 pt-4 border-t border-slate-200 space-y-2">
                                                <div className="flex gap-2">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="Enter code..."
                                                        value={code}
                                                        onChange={(e) => { setCode(e.target.value); setError(false); }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleUnlock();
                                                        }}
                                                        className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} text-xs px-3 py-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 placeholder-slate-400 tracking-widest uppercase font-mono`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUnlock(); }}
                                                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                                    >
                                                        Unlock
                                                    </button>
                                                </div>
                                                {error && <p className="text-red-500 text-[10px] font-semibold">Invalid code</p>}
                                            </div>
                                        ) : (
                                            <div className="relative z-10 mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> {res.type} Format</span>
                                                <span className="group-hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold">
                                                    {isLocked ? (
                                                        <span className="text-blue-600 flex items-center gap-1 transition-colors group-hover:text-blue-700">Unlock 🔒</span>
                                                    ) : (
                                                        <>Access <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span></>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                );

                                const className = `group relative rounded-2xl border ${isLocked ? 'border-slate-200 bg-white' : 'border-slate-200 bg-white shadow-sm'} p-5 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer overflow-hidden block w-full text-left`;

                                if (isLinkInteractive) {
                                    return (
                                        <a
                                            key={`${day}-${i}`}
                                            href={res.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={className}
                                        >
                                            {CardContent}
                                        </a>
                                    );
                                }

                                return (
                                    <button
                                        key={`${day}-${i}`}
                                        className={className}
                                        onClick={() => {
                                            if (isLocked && !isUnlocking) {
                                                setShowUnlockFor({ id: `${day}-${i}`, type: res.unlockType });
                                                setCode("");
                                                setError(false);
                                            }
                                        }}
                                    >
                                        {CardContent}
                                    </button>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* 30-Day Upsell */}
                <div className="mt-16 relative rounded-3xl border border-blue-600/20 overflow-hidden group bg-white shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/5 pointer-events-none" />

                    <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                        <div className="flex-1 space-y-4">
                            <div className={`${jetbrainsMono.variable} font-mono text-xs text-blue-600 tracking-widest uppercase mb-1 flex items-center gap-2 font-semibold`}>
                                <span>🔒</span> The Next Level
                            </div>

                            <h3 className="font-bold text-slate-900 text-3xl">
                                30-Day Agency Arsenal
                            </h3>

                            <p className="text-slate-600 text-base leading-relaxed max-w-lg font-medium">
                                When you are ready to scale to $10k/month, unlock the proprietary systems, sales pipelines, and hiring SOPs used to build multiple 7-figure AI automated agencies.
                            </p>

                            <button className="mt-6 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
                                Upgrade & Unlock Access ↗
                            </button>
                        </div>

                        <div className="flex-1 w-full space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
                            <div className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-widest mb-4">Included in 30-Day</div>
                            <LockedResource title="100k Agency Operating System" />
                            <LockedResource title="7-Figure Sales Call Pipeline" />
                            <LockedResource title="Hiring Your First Setter SOP" />
                            <LockedResource title="Advanced Lead Gen Matrix" />
                            <LockedResource title="White-label Subcontracting Hub" />
                        </div>
                    </div>
                </div>

                <div className="h-20" />
            </div>
        </div>
    );
}
