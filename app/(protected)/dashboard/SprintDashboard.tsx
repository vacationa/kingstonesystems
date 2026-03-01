"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { aeonik, jetbrainsMono } from "../../../app/fonts/fonts";
import { loadSprintProgress, toggleTask, unlockPrize, submitAuditRequest } from "@/app/actions/sprint";
import { signOutAction } from "@/app/actions/auth";

// ─── Data ──────────────────────────────────────────────────────────────────

const DAYS = [
    {
        day: 1,
        title: "Pick your niche",
        color: "#22c55e",
        prize: {
            name: "6 Months Free Notion",
            description: "Get organized from day one with 6 months of Notion's premium tier, completely free! [Claim your 6 free months here](https://ntn.so/kingstonesystems).",
        },
        tasks: [
            { id: "d1_v1", label: 'Watch The AI Arbitrage Model Explained Simply' },
            { id: "d1_v3", label: 'Watch Best Niches for AI Agent Services in 2026' },
            { id: "d1_v4", label: 'Watch Choosing Your Niche & Committing' },
            { id: "d1_niche", label: "Choose your niche and commit to it" },
        ],
    },
    {
        day: 2,
        title: "Build your first AI agent",
        color: "#3b82f6",
        prize: {
            name: "6 Custom AI GPTs",
            description: "Instant access to: [AI Closer](https://chatgpt.com/g/g-699e2b8a86fc81918dfe62b4f01b68b3-ai-sprint-closer), [AI Goals](https://chatgpt.com/g/g-699e2d48995c8191ac6f58bd22e97858-ai-sprint-launch), [AI Offer](https://chatgpt.com/g/g-699e2dc6329c819186957a8000a2b31c-ai-sprint-offer), [AI Ads](https://chatgpt.com/g/g-699e2e63cdc4819186a41a83891ee6bb-ai-sprint-ads), [AI Scripts](https://chatgpt.com/g/g-699e2e98d6d481919e00ae5a2ffc7af3-ai-sprint-scripts), and [AI Prompts](https://chatgpt.com/g/g-699e2f9f5d5c8191b0e089a16c29a22d-ai-sprint-promptgpt).",
        },
        tasks: [
            { id: "d2_v1", label: 'Watch The AI Receptionist: Your Anchor Offer' },
            { id: "d2_v2", label: 'Watch Missed Call Text Back & Lead Reactivation' },
            { id: "d2_v3", label: 'Watch Build an AI Agent' },
            { id: "d2_build", label: "Follow along with the \"Build Your First AI Agent\" instructions and build yours" },
            { id: "d2_screenshot_agent", label: "Screenshot your finished agent" },
        ],
    },
    {
        day: 3,
        title: "Build Your AI Agency Website",
        color: "#f59e0b",
        prizes: [
            {
                name: "Instagram Audit",
                description: "Enter your Instagram handle below and our team will provide a comprehensive profile optimization audit within 48 hours.",
            },
            {
                name: "LinkedIn Audit",
                description: "Enter your LinkedIn profile URL or username below and our team will provide a comprehensive profile optimization audit within 48 hours.",
            }
        ],
        tasks: [
            { id: "d3_v2", label: 'Watch Finalizing Your Core Offer' },
            { id: "d3_v4", label: "Watch Build Your AI Agency Website" },
            { id: "d3_website", label: "Get your website up" },
        ],
    },
    {
        day: 4,
        title: "Book Your First Meeting",
        color: "#ef4444",
        prize: {
            name: "15,000+ Verified Lead Database",
            description: "[Access your 15,000+ Verified Leads here](https://docs.google.com/spreadsheets/d/1_5TOn2Y-n0n7mKMdZl9Fzcb5kfmSYWAr1U3N6JCVkK8/edit?gid=491522820#gid=491522820).",
        },
        tasks: [
            { id: "d4_v1", label: "Watch How to Build an Elite Lead List Fast" },
            { id: "d4_v2", label: "Watch LinkedIn Prospecting: Authority & Outreach System" },
            { id: "d4_v3", label: "Watch Cold Calling System: High-Speed Pipeline Building" },
            { id: "d4_google_maps", label: "Build your first lead list using the Google Maps method" },
            { id: "d4_outreach_call", label: "Send your first outreach message or make your first call" },
            { id: "d4_screenshot", label: "Screenshot your lead list and outreach" },
        ],
    },
    {
        day: 5,
        title: "Close Your First AI Client",
        color: "#a855f7",
        prize: {
            name: "Silver Partner Status",
            description: "Submit your details in the Systems Vault to activate your Silver Partner status and join the Kingstone Verified Network.",
        },
        tasks: [
            { id: "d5_v1", label: "Watch The One-Call Close" },
            { id: "d5_v2", label: "Watch Launch, QA, & First 7 Days" },
            { id: "d5_outreach", label: "Continue doing outreach" },
        ],
    },
];

// ─── Prize Unlock Card ─────────────────────────────────────────────────────

function PrizeCard({ day, dayData, isComplete, unlockedPrize, onUnlock }: {
    day: number;
    dayData: typeof DAYS[0];
    isComplete: boolean;
    unlockedPrize: boolean;
    onUnlock: (day: number, code: string) => Promise<{ success: boolean; error?: string }>;
}) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const handleUnlock = async () => {
        if (!code.trim()) {
            setError(true);
            return;
        }

        setError(false);
        setServerError(null);
        setIsUnlocking(true);

        try {
            const result = await onUnlock(day, code.trim().toUpperCase());
            if (!result.success) {
                setServerError(result.error || "Invalid code");
            }
        } catch (err) {
            setServerError("An error occurred. Please try again.");
        } finally {
            setIsUnlocking(false);
        }
    };

    if (!isComplete && !unlockedPrize) {
        return (
            <div className="mt-6 p-5 rounded-2xl border border-black/10 bg-slate-50 text-center">
                <p className="text-slate-500 text-sm">
                    Complete all tasks to unlock today's prize
                </p>
                <div className="mt-3 px-4 py-2 bg-white border border-black/10 rounded-xl inline-block">
                    <p className="text-xs text-slate-500 font-medium">
                        {dayData.prize?.name || dayData.prizes?.[0]?.name}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="mt-6 rounded-2xl border overflow-hidden"
            style={{ borderColor: `${dayData.color}40`, background: `${dayData.color}08` }}
        >
            {unlockedPrize ? (
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <span
                            className="font-bold text-base"
                            style={{ color: dayData.color }}
                        >
                            Prize Unlocked!
                        </span>
                    </div>

                    <div>
                        <p className="font-bold text-slate-900 text-base">
                            {dayData.prize?.name || dayData.prizes?.[0]?.name}
                        </p>
                        <div
                            className="text-slate-600 text-sm leading-relaxed mt-1 max-w-lg prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500 prose-a:transition-colors"
                            dangerouslySetInnerHTML={{
                                __html: (dayData.prize?.description || dayData.prizes?.[0]?.description || "").replace(
                                    /\[([^\]]+)\]\(([^)]+)\)/g,
                                    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #2563EB; text-decoration: underline; font-weight: 500;">$1</a>'
                                )
                            }}
                        />
                    </div>

                    {(dayData.prize as any)?.link && (
                        <a
                            href={(dayData.prize as any).link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
                            style={{ background: dayData.color }}
                        >
                            Access Reward ↗
                        </a>
                    )}

                    {dayData.prizes && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {dayData.prizes.map((p, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl bg-white border border-black/5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 text-sm truncate">{p.name}</p>
                                            <p className="text-slate-500 text-[10px] mt-0.5 whitespace-normal leading-tight">{p.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    <div
                        className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl mt-2 w-max"
                        style={{ background: `${dayData.color}15`, color: dayData.color }}
                    >
                        <span>✓</span>
                        <span className={`${jetbrainsMono.variable} font-mono font-semibold`}>Access link processed</span>
                    </div>
                </div>
            ) : (
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🔑</span>
                        <span className="font-semibold text-slate-900 text-sm">
                            Day {day} Complete! Enter your unlock code
                        </span>
                    </div>


                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={code}
                                onChange={e => { setCode(e.target.value.toUpperCase()); setError(false); setServerError(null); }}
                                onKeyDown={e => e.key === "Enter" && handleUnlock()}
                                placeholder="ENTER CODE"
                                disabled={isUnlocking}
                                className={`flex-1 font-mono text-sm px-4 py-2.5 rounded-xl bg-white border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all tracking-widest uppercase disabled:opacity-50`}
                                style={{
                                    borderColor: error || serverError ? "#ef4444" : "#E2E8F0",
                                }}
                            />
                            <button
                                onClick={handleUnlock}
                                disabled={isUnlocking}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                style={{ background: dayData.color }}
                            >
                                {isUnlocking ? "..." : "Unlock"}
                            </button>
                        </div>
                        {(error || serverError) && (
                            <p className="text-red-500 text-xs font-medium">
                                {serverError || "Please enter your unlock code"}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Day Card ──────────────────────────────────────────────────────────────

function DayCard({
    dayData,
    isActive,
    checked,
    unlockedPrize,
    onCheck,
    onActivate,
    onUnlock,
}: {
    dayData: typeof DAYS[0];
    isActive: boolean;
    checked: Record<string, boolean>;
    unlockedPrize: boolean;
    onCheck: (id: string, val: boolean) => void;
    onActivate: () => void;
    onUnlock: (day: number, code: string) => Promise<{ success: boolean; error?: string }>;
}) {
    const totalTasks = dayData.tasks.length;
    const completedTasks = dayData.tasks.filter(t => checked[t.id]).length;
    const progress = Math.round((completedTasks / totalTasks) * 100);
    const isComplete = unlockedPrize || progress === 100;

    return (
        <div
            className="rounded-2xl border transition-all duration-300 overflow-hidden bg-white"
            style={{
                borderColor: isActive ? `${dayData.color}60` : "#E2E8F0",
                boxShadow: isActive ? `0 8px 32px ${dayData.color}15` : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
        >
            {/* Header */}
            <button
                onClick={onActivate}
                className="w-full text-left p-6 flex items-center gap-4 group"
            >
                {/* Day badge */}
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold transition-all"
                    style={{
                        background: isComplete ? `${dayData.color}15` : isActive ? `${dayData.color}10` : "#F8FAFC",
                        border: `1.5px solid ${isComplete || isActive ? `${dayData.color}60` : "#E2E8F0"}`,
                        color: isComplete || isActive ? dayData.color : "#64748B",
                    }}
                >
                    {isComplete ? "✓" : dayData.day}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="font-mono text-xs font-semibold tracking-widest uppercase"
                            style={{ color: dayData.color }}
                        >
                            Day {dayData.day}
                        </span>
                        {isComplete && (
                            <span
                                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{ background: `${dayData.color}15`, color: dayData.color }}
                            >
                                Complete
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mt-0.5 truncate">
                        {dayData.title}
                    </h3>
                </div>

                {/* Progress ring */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className="font-mono text-xs font-bold" style={{ color: dayData.color }}>
                        {completedTasks}/{totalTasks}
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden border border-black/10">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, background: dayData.color }}
                        />
                    </div>
                </div>

                {/* Chevron */}
                <svg
                    className="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded content */}
            {isActive && (
                <div className="px-6 pb-6">
                    <div className="w-full h-px bg-slate-200 mb-5" />

                    {/* Task list */}
                    <div className="space-y-2">
                        {dayData.tasks.map((task) => (
                            <label
                                key={task.id}
                                className="flex items-start gap-3 cursor-pointer group p-2.5 rounded-xl transition-colors hover:bg-slate-50"
                            >
                                <div className="relative flex-shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={!!checked[task.id]}
                                        onChange={e => onCheck(task.id, e.target.checked)}
                                    />
                                    <div
                                        className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 bg-white"
                                        style={{
                                            borderColor: checked[task.id] ? dayData.color : "#E2E8F0",
                                            background: checked[task.id] ? `${dayData.color}15` : "#FFFFFF",
                                        }}
                                    >
                                        {checked[task.id] && (
                                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                                <path
                                                    d="M2 6l3 3 5-5"
                                                    stroke={dayData.color}
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span
                                    className="text-sm leading-relaxed transition-colors mt-0.5"
                                    style={{ color: checked[task.id] ? "#94A3B8" : "#0F172A", textDecoration: checked[task.id] ? "line-through" : "none" }}
                                >
                                    {task.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Prize unlock */}
                    <PrizeCard
                        day={dayData.day}
                        dayData={dayData}
                        isComplete={isComplete}
                        unlockedPrize={unlockedPrize}
                        onUnlock={onUnlock}
                    />
                </div>
            )}
        </div>
    );
}

// ─── 30 Day Locked Card ────────────────────────────────────────────────────

function ThirtyDayLockedCard() {
    return (
        <div className="relative rounded-2xl border border-black/10 overflow-hidden bg-white p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />

            <div className="relative z-10 space-y-5">
                {/* Top row: label + lock button */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <div className="font-mono text-xs text-blue-600 tracking-widest uppercase mb-1.5 font-semibold flex items-center gap-2">
                            <span className="text-sm">🏆</span> COMING NEXT
                        </div>
                        <h3 className="text-slate-900 font-bold text-xl">
                            THE PLATINUM ARSENAL
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Move from Silver to Platinum Partner Status.</p>
                    </div>
                    <button
                        className="flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm text-slate-500 border border-black/10 bg-slate-50 cursor-not-allowed whitespace-nowrap"
                        disabled
                    >
                        Complete the 5-Day Sprint to Unlock
                    </button>
                </div>

                {/* Bullet points */}
                <ul className="space-y-2">
                    {[
                        "The Motherload: Turn your validated offer into a repeatable $10k/month engine.",
                        "Lead Overflow Access: Advanced client acquisition, delegation systems, and scaling playbooks.",
                        "The Platinum Credential: Earn your official 🥇 Platinum Partner Certification.",
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                            <span className="text-blue-600 mt-0.5 flex-shrink-0">→</span>
                            <span className="font-medium">{item}</span>
                        </li>
                    ))}
                </ul>

                {/* Refund highlight — full width */}
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/10">
                    <span className="text-lg">🤝</span>
                    <span>THE FOUNDER'S BET: Finish the 30-day tracker and get a 100% REFUND on your first month of Platinum HQ.</span>
                </div>
            </div>
        </div>
    );
}

// ─── Overall Progress Bar ──────────────────────────────────────────────────

function OverallProgress({ checked, unlockedPrizes }: { checked: Record<string, boolean>; unlockedPrizes: Record<number, boolean> }) {
    const totalTasks = DAYS.reduce((acc, d) => acc + d.tasks.length, 0);
    const completedTasks = DAYS.reduce((acc, d) => acc + d.tasks.filter(t => checked[t.id]).length, 0);
    const pct = Math.round((completedTasks / totalTasks) * 100);
    const completedDays = DAYS.filter(d => unlockedPrizes[d.day] || d.tasks.every(t => checked[t.id])).length;

    return (
        <div className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Stats */}
            <div className="flex gap-6 flex-shrink-0">
                <div>
                    <div className="font-mono text-3xl font-bold text-slate-900">{completedDays}<span className="text-slate-500 text-xl">/5</span></div>
                    <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Days done</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                    <div className="font-mono text-3xl font-bold text-slate-900">{completedTasks}<span className="text-slate-500 text-xl">/{totalTasks}</span></div>
                    <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Tasks done</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                    <div className="font-mono text-3xl font-bold text-slate-900">{pct}<span className="text-slate-500 text-xl">%</span></div>
                    <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Complete</div>
                </div>
            </div>

            {/* Full bar */}
            <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-700 font-medium">Sprint Progress</span>
                    <span className="font-mono text-xs text-blue-600 font-semibold">{pct}% complete</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 border border-black/10">
                    {DAYS.map((d) => {
                        const dayDone = d.tasks.filter(t => checked[t.id]).length;
                        const dayPct = dayDone / d.tasks.length;
                        return (
                            <div key={d.day} className="flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${dayPct * 100}%`, background: d.color }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="flex gap-1">
                    {DAYS.map((d) => (
                        <div key={d.day} className="flex-1 flex items-center justify-center">
                            <span className="font-mono text-[10px] opacity-100 font-semibold text-slate-500">D{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

interface SprintDashboardProps {
    initialChecked: Record<string, boolean>;
    initialPrizes: Record<number, boolean>;
}

export default function SprintDashboard({ initialChecked, initialPrizes }: SprintDashboardProps) {
    const [activeDay, setActiveDay] = useState(1);
    const [checked, setChecked] = useState<Record<string, boolean>>(initialChecked);
    const [unlockedPrizes, setUnlockedPrizes] = useState<Record<number, boolean>>(initialPrizes);
    const [isPending, startTransition] = useTransition();

    const handleCheck = (id: string, val: boolean) => {
        // Optimistic update
        setChecked(prev => ({ ...prev, [id]: val }));
        // Persist to Supabase in background
        startTransition(async () => {
            await toggleTask(id, val);
        });
    };

    const handleUnlock = async (day: number, code: string) => {
        // Persist to Supabase and wait for validation
        const result = await unlockPrize(day, code);

        if (result.success) {
            setUnlockedPrizes(prev => ({ ...prev, [day]: true }));
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    };


    return (
        <div className="w-full min-h-screen bg-slate-50 text-slate-900 relative" style={{ fontFamily: "var(--font-figtree, 'Figtree', system-ui, sans-serif)" }}>

            {/* Very subtle radial glow */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(30,64,175,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1 mt-6">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900">
                            Welcome to the AI Sprint.
                        </h1>
                        <p className="font-mono text-blue-600 text-sm font-semibold mt-2">
                            Let's get you one step closer to your first paying AI client today.
                        </p>
                    </div>
                    <button
                        onClick={() => signOutAction()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors mt-6"
                    >
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>

                {/* Overall progress */}
                <OverallProgress checked={checked} unlockedPrizes={unlockedPrizes} />

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-600/20">
                        <span>5-Day Sprint</span>
                        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Active</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-slate-500 text-sm cursor-not-allowed bg-white/50 font-medium"
                        disabled
                    >
                        <span>30-Day Sprint</span>
                    </button>
                </div>

                {/* Day cards */}
                <div className="space-y-3">
                    {DAYS.map((d) => (
                        <DayCard
                            key={d.day}
                            dayData={d}
                            isActive={activeDay === d.day}
                            checked={checked}
                            unlockedPrize={!!unlockedPrizes[d.day]}
                            onCheck={handleCheck}
                            onActivate={() => setActiveDay(activeDay === d.day ? -1 : d.day)}
                            onUnlock={handleUnlock}
                        />
                    ))}
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-lg uppercase tracking-tight">
                            Daily Maintenance Protocol
                        </h2>
                        <span className="font-mono text-xs text-blue-600 font-bold ml-1 uppercase">(Days 6+)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                            { label: "Response Management", desc: "Clear all follow-ups and active threads." },
                            { label: "Volume Injection", desc: "30 high-intent cold calls + outreach DMs." },
                            { label: "Architecture Review", desc: "Iterate outreach scripts based on yesterday's data." },
                            { label: "Partner Update", desc: "Post your daily accountability check-in." },
                        ].map((item) => (
                            <div key={item.label} className="p-4 rounded-xl bg-slate-50 border border-black/5 text-slate-700">
                                <p className="font-bold text-slate-900 text-sm mb-0.5">{item.label}</p>
                                <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 30-day locked card */}
                <ThirtyDayLockedCard />

                {/* Saving indicator */}
                {isPending && (
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 backdrop-blur-md border border-slate-700 text-xs text-slate-100 shadow-lg font-mono">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Saving...</span>
                    </div>
                )}

                {/* Bottom spacer */}
                <div className="h-8" />
            </div>
        </div>
    );
}
