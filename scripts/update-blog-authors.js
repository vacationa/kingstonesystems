import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTHOR_NAME = 'Adhiraj Hangal';
const PROFILE_IMAGE = '../assets/AdhirajProfile.png';

/**
 * Update author information in a blog HTML file
 */
function updateAuthorInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let hasChanges = false;

  // 1. Update meta author tag
  const metaAuthorPattern = /<meta name="author" content="[^"]*">/;
  if (metaAuthorPattern.test(content)) {
    content = content.replace(
      metaAuthorPattern,
      `<meta name="author" content="${AUTHOR_NAME}">`
    );
    hasChanges = true;
  }

  // 2. Update Schema.org author in JSON-LD
  // Find the JSON-LD script tag and update author
  const jsonLdPattern = /<script type="application\/ld\+json">\s*({[\s\S]*?})\s*<\/script>/;
  const jsonLdMatch = content.match(jsonLdPattern);
  
  if (jsonLdMatch) {
    try {
      const jsonLd = JSON.parse(jsonLdMatch[1]);
      
      // Update author to Person type
      if (jsonLd.author) {
        jsonLd.author = {
          "@type": "Person",
          "name": AUTHOR_NAME,
          "image": "https://kingstonesystems.com/assets/AdhirajProfile.png"
        };
        
        const updatedJsonLd = JSON.stringify(jsonLd, null, 6);
        content = content.replace(
          jsonLdPattern,
          `<script type="application/ld+json">\n    ${updatedJsonLd}\n    </script>`
        );
        hasChanges = true;
      }
    } catch (e) {
      console.warn(`  ⚠ Could not parse JSON-LD in ${path.basename(filePath)}: ${e.message}`);
    }
  }

  // 3. Add or update author section in the blog post body
  // Check if author section already exists
  const authorSectionPattern = /<!-- Author Section -->[\s\S]*?<!-- \/Author Section -->/;
  const hasAuthorSection = authorSectionPattern.test(content);

  // Find where to insert the author section (after </article> and before Related Posts)
  const articleEndPattern = /(\s*<\/article>\s*)/;
  const relatedPostsPattern = /(\s*<!-- Related Posts -->)/;
  
  if (!hasAuthorSection) {
    const authorSection = `
    <!-- Author Section -->
    <section class="author-section">
        <div class="container">
            <div class="author-card">
                <div class="author-avatar">
                    <img src="${PROFILE_IMAGE}" alt="${AUTHOR_NAME}">
                </div>
                <div class="author-info">
                    <h3 class="author-name">${AUTHOR_NAME}</h3>
                    <p class="author-bio">AI Voice Agent Consultant & Developer at Kingstone Systems</p>
                </div>
            </div>
        </div>
    </section>
    <!-- /Author Section -->`;

    // Try to insert after </article> and before Related Posts
    if (relatedPostsPattern.test(content)) {
      content = content.replace(
        relatedPostsPattern,
        `${authorSection}\n$1`
      );
      hasChanges = true;
    } else if (articleEndPattern.test(content)) {
      // If no Related Posts section, add after article
      content = content.replace(
        articleEndPattern,
        `$1${authorSection}\n`
      );
      hasChanges = true;
    }
  } else {
    // Update existing author section
    const existingAuthorMatch = content.match(authorSectionPattern);
    if (existingAuthorMatch) {
      const updatedAuthorSection = `
    <!-- Author Section -->
    <section class="author-section">
        <div class="container">
            <div class="author-card">
                <div class="author-avatar">
                    <img src="${PROFILE_IMAGE}" alt="${AUTHOR_NAME}">
                </div>
                <div class="author-info">
                    <h3 class="author-name">${AUTHOR_NAME}</h3>
                    <p class="author-bio">AI Voice Agent Consultant & Developer at Kingstone Systems</p>
                </div>
            </div>
        </div>
    </section>
    <!-- /Author Section -->`;
      
      content = content.replace(authorSectionPattern, updatedAuthorSection);
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
    if (updateAuthorInFile(filePath)) {
      updatedCount++;
      console.log(`✓ Updated: ${file}`);
    }
  });
  
  console.log(`\nUpdated ${updatedCount} files with author information`);
}

main();

