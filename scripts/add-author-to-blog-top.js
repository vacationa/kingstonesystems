import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTHOR_NAME = 'Adhiraj Hangal';
const PROFILE_IMAGE = '../assets/AdhirajProfile.png';

/**
 * Add author section at the top of blog post (after post-meta-top)
 */
function addAuthorToTop(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let hasChanges = false;

  // Check if author section already exists at the top
  const hasAuthorAtTop = /<!-- Author Info Top -->[\s\S]*?<!-- \/Author Info Top -->/.test(content);
  
  if (!hasAuthorAtTop) {
    // Find the post-meta-top section and add author after it
    const postMetaTopPattern = /(<div class="post-meta-top">[\s\S]*?<\/div>)/;
    const titlePattern = /(<h1 class="post-title">)/;
    
    const authorSection = `
                <div class="post-author-top">
                    <img src="${PROFILE_IMAGE}" alt="${AUTHOR_NAME}" class="post-author-avatar-top">
                    <div class="post-author-info-top">
                        <span class="post-author-name-top">${AUTHOR_NAME}</span>
                        <span class="post-author-role-top">AI Voice Agent Consultant & Developer</span>
                    </div>
                </div>`;

    // Try to insert after post-meta-top and before title
    if (postMetaTopPattern.test(content) && titlePattern.test(content)) {
      content = content.replace(
        /(<div class="post-meta-top">[\s\S]*?<\/div>\s*)(<h1 class="post-title">)/,
        `$1${authorSection}\n                $2`
      );
      hasChanges = true;
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
    if (addAuthorToTop(filePath)) {
      updatedCount++;
      console.log(`✓ Updated: ${file}`);
    }
  });
  
  console.log(`\nUpdated ${updatedCount} files with author info at top`);
}

main();






