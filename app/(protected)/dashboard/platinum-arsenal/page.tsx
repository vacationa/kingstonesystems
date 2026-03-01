"use client";

import { LayoutDashboard, Lock, Database, Terminal, Shield, Network, Folder, Compass, Ruler, Database as DbIcon, Zap, Target, Users, TrendingUp, BarChart, Code, Cpu, Globe, Rocket, Sword, GitMerge, Flame, Settings, Anchor, Crown } from "lucide-react";
import { jetbrainsMono } from "@/app/fonts/fonts";
import Link from "next/link";

const ARSENAL_CATEGORIES = [
    {
        name: "I. Sales & Acquisition (The Spear)",
        icon: <Sword size={20} className="text-slate-600" />,
        items: [
            { name: "The $3k Discovery Script", desc: "Logic-based diagnostic for high-ticket closing.", icon: <Terminal size={16} /> },
            { name: "The \"Lethal\" Objection Matrix", desc: "20 technical rebuttals for CFO-level hurdles.", icon: <Shield size={16} /> },
            { name: "The Architecture Pitch Deck", desc: "12-slide technical blueprint for Zoom calls.", icon: <LayoutDashboard size={16} /> },
            { name: "The \"No-Code\" Proposal Template", desc: "Notion-based $5,000 deployment offer.", icon: <Code size={16} /> },
            { name: "The ROI Deployment Calculator", desc: "Math-based proof of AI efficiency.", icon: <BarChart size={16} /> },
            { name: "Master Service Agreement (MSA)", desc: "Lean legal contract for AI recurring services.", icon: <Folder size={16} /> },
            { name: "Statement of Work (SOW)", desc: "Technical scope-of-work template for bot builds.", icon: <Database size={16} /> },
            { name: "The \"Silent Closer\" Video Script", desc: "5-minute pre-call authority video template.", icon: <Zap size={16} /> },
            { name: "Post-Demo Follow-up Protocol", desc: "Automated 7-day technical re-engagement.", icon: <Rocket size={16} /> },
            { name: "The \"Glitch\" Pricing Matrix", desc: "Standardized fees for Setup vs. Monthly Ops.", icon: <TrendingUp size={16} /> },
            { name: "High-Ticket Closing Psychology", desc: "Framework for \"Status-Based\" negotiation.", icon: <Users size={16} /> },
            { name: "The Discovery Audit Form", desc: "Technical checklist for client intake.", icon: <Compass size={16} /> },
            { name: "Vetted Closer Interview SOP", desc: "How to screen for commission-only partners.", icon: <Network size={16} /> },
            { name: "The \"Lethal\" Call Review Protocol", desc: "Step-by-step audit for sales recordings.", icon: <Ruler size={16} /> },
            { name: "The Retainer Transition Script", desc: "Moving a client from $2k to $5k/mo.", icon: <Globe size={16} /> },
            { name: "AI Agent Liability Waiver", desc: "Legal protection against bot hallucinations.", icon: <Shield size={16} /> },
            { name: "Strategic Partner Pitch", desc: "Script for partnering with local IT firms.", icon: <Users size={16} /> },
            { name: "The \"Anchor\" Recap Email", desc: "Summary template to lock in a verbal \"Yes.\"", icon: <Terminal size={16} /> },
            { name: "The Urgency \"Trigger\" List", desc: "10 technical reasons a client must act now.", icon: <Zap size={16} /> },
            { name: "Client Referral Protocol", desc: "The \"Partner-Led\" way to ask for intros.", icon: <Network size={16} /> }
        ]
    },
    {
        name: "II. Strategic Architecture & GTM (The Engineer)",
        icon: <GitMerge size={20} className="text-slate-600" />,
        items: [
            { name: "The \"Lethal\" Niche Selection Matrix", desc: "Analyzing technical vs. economic demand.", icon: <Target size={16} /> },
            { name: "The \"Anchor Offer\" GTM Blueprint", desc: "How to launch the AI Receptionist.", icon: <Rocket size={16} /> },
            { name: "The Systems-First Discovery Protocol", desc: "Diagnosing client bottlenecks.", icon: <Compass size={16} /> },
            { name: "The \"Moat\" Construction Strategy", desc: "Building proprietary agency assets.", icon: <Shield size={16} /> },
            { name: "The B2B SaaS Integration Map", desc: "Identifying high-value integration points.", icon: <Network size={16} /> },
            { name: "The \"Glitch\" Competitive Audit", desc: "How to make competitors look like amateurs.", icon: <Ruler size={16} /> },
            { name: "Strategic Advisory Protocol", desc: "Transitioning from \"Bot Builder\" to \"Consultant.\"", icon: <Users size={16} /> },
            { name: "The \"Lethal\" Offer Stacking Guide", desc: "Increasing LTV through vertical integration.", icon: <TrendingUp size={16} /> },
            { name: "The Engineering Authority Content Framework", desc: "High-status B2B posting.", icon: <Globe size={16} /> },
            { name: "Intellectual Property (IP) Retention SOP", desc: "Protecting your agency's logic.", icon: <Lock size={16} /> },
            { name: "The \"Hallucination\" Mitigation Policy", desc: "Standard client-facing safety doc.", icon: <Shield size={16} /> },
            { name: "Strategic Beta-Tester Protocol", desc: "Scaling new offers with \"Founding\" clients.", icon: <Zap size={16} /> },
            { name: "The \"Lethal\" Case Study Schema", desc: "Engineering-led social proof template.", icon: <Folder size={16} /> },
            { name: "Data Privacy Agreement (DPA)", desc: "B2B data protection and PII compliance.", icon: <Shield size={16} /> },
            { name: "The \"Outcome-Based\" Pricing Model", desc: "Moving from hours to performance.", icon: <BarChart size={16} /> },
            { name: "Strategic Technology Roadmap", desc: "Presenting a 12-month AI vision to clients.", icon: <LayoutDashboard size={16} /> },
            { name: "The \"Lethal\" White-Label Vetting SOP", desc: "How to outsource fulfillment safely.", icon: <Users size={16} /> },
            { name: "The Agency \"Exit\" Architecture", desc: "Building a sellable AI asset.", icon: <Rocket size={16} /> },
            { name: "Technical Documentation Standards", desc: "Ensuring your builds are \"Enterprise Ready.\"", icon: <Database size={16} /> },
            { name: "The \"Glitch\" Partnership Model", desc: "Revenue sharing with existing SaaS vendors.", icon: <Network size={16} /> }
        ]
    },
    {
        name: "III. Prospecting Infrastructure (The Fuel)",
        icon: <Flame size={20} className="text-slate-600" />,
        items: [
            { name: "The 100K Lead Vault Index", desc: "Categorized verified B2B lead segments.", icon: <Database size={16} /> },
            { name: "LinkedIn Automation \"Safety\" Matrix", desc: "Volume settings to avoid bans.", icon: <Shield size={16} /> },
            { name: "Cold Email Infrastructure SOP", desc: "Technical setup for domain warming.", icon: <Globe size={16} /> },
            { name: "The \"Lethal\" Cold Call Opener", desc: "30-second logic-based script.", icon: <Terminal size={16} /> },
            { name: "B2B Event Scraping Protocol", desc: "How to automate lead gen from trade shows.", icon: <Network size={16} /> },
            { name: "Strategic Niche List 2026", desc: "20 highest-margin industries for AI.", icon: <Target size={16} /> },
            { name: "The Clay.com Scaling Matrix", desc: "Advanced B2B research workflows.", icon: <Code size={16} /> },
            { name: "Instagram DM \"Hand-Raiser\" Bot Script", desc: "Automated outreach framework.", icon: <Zap size={16} /> },
            { name: "The Cold Loom Script", desc: "2-minute \"Architecture Review\" video template.", icon: <LayoutDashboard size={16} /> },
            { name: "High-Ticket Outreach Tracker", desc: "Tracking \"Cost Per Booked Meeting.\"", icon: <BarChart size={16} /> },
            { name: "The LinkedIn Content Plan", desc: "30 days of \"Engineering Authority\" posts.", icon: <Folder size={16} /> },
            { name: "Lead Overflow Submission SOP", desc: "How to submit a deal for fulfillment.", icon: <Database size={16} /> },
            { name: "Lusha/Apollo Export Filters", desc: "How to find Decision Makers only.", icon: <Ruler size={16} /> },
            { name: "Strategic SaaS Partnership SOP", desc: "Pitching to existing GHL/Notion users.", icon: <Users size={16} /> },
            { name: "The \"Local Dominance\" Protocol", desc: "Dominating your city’s AI niche.", icon: <Compass size={16} /> },
            { name: "YouTube Lead Gen Framework", desc: "Funneling views to your Agency Sprint.", icon: <Zap size={16} /> },
            { name: "The Cold Email \"Glitch\" Subject Lines", desc: "10 high-open-rate headlines.", icon: <Terminal size={16} /> },
            { name: "Automated Follow-up Matrix", desc: "Sequence for \"Non-Responsive\" leads.", icon: <Network size={16} /> },
            { name: "Strategic Niche Pivot SOP", desc: "How to change industries in 24 hours.", icon: <Globe size={16} /> },
            { name: "The \"Platinum\" Outreach Calendar", desc: "Daily volume targets for $10k/mo.", icon: <TrendingUp size={16} /> }
        ]
    },
    {
        name: "IV. Agency Operations (The Engine)",
        icon: <Settings size={20} className="text-slate-600" />,
        items: [
            { name: "The Agency Hub (Notion)", desc: "The central OS for your entire firm.", icon: <LayoutDashboard size={16} /> },
            { name: "The \"24-Hour\" Onboarding SOP", desc: "Moving from \"Paid\" to \"Kickoff.\"", icon: <Zap size={16} /> },
            { name: "Client Asset Delivery Protocol", desc: "How to \"hand over\" technical projects.", icon: <Folder size={16} /> },
            { name: "Monthly Performance Report", desc: "Automated data dashboard template for clients.", icon: <BarChart size={16} /> },
            { name: "The Weekly \"Stand-up\" SOP", desc: "10-minute team meeting framework.", icon: <Users size={16} /> },
            { name: "Time-Tracking Logic", desc: "Measuring Engineering vs. Sales hours.", icon: <Ruler size={16} /> },
            { name: "The Agency Brand Kit", desc: "Trust seals and professional guidelines.", icon: <Shield size={16} /> },
            { name: "The \"First Hire\" Protocol", desc: "Moving from Solo to Duo.", icon: <Users size={16} /> },
            { name: "Vetted Whitelabel Directory", desc: "Strategic partners for fulfillment.", icon: <Network size={16} /> },
            { name: "Technical Interview Script", desc: "How to audit developer candidates.", icon: <Code size={16} /> },
            { name: "The Profit Margin Calculator", desc: "Keeping overhead below 30%.", icon: <TrendingUp size={16} /> },
            { name: "Strategic Tax Setup", desc: "Optimizing your agency for high-profit.", icon: <BarChart size={16} /> },
            { name: "The \"Hiring\" Pipeline", desc: "Finding sales setters and architects.", icon: <Target size={16} /> },
            { name: "Agency Automation SOP", desc: "Automating your own internal operations.", icon: <Cpu size={16} /> },
            { name: "The \"Lethal\" Meeting Minute Template", desc: "AI-assisted client call notes.", icon: <Terminal size={16} /> }
        ]
    },
    {
        name: "V. Fulfillment & Retention (The Moat)",
        icon: <Anchor size={20} className="text-slate-600" />,
        items: [
            { name: "The \"First 30 Days\" Map", desc: "Ensuring a client doesn't churn.", icon: <Compass size={16} /> },
            { name: "Monthly AI Audit Template", desc: "Charging for \"Optimization & Maintenance.\"", icon: <Database size={16} /> },
            { name: "The \"Upsell\" Architecture", desc: "Moving clients to $5k+ monthly.", icon: <TrendingUp size={16} /> },
            { name: "Client Crisis Protocol", desc: "Managing technical errors or downtime.", icon: <Zap size={16} /> },
            { name: "User Acceptance Testing (UAT)", desc: "Getting client sign-off on builds.", icon: <Shield size={16} /> },
            { name: "The \"Feedback Loop\" System", desc: "Improving agents based on data.", icon: <Code size={16} /> },
            { name: "Platinum Case Study Template", desc: "Turning one win into 10 leads.", icon: <Folder size={16} /> },
            { name: "The Testimonial Script", desc: "Getting clients on video on Day 15.", icon: <Ruler size={16} /> },
            { name: "Monthly \"Alpha\" Updates", desc: "Sending high-value AI news to clients.", icon: <Globe size={16} /> },
            { name: "The Client Gift Strategy", desc: "High-ticket retention psychology.", icon: <Zap size={16} /> },
            { name: "Strategic Pricing Sheet", desc: "No-guesswork fees for AI deployment.", icon: <BarChart size={16} /> },
            { name: "The \"Scaling\" Proposal", desc: "Script for taking over more of their business.", icon: <Rocket size={16} /> },
            { name: "Architecture Migration SOP", desc: "Moving clients to your GHL ecosystem.", icon: <Network size={16} /> },
            { name: "The \"Lethal\" Fulfillment Tracker", desc: "Managing 10+ active clients.", icon: <Database size={16} /> },
            { name: "Client Handover SOP", desc: "Training the client's team to use the tech.", icon: <Users size={16} /> }
        ]
    },
    {
        name: "VI. Platinum Status & Partner HQ",
        icon: <Crown size={20} className="text-slate-600" />,
        items: [
            { name: "Unlimited GHL Sub-account Setup", desc: "Technical activation guide.", icon: <Code size={16} /> },
            { name: "LinkedIn Tool Access Guide", desc: "Setup & automated outreach protocol.", icon: <Terminal size={16} /> },
            { name: "Website Listing Submission SOP", desc: "How to get featured on Kingstone.com.", icon: <Globe size={16} /> },
            { name: "Platinum Partner Branding Kit", desc: "High-res badges and trust seals.", icon: <Shield size={16} /> },
            { name: "The Monthly \"Lethal\" Summit Agenda", desc: "Strategic meeting framework.", icon: <Users size={16} /> },
            { name: "The Platinum Hiring SOP", desc: "Scaling your team through our network.", icon: <Target size={16} /> },
            { name: "Investment Vault Blueprint", desc: "Using profits to buy AI equity.", icon: <TrendingUp size={16} /> },
            { name: "The \"Platinum\" Certification Exam", desc: "The final technical audit checklist.", icon: <Ruler size={16} /> },
            { name: "Platinum Partner Rules", desc: "The elite culture code.", icon: <Shield size={16} /> }
        ]
    }
];

export default function PlatinumArsenalPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8 pb-32">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row gap-6 md:items-start items-center">
                        <div className="w-32 h-32 flex-shrink-0">
                            <img
                                src="/platinum-badge.png"
                                alt="Platinum Status Badge"
                                className="w-full h-full object-contain filter drop-shadow-xl"
                            />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <div className={`${jetbrainsMono.variable} font-mono text-xs text-slate-500 tracking-widest uppercase font-semibold flex items-center justify-center md:justify-start gap-2`}>
                                <span className="flex h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
                                PLATINUM STATUS REQUIRED
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-500 to-slate-800 drop-shadow-sm">
                                The Platinum Arsenal
                            </h1>
                            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                                The proprietary infrastructure for agencies to scale past $10k/mo. High-ticket pipelines, lead overflow, and professional-grade agency assets.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/settings"
                        className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:from-slate-700 hover:to-slate-800 transition-all active:scale-95 flex items-center gap-2 w-fit relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover/btn:translate-x-[150%] transition-transform duration-1000" />
                        Upgrade to Platinum
                    </Link>
                </div>
            </div>

            {/* Categories and Grid */}
            <div className="max-w-7xl mx-auto space-y-20">
                {ARSENAL_CATEGORIES.map((category, catIndex) => (
                    <div key={catIndex} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center shadow-sm">
                                <div className="text-slate-600">
                                    {category.icon}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {category.name}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {category.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="group relative bg-white border border-slate-200 rounded-2xl p-5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-none hover:shadow-xl hover:border-slate-400 hover:shadow-slate-300/20"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100 to-transparent rounded-tr-2xl pointer-events-none z-0 group-hover:from-slate-200 group-hover:opacity-50 transition-colors" />

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:translate-x-[150%] transition-transform duration-1000 z-0 pointer-events-none rounded-2xl" />

                                    <div className="relative z-10 flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-gradient-to-br group-hover:from-slate-100 group-hover:to-slate-200 group-hover:text-slate-700 group-hover:border-slate-300 transition-all group-hover:shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div className="bg-slate-100 rounded-full p-1.5 group-hover:bg-slate-200 transition-colors flex items-center justify-center shadow-inner group-hover:shadow-slate-300/50">
                                            <Lock size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="relative z-10 space-y-1">
                                        <h4 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-slate-800 transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed h-8 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div className="relative z-10 mt-4 pt-4 border-t border-slate-100 flex items-center justify-between group-hover:border-slate-200 transition-colors">
                                        <p className={`${jetbrainsMono.variable} font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold group-hover:text-slate-600 transition-colors`}>
                                            Asset #{100 * (catIndex + 1) + i}
                                        </p>
                                        <div className="text-[10px] font-bold text-slate-300 group-hover:text-slate-500 transition-colors uppercase tracking-widest flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-400 transition-colors"></span> Locked
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Upsell for extra punch */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                                src="/platinum-badge.png"
                                alt="Platinum Status Badge"
                                className="w-full h-full object-contain filter drop-shadow-lg"
                            />
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
