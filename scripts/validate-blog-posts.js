import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all blog post slugs from HTML files
 */
function getExistingBlogSlugs() {
  const blogDir = path.join(__dirname, '../public/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  return new Set(files.map(f => f.replace('.html', '')));
}

/**
 * Read blog posts from the React component file
 */
function getBlogPostsFromComponent() {
  const componentPath = path.join(__dirname, '../src/pages/blog/index.tsx');
  const content = fs.readFileSync(componentPath, 'utf8');
  
  // Extract slug values from the component
  const slugMatches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
  const slugs = Array.from(slugMatches, m => m[1]);
  
  // Also check for cleanSlug calls
  const cleanSlugMatches = content.matchAll(/cleanSlug\(["']([^"']+)["']\)/g);
  const cleanSlugs = Array.from(cleanSlugMatches, m => m[1]);
  
  return [...new Set([...slugs, ...cleanSlugs])];
}

/**
 * Main function to validate blog posts
 */
function main() {
  const existingSlugs = getExistingBlogSlugs();
  const componentSlugs = getBlogPostsFromComponent();
  
  console.log(`\nTotal HTML files: ${existingSlugs.size}`);
  console.log(`Total slugs in component: ${componentSlugs.length}\n`);
  
  const missing = [];
  const extra = [];
  
  componentSlugs.forEach(slug => {
    if (!existingSlugs.has(slug)) {
      missing.push(slug);
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Blog posts in component but missing HTML files:');
    missing.forEach(slug => {
      console.log(`   - ${slug}`);
    });
    console.log(`\nTotal missing: ${missing.length}\n`);
  } else {
    console.log('✅ All blog posts in component have corresponding HTML files!\n');
  }
  
  return { missing, existingSlugs };
}

const result = main();
export { result };



