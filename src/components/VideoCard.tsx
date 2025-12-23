import React from 'react';
import { VideoPost } from '../types/video';
import { extractVideoId, getEmbedUrl } from '../utils/youtube-rss';

interface VideoCardProps {
  video: VideoPost;
  showEmbed?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, showEmbed = false }) => {
  const videoId = extractVideoId(video.videoUrl) || video.id;
  const embedUrl = getEmbedUrl(videoId);
  
  return (
    <article
      className="blog-post-card video-card"
      itemScope
      itemType="https://schema.org/VideoObject"
    >
      <div className="post-card-header video-header">
        {showEmbed ? (
          <div className="video-embed-container">
            <iframe
              src={embedUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </div>
        ) : (
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title}`}>
            <div className="video-thumbnail-container">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                itemProp="thumbnailUrl"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="video-play-overlay">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.6)"/>
                  <path d="M10 8l6 4-6 4V8z" fill="white"/>
                </svg>
              </div>
            </div>
          </a>
        )}
      </div>
      <div className="post-card-content">
        <div className="post-meta">
          <span className="post-category">{video.category || 'Video'}</span>
          <span className="post-date" itemProp="uploadDate">
            {new Date(video.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        <h3 className="post-card-title">
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" itemProp="url">
            <span itemProp="name">{video.title}</span>
          </a>
        </h3>
        <p className="post-card-excerpt" itemProp="description">
          {video.excerpt || video.description.substring(0, 150) + '...'}
        </p>
        <div className="post-card-footer">
          <span className="post-read-time">Video</span>
          <a 
            href={video.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="post-card-link"
            style={{ fontSize: '0.9em', color: '#7F00FF' }}
            itemProp="contentUrl"
          >
            Watch on YouTube →
          </a>
        </div>
      </div>
      
      {/* Schema.org VideoObject markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            uploadDate: video.publishedAt,
            contentUrl: video.videoUrl,
            embedUrl: embedUrl,
            publisher: {
              '@type': 'Organization',
              name: video.channelName || 'Kingstone Systems',
            },
          }),
        }}
      />
    </article>
  );
};


