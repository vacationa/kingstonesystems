"use client";

import { useState } from "react";
import { Lock as LucideLock, Database, Shield } from "lucide-react";
import { aeonik, jetbrainsMono } from "@/app/fonts/fonts";
import { submitAuditRequest, submitCertificationRequest } from "@/app/actions/sprint";

const RESOURCES_BY_DAY: Record<number, { title: string, type: string, icon: string, dayTitle: string, locked?: boolean, link?: string, unlockType?: string }[]> = {
    1: [
        { title: "6 Months Free Notion", type: "Link", icon: "📐", dayTitle: "Workspace Setup", locked: true, unlockType: "notion", link: "https://ntn.so/kingstonesystems" },
    ],
    2: [
        { title: "CloserGPT", type: "AI", icon: "📟", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2b8a86fc81918dfe62b4f01b68b3-ai-sprint-closergpt" },
        { title: "PromptGPT", type: "AI", icon: "📟", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2f9f5d5c8191b0e089a16c29a22d-ai-sprint-promptgpt" },
        { title: "ScriptGPT", type: "AI", icon: "📟", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2e98d6d481919e00ae5a2ffc7af3-ai-sprint-scriptgpt" },
        { title: "OfferGPT", type: "AI", icon: "📟", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2dc6329c819186957a8000a2b31c-ai-sprint-offergpt" },
        { title: "LaunchGPT", type: "AI", icon: "📟", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2d48995c8191ac6f58bd22e97858-ai-sprint-launchgpt" },
        { title: "AdGPT", type: "AI", icon: "📟", dayTitle: "Your AI Systems Vault", locked: true, link: "https://chatgpt.com/g/g-699e2e63cdc4819186a41a83891ee6bb-ai-sprint-adgpt" },
    ],
    3: [
        { title: "Instagram Audit", type: "Audit", icon: "🧭", dayTitle: "Audit Request Unlocked", locked: true, unlockType: "audit" },
        { title: "LinkedIn Audit", type: "Audit", icon: "🧭", dayTitle: "Audit Request Unlocked", locked: true, unlockType: "audit" },
    ],
    4: [
        { title: "15,000+ Lead Database", type: "Database", icon: "🗄️", dayTitle: "Land Your First Client Assets", locked: true, unlockType: "leads", link: "https://docs.google.com/spreadsheets/d/1_5TOn2Y-n0n7mKMdZl9Fzcb5kfmSYWAr1U3N6JCVkK8/edit?gid=491522820#gid=491522820" },
    ],
    5: []
};

function LockedResource({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm opacity-90">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💎</span>
            </div>
            <span className={`  text-sm text-slate-600 font-medium`}>{title}</span>
        </div>
    );
}

interface ResourcesDashboardProps {
    initialPrizes?: Record<number, boolean>;
    initialPartnerStatus?: string;
}

export default function ResourcesDashboard({ initialPrizes = {}, initialPartnerStatus = "Awaiting Activation" }: ResourcesDashboardProps) {
    const [unlockedNotion] = useState(!!initialPrizes[1]);
    const [unlockedAI] = useState(!!initialPrizes[2]);
    const [unlockedAudit] = useState(!!initialPrizes[3]);
    const [unlockedLeads] = useState(!!initialPrizes[4]);
    const [unlockedCertification] = useState(!!initialPrizes[5]);
    const [activeAuditForm, setActiveAuditForm] = useState<string | null>(null);
    const [submittedAudits, setSubmittedAudits] = useState<string[]>([]);

    return (
        <div className={`  w-full min-h-full bg-slate-50 text-slate-900 relative`}>
            {/* Background gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.03)_0%,transparent_100%)] pointer-events-none z-0" />
            <div className="fixed top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] z-0 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 lg:px-12 py-10 relative z-10 space-y-12">

                {/* Header */}
                <div className="space-y-2">
                    <div className={`${jetbrainsMono.variable} font-mono text-xs text-blue-600 tracking-widest uppercase font-semibold`}>
                        <span className="flex items-center gap-2">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            ACTIVE ARCHITECTURE
                        </span>
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4`}>
                        Systems Vault
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                        Proprietary architectures, sales systems, and growth assets for the Silver Partner Architecture.
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
                                const isLocked = res.locked && (
                                    res.unlockType === 'notion' ? !unlockedNotion :
                                        res.unlockType === 'audit' ? !unlockedAudit :
                                            res.unlockType === 'leads' ? !unlockedLeads :
                                                res.unlockType === 'certification' ? !unlockedCertification :
                                                    !unlockedAI
                                );
                                const isSubmitted = res.unlockType === 'audit' && submittedAudits.includes(res.title);
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

                                        <div className="relative z-10 mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> {res.type} Format</span>
                                            <span className="group-hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold">
                                                {isLocked ? (
                                                    <span className="text-slate-400 flex items-center gap-1">Locked 🔒</span>
                                                ) : (
                                                    <>
                                                        {res.unlockType === 'audit' ? (
                                                            isSubmitted ? <span className="text-emerald-600">Submitted ✓</span> :
                                                                (activeAuditForm === res.title ? 'Close ×' : 'Request Audit →')
                                                        ) : 'Open Asset →'}
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Inline Audit Form */}
                                        {!isLocked && res.unlockType === 'audit' && activeAuditForm === res.title && (
                                            <div className="relative z-10 mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                                                <form className="space-y-3" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const form = e.target as HTMLFormElement;
                                                    const input = form.querySelector('input') as HTMLInputElement;
                                                    const btn = form.querySelector('button') as HTMLButtonElement;
                                                    const val = input.value.trim();

                                                    if (val) {
                                                        const originalHtml = btn.innerHTML;
                                                        btn.innerHTML = "Submitting...";
                                                        btn.disabled = true;

                                                        const isInsta = res.title.toLowerCase().includes('instagram');
                                                        submitAuditRequest(isInsta ? "" : val, isInsta ? val : "").then((result) => {
                                                            if (result.success) {
                                                                btn.innerHTML = "✓ Submitted";
                                                                btn.style.background = "#22c55e";
                                                                setSubmittedAudits(prev => [...prev, res.title]);
                                                                setTimeout(() => { setActiveAuditForm(null); }, 2000);
                                                            } else {
                                                                btn.innerHTML = "Error";
                                                                btn.disabled = false;
                                                                setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
                                                            }
                                                        });
                                                    }
                                                }}>
                                                    <div className="space-y-1">
                                                        <label className={`${jetbrainsMono.variable} font-mono block text-[9px] text-slate-500 uppercase tracking-widest font-bold`}>
                                                            {res.title.includes('Instagram') ? 'Instagram Handle' : 'LinkedIn URL/Handle'}
                                                        </label>
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            placeholder={res.title.includes('Instagram') ? '@username' : 'linkedin.com/in/you'}
                                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2.5 focus:border-blue-600 focus:outline-none transition-all placeholder-slate-400 font-medium"
                                                        />
                                                    </div>
                                                    <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold text-[10px] py-2 rounded-lg transition-all active:scale-95 uppercase tracking-wider">
                                                        Submit for Audit
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                );

                                const isNotion = res.unlockType === 'notion';
                                const className = `group relative rounded-2xl border ${isLocked ? 'border-slate-200 bg-white' : 'border-slate-200 bg-white shadow-sm'} p-5 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer overflow-hidden block w-full text-left ${isNotion && !isLocked ? 'ring-2 ring-amber-400/50 border-amber-500/30' : ''}`;

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
                                    <div
                                        key={`${day}-${i}`}
                                        className={`${className} ${!isLocked && res.unlockType === 'audit' && !isSubmitted ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default hover:bg-white'}`}
                                        onClick={() => {
                                            if (!isLocked && res.unlockType === 'audit' && !isSubmitted) {
                                                setActiveAuditForm(activeAuditForm === res.title ? null : res.title);
                                            }
                                        }}
                                    >
                                        {CardContent}
                                    </div>
                                );
                            })
                        ))}
                    </div>

                </div>

                {/* Kingstone Silver Certification - Main Feature at Bottom */}
                <div className="mt-20 relative rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(226,232,240,0.5)_0%,transparent_100%)] pointer-events-none" />

                    <div className="p-8 md:p-12 relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                        {/* Certificate Badge Image */}
                        <div className="w-full lg:w-1/3 flex justify-center">
                            <div className="relative group/badge">
                                <div className="absolute -inset-4 bg-slate-200/50 rounded-full blur-2xl group-hover/badge:bg-slate-300/50 transition-all duration-500" />
                                <img
                                    src="/assets/silver-badge.png"
                                    alt="Silver Partner Certification"
                                    className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl transition-transform duration-500 group-hover/badge:scale-105"
                                />
                            </div>
                        </div>

                        {/* Content & Form */}
                        <div className="flex-1 space-y-8">
                            <div className="space-y-4 text-center lg:text-left">
                                <div className={`${jetbrainsMono.variable} font-mono text-xs text-blue-600 tracking-widest uppercase font-bold flex items-center justify-center lg:justify-start gap-2`}>
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    Partner Status Activation
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    Silver Partner Status
                                </h2>
                                <p className="text-slate-500 text-lg font-medium max-w-xl">
                                    Submit your details to activate your Silver Partner status and join the Kingstone Verified Network.
                                </p>
                            </div>

                            {unlockedCertification ? (
                                initialPartnerStatus === "Active" ? (
                                    <div className="bg-emerald-50/50 p-6 md:p-8 rounded-[2rem] border border-emerald-200 flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl mb-2">
                                            ✓
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Partner Status Activated</h3>
                                        <p className="text-emerald-700 font-medium">Your Silver Partner Status is active and your account is fully verified.</p>
                                    </div>
                                ) : (
                                    <form
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-200"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const formData = new FormData(form);
                                            const website = formData.get("website") as string;
                                            const name = formData.get("name") as string;
                                            const email = formData.get("email") as string;
                                            const skoolName = formData.get("skoolName") as string;
                                            const btn = form.querySelector('button');

                                            if (website && name && email && skoolName && btn) {
                                                const originalHtml = btn.innerHTML;
                                                btn.innerHTML = "Activating Partner Status...";
                                                btn.disabled = true;

                                                submitCertificationRequest(website, name, email, skoolName).then((res) => {
                                                    if (res.success) {
                                                        btn.innerHTML = "✓ Partner Status Activated";
                                                        btn.style.background = "#059669";
                                                        btn.style.color = "#FFF";
                                                        // Note: The UI will fully update to the success state on the next page refresh
                                                    } else {
                                                        btn.innerHTML = "Error. Sync required.";
                                                        btn.disabled = false;
                                                        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <div className="space-y-1.5">
                                            <label className={`${jetbrainsMono.variable} font-mono block text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1`}>Agency/Website Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="website"
                                                placeholder="e.g. Lethal AI"
                                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={`${jetbrainsMono.variable} font-mono block text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1`}>Contact Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                placeholder="John Doe"
                                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={`${jetbrainsMono.variable} font-mono block text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1`}>Official Contact Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={`${jetbrainsMono.variable} font-mono block text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1`}>Skool Username</label>
                                            <input
                                                required
                                                type="text"
                                                name="skoolName"
                                                placeholder="@username"
                                                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="md:col-span-2 bg-slate-900 hover:bg-black text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-all active:scale-95 shadow-2xl shadow-black/10 mt-2"
                                        >
                                            Activate Partner Status →
                                        </button>
                                    </form>
                                )
                            ) : (
                                <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-slate-500 font-medium">
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">💎</span> Finish Day 5 tasks to unlock your Silver Partner Status.
                                    </span>
                                    <span className={`${jetbrainsMono.variable} font-mono text-[10px] bg-slate-200 px-2 py-1 rounded uppercase tracking-tighter`}>Status: Locked</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 30-Day Upsell */}
                <div className="mt-16 relative rounded-3xl border border-blue-600/20 overflow-hidden group bg-white shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/5 pointer-events-none" />

                    <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                        <div className="flex-1 space-y-4">
                            <div className={`${jetbrainsMono.variable} font-mono text-[10px] text-blue-600 tracking-widest uppercase mb-1 flex items-center gap-2 font-bold`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Silver to Platinum Status
                            </div>

                            <h3 className="font-bold text-slate-900 text-3xl">
                                The Platinum Arsenal
                            </h3>

                            <p className="text-slate-600 text-base leading-relaxed max-w-lg font-medium">
                                For those ready to move from Silver to Platinum Status. Unlock the High-Ticket Pipeline, the proprietary Agency Arsenal, and our Lead Overflow.
                            </p>

                            <button className="mt-6 px-10 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-black text-white font-bold transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-0.5">
                                Upgrade Status ↗
                            </button>
                        </div>

                        <div className="flex-1 w-full space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
                            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mb-4">Included in Platinum</div>
                            <LockedResource title="💎 Unlimited GHL Sub-accounts (Save $97/mo+)" />
                            <LockedResource title="💎 LinkedIn Outreach Engine (Automate your prospecting)" />
                            <LockedResource title="💎 Advanced Voice AI Blueprints (Vapi & n8n Deployments)" />
                            <LockedResource title="💎 The Platinum Pipeline (Direct High-Ticket Lead Overflow)" />
                            <LockedResource title="💎 Featured Website Partner Status (Instant SEO & Social Proof)" />
                        </div>
                    </div>
                </div>

                <div className="h-20" />
            </div>
        </div>
    );
}
