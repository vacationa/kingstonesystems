import React from 'react';
import { cleanSlug } from '../utils/slug';

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  image?: string;
  videoUrl?: string;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({
  title,
  excerpt,
  category,
  date,
  readTime,
  slug,
  image,
  videoUrl,
}) => {
  return (
    <section className="featured-post-section">
      <div className="container">
        <div className="featured-badge">Featured Article</div>
        <article
          className="featured-post"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <div className="featured-post-content">
            <div className="post-meta">
              <span className="post-category">{category}</span>
              <span className="post-date" itemProp="datePublished">
                {date}
              </span>
              <span className="post-read-time">{readTime} read</span>
            </div>
            <div className="featured-post-author">
              <img 
                src="/assets/newlogo.png" 
                alt="Kingstone Team"
                className="featured-post-author-avatar"
              />
              <span className="featured-post-author-name">Kingstone Team</span>
            </div>
            <h2 className="featured-post-title">
              <a href={`/blog/${cleanSlug(slug)}`} itemProp="url">
                <span itemProp="headline">{title}</span>
              </a>
            </h2>
            <p className="featured-post-excerpt" itemProp="description">
              {excerpt}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {videoUrl && (
                <a 
                  href={videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-read-more"
                  style={{ backgroundColor: 'transparent', border: '1px solid #1E40AF', color: '#1E40AF' }}
                  itemProp="video"
                >
                  Watch Video →
                </a>
              )}
              <a href={`/blog/${cleanSlug(slug)}`} className="btn-read-more">
                Read Article →
              </a>
            </div>
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

