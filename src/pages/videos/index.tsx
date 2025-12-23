import React, { useEffect, useState } from 'react';
import { Navigation } from '../../components/Navigation';
import { VideoCard } from '../../components/VideoCard';
import { BlogCTA } from '../../components/BlogCTA';
import { Footer } from '../../components/Footer';
import { VideoPost } from '../../types/video';
import { fetchYouTubeRSSFeed, convertVideoToPost } from '../../utils/youtube-rss';

// YouTube Channel ID - Replace with your actual channel ID
// You can find this in your YouTube channel's URL or settings
const YOUTUBE_CHANNEL_ID = process.env.VITE_YOUTUBE_CHANNEL_ID || '';

export const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      if (!YOUTUBE_CHANNEL_ID) {
        setError('YouTube Channel ID not configured. Please set VITE_YOUTUBE_CHANNEL_ID in your environment variables.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const youtubeVideos = await fetchYouTubeRSSFeed(YOUTUBE_CHANNEL_ID);
        
        // Convert to VideoPost format
        const videoPosts = youtubeVideos.map(video => 
          convertVideoToPost(video, 'Video Tutorial')
        );
        
        // Sort by date (newest first)
        videoPosts.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        setVideos(videoPosts);
        setError(null);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos. Please check your YouTube Channel ID or use the YouTube Data API v3 as an alternative.');
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  return (
    <>
      <Navigation currentPage="videos" />
      
      {/* Hero Section */}
      <section className="blog-hero-section">
        <div className="container">
          <h1 className="blog-hero-title">Video Tutorials & Guides</h1>
          <p className="blog-hero-subtitle">
            Watch our latest video tutorials on AI voice agents, business automation, and implementation guides.
            Learn from real-world examples and step-by-step walkthroughs.
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      {loading && (
        <section className="blog-posts-section">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Loading videos...</p>
            </div>
          </div>
        </section>
      )}

      {error && (
        <section className="blog-posts-section">
          <div className="container">
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 0',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              margin: '2rem 0'
            }}>
              <h3 style={{ color: '#856404', marginBottom: '1rem' }}>Configuration Required</h3>
              <p style={{ color: '#856404', marginBottom: '1rem' }}>{error}</p>
              <p style={{ color: '#856404', fontSize: '0.9em' }}>
                To use YouTube RSS feeds, add your channel ID to your <code>.env</code> file:
                <br />
                <code>VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here</code>
                <br />
                <br />
                Alternatively, you can use the YouTube Data API v3 by configuring an API key.
              </p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && videos.length > 0 && (
        <section className="blog-posts-section">
          <div className="container">
            <div className="blog-posts-grid">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && !error && videos.length === 0 && (
        <section className="blog-posts-section">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No videos found. Please check your YouTube Channel ID configuration.</p>
            </div>
          </div>
        </section>
      )}

      {/* SEO: Internal linking section */}
      <section className="blog-related-section">
        <div className="container">
          <h2 className="blog-related-title">Explore More Resources</h2>
          <div className="blog-related-columns">
            <div className="blog-related-column">
              <h3>Video Tutorials</h3>
              <ul>
                {videos.slice(0, 5).map((video) => (
                  <li key={video.slug}>
                    <a href={`/blog/videos/${video.slug}`}>{video.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="blog-related-column">
              <h3>Blog Articles</h3>
              <ul>
                <li><a href="/blog">View All Blog Posts</a></li>
                <li><a href="/blog#roi-strategy">ROI & Strategy Guides</a></li>
                <li><a href="/blog#implementation">Implementation Guides</a></li>
              </ul>
            </div>
            <div className="blog-related-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/#solutions">Solutions</a></li>
                <li><a href="/#how-it-works">How It Works</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <BlogCTA />
      <Footer />
    </>
  );
};

export default VideosPage;


