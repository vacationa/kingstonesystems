// YouTube video type definitions

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelId?: string;
  channelName?: string;
  duration?: string;
  viewCount?: number;
}

export interface VideoPost extends YouTubeVideo {
  slug: string;
  category?: string;
  readTime?: string;
  excerpt?: string;
}






