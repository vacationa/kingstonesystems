"use client";

import { useState, useTransition } from "react";
import { aeonik, jetbrainsMono } from "../../../app/fonts/fonts";
import { loadSprintProgress, toggleTask, unlockPrize, submitAuditRequest } from "@/app/actions/sprint";

// ─── Data ──────────────────────────────────────────────────────────────────

const DAYS = [
    {
        day: 1,
        emoji: "📍",
        title: "Pick your niche",
        color: "#22c55e",
        prize: {
            name: "6 Months Free Notion",
            description: "Get organized from day one with 6 months of Notion's premium tier, completely free! [Claim your 6 free months here](https://ntn.so/kingstonesystems).",
            emoji: "🎁",
        },
        tasks: [
            { id: "d1_playbook", label: "🗺️ Copy the Day 1 Playbook" },
            { id: "d1_v1", label: 'Watch "The AI Arbitrage Model Explained Simply"' },
            { id: "d1_v2", label: 'Watch "The 5 Filters for a Profitable Niche"' },
            { id: "d1_v3", label: 'Watch "Best Niches for AI Agent Services in 2026"' },
            { id: "d1_v4", label: 'Watch "Choosing Your Niche & Committing"' },
            { id: "d1_account", label: "Create account on AI Sprint" },
            { id: "d1_niche", label: "Choose your niche" },
            { id: "d1_screenshot", label: "Screenshot your finished tracker in AI Sprint Dashboard" },
            { id: "d1_post", label: "Post in the community using the template below" },
            { id: "d1_cheer", label: "💚 Go comment on 5 other members' posts and hype them up" },
        ],
        postTemplate: {
            title: "Day 1 done — I'm in 🔥",
            lines: [
                "My niche: [your answer]",
                "Biggest takeaway: [your answer]",
            ],
        },
    },
    {
        day: 2,
        emoji: "🤖",
        title: "Build your first AI agent",
        color: "#3b82f6",
        prize: {
            name: "6 Custom AI GPTs",
            description: "Instant access to: [AI Closer](https://chatgpt.com/g/g-699e2b8a86fc81918dfe62b4f01b68b3-ai-sprint-closer), [AI Goals](https://chatgpt.com/g/g-699e2d48995c8191ac6f58bd22e97858-ai-sprint-launch), [AI Offer](https://chatgpt.com/g/g-699e2dc6329c819186957a8000a2b31c-ai-sprint-offer), [AI Ads](https://chatgpt.com/g/g-699e2e63cdc4819186a41a83891ee6bb-ai-sprint-ads), [AI Scripts](https://chatgpt.com/g/g-699e2e98d6d481919e00ae5a2ffc7af3-ai-sprint-scripts), and [AI Prompts](https://chatgpt.com/g/g-699e2f9f5d5c8191b0e089a16c29a22d-ai-sprint-promptgpt).",
            emoji: "🎁",
        },
        tasks: [
            { id: "d2_playbook", label: "🗺️ Copy the Day 2 Playbook" },
            { id: "d2_v1", label: 'Watch "The AI Receptionist: Your Anchor Offer"' },
            { id: "d2_v2", label: 'Watch "Missed Call Text Back & Lead Reactivation"' },
            { id: "d2_v3", label: 'Watch "Outbound Setters & Reputation Management"' },
            { id: "d2_v4", label: 'Watch "Build an AI Agent"' },
            { id: "d2_build", label: "Follow along with the \"Build an AI Agent\" video and build yours" },
            { id: "d2_screenshot_agent", label: "Screenshot your finished agent" },
            { id: "d2_screenshot", label: "Screenshot your finished tracker in AI Sprint Dashboard" },
            { id: "d2_post", label: "Post in the community using the template below" },
            { id: "d2_cheer", label: "💚 Go comment on 5 other members' posts and hype them up" },
        ],
        postTemplate: {
            title: "Day 2 done — I built my first AI agent 🤖",
            lines: [
                "What my agent does: [your answer]",
                "Biggest surprise: [your answer]",
                "Overall difficulty: [your answer]",
                "[Screenshot of your finished agent]",
                "[Screenshot of your tracker]",
            ],
        },
    },
    {
        day: 3,
        emoji: "",
        title: "Finalize your offer",
        color: "#f59e0b",
        prize: {
            name: "DFY Social Media Makeover",
            description: "A complete 'Done-For-You' professional social media profile optimization to instantly build your authority and trust.",
            emoji: "🎁",
        },
        tasks: [
            { id: "d3_playbook", label: "🗺️ Copy the Day 3 Playbook" },
            { id: "d3_v1", label: 'Watch "How to Structure a 1K-3K/Month Retainer"' },
            { id: "d3_v2", label: 'Watch "Finalizing Your Core Offer"' },
            { id: "d3_lock", label: "Lock in who you're serving and what you're charging" },
            { id: "d3_website", label: "Follow along with the website video and get yours live" },
            { id: "d3_screenshot", label: "Screenshot your finished tracker in AI Sprint Dashboard" },
            { id: "d3_post", label: "Post in the community using the template below" },
            { id: "d3_cheer", label: "💚 Go comment on 5 other members' posts and hype them up" },
        ],
        postTemplate: {
            title: "Day 3 done — my offer is locked 🔒",
            lines: [
                "Who I'm serving & what I'm charging: [your answer]",
                "[Screenshot of your tracker]",
            ],
        },
    },
    {
        day: 4,
        emoji: "",
        title: "Land your first client conversation",
        color: "#a855f7",
        prize: {
            name: "15K+ Verified Leads",
            description: "A highly targeted, verified database of 15,000+ high-intent prospects — the ultimate fuel for your daily outreach.",
            emoji: "🎁",
        },
        tasks: [
            { id: "d4_playbook", label: "🗺️ Copy the Day 4 Playbook" },
            { id: "d4_v1", label: 'Watch "The 4 Lead Channels That Actually Work"' },
            { id: "d4_v2", label: 'Watch "How to Build an Elite Lead List Fast"' },
            { id: "d4_v3", label: 'Watch "LinkedIn Prospecting: Authority & Outreach System"' },
            { id: "d4_v4", label: 'Watch "Cold Calling System: High-Speed Pipeline Building"' },
            { id: "d4_v5", label: 'Watch "The High-Conversion Cold Email System"' },
            { id: "d4_pick_channel", label: "Pick your primary lead channel" },
            { id: "d4_build_list", label: "Build your first lead list using the method from the videos" },
            { id: "d4_send_first", label: "Send your first outreach message or make your first call" },
            { id: "d4_screenshot_lead", label: "Screenshot your lead list and outreach" },
            { id: "d4_screenshot", label: "Screenshot your finished tracker in AI Sprint Dashboard" },
            { id: "d4_post", label: "Post in the community using the template below" },
            { id: "d4_cheer", label: "💚 Go comment on 5 other members' posts and hype them up" },
        ],
        postTemplate: {
            title: "Day 4 done — I'm in the market 📞",
            lines: [
                "Lead channel I chose: [your answer]",
                "How many people I reached out to: [your answer]",
                "Biggest learning: [your answer]",
                "[Screenshot of your lead list]",
                "[Screenshot of your tracker]",
            ],
        },
    },
    {
        day: 5,
        emoji: "🤝",
        title: "Retain your clients & scale what you've built",
        color: "#ef4444",
        prize: {
            name: "The Kingstone AI Solutions Partner Certificate",
            description: "Get your business featured on our website, building instant credibility and social proof that makes closing clients that much easier.",
            emoji: "�",
        },
        tasks: [
            { id: "d5_playbook", label: "🗺️ Copy the Day 5 Playbook" },
            { id: "d5_v1", label: 'Watch "Day 5 Playbook"' },
            { id: "d5_v2", label: 'Watch "Launch, QA, & First 7 Days"' },
            { id: "d5_v3", label: 'Watch "Monthly Reporting That Shows ROI"' },
            { id: "d5_onboard", label: "Map out your client onboarding process" },
            { id: "d5_report", label: "Build your first monthly report template" },
            { id: "d5_screenshot", label: "Screenshot your finished tracker in AI Sprint Dashboard" },
            { id: "d5_post", label: "Post in the community using the template below" },
            { id: "d5_cheer", label: "💚 Go comment on 5 other members' posts and hype them up" },
        ],
        postTemplate: {
            title: "Day 5 done — I finished the sprint �",
            lines: [
                "The biggest thing I built this week: [your answer]",
                "Where I'm going from here: [your answer]",
                "Biggest takeaway from the whole sprint: [your answer]",
                "[Screenshot of your completed tracker]",
            ],
        },
    },
];

// ─── Prize Unlock Card ─────────────────────────────────────────────────────

function PrizeCard({ day, dayData, isComplete, unlockedPrize, onUnlock }: {
    day: number;
    dayData: typeof DAYS[0];
    isComplete: boolean;
    unlockedPrize: boolean;
    onUnlock: (day: number, code: string) => void;
}) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    // Day 3 state
    const [auditCode, setAuditCode] = useState("");
    const [auditError, setAuditError] = useState(false);

    const postText = `${dayData.postTemplate.title}\n${dayData.postTemplate.lines.join("\n")}\n________________________\n🎁 TO GET YOUR DAILY REWARD 🎁\n\nScreenshot your aisprint.com dashboard showing Day ${day} complete\nComment EXACTLY this ⬇️\n"Day ${day} done! Here's my dashboard: [insert screenshot]"\nI'll DM you the secret unlock code 🤫`;

    const handleCopy = () => {
        navigator.clipboard.writeText(postText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUnlock = () => {
        if (code.trim()) {
            onUnlock(day, code.trim().toUpperCase());
            setError(false);
        } else {
            setError(true);
        }
    };

    if (!isComplete) {
        return (
            <div className="mt-6 p-5 rounded-2xl border border-gray-200 bg-gray-50 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-gray-500 text-sm">
                    Complete all tasks to unlock today's prize
                </p>
                <div className="mt-3 px-4 py-2 bg-gray-100 rounded-xl inline-block">
                    <p className="text-xs text-gray-500">
                        {dayData.prize.emoji} {dayData.prize.name}
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
                        <span className="text-2xl">🎉</span>
                        <span
                            className="font-bold text-base"
                            style={{ color: dayData.color }}
                        >
                            Prize Unlocked!
                        </span>
                    </div>

                    <div>
                        <p className="font-bold text-gray-900 text-base">
                            {dayData.prize.name}
                        </p>
                        <div
                            className="text-gray-500 text-sm leading-relaxed mt-1 max-w-lg prose-a:text-blue-700 prose-a:underline hover:prose-a:text-blue-800 prose-a:transition-colors"
                            dangerouslySetInnerHTML={{
                                __html: dayData.prize.description.replace(
                                    /\[([^\]]+)\]\(([^)]+)\)/g,
                                    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #1E40AF; text-decoration: underline; font-weight: 500;">$1</a>'
                                )
                            }}
                        />
                    </div>

                    {/* Special Inline Form for Day 3 Social Medial Makeover */}
                    {day === 3 && (
                        <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <span>🛠️</span> Start Your Audit
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Enter the links to up to two platforms you would like our team to review and remake.
                            </p>

                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault();

                                if (auditCode.trim().toUpperCase() !== "AILAUNCH2026") {
                                    setAuditError(true);
                                    return;
                                }
                                setAuditError(false);

                                const form = e.target as HTMLFormElement;
                                const formData = new FormData(form);
                                const linkedin = formData.get("linkedin") as string;
                                const instagram = formData.get("instagram") as string;

                                if (linkedin || instagram) {
                                    const btn = form.querySelector('button');
                                    if (btn) {
                                        btn.innerHTML = "Submitting...";
                                    }

                                    // Submit to Supabase audit log
                                    submitAuditRequest(linkedin, instagram).then(() => {
                                        if (btn) {
                                            btn.innerHTML = "✓ Audit Requested";
                                            btn.style.background = dayData.color;
                                            btn.style.color = "#000";
                                            btn.disabled = true;
                                        }
                                    });
                                }
                            }}>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1.5 ml-1 uppercase tracking-widest font-mono">LinkedIn URL</label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            placeholder="https://linkedin.com/in/your-profile"
                                            className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none transition-all placeholder-gray-400`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1.5 ml-1 uppercase tracking-widest font-mono">Instagram URL</label>
                                        <input
                                            type="url"
                                            name="instagram"
                                            placeholder="https://instagram.com/your-handle"
                                            className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none transition-all placeholder-gray-400`}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <label className="block text-[10px] flex justify-between text-gray-500 mb-1.5 ml-1 uppercase tracking-widest font-mono">
                                            <span>Access Passcode 🔒</span>
                                            {auditError && <span className="text-red-400 normal-case">Invalid code</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="passcode"
                                            value={auditCode}
                                            onChange={(e) => { setAuditCode(e.target.value); setAuditError(false); }}
                                            placeholder="Enter secret code"
                                            className={`w-full bg-white border ${auditError ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm rounded-xl px-4 py-3 focus:border-blue-700 focus:outline-none transition-all tracking-widest uppercase`}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors">
                                    Submit For Audit →
                                </button>
                            </form>
                        </div>
                    )}

                    {day !== 3 && (
                        <div
                            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl mt-2 w-max"
                            style={{ background: `${dayData.color}20`, color: dayData.color }}
                        >
                            <span>✓</span>
                            <span className={`${jetbrainsMono.variable} font-mono font-semibold`}>Access link processed</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🎁</span>
                        <span className="font-semibold text-gray-900 text-sm">
                            Day {day} Complete! Enter your unlock code
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                        Post your accountability update, share your dashboard screenshot, and DM to receive your code.
                    </p>

                    {/* Post template copy */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Post Template</span>
                            <button
                                onClick={handleCopy}
                                className="text-xs px-3 py-1 rounded-lg transition-all"
                                style={{ background: copied ? `${dayData.color}20` : "#F3F4F6", color: copied ? dayData.color : "#6B7280" }}
                            >
                                {copied ? "✓ Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-900 text-xs font-semibold">{dayData.postTemplate.title}</p>
                            {dayData.postTemplate.lines.map((line, i) => (
                                <p key={i} className="text-gray-500 text-xs">{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Code input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={e => { setCode(e.target.value.toUpperCase()); setError(false); }}
                            onKeyDown={e => e.key === "Enter" && handleUnlock()}
                            placeholder="ENTER CODE"
                            className="flex-1 font-mono text-sm px-4 py-2.5 rounded-xl bg-white border text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 transition-all tracking-widest uppercase"
                            style={{
                                borderColor: error ? "#ef4444" : "#E5E7EB",
                            }}
                        />
                        <button
                            onClick={handleUnlock}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                            style={{ background: dayData.color }}
                        >
                            Unlock
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs">Please enter your unlock code</p>
                    )}
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
    onUnlock: (day: number, code: string) => void;
}) {
    const totalTasks = dayData.tasks.length;
    const completedTasks = dayData.tasks.filter(t => checked[t.id]).length;
    const progress = Math.round((completedTasks / totalTasks) * 100);
    const isComplete = progress === 100;

    return (
        <div
            className="rounded-2xl border transition-all duration-300 overflow-hidden bg-white"
            style={{
                borderColor: isActive ? `${dayData.color}50` : "#E5E7EB",
                boxShadow: isActive ? `0 4px 24px ${dayData.color}12` : "0 1px 3px rgba(0,0,0,0.05)",
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
                        background: isComplete ? `${dayData.color}15` : isActive ? `${dayData.color}10` : "#F9FAFB",
                        border: `1.5px solid ${isComplete || isActive ? `${dayData.color}40` : "#E5E7EB"}`,
                    }}
                >
                    {isComplete ? "✓" : dayData.emoji}
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
                    <h3 className="font-bold text-gray-900 text-lg mt-0.5 truncate">
                        {dayData.title}
                    </h3>
                </div>

                {/* Progress ring */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className="font-mono text-xs font-bold" style={{ color: dayData.color }}>
                        {completedTasks}/{totalTasks}
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, background: dayData.color }}
                        />
                    </div>
                </div>

                {/* Chevron */}
                <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded content */}
            {isActive && (
                <div className="px-6 pb-6">
                    <div className="w-full h-px bg-gray-100 mb-5" />

                    {/* Task list */}
                    <div className="space-y-2">
                        {dayData.tasks.map((task) => (
                            <label
                                key={task.id}
                                className="flex items-start gap-3 cursor-pointer group p-2.5 rounded-xl transition-colors hover:bg-gray-50"
                            >
                                <div className="relative flex-shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={!!checked[task.id]}
                                        onChange={e => onCheck(task.id, e.target.checked)}
                                    />
                                    <div
                                        className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                                        style={{
                                            borderColor: checked[task.id] ? dayData.color : "#D1D5DB",
                                            background: checked[task.id] ? `${dayData.color}15` : "transparent",
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
                                    className="text-sm leading-relaxed transition-colors"
                                    style={{ color: checked[task.id] ? "#9CA3AF" : "#374151", textDecoration: checked[task.id] ? "line-through" : "none" }}
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
        <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-white p-8 shadow-sm">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Lock icon */}
                <div className="w-16 h-16 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <div className="flex-1">
                    <div className="font-mono text-xs text-blue-700 tracking-widest uppercase mb-1">
                        Coming Next
                    </div>
                    <h3 className="text-gray-900 font-bold text-2xl mb-2">
                        The 30-Day AI Agency Sprint
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                        After you've validated your offer and sent your first outreach — the 30-Day Sprint turns it into a <span className="text-gray-900 font-semibold">repeatable $10k/month system</span>. Advanced client acquisition, team building, case studies, and scaling playbooks.
                    </p>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto">
                    <button
                        className="w-full md:w-auto px-6 py-3 rounded-2xl font-semibold text-sm text-gray-400 border border-gray-200 bg-gray-50 cursor-not-allowed"
                        disabled
                    >
                        🔒 Complete 5-Day Sprint to Unlock
                    </button>
                </div>
            </div>

            {/* Preview pills */}
            <div className="relative z-10 mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {[
                    "Cold outreach system",
                    "Case study templates",
                    "Sales call scripts",
                    "Team hiring SOPs",
                    "$10k/month roadmap",
                    "Automated lead generation",
                    "Client retention playbook",
                ].map((item) => (
                    <span
                        key={item}
                        className="text-xs px-3 py-1.5 rounded-full text-gray-500 border border-gray-200 bg-gray-50"
                    >
                        {item}
                    </span>
                ))}
                <span className="text-xs px-3 py-1.5 rounded-full text-gray-500 border border-gray-200 bg-gray-50">
                    + 20 more modules
                </span>
            </div>
        </div>
    );
}

// ─── Overall Progress Bar ──────────────────────────────────────────────────

function OverallProgress({ checked }: { checked: Record<string, boolean> }) {
    const totalTasks = DAYS.reduce((acc, d) => acc + d.tasks.length, 0);
    const completedTasks = DAYS.reduce((acc, d) => acc + d.tasks.filter(t => checked[t.id]).length, 0);
    const pct = Math.round((completedTasks / totalTasks) * 100);
    const completedDays = DAYS.filter(d => d.tasks.every(t => checked[t.id])).length;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
            {/* Stats */}
            <div className="flex gap-6 flex-shrink-0">
                <div>
                    <div className="font-mono text-3xl font-bold text-gray-900">{completedDays}<span className="text-gray-300 text-xl">/5</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Days done</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                    <div className="font-mono text-3xl font-bold text-gray-900">{completedTasks}<span className="text-gray-300 text-xl">/{totalTasks}</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Tasks done</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                    <div className="font-mono text-3xl font-bold text-gray-900">{pct}<span className="text-gray-300 text-xl">%</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Complete</div>
                </div>
            </div>

            {/* Full bar */}
            <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">5-Day Sprint Progress</span>
                    <span className="font-mono text-xs text-gray-400">{pct}% complete</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                    {DAYS.map((d) => {
                        const dayDone = d.tasks.filter(t => checked[t.id]).length;
                        const dayPct = dayDone / d.tasks.length;
                        return (
                            <div key={d.day} className="flex-1 bg-gray-100 rounded-full overflow-hidden">
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
                            <span className="font-mono text-[10px]" style={{ color: d.color }}>D{d.day}</span>
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

    const handleUnlock = (day: number, code: string) => {
        // Optimistic update
        setUnlockedPrizes(prev => ({ ...prev, [day]: true }));
        // Persist to Supabase in background
        startTransition(async () => {
            await unlockPrize(day, code);
        });
    };


    return (
        <div className="w-full min-h-screen bg-[#FAFAFA] text-gray-900 relative" style={{ fontFamily: "var(--font-figtree, 'Figtree', system-ui, sans-serif)" }}>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 relative z-10">
                {/* Header */}
                <div className="space-y-1">
                    <div className="font-mono text-xs text-emerald-600 tracking-widest uppercase">
                        ● System Online
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">
                        Mission Control
                    </h1>
                    <p className="font-mono text-gray-500 text-sm">
                        The AI Sprint — Your Daily Tracker & Reward Ecosystem
                    </p>
                </div>

                {/* Overall progress */}
                <OverallProgress checked={checked} />

                {/* Program selector tabs */}
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200">
                        <span>⚡️</span>
                        <span>5-Day Sprint</span>
                        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Active</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-400 text-sm cursor-not-allowed bg-white"
                        disabled
                    >
                        <span>🔒</span>
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

                {/* Daily Non-Negotiables */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🔁</span>
                        <h2 className="font-bold text-gray-900 text-lg">
                            Daily Non-Negotiables
                        </h2>
                        <span className="font-mono text-xs text-gray-400 ml-1">(Days 5–10)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                            "Follow up on all conversations from yesterday",
                            "30 cold calls + outreach DMs (combined)",
                            "Iterate your outreach scripts",
                            "Post your daily accountability update",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-700 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 30-day locked card */}
                <ThirtyDayLockedCard />

                {/* Saving indicator */}
                {isPending && (
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white backdrop-blur-md border border-gray-200 text-xs text-gray-500 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
                        <span className="font-mono">Saving...</span>
                    </div>
                )}

                {/* Bottom spacer */}
                <div className="h-8" />
            </div>
        </div>
    );
}
