// YouTube RSS feed parser and utilities
// YouTube RSS feed format: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID

import { YouTubeVideo, VideoPost } from '../types/video';
import { cleanSlug } from './slug';

/**
 * Parse YouTube RSS feed XML
 * YouTube RSS format: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 */
export async function fetchYouTubeRSSFeed(channelId: string): Promise<YouTubeVideo[]> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  
  try {
    // Note: YouTube RSS feeds may have CORS restrictions
    // For production, you may need a server-side proxy or use YouTube Data API v3
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    return parseYouTubeRSS(xmlText);
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    // Fallback: return empty array or use YouTube Data API v3 as alternative
    return [];
  }
}

/**
 * Parse YouTube RSS XML into YouTubeVideo objects
 */
function parseYouTubeRSS(xmlText: string): YouTubeVideo[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const entries = xmlDoc.querySelectorAll('entry');
  const videos: YouTubeVideo[] = [];
  
  entries.forEach((entry) => {
    const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || '';
    const title = entry.querySelector('title')?.textContent || '';
    const description = entry.querySelector('media\\:description, description')?.textContent || '';
    const published = entry.querySelector('published')?.textContent || '';
    const thumbnail = entry.querySelector('media\\:thumbnail')?.getAttribute('url') || '';
    const channelName = entry.querySelector('author name')?.textContent || '';
    
    if (videoId && title) {
      videos.push({
        id: videoId,
        title: title.trim(),
        description: description.trim(),
        publishedAt: published,
        thumbnailUrl: thumbnail,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        channelName: channelName.trim(),
      });
    }
  });
  
  return videos;
}

/**
 * Convert YouTube video to VideoPost format for blog integration
 */
export function convertVideoToPost(video: YouTubeVideo, category?: string): VideoPost {
  // Create slug from title
  const slug = cleanSlug(video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  
  // Generate excerpt from description (first 150 chars)
  const excerpt = video.description.length > 150 
    ? video.description.substring(0, 150).trim() + '...'
    : video.description;
  
  // Format date
  const date = new Date(video.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return {
    ...video,
    slug,
    category: category || 'Video Tutorial',
    readTime: '5 min', // Default, could be calculated from duration if available
    excerpt,
  };
}

/**
 * Fetch YouTube videos using YouTube Data API v3 (alternative to RSS)
 * Requires API key: https://console.cloud.google.com/apis/credentials
 */
export async function fetchYouTubeVideosAPI(
  channelId: string,
  apiKey: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channelId: item.snippet.channelId,
      channelName: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos via API:', error);
    return [];
  }
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Get YouTube embed URL from video ID or URL
 */
export function getEmbedUrl(videoIdOrUrl: string): string {
  const videoId = extractVideoId(videoIdOrUrl) || videoIdOrUrl;
  return `https://www.youtube.com/embed/${videoId}`;
}


