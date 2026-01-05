import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-copyright">
              © 2026 Kingstone Systems. All rights reserved.
            </span>
          </div>
          <div className="footer-right">
            <a
              href="https://cal.com/kingstonesystems/free-strategy-call"
              className="footer-link"
            >
              Book a Call ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

