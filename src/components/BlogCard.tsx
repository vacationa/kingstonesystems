import React from 'react';
import { cleanSlug } from '../utils/slug';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  image?: string;
  videoUrl?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
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
    <article
      className="blog-post-card"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <div className="post-card-header">
        {image ? (
          <img 
            src={image} 
            alt={title}
            itemProp="image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="post-card-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
        )}
      </div>
      <div className="post-card-content">
        <div className="post-meta">
          <span className="post-category">{category}</span>
          <span className="post-date" itemProp="datePublished">
            {date}
          </span>
        </div>
        <div className="post-card-author">
          <img 
            src="/assets/AdhirajProfile.png" 
            alt="Adhiraj Hangal"
            className="post-card-author-avatar"
          />
          <span className="post-card-author-name">Adhiraj Hangal</span>
        </div>
        <h3 className="post-card-title">
          <a href={`/blog/${cleanSlug(slug)}`} itemProp="url">
            <span itemProp="headline">{title}</span>
          </a>
        </h3>
        <p className="post-card-excerpt" itemProp="description">
          {excerpt}
        </p>
        <div className="post-card-footer">
          <span className="post-read-time">{readTime} read</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {videoUrl && (
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="post-card-link"
                style={{ fontSize: '0.9em', color: '#1E40AF' }}
                itemProp="video"
              >
                Watch Video →
              </a>
            )}
            <a href={`/blog/${cleanSlug(slug)}`} className="post-card-link">
              Read More →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

