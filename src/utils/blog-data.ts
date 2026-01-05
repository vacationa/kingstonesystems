// Centralized blog post data - extracted from src/pages/blog/index.tsx
// This ensures we have a single source of truth for blog post metadata

export interface BlogPostData {
  slug: string;
  image: string;
  title: string;
  category?: string;
  date?: string;
  readTime?: string;
}

// Export blog posts data for use in scripts and components
export const blogPostsData: BlogPostData[] = [
  {
    slug: "roi-of-ai-receptionist-for-realtors",
    image: "/assets/blog/headers/roi-realtors.png",
    title: "The ROI of an AI Receptionist for Realtors: The Ultimate 2026 Deep-Dive Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-personal-injury-law",
    image: "/assets/blog/headers/roi-personalinjury.png",
    title: "The ROI of an AI Receptionist for Personal Injury Law: The Definitive Guide for 2026"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-immigration-law",
    image: "/assets/blog/headers/roi-immigrationlaw.png",
    title: "The ROI of an AI Receptionist for Immigration Law: Complete 2026 Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-accounting-firms",
    image: "/assets/blog/headers/roi-accounting.png",
    title: "The ROI of an AI Receptionist for Accounting Firms: The Ultimate Guide"
  },
  {
    slug: "roi-of-ai-receptionist-for-recruiting-hr",
    image: "/assets/blog/headers/roi-humanresources.png",
    title: "The ROI of an AI Receptionist for Recruiting & HR: The Definitive 2026 Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-landscaping",
    image: "/assets/blog/headers/roi-landscaping.png",
    title: "The ROI of an AI Receptionist for Landscaping: The Ultimate Guide"
  },
  {
    slug: "roi-ai-receptionist-education-training",
    image: "/assets/blog/headers/roi-educationandtraining.png",
    title: "The ROI of an AI Receptionist for Education & Training: The Ultimate Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-consulting-firms",
    image: "/assets/blog/headers/roi-consulting.png",
    title: "The ROI of an AI Receptionist for Consulting Firms: The Definitive 2026 Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-short-term-rentals",
    image: "/assets/blog/headers/roi-shorttermrentals.png",
    title: "The ROI of an AI Receptionist for Short-Term Rentals: The Ultimate Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-b2b-saas",
    image: "/assets/blog/headers/roi-b2bsaas.png",
    title: "The ROI of an AI Receptionist for B2B SaaS"
  },
  {
    slug: "ai-voice-agent-services-for-businesses",
    image: "/assets/blog/headers/ai-voice-agent-services-for-businesses.png",
    title: "AI Voice Agent Services for Businesses: Complete 2026 Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-property-managers",
    image: "/assets/blog/headers/roi-propertymanagers.png",
    title: "The ROI of an AI Receptionist for Property Managers"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-roofing",
    image: "/assets/blog/headers/roi-roofing.png",
    title: "The ROI of an AI Receptionist for Roofing: The Ultimate 2026 Guide"
  },
  {
    slug: "ai-voice-agents-for-law-firms",
    image: "/assets/blog/headers/ai-voice-agents-for-law-firm.png",
    title: "AI Voice Agents for Law Firms: Complete Implementation Guide"
  },
  {
    slug: "best-ai-voice-agent-solutions-for-business-phone-systems",
    image: "/assets/blog/headers/best-ai-voice-agent-solutions-for-business-phone-systems.png",
    title: "Best AI Voice Agent Solutions for Business Phone Systems (2025)"
  },
  {
    slug: "best-voice-ai-agents-for-telecom-and-utility-providers",
    image: "/assets/blog/headers/best-voice-ai-agents-for-telecom-and-utility-providers.png",
    title: "Best Voice AI Agents for Telecom and Utility Providers"
  },
  {
    slug: "ai-voice-agent-for-healthcare",
    image: "/assets/blog/headers/ai-voice-agent-for-healthcare.png",
    title: "AI Voice Agent for Healthcare: HIPAA-Compliant Guide 2026"
  },
  {
    slug: "ai-voice-agent-for-real-estate",
    image: "/assets/blog/headers/ai-voice-agent-for-real-estate.png",
    title: "AI Voice Agent for Real Estate: Complete Implementation Guide"
  },
  {
    slug: "ai-voice-agent-for-restaurants",
    image: "/assets/blog/headers/ai-voice-agent-for-restaurants.png",
    title: "AI Voice Agent for Restaurants: Complete Guide 2026"
  },
  {
    slug: "ai-voice-agent-for-small-business",
    image: "/assets/blog/headers/ai-voice-agent-for-small-business.png",
    title: "AI Voice Agent for Small Business: Complete Guide 2026"
  },
  {
    slug: "how-can-ai-help-my-business",
    image: "/assets/blog/headers/how-can-ai-help-my-business.png",
    title: "How Can AI Help My Business: Complete Guide to AI Transformation"
  },
  {
    slug: "is-ai-worth-investing-in",
    image: "/assets/blog/headers/is-ai-worth-investing-in.png",
    title: "Is AI Worth Investing In? Complete Investment Analysis 2025"
  },
  {
    slug: "how-do-ai-chatbots-compare-to-human-agents",
    image: "/assets/blog/headers/how-do-ai-chatbots-compare-to-human-agents.png",
    title: "How Do AI Chatbots Compare to Human Agents? Complete 2026 Analysis"
  },
  {
    slug: "how-to-build-ai-agents",
    image: "/assets/blog/headers/how-to-build-ai-agents.png",
    title: "How to Build AI Agents: A Complete Step-by-Step Guide for 2025"
  },
  {
    slug: "how-to-create-industry-specific-knowledge-bases-for-ai-agents",
    image: "/assets/blog/headers/how-to-create-industry-specific-knowledge-bases-for-ai-agents.png",
    title: "How to Create Industry-Specific Knowledge Bases for AI Agents"
  },
  {
    slug: "best-companies-for-outbound-call-agents-using-voice-ai",
    image: "/assets/blog/headers/best-companies-for-outbound-call-agents-using-voice-ai.png",
    title: "Best Companies for Outbound Call Agents Using Voice AI: 2026 Comparison"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-hospitality-and-travel",
    image: "/assets/blog/headers/the-roi-of-an-ai-receptionist-for-hospitality-and-travel.png",
    title: "The ROI of an AI Receptionist for Hospitality & Travel"
  },
  {
    slug: "roi-of-an-ai-receptionist-for-construction",
    image: "/assets/blog/headers/roi-of-an-ai-receptionist-for-construction.png",
    title: "The ROI of an AI Receptionist for Construction: The Ultimate 2026 Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-apartment-complexes",
    image: "/assets/blog/headers/the-roi-of-an-ai-receptionist-for-apartment-complexes.png",
    title: "The ROI of an AI Receptionist for Apartment Complexes"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-brokerages",
    image: "/assets/blog/headers/the-roi-of-an-ai-receptionist-for-brokerages.png",
    title: "The ROI of an AI Receptionist for Brokerages: The Ultimate Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-family-law",
    image: "/assets/blog/headers/the-roi-of-an-ai-receptionist-for-family-law.png",
    title: "The ROI of an AI Receptionist for Family Law: The Definitive 2026 Guide"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-logistics-auto-field-ops",
    image: "/assets/blog/headers/the-roi-of-an-ai-receptionist-for-logistics-auto-field-ops.png",
    title: "The ROI of an AI Receptionist for Logistics, Auto, and Field Ops"
  },
  {
    slug: "how-to-use-agentic-ai",
    image: "/assets/blog/headers/how-to-use-agentic-ai.png",
    title: "How to Use Agentic AI: Complete Implementation Guide"
  },
  {
    slug: "how-to-control-emotional-tone-of-ai-agent-responses",
    image: "/assets/blog/headers/how-to-control-emotional-tone-of-ai-agent-responses.png",
    title: "How to Control Emotional Tone of AI Agent Responses"
  },
  {
    slug: "why-voice-ai-will-replace-traditional-call-centers-in-2026",
    image: "/assets/blog/headers/why-voice-ai-will-replace-traditional-call-centers-in-2026.png",
    title: "Why Voice AI Will Replace Traditional Call Centers in 2026"
  },
  {
    slug: "the-roi-of-an-ai-receptionist-for-real-estate-law",
    image: "/assets/blog/headers/the-roi-of-an-ai-receptionist-for-real-estate-law.png",
    title: "The ROI of an AI Receptionist for Real Estate Law"
  },
  {
    slug: "ai-call-answering-automation-for-chicago-small-businesses",
    image: "/assets/blog/headers/ai-call-answering-automation-for-chicago-small-businesses.png",
    title: "AI Call Answering Automation for Chicago Small Businesses: Complete 2026 Guide"
  },
  {
    slug: "ai-call-answering-automation-for-houston-small-businesses",
    image: "/assets/blog/headers/ai-call-answering-automation-for-houston-small-businesses.png",
    title: "AI Call Answering Automation for Houston Small Businesses: Complete 2026 Guide"
  },
  {
    slug: "ai-call-answering-automation-for-los-angeles-small-businesses",
    image: "/assets/blog/headers/ai-call-answering-automation-for-losangeles-small-businesses.png",
    title: "AI Call Answering Automation for Los Angeles Small Businesses: Complete 2026 Guide"
  },
  {
    slug: "ai-call-answering-automation-for-new-york-small-businesses",
    image: "/assets/blog/headers/ai-call-answering-automation-for-newyork-small-businesses.png",
    title: "AI Call Answering Automation for New York Small Businesses: Complete 2026 Guide"
  },
  {
    slug: "ai-call-answering-automation-for-phoenix-small-businesses",
    image: "/assets/blog/headers/ai-call-answering-automation-for-phoenix-small-businesses.png",
    title: "AI Call Answering Automation for Phoenix Small Businesses: Complete 2026 Guide"
  },
  {
    slug: "ai-phone-agent-to-answer-common-customer-questions",
    image: "/assets/blog/headers/ai-phone-agent-to-answer-common-customer-questions.png",
    title: "AI Phone Agent to Answer Common Customer Questions: Complete 2026 Guide"
  },
  {
    slug: "ai-phone-answering-for-plumbers",
    image: "/assets/blog/headers/ai-phone-answering-for-plumbers.png",
    title: "AI Phone Answering for Plumbers: The Complete 2026 Guide to 100% Call Capture"
  },
  {
    slug: "ai-receptionist-for-home-services-booking",
    image: "/assets/blog/headers/ai-receptionist-for-home-services-booking.png",
    title: "AI Receptionist for Home Services Booking: The Complete 2026 Automation Guide"
  },
  {
    slug: "ai-voice-agent-for-booking-appointments-for-my-business",
    image: "/assets/blog/headers/ai-voice-agent-for-booking-appointments-for-my-business.png",
    title: "AI Voice Agent for Booking Appointments: Complete 2026 Guide for Your Business"
  },
  {
    slug: "ai-voice-agent-for-inbound-sales-calls-for-small-business",
    image: "/assets/blog/headers/ai-voice-agent-for-inbound-sales-calls-for-small-business.png",
    title: "AI Voice Agent for Inbound Sales Calls: Complete 2026 Guide for Small Business"
  },
  {
    slug: "ai-voice-agent-to-handle-missed-calls-for-my-business",
    image: "/assets/blog/headers/ai-voice-agent-to-handle-missed-calls-for-my-business.png",
    title: "AI Voice Agent to Handle Missed Calls: Complete 2026 Guide"
  },
  {
    slug: "ai-voice-agent-vs-human-receptionist-for-small-business",
    image: "/assets/blog/headers/ai-voice-agent-vs-human-receptionist-for-small-business.png",
    title: "AI Voice Agent vs Human Receptionist for Small Business: Complete 2026 Comparison"
  },
  {
    slug: "common-problems-with-ai-voice-agents-and-how-to-fix-them",
    image: "/assets/blog/headers/common-problems-with-ai-voice-agents-and-how-to-fix-them.png",
    title: "Common Problems with AI Voice Agents and How to Fix Them - Complete Guide 2025"
  },
  {
    slug: "emotional-intelligence-ai-receptionist",
    image: "/assets/blog/headers/emotional-intelligence-ai-receptionist.png",
    title: "Emotional Intelligence in AI Receptionists: Sentiment Analysis and Response Strategies"
  },
  {
    slug: "goodcall-ai-receptionist-alternative",
    image: "/assets/blog/headers/goodcall-ai-receptionist-alternative.png",
    title: "Goodcall AI Receptionist Alternative: Complete 2025 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-long-hold-times-at-hvac-companies",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-long-hold-times-at-hvac-companies.png",
    title: "How an AI Receptionist Fixes Long Hold Times at HVAC Companies: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-long-wait-times-at-home-services-companies",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-long-wait-times-at-home-services-companies.png",
    title: "How an AI Receptionist Fixes Long Wait Times at Home Services Companies: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-missed-calls-at-auto-repair-shops",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-missed-calls-at-auto-repair-shops.png",
    title: "How an AI Receptionist Fixes Missed Calls at Auto Repair Shops: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-missed-calls-at-dental-practices",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-missed-calls-at-dental-practices.png",
    title: "How an AI Receptionist Fixes Missed Calls at Dental Practices: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-missed-calls-at-medical-clinics",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-missed-calls-at-medical-clinics.png",
    title: "How an AI Receptionist Fixes Missed Calls at Medical Clinics: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-missed-calls-at-veterinary-clinics",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-missed-calls-at-veterinary-clinics.png",
    title: "How an AI Receptionist Fixes Missed Calls at Veterinary Clinics: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-overloaded-front-desk-staff-at-law-firms",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-overloaded-front-desk-staff-at-law-firms.png",
    title: "How an AI Receptionist Fixes Overloaded Front Desk Staff at Law Firms: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-overloaded-staff-at-property-management-companies",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-overloaded-staff-at-property-management-companies.png",
    title: "How an AI Receptionist Fixes Overloaded Staff at Property Management Companies: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-patient-complaints-at-urgent-care-centers",
    image: "/assets/blog/headers/how-an-ai-receptionist-fixes-patient-complaints-at-urgent-care-centers.png",
    title: "How an AI Receptionist Fixes Patient Complaints at Urgent Care Centers: Complete 2026 Guide"
  },
  {
    slug: "how-an-ai-receptionist-fixes-restaurant-phones-during-dinner-service",
    image: "/assets/blog/headers/ai-voice-agent-for-restaurants.png",
    title: "How an AI Receptionist Fixes Restaurant Phones During Dinner Service: Complete 2026 Guide"
  },
  {
    slug: "how-can-ai-help-small-businesses",
    image: "/assets/blog/headers/how-can-ai-help-small-businesses.png",
    title: "How Can AI Help Small Businesses: Affordable AI Solutions Guide"
  },
  {
    slug: "how-can-ai-improve-business",
    image: "/assets/blog/headers/how-can-ai-improve-business.png",
    title: "How Can AI Improve Business: Complete Improvement Guide"
  },
  {
    slug: "how-can-i-use-ai-agents-to-load-data-into-iceberg",
    image: "/assets/blog/headers/how-can-i-use-ai-agents-to-load-data-into-iceberg.png",
    title: "How Can I Use AI Agents to Load Data into Apache Iceberg? Complete Guide 2025"
  },
  {
    slug: "how-can-i-use-ai-agents-to-load-data-into-snowflake",
    image: "/assets/blog/headers/how-can-i-use-ai-agents-to-load-data-into-snowflake.png",
    title: "How Can I Use AI Agents to Load Data into Snowflake? Complete Guide 2025"
  },
  {
    slug: "how-much-does-an-ai-voice-agent-cost-for-small-business",
    image: "/assets/blog/headers/how-much-does-an-ai-voice-agent-cost-for-small-business.png",
    title: "How Much Does an AI Voice Agent Cost for a Small Business? Complete 2026 Pricing Guide"
  },
  {
    slug: "how-to-choose-the-right-ai-voice-agent-provider",
    image: "/assets/blog/headers/how-to-choose-the-right-ai-voice-agent-provider.png",
    title: "How to Choose the Right AI Voice Agent Provider: Complete 2026 Buyer's Guide"
  },
  {
    slug: "how-to-connect-ai-voice-agent-to-hubspot-salesforce",
    image: "/assets/blog/headers/how-to-connect-ai-voice-agent-to-hubspot-salesforce.png",
    title: "How to Connect AI Voice Agent to HubSpot and Salesforce: Complete 2026 Guide"
  },
  {
    slug: "how-to-learn-building-ai-agents",
    image: "/assets/blog/headers/how-to-learn-building-ai-agents.png",
    title: "How to Learn Building AI Agents: Complete Guide with Reddit Resources 2025"
  },
  {
    slug: "how-to-measure-roi-of-ai-voice-agents-in-customer-support",
    image: "/assets/blog/headers/how-to-measure-roi-of-ai-voice-agents-in-customer-support.png",
    title: "How to Measure ROI of AI Voice Agents in Customer Support: Complete 2026 Guide"
  },
  {
    slug: "how-to-qualify-leads-using-ai-phone-agents",
    image: "/assets/blog/headers/how-to-qualify-leads-using-ai-phone-agents.png",
    title: "How to Qualify Leads Using AI Phone Agents: Complete 2026 Guide"
  },
  {
    slug: "how-to-replace-after-hours-receptionist-with-ai-voice-agent",
    image: "/assets/blog/headers/how-to-replace-after-hours-receptionist-with-ai-voice-agent.png",
    title: "How to Replace After Hours Receptionist with AI Voice Agent: Complete 2026 Guide"
  },
  {
    slug: "how-to-run-ai-voice-locally",
    image: "/assets/blog/headers/how-to-run-ai-voice-locally.png",
    title: "How to Run AI Voice Locally: Complete Guide to Making AI Voices and Voice Assistants 2025"
  },
  {
    slug: "how-to-train-an-ai-voice-agent-on-my-business-knowledge-base",
    image: "/assets/blog/headers/how-to-train-an-ai-voice-agent-on-my-business-knowledge-base.png",
    title: "How to Train an AI Voice Agent on Your Business Knowledge Base: Complete 2026 Guide"
  },
  {
    slug: "how-to-use-ai-for-marketing-my-business",
    image: "/assets/blog/headers/how-to-use-ai-for-marketing-my-business.png",
    title: "How to Use AI for Marketing Your Business: Complete Guide 2025"
  },
  {
    slug: "how-to-use-ai-to-advertise-my-business",
    image: "/assets/blog/headers/how-to-use-ai-to-advertise-my-business.png",
    title: "How to Use AI to Advertise Your Business: Complete Advertising Guide 2025"
  },
  {
    slug: "how-to-use-ai-to-grow-my-business",
    image: "/assets/blog/headers/ai-voice-agent-services-for-businesses.png",
    title: "How to Use AI to Grow Your Business: Complete Growth Strategy Guide 2025"
  },
  {
    slug: "how-to-use-ai-to-promote-your-business",
    image: "/assets/blog/headers/how-to-use-ai-to-promote-your-business.png",
    title: "How to Use AI to Promote Your Business: Complete Promotion Strategy Guide 2025"
  },
  {
    slug: "how-to-use-ai-voice-agents-to-reduce-call-center-costs",
    image: "/assets/blog/headers/how-to-use-ai-voice-agents-to-reduce-call-center-costs.png",
    title: "How to Use AI Voice Agents to Reduce Call Center Costs: Complete 2026 Guide"
  },
  {
    slug: "is-ai-worth-learning",
    image: "/assets/blog/headers/is-ai-worth-learning.png",
    title: "Is AI Worth Learning? Complete Guide to AI Education in 2025"
  },
  {
    slug: "is-ai-worth-paying-for",
    image: "/assets/blog/headers/is-ai-worth-paying-for.png",
    title: "Is AI Worth Paying For? Complete Cost-Benefit Analysis 2025"
  },
  {
    slug: "is-ai-worth-studying",
    image: "/assets/blog/headers/is-ai-worth-studying.png",
    title: "Is AI Worth Studying? Complete Guide to AI Education Decisions 2025"
  },
  {
    slug: "is-ai-worth-the-cost",
    image: "/assets/blog/headers/is-ai-worth-the-cost.png",
    title: "Is AI Worth the Cost? Complete Cost Analysis and ROI Guide 2025"
  },
  {
    slug: "is-ai-worth-the-hype",
    image: "/assets/blog/headers/is-ai-worth-the-hype.png",
    title: "Is AI Worth the Hype? Balanced Analysis of AI Reality in 2025"
  },
  {
    slug: "is-an-ai-phone-agent-worth-it-for-my-business",
    image: "/assets/blog/headers/is-an-ai-phone-agent-worth-it-for-my-business.png",
    title: "Is an AI Phone Agent Worth It for My Business? Complete 2026 ROI Analysis"
  },
  {
    slug: "jobber-ai-receptionist-for-hvac",
    image: "/assets/blog/headers/jobber-ai-receptionist-for-hvac.png",
    title: "Jobber AI Receptionist for HVAC: Complete 2025 Setup Guide"
  },
  {
    slug: "latency-in-ai-voice-agents-why-it-matters",
    image: "/assets/blog/headers/latency-in-ai-voice-agents-why-it-matters.png",
    title: "Latency in AI Voice Agents: Why It Matters - Complete Guide 2025"
  },
  {
    slug: "openphone-ai-receptionist-how-it-works",
    image: "/assets/blog/headers/openphone-ai-receptionist-how-it-works.png",
    title: "OpenPhone AI Receptionist: How It Works (2025 Guide)"
  },
  {
    slug: "realtime-ai-vs-chatbot-models-explained",
    image: "/assets/blog/headers/realtime-ai-vs-chatbot-models-explained.png",
    title: "Realtime AI vs Chatbot Models Explained: Complete Guide 2025"
  },
  {
    slug: "ringcentral-ai-receptionist-setup",
    image: "/assets/blog/headers/ringcentral-ai-receptionist-setup.png",
    title: "RingCentral AI Receptionist Setup: Complete 2025 Guide"
  },
  {
    slug: "rosie-ai-receptionist-reviews",
    image: "/assets/blog/headers/rosie-ai-receptionist-reviews.png",
    title: "Rosie AI Receptionist Reviews: Complete 2025 Analysis"
  },
  {
    slug: "smith-ai-receptionist-alternative",
    image: "/assets/blog/headers/smith-ai-receptionist-alternative.png",
    title: "Smith.ai Receptionist Alternative: Complete 2025 Buyer's Guide"
  },
  {
    slug: "stop-missed-calls-for-hvac-company",
    image: "/assets/blog/headers/stop-missed-calls-for-hvac-company.png",
    title: "Stop Missed Calls for HVAC Company: The Complete 2026 Guide to 100% Lead Capture"
  },
  {
    slug: "technical-architecture-ai-receptionist-complex-queries",
    image: "/assets/blog/headers/technical-architecture-ai-receptionist-complex-queries.png",
    title: "Technical Architecture for AI Receptionists: Handling Complex Queries Without Frustration"
  },
  {
    slug: "what-are-ai-agents-in-crypto",
    image: "/assets/blog/headers/what-are-ai-agents-in-crypto.png",
    title: "What Are AI Agents in Crypto? Complete Guide to Blockchain AI Agents 2025"
  },
  {
    slug: "what-are-ai-agents",
    image: "/assets/blog/headers/what-are-ai-agents.png",
    title: "What Are AI Agents? Complete Guide to Artificial Intelligence Agents 2025"
  },
  {
    slug: "what-can-ai-do-for-my-business",
    image: "/assets/blog/headers/what-can-ai-do-for-my-business.png",
    title: "What Can AI Do For My Business: Actionable Use Cases and Examples"
  },
  {
    slug: "what-can-an-ai-voice-agent-do-for-my-business",
    image: "/assets/blog/headers/what-can-an-ai-voice-agent-do-for-my-business.png",
    title: "What Can an AI Voice Agent Do for My Business? Complete Capabilities Guide 2026"
  },
  {
    slug: "what-do-ai-agents-cost",
    image: "/assets/blog/headers/what-do-ai-agents-cost.png",
    title: "What Do AI Agents Cost? Complete Pricing and Budgeting Guide 2025"
  },
  {
    slug: "what-do-ai-agents-do",
    image: "/assets/blog/headers/what-do-ai-agents-do.png",
    title: "What Do AI Agents Do? Complete Guide to AI Agent Capabilities and Functions"
  },
  {
    slug: "what-do-ai-agents-look-like",
    image: "/assets/blog/headers/what-do-ai-agents-look-like.png",
    title: "What Do AI Agents Look Like? Complete Guide to AI Agent Interfaces and Appearance"
  },
  {
    slug: "what-do-ai-agents-run-on",
    image: "/assets/blog/headers/what-do-ai-agents-run-on.png",
    title: "What Do AI Agents Run On? Complete Infrastructure and Platform Guide 2025"
  },
  {
    slug: "what-is-tool-calling-in-ai-agents",
    image: "/assets/blog/headers/what-is-tool-calling-in-ai-agents.png",
    title: "What Is Tool Calling in AI Agents? Complete Guide 2025"
  }
];

/**
 * Get image path for a blog post slug
 */
export function getImageForSlug(slug: string): string | null {
  const post = blogPostsData.find(p => p.slug === slug || p.slug === slug.replace('.html', ''));
  return post?.image || null;
}

/**
 * Get blog post data by slug
 */
export function getBlogPostBySlug(slug: string): BlogPostData | null {
  const cleanSlug = slug.replace('.html', '');
  return blogPostsData.find(p => p.slug === cleanSlug) || null;
}








