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
 * Validate related articles in all blog files
 */
function validateRelatedArticles() {
  const blogDir = path.join(__dirname, '../public/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  const existingSlugs = getExistingBlogSlugs();
  
  let totalIssues = 0;
  const issues = [];
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all href links in related articles section
    const relatedSectionMatch = content.match(/<section class="related-posts-section">([\s\S]*?)<\/section>/);
    
    if (relatedSectionMatch) {
      const relatedSection = relatedSectionMatch[1];
      const hrefMatches = relatedSection.matchAll(/href=["']([^"']+\.html)["']/g);
      
      Array.from(hrefMatches).forEach(match => {
        const href = match[1];
        // Extract slug from href (could be relative like "slug.html" or "../blog/slug.html")
        let slug = href;
        
        // Remove path prefixes
        slug = slug.replace(/^\.\.\/blog\//, '');
        slug = slug.replace(/^\/blog\//, '');
        slug = slug.replace(/^blog\//, '');
        slug = slug.replace(/\.html$/, '');
        
        if (!existingSlugs.has(slug)) {
          totalIssues++;
          issues.push({
            file,
            href,
            slug,
            message: `Broken link to non-existent post: ${slug}`
          });
        }
      });
    }
  });
  
  if (issues.length > 0) {
    console.log(`\n❌ Found ${totalIssues} broken links in related articles:\n`);
    issues.forEach(issue => {
      console.log(`   ${issue.file}: ${issue.message}`);
      console.log(`      Link: ${issue.href}\n`);
    });
  } else {
    console.log('\n✅ All related article links are valid!\n');
  }
  
  return issues;
}

validateRelatedArticles();

