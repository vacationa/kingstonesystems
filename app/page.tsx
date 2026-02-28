"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [missedCalls, setMissedCalls] = useState(20);
  const [conversionRate, setConversionRate] = useState(30);
  const [avgRevenue, setAvgRevenue] = useState(75);
  const [monthlyLoss, setMonthlyLoss] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const calculateRevenue = () => {
    const dailyLoss = missedCalls * (conversionRate / 100) * avgRevenue;
    setMonthlyLoss(Math.round(dailyLoss * 30));
  };

  const faqs = [
    {
      q: "What exactly does Kingstone Systems do?",
      a: "We design, build, and operate AI agents and automation systems for businesses that want to run leaner and respond faster. We handle the full deployment, from build to integration to ongoing optimization.",
    },
    {
      q: "What is the difference between working directly with Kingstone and working with a Certified Partner?",
      a: "Both deliver the same system, built to the same standard. Working directly with Kingstone is right for businesses that want to work with our core team. A Certified Partner is a trained and vetted partner who deploys the same Kingstone system, often with specific industry or regional expertise.",
    },
    {
      q: "How do you make sure the AI agents do not make mistakes?",
      a: "We build in guardrails, escalation logic, and human handoff protocols from the start. The system is trained on your specific business, tested before it goes live, and monitored continuously. Monthly optimization reviews catch and correct any drift before it becomes a problem.",
    },
    {
      q: "Do I need to change any of my existing tools?",
      a: "No. We integrate with what you already use, from your CRM to your helpdesk to your scheduling software. Your team keeps their existing workflows.",
    },
    {
      q: "How much does this cost?",
      a: "Pricing depends on the scope of your deployment. We offer a free consultation to understand your needs and give you a clear number before any commitment.",
    },
    {
      q: "How quickly will I see results?",
      a: "Most clients see measurable improvements within the first few weeks of going live. Full optimization typically comes through in the first 60 to 90 days as the system learns from real interactions.",
    },
    {
      q: "Can I customize how the AI agents communicate?",
      a: "Yes, completely. We train agents on your brand voice, tone, and communication standards. They respond the way you would want your best team member to respond.",
    },
    {
      q: "What if I want to go back to manual processes?",
      a: "You can. We do not lock you in. But in practice, clients who see the system running rarely want to go back.",
    },
  ];

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --primary: #1E40AF;
          --primary-dark: #1E3A8A;
          --text-dark: #1F2937;
          --text-gray: #6B7280;
          --text-light: #9CA3AF;
          --border: #E5E7EB;
          --bg-light: #F9FAFB;
          --white: #FFFFFF;
        }
        body { font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif); color: var(--text-dark); background: var(--white); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        a { text-decoration: none; color: inherit; }
        /* NAV */
        nav { position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.97); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); z-index: 1000; padding: 16px 0; }
        .nav-inner { display: flex; justify-content: space-between; align-items: center; }
        .logo-wrap { display: flex; align-items: center; gap: 10px; }
        .logo-wrap img { height: 48px; width: auto; border-radius: 6px; }
        .logo-wrap span { font-size: 17px; font-weight: 500; color: var(--text-dark); }
        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a { color: var(--text-gray); font-weight: 500; font-size: 14px; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text-dark); }
        .btn-client-login { border: 1.5px solid var(--primary); padding: 8px 18px; border-radius: 6px; color: var(--primary) !important; font-weight: 500; transition: all 0.2s; }
        .btn-client-login:hover { background: var(--primary); color: var(--white) !important; }
        .btn-operator-login { border: 1px solid #CBD5E1; padding: 7px 14px; border-radius: 6px; color: var(--text-light) !important; font-weight: 400; font-size: 13px; transition: all 0.2s; }
        .btn-operator-login:hover { border-color: var(--primary); color: var(--primary) !important; }
        .btn-demo { background: var(--primary) !important; color: var(--white) !important; padding: 10px 20px; border-radius: 6px; font-weight: 600; transition: all 0.2s; }
        .btn-demo:hover { background: var(--primary-dark) !important; }
        /* HERO */
        .hero { margin-top: 80px; padding: 120px 0 100px; background: var(--white); }
        .hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: start; }
        .hero-tagline { font-size: 13px; font-weight: 600; letter-spacing: 1px; color: var(--primary); text-transform: uppercase; margin-bottom: 16px; }
        .hero-title { font-size: 58px; font-weight: 400; line-height: 1.1; letter-spacing: -1.5px; color: var(--text-dark); }
        .hero-desc { font-size: 17px; color: #4B5563; line-height: 1.75; margin-bottom: 28px; }
        .hero-cta { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--primary); color: var(--white); font-weight: 600; font-size: 15px; border-radius: 8px; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }
        .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--white); color: var(--text-dark); font-weight: 500; font-size: 15px; border: 1.5px solid var(--border); border-radius: 8px; transition: all 0.2s; }
        .btn-secondary:hover { border-color: var(--text-dark); }
        /* SECTION */
        section { padding: 100px 0; }
        .section-title { font-size: 42px; font-weight: 400; letter-spacing: -1px; line-height: 1.15; margin-bottom: 16px; }
        .section-subtitle { font-size: 17px; color: var(--text-gray); line-height: 1.7; max-width: 640px; margin-bottom: 60px; }
        /* WORKFLOW */
        .workflow { background: var(--bg-light); }
        .workflow-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 56px; }
        .workflow-card { padding: 40px; background: var(--white); border-radius: 16px; border: 1px solid var(--border); }
        .workflow-card h3 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
        .workflow-card p { font-size: 15px; color: var(--text-gray); line-height: 1.7; }
        /* STATS */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 56px; }
        .stat-card { padding: 48px 40px; background: var(--white); border: 1px solid var(--border); border-radius: 20px; text-align: center; transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .stat-number { font-size: 56px; font-weight: 400; background: linear-gradient(135deg, #1F2937 0%, #1E40AF 50%, #2563EB 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 12px; line-height: 1; }
        .stat-label { font-size: 18px; font-weight: 500; color: var(--text-dark); margin-bottom: 10px; }
        .stat-note { font-size: 14px; color: var(--text-gray); line-height: 1.5; }
        /* COMPARISON */
        .comparison { background: var(--bg-light); }
        .comparison-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 56px; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .comp-col { padding: 40px; }
        .comp-col.left { background: var(--white); }
        .comp-col.right { background: #fafafa; }
        .comp-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-light); margin-bottom: 24px; }
        .comp-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .comp-list li { display: flex; gap: 12px; font-size: 15px; line-height: 1.6; }
        .check { color: #16a34a; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
        .cross { color: #dc2626; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
        /* HOW IT WORKS */
        .steps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-top: 56px; }
        .step-num { font-size: 48px; font-weight: 300; color: #E5E7EB; line-height: 1; margin-bottom: 20px; }
        .step h3 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
        .step p { font-size: 15px; color: var(--text-gray); line-height: 1.7; }
        /* PHILOSOPHY */
        .philosophy { background: var(--bg-light); }
        .philosophy-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 80px; align-items: start; }
        .philosophy-values { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .philosophy-values h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
        .philosophy-values p { font-size: 14px; color: var(--text-gray); line-height: 1.65; }
        /* INDUSTRIES */
        .industries-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 56px; }
        .industry-card { padding: 36px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; transition: all 0.2s; }
        .industry-card:hover { border-color: var(--primary); box-shadow: 0 4px 16px rgba(30,64,175,0.08); }
        .ind-tag { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--primary); background: #EFF6FF; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px; }
        .industry-card p { font-size: 15px; color: var(--text-gray); line-height: 1.7; }
        /* CERTIFIED PARTNERS */
        .partners-section { background: var(--bg-light); }
        .partners-inner { max-width: 820px; }
        .partners-body { font-size: 16px; color: #4B5563; line-height: 1.8; margin-bottom: 40px; padding: 28px 32px; background: var(--white); border: 1px solid var(--border); border-left: 4px solid var(--primary); border-radius: 0 12px 12px 0; }
        .partners-cta { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
        .btn-find-partner { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--primary); color: var(--white); font-weight: 600; font-size: 15px; border-radius: 8px; transition: all 0.2s; }
        .btn-find-partner:hover { background: var(--primary-dark); transform: translateY(-1px); }
        .btn-work-direct { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--white); color: var(--text-dark); font-weight: 500; font-size: 15px; border: 1.5px solid var(--border); border-radius: 8px; transition: all 0.2s; }
        .btn-work-direct:hover { border-color: var(--text-dark); }
        /* CALCULATOR */
        .calc-box { max-width: 900px; margin: 56px auto 0; padding: 56px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .calc-inputs { display: flex; flex-direction: column; gap: 24px; }
        .calc-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-gray); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .calc-input { width: 100%; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 16px; color: var(--text-dark); outline: none; font-family: inherit; transition: border-color 0.2s; }
        .calc-input:focus { border-color: var(--primary); }
        .calc-btn { padding: 14px 24px; background: var(--primary); color: var(--white); border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .calc-btn:hover { background: var(--primary-dark); }
        .calc-result { text-align: center; }
        .calc-value { font-size: 64px; font-weight: 400; color: var(--primary); line-height: 1; margin-bottom: 12px; }
        .calc-rlabel { font-size: 16px; color: var(--text-gray); }
        /* FAQ */
        .faq { background: var(--bg-light); }
        .faq-list { max-width: 760px; margin: 0 auto; margin-top: 48px; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-q { display: flex; justify-content: space-between; align-items: center; width: 100%; background: none; border: none; text-align: left; padding: 22px 0; cursor: pointer; font-family: inherit; font-size: 16px; font-weight: 500; color: var(--text-dark); gap: 16px; }
        .faq-icon { font-size: 22px; color: var(--primary); flex-shrink: 0; line-height: 1; }
        .faq-a { padding: 0 0 20px; font-size: 15px; color: var(--text-gray); line-height: 1.75; max-width: 680px; }
        /* CTA */
        .final-cta { background: var(--text-dark); padding: 100px 0; text-align: center; }
        .final-cta h2 { font-size: 56px; font-weight: 400; color: var(--white); letter-spacing: -1px; margin-bottom: 8px; }
        .final-cta h3 { font-size: 22px; color: rgba(255,255,255,0.6); margin-bottom: 36px; font-weight: 400; }
        .btn-cta { display: inline-block; padding: 18px 48px; background: var(--white); color: var(--text-dark); font-weight: 700; font-size: 16px; border-radius: 8px; transition: all 0.2s; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        /* FOOTER */
        footer { padding: 32px 0; border-top: 1px solid var(--border); background: var(--white); }
        .footer-inner { display: flex; justify-content: space-between; align-items: center; }
        .footer-inner span { font-size: 14px; color: var(--text-light); }
        .footer-inner a { font-size: 14px; color: var(--text-gray); font-weight: 500; }
        /* MOBILE */
        .mobile-toggle { display: none; background: none; border: none; cursor: pointer; padding: 6px; }
        .mobile-toggle span { display: block; width: 22px; height: 2px; background: var(--text-dark); margin: 4px 0; transition: all 0.3s; }
        @media (max-width: 768px) {
          .hero-grid, .workflow-grid, .stats-grid, .comparison-inner, .steps, .philosophy-grid, .philosophy-values, .industries-grid, .calc-box { grid-template-columns: 1fr; }
          .hero-title { font-size: 38px; }
          .section-title { font-size: 30px; }
          .hero { padding: 80px 0 60px; }
          .mobile-toggle { display: flex; flex-direction: column; }
          .nav-links { display: none; flex-direction: column; position: absolute; top: 80px; left: 0; right: 0; background: var(--white); border-bottom: 1px solid var(--border); padding: 20px; gap: 16px; z-index: 999; }
          .nav-links.open { display: flex; }
          .calc-box { padding: 32px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="container nav-inner">
          <div className="logo-wrap">
            <img src="/assets/newlogo.png" alt="Kingstone Systems" />
            <span>Kingstone Systems</span>
          </div>
          <button className="mobile-toggle" aria-label="Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </button>
          <div className={`nav-links${mobileMenuOpen ? " open" : ""}`}>
            <Link href="/partners">Partners</Link>
            <a href="/blog">Blog</a>
            <Link href="/sign-in" className="btn-client-login">Client Login</Link>
            <a href="https://cal.com/kingstonesystems/free-strategy-call" className="btn-demo">Book a Demo</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <p className="hero-tagline">The Operational Standard for AI Deployment</p>
              <h1 className="hero-title">Your business, run by AI that actually works.</h1>
            </div>
            <div>
              <p className="hero-desc">
                Kingstone builds and operates production-grade AI agents and automation systems for businesses that are serious about scale. We handle the infrastructure, the integration, and the ongoing optimization so your team can focus on the work only humans can do.
              </p>
              <div className="hero-cta">
                <a href="#how-it-works" className="btn-primary">See How It Works →</a>
                <a href="https://cal.com/kingstonesystems/free-strategy-call" className="btn-secondary">Book a Call</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="workflow">
        <div className="container">
          <h2 className="section-title">Your AI workforce, deployed in weeks</h2>
          <div className="workflow-grid">
            {[
              { title: "Instant customer support", desc: "Every inquiry is handled within seconds. No hold times, no waiting on email. Your AI agents answer questions, route requests, and resolve common issues across chat, email, and phone, around the clock." },
              { title: "Smart task routing", desc: "AI agents handle routine tasks automatically and escalate only what needs a human. Your team stays focused on high-value work, not inbox management." },
              { title: "Complete visibility", desc: "Every interaction is logged, synced to your existing tools, and surfaced as actionable insights. You always know what is happening and where there is room to improve." },
              { title: "Gets smarter over time", desc: "Your AI learns from every interaction. Monthly optimizations mean fewer escalations, more accurate responses, and steadily improving outcomes while costs stay predictable." },
            ].map((item) => (
              <div key={item.title} className="workflow-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section>
        <div className="container">
          <h2 className="section-title">Results that speak for themselves</h2>
          <div className="stats-grid">
            {[
              { num: "60%", label: "Reduction in response time", note: "Customers and leads get answers in seconds, not hours." },
              { num: "3x", label: "More capacity, same team", note: "AI handles the volume so your team handles the value." },
              { num: "24/7", label: "Availability", note: "Never miss an opportunity because of time zones or office hours." },
            ].map((s) => (
              <div key={s.num} className="stat-card">
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
                <p className="stat-note">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="comparison">
        <div className="container">
          <h2 className="section-title">Kingstone vs. Traditional Operations</h2>
          <div className="comparison-inner">
            <div className="comp-col left">
              <p className="comp-label">With Kingstone</p>
              <ul className="comp-list">
                {["Handle unlimited inquiries, leads, and tasks simultaneously", "Automate repetitive workflows and follow-ups around the clock", "Predictable monthly cost instead of growing headcount", "Consistent, accurate responses every time", "Instant coordination across every channel and tool"].map(text => (
                  <li key={text}><span className="check">✓</span>{text}</li>
                ))}
              </ul>
            </div>
            <div className="comp-col right">
              <p className="comp-label">Traditional Operations</p>
              <ul className="comp-list">
                {["Weeks to hire, onboard, and train new staff", "Manual processes create bottlenecks as you grow", "Salary, benefits, and software costs per person", "Hard to scale quickly during busy periods", "Inconsistent quality and human error over time"].map(text => (
                  <li key={text}><span className="cross">✗</span>{text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="container">
          <h2 className="section-title">How a Kingstone Deployment Works</h2>
          <p className="section-subtitle">We do not hand you software and wish you luck. We build the system, integrate it into your operations, and stay on to make sure it performs.</p>
          <div className="steps">
            {[
              { n: "01", title: "A custom demo built around your business", desc: "Before anything goes live, we build a working demo using your real services, FAQs, and common scenarios. Your brand voice, your processes, your edge cases. You see exactly how it performs before we deploy a single line." },
              { n: "02", title: "Trained on how you communicate", desc: "We train your AI agents on your business knowledge, communication standards, and brand personality. They respond the way your best team member would, across every channel, for every conversation." },
              { n: "03", title: "Integrated with the tools you already use", desc: "We connect directly with your CRM, scheduling software, helpdesk, and any other platform you rely on. Data flows automatically, your team keeps using familiar tools, and nothing falls through the cracks." },
              { n: "04", title: "Built on systems we have already proven", desc: "We have already solved the hard problems: high inquiry volume, multi-channel communication, seasonal scaling, seamless handoffs to humans. You get battle-tested infrastructure, not a pilot project." },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="philosophy">
        <div className="container">
          <div className="philosophy-grid">
            <div>
              <h2 className="section-title">Our Philosophy</h2>
              <p style={{ fontSize: "16px", color: "#4B5563", lineHeight: "1.75" }}>
                We are not here to sell you software. We are here to change how your business operates. That means caring about your metrics more than our own, being honest about what is working and what is not, and staying involved long after the system goes live. Your growth is the only number we track.
              </p>
            </div>
            <div className="philosophy-values">
              {[
                { title: "ROI-obsessed", desc: "Every feature we build has to improve your bottom line. If it does not drive revenue or cut costs, we do not ship it." },
                { title: "Radically transparent", desc: "Full access to call logs, performance metrics, and pricing. No black boxes, no vague dashboards, no algorithm you just have to trust." },
                { title: "Built to last", desc: "We build systems designed to scale with you for years. Not quick wins that need replacing in six months." },
                { title: "Always evolving", desc: "Monthly optimizations and performance tuning mean your system gets sharper over time. We do not deploy and disappear." },
              ].map(v => (
                <div key={v.title}><h3>{v.title}</h3><p>{v.desc}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="solutions">
        <div className="container">
          <h2 className="section-title">Where AI makes the biggest difference</h2>
          <div className="industries-grid">
            {[
              { tag: "Professional Services", desc: "Agencies, consultancies, and law firms answer the same intake questions dozens of times a week. AI agents handle qualification, scheduling, and follow-ups so your team spends time on billable work, not inbox management." },
              { tag: "Healthcare and Wellness", desc: "Clinics, therapists, and wellness providers need to stay reachable without being overwhelmed. AI agents handle appointment scheduling, intake forms, FAQ responses, and reminders while your staff stays focused on patient care." },
              { tag: "Home and Field Services", desc: "HVAC companies, plumbers, and contractors lose leads every time a call goes unanswered. AI agents capture inquiries 24/7, qualify the job, book estimates, and send follow-ups so no opportunity slips through." },
              { tag: "SaaS and Technology", desc: "Support tickets, onboarding questions, and feature inquiries pile up fast. AI agents handle tier-1 support, guide users through common workflows, and surface insights that help your team prioritize what to build next." },
            ].map(i => (
              <div key={i.tag} className="industry-card">
                <span className="ind-tag">{i.tag}</span>
                <p>{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFIED PARTNERS */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-inner">
            <h2 className="section-title">Kingstone Certified Partners</h2>
            <p className="section-subtitle" style={{ marginBottom: "28px" }}>A vetted network of partners who know this system inside out and deploy it for businesses just like yours.</p>
            <p className="partners-body">
              Every Kingstone Certified Partner has been trained, tested, and approved by our team. They carry the same standards we do, use the same systems we built, and are held to the same results we promise. Whether you work directly with Kingstone or through a certified partner, you get the same quality of deployment.
            </p>
            <div className="partners-cta">
              <Link href="/partners" className="btn-find-partner">Find a Certified Partner →</Link>
              <a href="https://cal.com/kingstonesystems/free-strategy-call" className="btn-work-direct">Work Directly With Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section style={{ background: "#F9FAFB" }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Calculate your cost of slow follow-up</h2>
          <p className="section-subtitle" style={{ textAlign: "center", margin: "0 auto 0" }}>Every missed inquiry is a missed opportunity. See what delayed responses are costing your business each month.</p>
          <div className="calc-box">
            <div className="calc-inputs">
              <div>
                <label className="calc-label">Missed or slow-response inquiries per day</label>
                <input type="number" className="calc-input" value={missedCalls} min={0} onChange={e => setMissedCalls(Number(e.target.value))} />
              </div>
              <div>
                <label className="calc-label">Estimated conversion rate with instant response (%)</label>
                <input type="number" className="calc-input" value={conversionRate} min={0} max={100} onChange={e => setConversionRate(Number(e.target.value))} />
              </div>
              <div>
                <label className="calc-label">Average deal or transaction value ($)</label>
                <input type="number" className="calc-input" value={avgRevenue} min={0} onChange={e => setAvgRevenue(Number(e.target.value))} />
              </div>
              <button className="calc-btn" onClick={calculateRevenue}>Calculate Monthly Loss →</button>
            </div>
            <div className="calc-result">
              <div className="calc-value">${monthlyLoss !== null ? monthlyLoss.toLocaleString() : "0"}</div>
              <div className="calc-rlabel">Potential monthly revenue loss</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Questions you may have</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <p className="faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Let us talk.</h2>
          <h3>Book a free consultation and see what a Kingstone deployment could look like for your business.</h3>
          <a href="https://cal.com/kingstonesystems/free-strategy-call" className="btn-cta">Book a Call ↗</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <span>© 2026 Kingstone Systems. All rights reserved.</span>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/partners">Certified Partners</Link>
            <Link href="/partner-login">Partner Login</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
