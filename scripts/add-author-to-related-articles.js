import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTHOR_NAME = 'Adhiraj Hangal';
const PROFILE_IMAGE = '../assets/AdhirajProfile.png';

/**
 * Add author info to related articles in blog posts
 */
function addAuthorToRelatedArticles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let hasChanges = false;

  // Find related articles section and add author to each card
  const relatedSectionPattern = /(<section class="related-posts-section">[\s\S]*?<\/section>)/;
  const relatedMatch = content.match(relatedSectionPattern);
  
  if (relatedMatch) {
    let relatedSection = relatedMatch[1];
    let updatedSection = relatedSection;
    
    // Find all blog-post-card articles in related section
    const articleCardPattern = /(<article class="blog-post-card">[\s\S]*?<\/article>)/g;
    const cards = relatedSection.match(articleCardPattern);
    
    if (cards) {
      cards.forEach(card => {
        // Check if author already exists
        if (!card.includes('post-card-author')) {
          // Find post-meta and add author after it
          const authorHtml = `
                        <div class="post-card-author">
                            <img src="${PROFILE_IMAGE}" alt="${AUTHOR_NAME}" class="post-card-author-avatar">
                            <span class="post-card-author-name">${AUTHOR_NAME}</span>
                        </div>`;
          
          // Insert author after post-meta
          const updatedCard = card.replace(
            /(<div class="post-meta">[\s\S]*?<\/div>)/,
            `$1${authorHtml}`
          );
          
          updatedSection = updatedSection.replace(card, updatedCard);
          hasChanges = true;
        }
      });
    }
    
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
 * Main function to update all blog HTML files
 */
function main() {
  const blogDir = path.join(__dirname, '../public/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  
  console.log(`Found ${files.length} blog HTML files`);
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (addAuthorToRelatedArticles(filePath)) {
      updatedCount++;
      console.log(`✓ Updated: ${file}`);
    }
  });
  
  console.log(`\nUpdated ${updatedCount} files with author info in related articles`);
}

main();

