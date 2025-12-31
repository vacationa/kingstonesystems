# YouTube RSS Feed Integration Guide

This guide explains how to use YouTube RSS feeds on your website to promote videos for SEO.

## Overview

The YouTube integration allows you to:
- Automatically fetch videos from your YouTube channel via RSS feed
- Display videos on a dedicated videos page
- Generate SEO-optimized static HTML pages for each video
- Include proper schema markup for better search engine visibility

## Setup

### 1. Get Your YouTube Channel ID

1. Go to your YouTube channel
2. The Channel ID is in the URL: `https://www.youtube.com/channel/CHANNEL_ID_HERE`
3. Or go to YouTube Studio → Settings → Channel → Advanced settings

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here
```

For the static page generation script, you can also set it when running:

```bash
YOUTUBE_CHANNEL_ID=your_channel_id node scripts/generate-video-pages.js
```

## Usage

### Option 1: Dynamic Videos Page (React)

The videos page (`/videos`) automatically fetches and displays videos from your YouTube channel:

1. Set `VITE_YOUTUBE_CHANNEL_ID` in your `.env` file
2. Visit `/videos` to see your videos

**Note:** YouTube RSS feeds may have CORS restrictions. If you encounter issues, use Option 2 (YouTube Data API v3).

### Option 2: YouTube Data API v3 (Recommended for Production)

For better reliability and more features, use the YouTube Data API:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Update `src/pages/videos/index.tsx` to use `fetchYouTubeVideosAPI`:

```typescript
import { fetchYouTubeVideosAPI } from '../../utils/youtube-rss';

// In your component:
const videos = await fetchYouTubeVideosAPI(
  YOUTUBE_CHANNEL_ID,
  'YOUR_API_KEY',
  10 // max results
);
```

### Option 3: Generate Static HTML Pages (Best for SEO)

Generate static HTML pages for each video to maximize SEO:

```bash
npm run generate-video-pages
```

Or with environment variable:

```bash
YOUTUBE_CHANNEL_ID=your_channel_id npm run generate-video-pages
```

This creates individual HTML pages in `public/blog/videos/` for each video with:
- Full SEO metadata (title, description, Open Graph, Twitter Cards)
- Schema.org VideoObject markup
- Embedded YouTube player
- Related links

## SEO Benefits

### 1. Individual Pages for Each Video
- Each video gets its own URL: `/blog/videos/video-slug`
- Better indexing by search engines
- More opportunities for long-tail keywords

### 2. Rich Schema Markup
- VideoObject schema helps Google understand your content
- Enables rich snippets in search results
- Better visibility in video search

### 3. Internal Linking
- Videos link to blog posts and vice versa
- Strengthens topical authority
- Improves site structure

### 4. Social Sharing
- Open Graph tags for Facebook/LinkedIn
- Twitter Cards for better previews
- Thumbnail images for visual appeal

## Integration with Blog

You can also integrate videos into your blog:

1. **Add videos to blog posts**: Use the `videoUrl` field in blog post data
2. **Show videos in blog listing**: Videos with `videoUrl` automatically show a "Watch Video" link
3. **Related videos section**: Add a section showing related videos

## Troubleshooting

### CORS Errors
If you see CORS errors when fetching RSS:
- Use YouTube Data API v3 instead (Option 2)
- Or generate static pages (Option 3)

### No Videos Showing
- Check that `VITE_YOUTUBE_CHANNEL_ID` is set correctly
- Verify your channel ID is correct
- Check browser console for errors

### RSS Feed Not Updating
- YouTube RSS feeds update when new videos are published
- For real-time updates, use YouTube Data API v3

## Best Practices

1. **Generate Static Pages Regularly**: Run the generation script after publishing new videos
2. **Add Descriptions**: Ensure your YouTube videos have good descriptions (used for SEO)
3. **Use Keywords**: Include relevant keywords in video titles and descriptions
4. **Link Internally**: Link videos to related blog posts and vice versa
5. **Update Sitemap**: Add video pages to your sitemap.xml

## Example: Adding to Sitemap

Add video pages to `public/sitemap.xml`:

```xml
<url>
  <loc>https://kingstonesystems.com/blog/videos/video-slug</loc>
  <lastmod>2025-01-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

## Files Created

- `src/types/video.ts` - TypeScript types for videos
- `src/utils/youtube-rss.ts` - RSS parser and utilities
- `src/components/VideoCard.tsx` - Video display component
- `src/pages/videos/index.tsx` - Videos page component
- `src/videos.tsx` - Entry point for videos page
- `videos.html` - HTML page for videos
- `scripts/generate-video-pages.js` - Static page generator

## Next Steps

1. Set your YouTube Channel ID
2. Test the videos page
3. Generate static pages for SEO
4. Add video pages to sitemap
5. Link videos in blog posts



