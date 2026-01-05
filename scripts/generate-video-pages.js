// Script to generate static HTML pages for YouTube videos
// This improves SEO by creating individual pages for each video

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// YouTube Channel ID - can be set via environment variable
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';

// Template for video page HTML
const videoPageTemplate = (video) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${video.description.substring(0, 160).replace(/"/g, '&quot;')}">
    <meta name="keywords" content="AI voice agent, voice AI tutorial, ${video.title.toLowerCase().replace(/[^a-z0-9]+/g, ', ')}">
    <meta name="author" content="Kingstone Systems">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="https://kingstonesystems.com/blog/videos/${video.slug}">
    <meta property="og:title" content="${video.title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${video.description.substring(0, 200).replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${video.thumbnailUrl}">
    <meta property="og:video" content="${video.videoUrl}">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="player">
    <meta name="twitter:title" content="${video.title.replace(/"/g, '&quot;')}">
    <meta name="twitter:description" content="${video.description.substring(0, 200).replace(/"/g, '&quot;')}">
    <meta name="twitter:image" content="${video.thumbnailUrl}">
    <meta name="twitter:player" content="https://www.youtube.com/embed/${video.id}">
    <meta name="twitter:player:width" content="1280">
    <meta name="twitter:player:height" content="720">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://kingstonesystems.com/blog/videos/${video.slug}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../../assets/logo.svg">
    
    <title>${video.title.replace(/"/g, '&quot;')} | Kingstone Systems</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/styles.css">

    <!-- Schema.org VideoObject markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": ${JSON.stringify(video.title)},
      "description": ${JSON.stringify(video.description)},
      "thumbnailUrl": "${video.thumbnailUrl}",
      "uploadDate": "${video.publishedAt}",
      "contentUrl": "${video.videoUrl}",
      "embedUrl": "https://www.youtube.com/embed/${video.id}",
      "duration": "${video.duration || 'PT5M'}",
      "publisher": {
        "@type": "Organization",
        "name": "${video.channelName || 'Kingstone Systems'}",
        "logo": {
          "@type": "ImageObject",
          "url": "https://kingstonesystems.com/assets/logo.svg"
        }
      }
    }
    </script>
</head>
<body>
    <!-- Navigation -->
    <nav class="nav">
        <div class="container nav-content">
            <div class="logo">
                <a href="../../index.html" style="text-decoration: none; color: inherit;">
                    <span class="logo-text">Kingstone Systems</span>
                </a>
            </div>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="nav-links">
                <a href="../../index.html#tutorials">Tutorials</a>
                <a href="../../index.html#solutions">Solutions</a>
                <a href="../../index.html#how-it-works">How It Works</a>
                <a href="../../blog">Blog</a>
                <a href="../../videos">Videos</a>
                <a href="https://cal.com/kingstonesystems/free-strategy-call" class="btn-signup">Book a Demo</a>
            </div>
        </div>
    </nav>

    <!-- Video Page -->
    <article class="blog-post-page">
        <div class="container">
            <div class="post-header">
                <a href="../../videos" class="back-to-blog">← Back to Videos</a>
                <div class="post-meta-top">
                    <span class="post-category">${video.category || 'Video Tutorial'}</span>
                    <span class="post-date">${new Date(video.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                </div>
                <h1 class="post-title">${video.title.replace(/"/g, '&quot;')}</h1>
                <p class="post-subtitle">
                    ${video.description.replace(/"/g, '&quot;')}
                </p>
            </div>

            <div class="post-featured-image" style="margin: 40px 0;">
                <div class="video-embed-container">
                    <iframe
                        src="https://www.youtube.com/embed/${video.id}"
                        title="${video.title.replace(/"/g, '&quot;')}"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
                    ></iframe>
                </div>
            </div>

            <div class="post-content">
                <div style="text-align: center; margin: 40px 0;">
                    <a 
                        href="${video.videoUrl}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="btn-read-more"
                        style="display: inline-block;"
                    >
                        Watch on YouTube →
                    </a>
                </div>
                
                <h2>About This Video</h2>
                <p>${video.description.replace(/\n/g, '</p><p>').replace(/"/g, '&quot;')}</p>
                
                <h2>Related Resources</h2>
                <ul>
                    <li><a href="../../blog">View All Blog Posts</a></li>
                    <li><a href="../../videos">Browse More Videos</a></li>
                    <li><a href="../../index.html#solutions">Explore Solutions</a></li>
                </ul>
            </div>
        </div>
    </article>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Kingstone Systems</h3>
                    <p>Building custom AI voice agents for businesses.</p>
                </div>
                <div class="footer-section">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="../../blog">Blog</a></li>
                        <li><a href="../../videos">Videos</a></li>
                        <li><a href="../../index.html#solutions">Solutions</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="https://cal.com/kingstonesystems/free-strategy-call">Book a Demo</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Kingstone Systems. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../../js/script.js"></script>
</body>
</html>`;

async function fetchYouTubeRSS(channelId) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  
  try {
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.statusText}`);
    }
    const xmlText = await response.text();
    return parseRSS(xmlText);
  } catch (error) {
    console.error('Error fetching YouTube RSS:', error);
    return [];
  }
}

function parseRSS(xmlText) {
  const videos = [];
  const entryMatches = xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/g);
  
  for (const match of entryMatches) {
    const entry = match[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || 
                    entry.match(/<videoId>([^<]+)<\/videoId>/)?.[1] || '';
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || 
                       entry.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
    const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] || '';
    const channelName = entry.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/)?.[1] || '';
    
    if (videoId && title) {
      // Create slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      videos.push({
        id: videoId,
        title: title.trim(),
        description: description.trim().replace(/<[^>]+>/g, ''),
        publishedAt: published,
        thumbnailUrl: thumbnail,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        channelName: channelName.trim(),
        slug,
        category: 'Video Tutorial',
      });
    }
  }
  
  return videos;
}

async function generateVideoPages() {
  if (!YOUTUBE_CHANNEL_ID) {
    console.error('YOUTUBE_CHANNEL_ID environment variable is not set.');
    console.log('Usage: YOUTUBE_CHANNEL_ID=your_channel_id node scripts/generate-video-pages.js');
    process.exit(1);
  }

  console.log(`Fetching videos from YouTube channel: ${YOUTUBE_CHANNEL_ID}`);
  const videos = await fetchYouTubeRSS(YOUTUBE_CHANNEL_ID);
  
  if (videos.length === 0) {
    console.error('No videos found. Please check your channel ID.');
    process.exit(1);
  }

  console.log(`Found ${videos.length} videos. Generating pages...`);

  // Create videos directory if it doesn't exist
  const videosDir = path.join(__dirname, '../public/blog/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  // Generate HTML page for each video
  let generated = 0;
  for (const video of videos) {
    const html = videoPageTemplate(video);
    const filePath = path.join(videosDir, `${video.slug}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    generated++;
    console.log(`✓ Generated: ${video.slug}.html`);
  }

  console.log(`\n✅ Successfully generated ${generated} video pages in ${videosDir}`);
}

generateVideoPages().catch(console.error);


