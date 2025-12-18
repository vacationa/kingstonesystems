import React from 'react';

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  image?: string;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({
  title,
  excerpt,
  category,
  date,
  readTime,
  slug,
  image,
}) => {
  return (
    <section className="featured-post-section">
      <div className="container">
        <div className="featured-badge">Featured Article</div>
        <article className="featured-post">
          <div className="featured-post-content">
            <div className="post-meta">
              <span className="post-category">{category}</span>
              <span className="post-date">{date}</span>
              <span className="post-read-time">{readTime} read</span>
            </div>
            <h2 className="featured-post-title">
              <a href={`/blog/${slug}.html`}>{title}</a>
            </h2>
            <p className="featured-post-excerpt">{excerpt}</p>
            <a href={`/blog/${slug}.html`} className="btn-read-more">
              Read Article →
            </a>
          </div>
          <div className="featured-post-image">
            {image ? (
              <img 
                src={image} 
                alt={title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="featured-post-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 10h.01M12 10h.01M16 10h.01"/>
                </svg>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

