"use client";

import { LayoutDashboard, Lock, Database, Terminal, Shield, Network, Folder, Compass, Ruler, Database as DbIcon, Zap, Target, Users, TrendingUp, BarChart, Code, Cpu, Globe, Rocket, Sword, GitMerge, Flame, Settings, Anchor, Crown } from "lucide-react";
import { jetbrainsMono } from "@/app/fonts/fonts";
import Link from "next/link";
import { useDemoMode } from "@/app/context/demo-mode-context";

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
                                src="/new-platinum-badge.jpg"
                                alt="Platinum Status Badge"
                                className="w-full h-full object-contain filter drop-shadow-xl"
                            />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-500 to-slate-800 drop-shadow-sm">
                                The Platinum Arsenal
                            </h1>
                            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                                The proprietary infrastructure for agencies to scale past $10k/mo. High-ticket pipelines, lead overflow, and professional-grade agency assets.
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium border border-red-100">
                                <Lock size={16} />
                                Platinum Status Required
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories and Grid */}
            <div className="max-w-7xl mx-auto space-y-20 relative">

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
                                    className="group relative bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 pointer-events-none opacity-60"
                                >
                                    <div className="relative z-10 flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="relative z-10 space-y-1">
                                        <h4 className="font-bold text-slate-500 text-[15px] leading-tight flex items-center gap-2">
                                            {item.name} <Lock size={12} className="text-slate-400" />
                                        </h4>
                                        <div className="h-8 bg-slate-100 rounded animate-pulse mt-2 w-3/4"></div>
                                    </div>

                                    <div className="relative z-10 mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <p className={`${jetbrainsMono.variable} font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold`}>
                                            Asset #{100 * (catIndex + 1) + i}
                                        </p>
                                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                                            <Lock size={10} /> Locked
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Overlay Prompt */}
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="sticky top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-2xl max-w-lg w-full mx-4 text-center pointer-events-auto filter drop-shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-700">
                            <Lock className="text-slate-200" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                            Platinum Status Required
                        </h3>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                            The Platinum Arsenal contains proprietary acquisition systems, high-ticket technical sales frameworks, and strategic agency assets.
                        </p>
                        <button className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border border-slate-700 flex items-center justify-center gap-2">
                            <span>Upgrade to Platinum Status</span>
                            <Crown size={16} className="text-slate-300" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
