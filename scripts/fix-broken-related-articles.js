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
 * Fix broken links in related articles
 */
function fixBrokenLinks(filePath, existingSlugs) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let hasChanges = false;

  // Find related articles section
  const relatedSectionPattern = /(<section class="related-posts-section">[\s\S]*?<\/section>)/;
  const relatedMatch = content.match(relatedSectionPattern);
  
  if (relatedMatch) {
    let relatedSection = relatedMatch[1];
    let updatedSection = relatedSection;
    
    // Find all href links in related section
    const hrefPattern = /href=["']([^"']+\.html)["']/g;
    const hrefMatches = Array.from(relatedSection.matchAll(hrefPattern));
    
    hrefMatches.forEach(match => {
      const href = match[1];
      let slug = href;
      
      // Extract slug from href
      slug = slug.replace(/^\.\.\/blog\//, '');
      slug = slug.replace(/^\/blog\//, '');
      slug = slug.replace(/^blog\//, '');
      slug = slug.replace(/\.html$/, '');
      
      // Check if slug exists
      if (!existingSlugs.has(slug)) {
        // Remove the entire article card
        const articleCardPattern = new RegExp(`<article class="blog-post-card">[\\s\\S]*?href=["'][^"']*${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["'][\\s\\S]*?<\\/article>`, 'g');
        updatedSection = updatedSection.replace(articleCardPattern, '');
        hasChanges = true;
      }
    });
    
    // Clean up empty grids
    updatedSection = updatedSection.replace(/<div class="related-posts-grid">\s*<\/div>/g, '');
    
    if (hasChanges) {
      content = content.replace(relatedSectionPattern, updatedSection);
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

/**
 * Main function to fix all blog HTML files
 */
function main() {
  const blogDir = path.join(__dirname, '../public/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  const existingSlugs = getExistingBlogSlugs();
  
  console.log(`Found ${files.length} blog HTML files`);
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fixBrokenLinks(filePath, existingSlugs)) {
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  });
  
  console.log(`\nFixed ${fixedCount} files by removing broken links`);
}

main();






