import { LayoutDashboard, Lock, Database, Terminal, Shield, Network, Folder, Compass, Ruler, Zap, Target, Users, TrendingUp, BarChart, Code, Cpu, Globe, Rocket, Sword, GitMerge, Flame, Settings, Anchor, Crown, Bot, Phone, MessageSquare } from "lucide-react";
import { jetbrainsMono } from "@/app/fonts/fonts";
import { getPartnerStatus } from "@/app/actions/sprint";

const SKOOL = "https://www.skool.com/platinum";

const ARSENAL_CATEGORIES = [
    {
        name: "Agents",
        icon: <Bot size={20} className="text-slate-600" />,
        items: [
            { name: "Tow Truck AI Receptionist", desc: "24/7 AI voice agent for towing dispatch & intake.", icon: <Phone size={16} />, href: SKOOL },
            { name: "HVAC AI Receptionist", desc: "Automated booking & emergency call routing for HVAC.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Auto Repair AI Receptionist", desc: "AI-powered scheduling & service inquiry handler.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Gym AI Receptionist", desc: "Membership inquiries, class bookings & tours on autopilot.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Pest Control AI Receptionist", desc: "Instant quoting & appointment booking for pest services.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Personal Injury Law Firm AI Receptionist", desc: "24/7 lead intake & case qualification for law firms.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Med Spa AI Receptionist", desc: "Appointment scheduling & treatment inquiry automation.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Driving School AI Receptionist", desc: "Lesson booking & student inquiry management.", icon: <Phone size={16} />, href: SKOOL },
            { name: "Plumbing Missed Call Text-Back System", desc: "Automated SMS follow-up for missed plumbing calls.", icon: <MessageSquare size={16} />, href: SKOOL },
            { name: "Barbershop Missed Call Text-Back System", desc: "Instant text follow-up for missed barbershop calls.", icon: <MessageSquare size={16} />, href: SKOOL },
            { name: "HVAC Missed Call Text-Back System", desc: "Automated text response for missed HVAC service calls.", icon: <MessageSquare size={16} />, href: SKOOL },
            { name: "Ecommerce Returns Agent", desc: "AI-powered returns & refund request automation.", icon: <Bot size={16} />, href: SKOOL },
            { name: "Solar Proposal Generator", desc: "Automated solar installation proposals & estimates.", icon: <Zap size={16} />, href: SKOOL },
            { name: "Plumbing Quote Generator", desc: "Instant AI-generated quotes for plumbing services.", icon: <Ruler size={16} />, href: SKOOL },
            { name: "HVAC Proposal Generator", desc: "Automated HVAC system proposals & pricing.", icon: <Settings size={16} />, href: SKOOL },
            { name: "Junk Removal Quoter", desc: "AI-powered junk removal estimates & booking.", icon: <Target size={16} />, href: SKOOL },
        ]
    },
    {
        name: "I. Sales & Acquisition (The Spear)",
        icon: <Sword size={20} className="text-slate-600" />,
        items: [
            { name: "The $3k Discovery Script", desc: "Logic-based diagnostic for high-ticket closing.", icon: <Terminal size={16} />, href: "https://docs.google.com/document/d/1zKJXQ0g45G2IoSSltkm7_EvAZIeroQiOW2IbQc7dDwQ/edit?tab=t.0" },
            { name: "The \"Lethal\" Objection Matrix", desc: "20 technical rebuttals for CFO-level hurdles.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/1pKACh7YPthwGntq5-GChvkSH2J4zieoVyI2dU4mTdlw/edit?tab=t.0#heading=h.b11q0521zm16" },
            { name: "The Architecture Pitch Deck", desc: "12-slide technical blueprint for Zoom calls.", icon: <LayoutDashboard size={16} />, href: "https://claude.ai/public/artifacts/c62eac32-af66-4d87-bb24-da586814c7d9" },
            { name: "The \"No-Code\" Proposal Template", desc: "Notion-based $5,000 deployment offer.", icon: <Code size={16} />, href: "https://docs.google.com/document/d/18gC1SMt85hj7yCDAPHFVOLxx5UR0Xw06YanUvW_UHR8/edit?tab=t.0" },
            { name: "The ROI Deployment Calculator", desc: "Math-based proof of AI efficiency.", icon: <BarChart size={16} />, href: "https://claude.ai/public/artifacts/1bd51826-673c-4636-913b-9774f4921834" },
            { name: "Master Service Agreement (MSA)", desc: "Lean legal contract for AI recurring services.", icon: <Folder size={16} />, href: "https://docs.google.com/document/d/1Xj5V1ioclMQ31Cr_zfexu1J8ao8UZSKjkO6O037tEBQ/edit?tab=t.0" },
            { name: "Statement of Work (SOW)", desc: "Technical scope-of-work template for bot builds.", icon: <Database size={16} />, href: "https://docs.google.com/document/d/1XmeprplorVowDiufuM-9ecUOSxo_kV4Zn4yssoO7Xqc/edit?tab=t.0#heading=h.mcxp9qff14cj" },
            { name: "The \"Silent Closer\" Video Script", desc: "5-minute pre-call authority video template.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/1fKwyD2gTuvhfdVkXRGl2dhlE-iViFvBOkeadNXC7meI/edit?tab=t.0" },
            { name: "Post-Demo Follow-up Protocol", desc: "Automated 7-day technical re-engagement.", icon: <Rocket size={16} />, href: "https://docs.google.com/document/d/1p1hkmBgVu4sa119i8UyDgD5tWz-ulHxlg_rwGeEjCYc/edit?tab=t.0#heading=h.wqfhgy99011" },
            { name: "The \"Glitch\" Pricing Matrix", desc: "Standardized fees for Setup vs. Monthly Ops.", icon: <TrendingUp size={16} />, href: "https://claude.ai/public/artifacts/298fc390-21ae-449f-8cd7-4689e0267a89" },
            { name: "High-Ticket Closing Psychology", desc: "Framework for \"Status-Based\" negotiation.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/1MB1Aep6qj3o9_6_4emEGj3hPsex7fok7P7f8oDW4rZw/edit?tab=t.0#heading=h.fyv2ja9ky7lg" },
            { name: "The Discovery Audit Form", desc: "Technical checklist for client intake.", icon: <Compass size={16} />, href: "https://docs.google.com/document/d/1BvTyExpVR6nz-0ZoQbEQajT2b7aSkrAsCBjuaNb-0io/edit?tab=t.0" },
            { name: "Vetted Closer Interview SOP", desc: "How to screen for commission-only partners.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1JwBsp555fu6R7N3Buz0dXYdKrFxLbXqS0wvZrt9HXy0/edit?tab=t.0#heading=h.6r2znjuv77vh" },
            { name: "The \"Lethal\" Call Review Protocol", desc: "Step-by-step audit for sales recordings.", icon: <Ruler size={16} />, href: "https://docs.google.com/document/d/1WaeHpBFReTodnPbdC5zWnqRBvR9guZkAO2rgm8-4GLk/edit?tab=t.0" },
            { name: "The Retainer Transition Script", desc: "Moving a client from $2k to $5k/mo.", icon: <Globe size={16} />, href: "https://docs.google.com/document/d/1AKQlMjfX7HSB8yYmHXlXwlnWadpGIKNPHs7nhTwzl5g/edit?tab=t.0#heading=h.tflvxtozbl0z" },
            { name: "AI Agent Liability Waiver", desc: "Legal protection against bot hallucinations.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/1r2ISOYOMxvsaiwWWQK-RXy4jq3qtIpGSUR0ZYwd7f4o/edit?tab=t.0#heading=h.62h3mfv5khhg" },
            { name: "Strategic Partner Pitch", desc: "Script for partnering with local IT firms.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/11NOPrdM-WaMgLNzIfqAy5N6-frHp5Xo5j3Emer8uzv0/edit?tab=t.0" },
            { name: "The \"Anchor\" Recap Email", desc: "Summary template to lock in a verbal \"Yes.\"", icon: <Terminal size={16} />, href: "https://docs.google.com/document/d/1e9VHghAc5cC-QAfzHdloCZhqwG66XQxQd6H6kiosF8s/edit?tab=t.0#heading=h.gdez1uwojuq9" },
            { name: "The Urgency \"Trigger\" List", desc: "10 technical reasons a client must act now.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/1VroDsUhIXHgh5hkyykV5QrByqDtohC6sHKSMTacdf4A/edit?tab=t.0" },
            { name: "Client Referral Protocol", desc: "The \"Partner-Led\" way to ask for intros.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1yY5V3cJOfvBptCvv-wNS27YKCx1dedwfHHsjPdEGb5w/edit?tab=t.0" },
        ]
    },
    {
        name: "II. Strategic Architecture & GTM (The Engineer)",
        icon: <GitMerge size={20} className="text-slate-600" />,
        items: [
            { name: "The \"Lethal\" Niche Selection Matrix", desc: "Analyzing technical vs. economic demand.", icon: <Target size={16} />, href: "https://docs.google.com/document/d/1NJQfK3IO-Eq-DehP-YXPIY-txmo7e5X3CZpCmWoYPM4/edit?tab=t.0" },
            { name: "The \"Anchor Offer\" GTM Blueprint", desc: "How to launch the AI Receptionist.", icon: <Rocket size={16} />, href: "https://docs.google.com/document/d/1zlOZQvpQENSqaBUz0IRoyN5oRJoFfssb-jNhJWSFgh4/edit?tab=t.0" },
            { name: "The Systems-First Discovery Protocol", desc: "Diagnosing client bottlenecks.", icon: <Compass size={16} />, href: "https://docs.google.com/document/d/1hAky0qAO4lE04ipBHUp2LKHNgofbTy0sOELZ-SNvsrE/edit?tab=t.0" },
            { name: "The \"Moat\" Construction Strategy", desc: "Building proprietary agency assets.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/1hDJm2Nt1grC3Z6f0i-DBPRXmhZ8IALSxWlVjGS4_IN0/edit?tab=t.0" },
            { name: "The B2B SaaS Integration Map", desc: "Identifying high-value integration points.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1RPsc2NOm1wKhyOz5X392OSHxsSa5lVbqXsBkMi8GMjY/edit?tab=t.0" },
            { name: "The \"Glitch\" Competitive Audit", desc: "How to make competitors look like amateurs.", icon: <Ruler size={16} />, href: "https://docs.google.com/document/d/1WRTZYd1dOlT3MyXuWE-1GYpRatfwsqo_WrnJW6YNV3g/edit?tab=t.0" },
            { name: "Strategic Advisory Protocol", desc: "Transitioning from \"Bot Builder\" to \"Consultant.\"", icon: <Users size={16} />, href: "https://docs.google.com/document/d/1ujlXeUux6s_ZItCBFfxYjiF57X3EPjoCWaqKs83lH4A/edit?tab=t.0" },
            { name: "The \"Lethal\" Offer Stacking Guide", desc: "Increasing LTV through vertical integration.", icon: <TrendingUp size={16} />, href: "https://docs.google.com/document/d/1LDrc1Q5QgoPXIDpTITYTDn04PrvFVEshLj6MaVIMgRo/edit?tab=t.0" },
            { name: "The Engineering Authority Content Framework", desc: "High-status B2B posting.", icon: <Globe size={16} />, href: "https://docs.google.com/document/d/1Y8JBH0cIBoMCulVabKRQJBzFs-udxPSRmg4ySPqTFJA/edit?tab=t.0" },
            { name: "Intellectual Property (IP) Retention SOP", desc: "Protecting your agency's logic.", icon: <Lock size={16} />, href: "https://docs.google.com/document/d/1L7W0mJvHS0DAM1jjqvHy02TrMh9wfuaV_ghgR9zlYlQ/edit?tab=t.0" },
            { name: "The \"Hallucination\" Mitigation Policy", desc: "Standard client-facing safety doc.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/18J4apDRukjPR0xmUAKJ_WeOZf1b-tFrgJydGUvbOjlQ/edit?tab=t.0" },
            { name: "Strategic Beta-Tester Protocol", desc: "Scaling new offers with \"Founding\" clients.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/1Jp-I80NkwnYAia5cBw6vxtvEid5NAiL-X5vZxR9c8uw/edit?tab=t.0" },
            { name: "The \"Lethal\" Case Study Schema", desc: "Engineering-led social proof template.", icon: <Folder size={16} />, href: "https://docs.google.com/document/d/1SSb6z2Op5x2s2vs-DQe7w-MwKZa54pyGj09mfOvTLPw/edit?tab=t.0" },
            { name: "Data Privacy Agreement (DPA)", desc: "B2B data protection and PII compliance.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/1LzXJHovsGLExNQc3SJV0H3RxhRZ5xncvStR3M8uAnBE/edit?tab=t.0" },
            { name: "The \"Outcome-Based\" Pricing Model", desc: "Moving from hours to performance.", icon: <BarChart size={16} />, href: "https://docs.google.com/document/d/1_ali6whem5pAzZH6hk4YosmCClEasfbsxkR5MNi-s8w/edit?tab=t.0" },
            { name: "Strategic Technology Roadmap", desc: "Presenting a 12-month AI vision to clients.", icon: <LayoutDashboard size={16} />, href: "https://docs.google.com/document/d/19vGaBGYE5f8rwWpid_rgW1Jwzxei5AA5LJn3Ynu9rVY/edit?tab=t.0" },
            { name: "The \"Lethal\" White-Label Vetting SOP", desc: "How to outsource fulfillment safely.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/1R3ohYEFBu0rUdgBlujgfu-pf36zRzHv20fnKJ4jO-1k/edit?tab=t.0" },
            { name: "The Agency \"Exit\" Architecture", desc: "Building a sellable AI asset.", icon: <Rocket size={16} />, href: "https://docs.google.com/document/d/1gAEFuL706DKIiTfSv8PO1Y2fbKasQ1GIRtq-VdBTbs0/edit?tab=t.0" },
            { name: "Technical Documentation Standards", desc: "Ensuring your builds are \"Enterprise Ready.\"", icon: <Database size={16} />, href: "https://docs.google.com/document/d/1nxmrXxcUcE74g1UJVDQLUevTB7lbxCWx1lQqal8IIi8/edit?usp=sharing" },
            { name: "The \"Glitch\" Partnership Model", desc: "Revenue sharing with existing SaaS vendors.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1_08ViM8RfiAjiLlN5vzWCU11FVEHkYNQO-DRwUJxFTo/edit?tab=t.0" },
        ]
    },
    {
        name: "III. Prospecting Infrastructure (The Fuel)",
        icon: <Flame size={20} className="text-slate-600" />,
        items: [
            { name: "The 100K Lead Vault Index", desc: "Categorized verified B2B lead segments.", icon: <Database size={16} />, href: "https://docs.google.com/document/d/10aMYUsOhvE5RjwAFwAEfDZ9Q0a9yd4gUqRm8pIgc_9s/edit?tab=t.0" },
            { name: "LinkedIn Automation \"Safety\" Matrix", desc: "Volume settings to avoid bans.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/1csIYqxQzaHIOuIYYhFy_XTHYb8c98jgbrkOmeKRUr6Y/edit?tab=t.0" },
            { name: "Cold Email Infrastructure SOP", desc: "Technical setup for domain warming.", icon: <Globe size={16} />, href: "https://docs.google.com/document/d/1_DNO6D--u55rvNREWz7yWEgkBESwsj3P91Nsf6IdvKY/edit?tab=t.0" },
            { name: "The \"Lethal\" Cold Call Opener", desc: "30-second logic-based script.", icon: <Terminal size={16} />, href: "https://docs.google.com/document/d/1_DNO6D--u55rvNREWz7yWEgkBESwsj3P91Nsf6IdvKY/edit?tab=t.0" },
            { name: "B2B Event Scraping Protocol", desc: "How to automate lead gen from trade shows.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1Xu-u-13XfFQNGnhzd0lpsKCPDKqKlpx6V-i7h78bqTs/edit?tab=t.0" },
            { name: "Strategic Niche List 2026", desc: "20 highest-margin industries for AI.", icon: <Target size={16} />, href: "https://docs.google.com/document/d/1Gi7rn8xD4yxLqqOkGdzGevHnmh_sjJ_rhjlafOZnpg0/edit?tab=t.0" },
            { name: "The Clay.com Scaling Matrix", desc: "Advanced B2B research workflows.", icon: <Code size={16} />, href: "https://docs.google.com/document/d/1vi3So5OGdvVY_hLcmkv_V3q8mqYXb42km3tk6tKQFBk/edit?tab=t.0" },
            { name: "Instagram DM \"Hand-Raiser\" Bot Script", desc: "Automated outreach framework.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/1B5TYBXEBGDKkAmnpezWVAZ6uRm6jqTMnhxT0Yw-NEgo/edit?tab=t.0" },
            { name: "The Cold Loom Script", desc: "2-minute \"Architecture Review\" video template.", icon: <LayoutDashboard size={16} />, href: "https://docs.google.com/document/d/1Iw-EIYJiw1cvapt0zJIOCZtxHGB3nW5L4wiu4FFHd-w/edit?tab=t.0" },
            { name: "High-Ticket Outreach Tracker", desc: "Tracking \"Cost Per Booked Meeting.\"", icon: <BarChart size={16} />, href: "https://docs.google.com/spreadsheets/d/1ADulgLIxXfP50wW2dAIbkn_fn5_6gmgy-t_fHaYEjWs/edit" },
            { name: "The LinkedIn Content Plan", desc: "30 days of \"Engineering Authority\" posts.", icon: <Folder size={16} />, href: "https://docs.google.com/document/d/1LHNKTOwJhcp0c0Uqq5dTkcFJEE_58sbmSd_Rg4wjGXY/edit?tab=t.0" },
            { name: "Lead Overflow Submission SOP", desc: "How to submit a deal for fulfillment.", icon: <Database size={16} />, href: "https://docs.google.com/document/d/1taeUusSRqa5NRJAh95RJnN3alMA7h4ucZ7mgT8O4EsQ/edit?tab=t.0" },
            { name: "Lusha/Apollo Export Filters", desc: "How to find Decision Makers only.", icon: <Ruler size={16} />, href: "https://docs.google.com/document/d/1rUNe1GAwU9zEGk1b12RYdH6RZx6lbJX7nW4Xnem_18U/edit?tab=t.0" },
            { name: "Strategic SaaS Partnership SOP", desc: "Pitching to existing GHL/Notion users.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/1DeV57sZx8Twgcxdu3VvKkppslZlqQVWvd66lxg78vVY/edit?tab=t.0" },
            { name: "The \"Local Dominance\" Protocol", desc: "Dominating your city's AI niche.", icon: <Compass size={16} />, href: "https://docs.google.com/document/d/1pnocSSfg8ULpKTaongMWTPdzuiQCkokoke3gOC_i7fc/edit?tab=t.0" },
            { name: "YouTube Lead Gen Framework", desc: "Funneling views to your Agency Sprint.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/11WzVfVC0C7lefSKnOqAON5HliLHTKIwQMwUW5tbunyg/edit?tab=t.0" },
            { name: "The Cold Email \"Glitch\" Subject Lines", desc: "10 high-open-rate headlines.", icon: <Terminal size={16} />, href: "https://docs.google.com/document/d/1FfJwNWf01o3ISLMuCbcbgphlk97uaZdQmtj-3MpGOIw/edit?tab=t.0" },
            { name: "Automated Follow-up Matrix", desc: "Sequence for \"Non-Responsive\" leads.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1aimmRQBBl3MMTpB9_I7oCN0GlmDgu2sIJojnOso4t7c/edit?tab=t.0" },
            { name: "Strategic Niche Pivot SOP", desc: "How to change industries in 24 hours.", icon: <Globe size={16} />, href: "https://docs.google.com/document/d/1RyJM1OSK2DOY3Gy1LZbLePYkJ45vsW7E42L52hrkkUM/edit?tab=t.0" },
            { name: "The \"Platinum\" Outreach Calendar", desc: "Daily volume targets for $10k/mo.", icon: <TrendingUp size={16} />, href: "https://docs.google.com/document/d/1DMyvWrARr5PwbXNuuRjyh0U-wc4OeRLKKpxlOOHWq7M/edit?tab=t.0" },
        ]
    },
    {
        name: "IV. Agency Operations (The Engine)",
        icon: <Settings size={20} className="text-slate-600" />,
        items: [
            { name: "The Agency Hub (Notion)", desc: "The central OS for your entire firm.", icon: <LayoutDashboard size={16} />, href: SKOOL },
            { name: "The \"24-Hour\" Onboarding SOP", desc: "Moving from \"Paid\" to \"Kickoff.\"", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/14dpwYbTNinPjbpjMajOgLwGZcUexZ-BkCYg4QXwMee0/edit?tab=t.0" },
            { name: "Client Asset Delivery Protocol", desc: "How to \"hand over\" technical projects.", icon: <Folder size={16} />, href: "https://docs.google.com/document/d/17Yjf9d5HmQDbfHBvxL43jhpQ_4pk8y4bLRdrpgGpXck/edit?tab=t.0" },
            { name: "Monthly Performance Report", desc: "Automated data dashboard template for clients.", icon: <BarChart size={16} />, href: "https://docs.google.com/document/d/189nsJJhDx16LLil2YqpC611_N82lhzCBEODUfb1Cc2M/edit?tab=t.0" },
            { name: "The Weekly \"Stand-up\" SOP", desc: "10-minute team meeting framework.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/1pPGGWq-yiMi1DaMqn9g3rmk_5G9TrTa2Pma9yBEqs8w/edit?tab=t.0" },
            { name: "Time-Tracking Logic", desc: "Measuring Engineering vs. Sales hours.", icon: <Ruler size={16} />, href: "https://docs.google.com/document/d/1sXHmggv70g9Q5xuSEpdbZ-iol7vHYzdDb7hrr6ZcX8Q/edit?tab=t.0" },
            { name: "The Agency Brand Kit", desc: "Trust seals and professional guidelines.", icon: <Shield size={16} />, href: "https://claude.ai/public/artifacts/70d05283-9631-4454-871b-5671594d7eee" },
            { name: "The \"First Hire\" Protocol", desc: "Moving from Solo to Duo.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/1rlJ3X-n75kLkq_Kpxeji67M_mJZiNwdTkfS5NjdR8F4/edit?tab=t.0" },
            { name: "Vetted Whitelabel Directory", desc: "Strategic partners for fulfillment.", icon: <Network size={16} />, href: SKOOL },
            { name: "Technical Interview Script", desc: "How to audit developer candidates.", icon: <Code size={16} />, href: "https://docs.google.com/document/d/1YT3WCB6Ql2ietAU6a3URPNPlhBECFLX05XgjyFhBEn4/edit?tab=t.0" },
            { name: "The Profit Margin Calculator", desc: "Keeping overhead below 30%.", icon: <TrendingUp size={16} />, href: "https://docs.google.com/document/d/1O4Ge6IgWcgFFeT1DnAWPtJ344rExM4xzBdx5bOyPois/edit?tab=t.0" },
            { name: "Strategic Tax Setup", desc: "Optimizing your agency for high-profit.", icon: <BarChart size={16} />, href: "https://docs.google.com/document/d/1kzqn7O5yD0qRha2oycZWXZZX5Iz3eu-lLlPEkc6xoOg/edit?usp=sharing" },
            { name: "The \"Hiring\" Pipeline", desc: "Finding sales setters and architects.", icon: <Target size={16} />, href: "https://docs.google.com/document/d/1XSoQyNEkfPc5SftH52vjwwcpKChAJmbhfrkwbzWjXJ0/edit?tab=t.0" },
            { name: "Agency Automation SOP", desc: "Automating your own internal operations.", icon: <Cpu size={16} />, href: "https://docs.google.com/document/d/1Px7ubYPHkx67OrTsLExR4uethPgRLSnvcyCv1sAvDi4/edit?tab=t.0" },
            { name: "The \"Lethal\" Meeting Minute Template", desc: "AI-assisted client call notes.", icon: <Terminal size={16} />, href: "https://docs.google.com/document/d/1nZASKJFlHrwXL1nW6DDuYh05qo3WuKEytpQwdWAec6Q/edit?tab=t.0" },
        ]
    },
    {
        name: "V. Fulfillment & Retention (The Moat)",
        icon: <Anchor size={20} className="text-slate-600" />,
        items: [
            { name: "The \"First 30 Days\" Map", desc: "Ensuring a client doesn't churn.", icon: <Compass size={16} />, href: "https://docs.google.com/document/d/1r1zQSqLS3qeW4ZToy_UcWu6K7FPbcZX7E5XgnnQwQ4s/edit?tab=t.0" },
            { name: "Monthly AI Audit Template", desc: "Charging for \"Optimization & Maintenance.\"", icon: <Database size={16} />, href: "https://docs.google.com/document/d/1ScPn7yoA3RMqfS128Xu8uOR8n5LnRiqJmBj9Uf_zMGA/edit?tab=t.0" },
            { name: "The \"Upsell\" Architecture", desc: "Moving clients to $5k+ monthly.", icon: <TrendingUp size={16} />, href: "https://docs.google.com/document/d/1KF2voZvPYqC0UDAo6qxFB27L26qnWD8KP-hJl2brHdI/edit?tab=t.0" },
            { name: "Client Crisis Protocol", desc: "Managing technical errors or downtime.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/11FfRnWP9vVa3fA5OWiPTDiWsZ8-KJYST3gG-iaKL3ic/edit?tab=t.0" },
            { name: "User Acceptance Testing (UAT)", desc: "Getting client sign-off on builds.", icon: <Shield size={16} />, href: "https://docs.google.com/document/d/1rFYbM29auIi26nRat8cJpKR7-X9tdhLhRQZDDd3HoYg/edit?tab=t.0" },
            { name: "The \"Feedback Loop\" System", desc: "Improving agents based on data.", icon: <Code size={16} />, href: "https://docs.google.com/document/d/1D1bRGrFVHPX87stx4CZw4y3D1II7pvDBl33NY34LjWw/edit?tab=t.0" },
            { name: "Platinum Case Study Template", desc: "Turning one win into 10 leads.", icon: <Folder size={16} />, href: "https://docs.google.com/document/d/1REfRAMDdm6fflTBucN7d9I45J6qpiKF0JHzxxb96-Jc/edit?tab=t.0" },
            { name: "The Testimonial Script", desc: "Getting clients on video on Day 15.", icon: <Ruler size={16} />, href: "https://docs.google.com/document/d/1JMCSHWPoazqEPCWecMMpiqzpK2BRDi9WjoSnsFSs8_c/edit?tab=t.0" },
            { name: "Monthly \"Alpha\" Updates", desc: "Sending high-value AI news to clients.", icon: <Globe size={16} />, href: "https://docs.google.com/document/d/1cQ-HO3j2p7w7V2byjkYBlYaOFS13ydK9-TkDLM0-Vac/edit?tab=t.0" },
            { name: "The Client Gift Strategy", desc: "High-ticket retention psychology.", icon: <Zap size={16} />, href: "https://docs.google.com/document/d/15AQuUpQk5WcFsvkmOMT5SylpcKJZjcOqYuNYvBKmOxM/edit?tab=t.0" },
            { name: "Strategic Pricing Sheet", desc: "No-guesswork fees for AI deployment.", icon: <BarChart size={16} />, href: "https://docs.google.com/document/d/1AKdcwTi8LHLmtJuWBuK8PI0S2wGhTkPVvPfNBRZ00F0/edit?tab=t.0" },
            { name: "The \"Scaling\" Proposal", desc: "Script for taking over more of their business.", icon: <Rocket size={16} />, href: "https://docs.google.com/document/d/13mCu5toEsgkzwp2eYw1Z-p47_r7j_GHI7xVdXeUJI5U/edit?tab=t.0" },
            { name: "Architecture Migration SOP", desc: "Moving clients to your GHL ecosystem.", icon: <Network size={16} />, href: "https://docs.google.com/document/d/1K2JiV-yz0_lu0gVEpm4zl2GGjeSOxUSBrIYjQbw-iNY/edit?tab=t.0" },
            { name: "The \"Lethal\" Fulfillment Tracker", desc: "Managing 10+ active clients.", icon: <Database size={16} />, href: "https://docs.google.com/document/d/1wBXu2K_U0Zi_iP8bCvjrE86K9buLoYaBxFJyXQNnJ8M/edit?tab=t.0" },
            { name: "Client Handover SOP", desc: "Training the client's team to use the tech.", icon: <Users size={16} />, href: "https://docs.google.com/document/d/12LcKXanxo1ykPuN1aDRfBPUsaMw2wkbqGiE05Z26_Oo/edit?tab=t.0" },
        ]
    },
    {
        name: "VI. Platinum Status & Partner HQ",
        icon: <Crown size={20} className="text-slate-600" />,
        comingSoon: true,
        items: [
            { name: "LinkedIn Tool Access Guide", desc: "Setup & automated outreach protocol.", icon: <Terminal size={16} />, href: SKOOL },
            { name: "Website Listing Submission SOP", desc: "How to get featured on Kingstone.com.", icon: <Globe size={16} />, href: SKOOL },
            { name: "Platinum Partner Branding Kit", desc: "High-res badges and trust seals.", icon: <Shield size={16} />, href: SKOOL },
            { name: "Platinum Partner Rules", desc: "The elite culture code.", icon: <Shield size={16} />, href: SKOOL },
        ]
    }
];

export default async function PlatinumArsenalPage() {
    const partnerStatus = await getPartnerStatus();
    const hasAccess = partnerStatus === "Platinum";

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
                            {hasAccess ? (
                                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-medium border border-emerald-100">
                                    <Crown size={16} />
                                    Platinum Access Granted
                                </div>
                            ) : (
                                <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium border border-red-100">
                                    <Lock size={16} />
                                    Platinum Status Required
                                </div>
                            )}
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
                            {category.comingSoon && (
                                <span className="ml-2 inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    <Lock size={10} /> Coming Soon
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {category.items.map((item, i) => (
                                hasAccess && !category.comingSoon ? (
                                    <a
                                        key={i}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-all duration-300 hover:shadow-md no-underline"
                                    >
                                        <div className="relative z-10 flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-100 transition-colors">
                                                {item.icon}
                                            </div>
                                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                <Crown size={10} /> Platinum
                                            </div>
                                        </div>
                                        <div className="relative z-10 space-y-1">
                                            <h4 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </h4>
                                            <p className="text-slate-500 text-xs leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="relative z-10 mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <p className={`${jetbrainsMono.variable} font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold`}>
                                                Asset #{100 * (catIndex + 1) + i}
                                            </p>
                                            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
                                                Open →
                                            </span>
                                        </div>
                                    </a>
                                ) : (
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
                                )
                            ))}
                        </div>
                    </div>
                ))}

                {/* Upgrade overlay — only shown when user doesn't have access */}
                {!hasAccess && (
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
                            <a
                                href={SKOOL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border border-slate-700 flex items-center justify-center gap-2"
                            >
                                <span>Upgrade to Platinum Status</span>
                                <Crown size={16} className="text-slate-300" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
