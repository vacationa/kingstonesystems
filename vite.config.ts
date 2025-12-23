import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Plugin to handle clean URLs for blog posts
function cleanBlogUrls() {
  return {
    name: 'clean-blog-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Handle /blog/:slug (without .html)
        if (req.url && req.url.startsWith('/blog/') && !req.url.endsWith('.html') && !req.url.includes('.')) {
          const slug = req.url.replace('/blog/', '').split('?')[0].split('#')[0];
          const htmlPath = resolve(__dirname, 'public', 'blog', `${slug}.html`);
          
          // Check if the HTML file exists
          if (fs.existsSync(htmlPath)) {
            req.url = `/blog/${slug}.html${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
          }
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
