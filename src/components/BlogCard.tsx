import React from 'react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  category,
  date,
  readTime,
  slug,
}) => {
  return (
    <article className="blog-post-card">
      <div className="post-card-header">
        <div className="post-card-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
      </div>
      <div className="post-card-content">
        <div className="post-meta">
          <span className="post-category">{category}</span>
          <span className="post-date">{date}</span>
        </div>
        <h3 className="post-card-title">
          <a href={`/blog/${slug}`}>{title}</a>
        </h3>
        <p className="post-card-excerpt">{excerpt}</p>
        <div className="post-card-footer">
          <span className="post-read-time">{readTime} read</span>
          <a href={`/blog/${slug}`} className="post-card-link">
            Read More →
          </a>
        </div>
      </div>
    </article>
  );
};

