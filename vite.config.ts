import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Plugin to handle clean URLs (remove .html extension)
function cleanBlogUrls() {
  return {
    name: 'clean-blog-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        // Handle /blog/:slug (without .html)
        if (req.url.startsWith('/blog/') && !req.url.endsWith('.html') && !req.url.includes('.')) {
          const slug = req.url.replace('/blog/', '').split('?')[0].split('#')[0];
          const htmlPath = resolve(__dirname, 'public', 'blog', `${slug}.html`);
          
          // Check if the HTML file exists
          if (fs.existsSync(htmlPath)) {
            req.url = `/blog/${slug}.html${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
          }
        }
        
        // Handle /blog (redirect blog.html to /blog)
        if (req.url === '/blog.html' || req.url === '/blog.html/') {
          req.url = '/blog';
        }
        
        // Handle /videos (redirect videos.html to /videos)
        if (req.url === '/videos.html' || req.url === '/videos.html/') {
          req.url = '/videos';
        }
        
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), cleanBlogUrls()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        blog: './blog.html',
        videos: './videos.html',
      },
    },
  },
  publicDir: 'public',
});
