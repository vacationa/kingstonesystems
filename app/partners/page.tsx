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
            tier: "Gold",
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
          --gold: #F59E0B;
          --gold-bg: #FEF3C7;
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
        .tier-section { margin-bottom: 80px; }
        .tier-header { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
        .tier-title { font-size: 32px; font-weight: 400; letter-spacing: -1px; }
        .tier-desc { font-size: 16px; color: var(--text-gray); margin-top: 8px; }
        
        .gold-title { color: var(--text-dark); }
        .silver-title { color: var(--text-dark); }
        
        /* Grid */
        .partner-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; }
        
        /* Cards */
        .partner-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 36px; transition: all 0.3s; display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; }
        .partner-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: #D1D5DB; }
        
        .gold-card { border-top: 4px solid var(--gold); }
        .silver-card { border-top: 4px solid var(--text-light); }
        
        .partner-logo-container { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--white); margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .gold-logo { background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%); }
        .silver-logo { background: linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%); }
        
        .partner-name { font-size: 22px; font-weight: 600; color: var(--text-dark); margin-bottom: 12px; }
        .partner-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 6px 12px; border-radius: 20px; margin-bottom: 20px; }
        .gold-badge { background: var(--gold-bg); color: #B45309; }
        .silver-badge { background: var(--silver-bg); color: #374151; }
        
        .partner-specialty { font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .partner-blurb { font-size: 15px; color: var(--text-gray); line-height: 1.7; flex-grow: 1; padding-bottom: 24px; }
        
        .partner-link { margin-top: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--primary); transition: opacity 0.2s; }
        .partner-link:hover { opacity: 0.8; }
        
        .tier-icon { width: 32px; height: 32px; flex-shrink: 0; }
        .gold-icon { color: var(--gold); }
        .silver-icon { color: var(--text-light); }

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
                            <svg className="tier-icon gold-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>
                                <h2 className="tier-title gold-title">Gold Certified Partners</h2>
                                <p className="tier-desc">Top-tier partners who have demonstrated exceptional technical mastery and scaled complex AI deployments.</p>
                            </div>
                        </div>

                        <div className="partner-grid">
                            {goldPartners.map((partner) => (
                                <div key={partner.name} className="partner-card gold-card">
                                    <div className="partner-badge gold-badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                        </svg>
                                        Gold Certified
                                    </div>
                                    <div className="partner-logo-container gold-logo">
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
                            <svg className="tier-icon silver-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>
                                <h2 className="tier-title silver-title">Silver Certified Partners</h2>
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
                        <Link href="/operator-login" style={{ fontSize: "12px", color: "#9CA3AF", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#6B7280")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>Partner Login</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
