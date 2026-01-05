import React from 'react';

export const BlogCTA: React.FC = () => {
  return (
    <section className="blog-cta-section">
      <div className="container">
        <div className="blog-cta-card">
          <h2 className="blog-cta-title">Ready to Transform Your Business?</h2>
          <p className="blog-cta-description">
            Book a free consultation to see how voice AI can drive growth in your organization.
          </p>
          <a
            href="https://cal.com/kingstonesystems/free-strategy-call"
            className="btn-primary"
          >
            Book a Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
};

