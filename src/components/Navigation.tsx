import React from 'react';

interface NavigationProps {
  currentPage?: 'home' | 'blog' | 'videos';
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage = 'home' }) => {
  return (
    <nav className="nav">
      <div className="container nav-content">
        <div className="logo">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img src="/assets/newlogo.png" alt="Kingstone Systems" style={{ height: '60px', width: 'auto', borderRadius: '8px' }} />
            <span className="logo-text">Kingstone Systems</span>
          </a>
        </div>
        <button className="mobile-menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="nav-links">
          <a href="/#solutions">Solutions</a>
          <a href="/blog" className={currentPage === 'blog' ? 'active' : ''}>
            Blog
          </a>
          <a href="/videos" className={currentPage === 'videos' ? 'active' : ''}>
            Videos
          </a>
          <a
            href="https://cal.com/kingstonesystems/free-strategy-call"
            className="btn-signup"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </nav>
  );
};

