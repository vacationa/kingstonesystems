import React, { useEffect, useState } from 'react';
import { Navigation } from '../../components/Navigation';
import { VideoHero } from '../../components/VideoHero';
import { VideoCard } from '../../components/VideoCard';
import { BlogCTA } from '../../components/BlogCTA';
import { Footer } from '../../components/Footer';
import { VideoPost } from '../../types/video';
import { fetchYouTubeRSSFeed, fetchYouTubeVideosAPI, convertVideoToPost } from '../../utils/youtube-rss';

// YouTube Channel ID - Replace with your actual channel ID
// You can find this in your YouTube channel's URL or settings
const YOUTUBE_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

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
        let youtubeVideos;
        
        // Try YouTube Data API v3 first (more reliable)
        if (YOUTUBE_API_KEY) {
          try {
            youtubeVideos = await fetchYouTubeVideosAPI(YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY, 50);
            console.log(`Loaded ${youtubeVideos.length} videos via YouTube Data API v3`);
          } catch (apiError) {
            console.warn('YouTube API failed, trying RSS feed:', apiError);
            // Fall back to RSS feed
            youtubeVideos = await fetchYouTubeRSSFeed(YOUTUBE_CHANNEL_ID);
          }
        } else {
          // Try RSS feed if no API key
          youtubeVideos = await fetchYouTubeRSSFeed(YOUTUBE_CHANNEL_ID);
        }
        
        if (youtubeVideos.length === 0) {
          setError('No videos found. This may be because YouTube RSS feeds are not available for your channel. Please use YouTube Data API v3 instead (see instructions below).');
          setLoading(false);
          return;
        }
        
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
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load videos: ${errorMessage}. YouTube RSS feeds may not be available for your channel. Please use YouTube Data API v3 instead (see instructions below).`);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  return (
    <>
      <Navigation currentPage="videos" />
      
      <VideoHero />

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
                <strong>Option 1: YouTube Data API v3 (Recommended)</strong>
                <br />
                1. Get an API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" style={{ color: '#856404', textDecoration: 'underline' }}>Google Cloud Console</a>
                <br />
                2. Add to your <code>.env</code> file: <code>VITE_YOUTUBE_API_KEY=your_api_key_here</code>
                <br />
                3. The code will automatically use the API if available.
                <br />
                <br />
                <strong>Option 2: Use RSS Feed (May not work)</strong>
                <br />
                YouTube RSS feeds are often unavailable or blocked. If you want to try, ensure <code>VITE_YOUTUBE_CHANNEL_ID</code> is set in your <code>.env</code> file.
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
      {!loading && !error && videos.length > 0 && (
        <section className="blog-related-section">
          <div className="container">
            <h2 className="blog-related-title">Explore More Resources</h2>
            <div className="blog-related-columns">
              <div className="blog-related-column">
                <h3>Video Tutorials</h3>
                <ul>
                  {videos.slice(0, 5).map((video) => (
                    <li key={video.slug}>
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">{video.title}</a>
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
      )}
      
      <BlogCTA />
      <Footer />
    </>
  );
};

export default VideosPage;


