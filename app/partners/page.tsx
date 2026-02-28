"use client";

import Link from "next/link";
import { useState } from "react";

export default function PartnersPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Example partners data
    const goldPartners = [
        {
            name: "Wyneo Technology",
            logo: "W",
            tier: "Platinum",
            specialty: "Salesforce Agents",
            blurb: "Wyneo Technology specializes in deploying custom AI agents integrated natively with Salesforce to automate data entry, streamline pipeline management, and accelerate revenue operations.",
            link: "#"
        }
    ];

    const silverPartners = [
        {
            name: "Pen To Paper",
            logo: "P",
            tier: "Silver",
            specialty: "Content & Copywriting Automation",
            blurb: "Streamlining content creation, editing, and distribution workflows through custom agentic pipelines for marketing agencies.",
            link: "#"
        },
        {
            name: "LaunchLens",
            logo: "L",
            tier: "Silver",
            specialty: "Product Launch Operations",
            blurb: "Automating go-to-market strategies, user feedback aggregation, and launch analytics for early-stage startups.",
            link: "#"
        }
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
          --platinum: #E5E4E2;
          --platinum-bg: #F3F3F2;
          --silver: #6B7280;
          --silver-bg: #F3F4F6;
        }
        body { font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif); color: var(--text-dark); background: var(--bg-light); }
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
        .btn-demo { background: var(--primary) !important; color: var(--white) !important; padding: 10px 20px; border-radius: 6px; font-weight: 600; transition: all 0.2s; }
        .btn-demo:hover { background: var(--primary-dark) !important; }
        
        /* HEADER */
        .partners-header { margin-top: 80px; padding: 100px 0 80px; background: var(--white); border-bottom: 1px solid var(--border); text-align: center; }
        .partners-tagline { font-size: 13px; font-weight: 600; letter-spacing: 1px; color: var(--primary); text-transform: uppercase; margin-bottom: 16px; }
        .partners-title { font-size: 52px; font-weight: 400; letter-spacing: -1.5px; color: var(--text-dark); margin-bottom: 24px; line-height: 1.1; }
        .partners-desc { font-size: 18px; color: #4B5563; line-height: 1.7; max-width: 720px; margin: 0 auto; }
        
        /* Layout */
        .section-padding { padding: 80px 0; }
        .tier-section { margin-bottom: 96px; }
        .tier-header { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 52px; }
        .tier-title { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-light); margin-bottom: 6px; }
        .tier-name { font-size: 26px; font-weight: 300; letter-spacing: -0.5px; color: var(--text-dark); }
        .tier-rule { width: 40px; height: 1px; background: var(--border); margin: 12px 0 32px; }
        .tier-desc { font-size: 15px; color: var(--text-gray); line-height: 1.65; max-width: 480px; }

        /* Grid */
        .partner-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }

        /* PLATINUM CARD — near-white, ultra-refined */
        .platinum-card { background: linear-gradient(160deg, #FFFFFF 0%, #F2F2F6 60%, #FAFAFA 100%); border: 1px solid #D4D4DC; color: #111827; }
        .platinum-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(200,200,220,0.4) 20%, rgba(255,255,255,1) 50%, rgba(200,200,220,0.4) 80%, transparent 100%); }
        .platinum-card:hover { transform: translateY(-5px); border-color: #BBBBC8; box-shadow: 0 24px 60px rgba(60,60,100,0.1); }

        /* SILVER CARD — distinctly mid-gray */
        .silver-card { background: linear-gradient(160deg, #E4E4E9 0%, #D4D4DB 100%); border: 1px solid #BABAC6; border-left: 3px solid #9090A8; }
        .silver-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(50,50,90,0.12); border-left-color: #707090; }

        .partner-card { border-radius: 20px; padding: 40px; transition: all 0.35s cubic-bezier(0.22,1,0.36,1); display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; }
        .partner-logo-container { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; margin-bottom: 28px; }
        .platinum-logo { background: rgba(0,0,0,0.04); color: #555566; border: 1px solid rgba(0,0,0,0.1); }
        .silver-logo { background: rgba(0,0,0,0.07); color: #44445A; border: 1px solid rgba(0,0,0,0.12); }

        /* BADGE */
        .partner-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 4px 10px; border-radius: 3px; margin-bottom: 18px; width: fit-content; }
        .platinum-badge { background: rgba(0,0,0,0.04); color: #888899; border: 1px solid rgba(0,0,0,0.08); }
        .silver-badge { background: rgba(0,0,0,0.06); color: #6E6E88; border: 1px solid rgba(0,0,0,0.1); }

        /* TEXT */
        .partner-name { font-size: 19px; font-weight: 500; letter-spacing: -0.3px; margin-bottom: 8px; }
        .platinum-card .partner-name { color: #111827; }
        .silver-card .partner-name { color: #111827; }

        .partner-specialty { font-size: 12px; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 5px; letter-spacing: 0.2px; }
        .platinum-card .partner-specialty { color: #555570; }
        .silver-card .partner-specialty { color: #444460; }

        .partner-blurb { font-size: 14px; line-height: 1.8; flex-grow: 1; padding-bottom: 28px; }
        .platinum-card .partner-blurb { color: #555566; }
        .silver-card .partner-blurb { color: #444458; }

        .partner-link { margin-top: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; letter-spacing: 0.5px; transition: all 0.2s; padding-top: 16px; border-top: 1px solid; width: fit-content; text-transform: uppercase; }
        .platinum-card .partner-link { color: #777788; border-color: rgba(0,0,0,0.1); }
        .platinum-card .partner-link:hover { color: #111827; border-color: rgba(0,0,0,0.2); }
        .silver-card .partner-link { color: #666678; border-color: rgba(0,0,0,0.1); }
        .silver-card .partner-link:hover { color: #111827; }

        .tier-icon { display: none; }

        /* FOOTER */
        footer { padding: 32px 0; border-top: 1px solid var(--border); background: var(--white); }
        .footer-inner { display: flex; justify-content: space-between; align-items: center; }
        .footer-inner span { font-size: 14px; color: var(--text-light); }
        .footer-inner a { font-size: 14px; color: var(--text-gray); font-weight: 500; }
        
        /* MOBILE */
        .mobile-toggle { display: none; background: none; border: none; cursor: pointer; padding: 6px; }
        .mobile-toggle span { display: block; width: 22px; height: 2px; background: var(--text-dark); margin: 4px 0; transition: all 0.3s; }
        @media (max-width: 768px) {
          .partners-title { font-size: 38px; }
          .partners-header { padding: 60px 0; }
          .mobile-toggle { display: flex; flex-direction: column; }
          .nav-links { display: none; flex-direction: column; position: absolute; top: 80px; left: 0; right: 0; background: var(--white); border-bottom: 1px solid var(--border); padding: 20px; gap: 16px; z-index: 999; }
          .nav-links.open { display: flex; }
          .tier-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

            {/* NAV */}
            <nav>
                <div className="container nav-inner">
                    <Link href="/" className="logo-wrap">
                        <img src="/assets/newlogo.png" alt="Kingstone Systems" />
                        <span>Kingstone Systems</span>
                    </Link>
                    <button className="mobile-toggle" aria-label="Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <span /><span /><span />
                    </button>
                    <div className={`nav-links${mobileMenuOpen ? " open" : ""}`}>
                        <Link href="/blog">Blog</Link>
                        <Link href="/partners" style={{ color: "var(--text-dark)", fontWeight: 600 }}>Partners</Link>
                        <Link href="/sign-in" className="btn-client-login">Client Login</Link>
                        <a href="https://cal.com/kingstonesystems/free-strategy-call" className="btn-demo">Book a Demo</a>
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            <header className="partners-header">
                <div className="container">
                    <p className="partners-tagline">Certified Network</p>
                    <h1 className="partners-title">Kingstone Certified Partners</h1>
                    <p className="partners-desc">
                        Kingstone is the infrastructure layer businesses rely on. These distinguished agencies and consultancies have earned their certification to deploy, manage, and scale Kingstone AI systems for their clients.
                    </p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="section-padding">
                <div className="container">

                    {/* GOLD TIER */}
                    <section className="tier-section">
                        <div className="tier-header">
                            <div>
                                <p className="tier-title">Tier I</p>
                                <h2 className="tier-name">Platinum Partners</h2>
                                <div className="tier-rule"></div>
                                <p className="tier-desc">Top-tier partners who have demonstrated exceptional technical mastery and scaled complex AI deployments.</p>
                            </div>
                        </div>

                        <div className="partner-grid">
                            {goldPartners.map((partner) => (
                                <div key={partner.name} className="partner-card platinum-card">
                                    <div className="partner-badge platinum-badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                        </svg>
                                        Platinum Certified
                                    </div>
                                    <div className="partner-logo-container platinum-logo">
                                        {partner.logo}
                                    </div>
                                    <h3 className="partner-name">{partner.name}</h3>
                                    <div className="partner-specialty">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                            <polyline points="2 17 12 22 22 17"></polyline>
                                            <polyline points="2 12 12 17 22 12"></polyline>
                                        </svg>
                                        {partner.specialty}
                                    </div>
                                    <p className="partner-blurb">{partner.blurb}</p>
                                    <a href={partner.link} className="partner-link">
                                        Connect with Partner
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SILVER TIER */}
                    <section className="tier-section">
                        <div className="tier-header">
                            <div>
                                <p className="tier-title">Tier II</p>
                                <h2 className="tier-name">Silver Partners</h2>
                                <div className="tier-rule"></div>
                                <p className="tier-desc">Trusted agencies fully equipped to design, build, and deploy Kingstone AI solutions.</p>
                            </div>
                        </div>

                        <div className="partner-grid">
                            {silverPartners.map((partner) => (
                                <div key={partner.name} className="partner-card silver-card">
                                    <div className="partner-badge silver-badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" />
                                        </svg>
                                        Silver Certified
                                    </div>
                                    <div className="partner-logo-container silver-logo">
                                        {partner.logo}
                                    </div>
                                    <h3 className="partner-name">{partner.name}</h3>
                                    <div className="partner-specialty">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                            <polyline points="2 17 12 22 22 17"></polyline>
                                            <polyline points="2 12 12 17 22 12"></polyline>
                                        </svg>
                                        {partner.specialty}
                                    </div>
                                    <p className="partner-blurb">{partner.blurb}</p>
                                    <a href={partner.link} className="partner-link">
                                        Connect with Partner
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* FOOTER */}
            <footer>
                <div className="container footer-inner">
                    <span>© 2026 Kingstone Systems. All rights reserved.</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <Link href="/partners">Certified Partners</Link>
                        <a href="https://cal.com/kingstonesystems/free-strategy-call">Book a Call ↗</a>
                        <Link href="/partner-login" style={{ fontSize: "12px", color: "#9CA3AF", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#6B7280")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>Partner Login</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
