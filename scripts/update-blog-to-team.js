import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTHOR_NAME = 'Kingstone Team';
const LOGO_IMAGE = '../assets/newlogo.png';

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
  } else {
    // Add meta author tag if it doesn't exist (after keywords)
    const afterKeywords = /(<meta name="keywords"[^>]*>)/;
    if (afterKeywords.test(content)) {
      content = content.replace(
        afterKeywords,
        `$1\n    <meta name="author" content="${AUTHOR_NAME}">`
      );
      hasChanges = true;
    }
  }

  // 2. Update Schema.org author in JSON-LD
  // Match author field with nested braces
  const authorInJsonLdPattern = /"author"\s*:\s*\{[^}]*"@type"\s*:\s*"[^"]*"[^}]*\}/;
  const authorReplacement = `"author": {
        "@type": "Organization",
        "name": "${AUTHOR_NAME}",
        "logo": {
          "@type": "ImageObject",
          "url": "https://kingstonesystems.com/assets/newlogo.png"
        }
      }`;
  
  if (authorInJsonLdPattern.test(content)) {
    content = content.replace(authorInJsonLdPattern, authorReplacement);
    hasChanges = true;
  } else {
    // If author field doesn't exist, try to add it after @type or description
    const addAuthorAfterType = /("@type"\s*:\s*"Article"[^}]*)(,\s*"publisher")/;
    const addAuthorAfterDesc = /("description"\s*:\s*"[^"]*"[^}]*)(,\s*"publisher")/;
    
    if (addAuthorAfterDesc.test(content)) {
      content = content.replace(
        addAuthorAfterDesc,
        `$1,\n      ${authorReplacement}$2`
      );
      hasChanges = true;
    } else if (addAuthorAfterType.test(content)) {
      content = content.replace(
        addAuthorAfterType,
        `$1,\n      ${authorReplacement}$2`
      );
      hasChanges = true;
    }
  }

  // 3. Update the author section at the top of the post (post-author-top)
  const authorTopSectionPattern = /<div class="post-author-top">[\s\S]*?<\/div>\s*<\/div>/;
  if (authorTopSectionPattern.test(content)) {
    const newAuthorTopSection = `<div class="post-author-top">
                    <img src="${LOGO_IMAGE}" alt="${AUTHOR_NAME}" class="post-author-avatar-top">
                    <div class="post-author-info-top">
                        <span class="post-author-name-top">${AUTHOR_NAME}</span>
                        <span class="post-author-role-top">AI Voice Agent Solutions</span>
                    </div>
                </div>`;
    
    content = content.replace(authorTopSectionPattern, newAuthorTopSection);
    hasChanges = true;
  }

  // 4. Update related posts author references (in post cards)
  // Replace all instances of Adhiraj references in related posts
  content = content.replace(
    /src="\.\.\/assets\/AdhirajProfile\.png" alt="Adhiraj Hangal"/g,
    `src="${LOGO_IMAGE}" alt="${AUTHOR_NAME}"`
  );
  content = content.replace(
    /<span class="post-card-author-name">Adhiraj Hangal<\/span>/g,
    `<span class="post-card-author-name">${AUTHOR_NAME}</span>`
  );

  // 5. Add or update author section in the blog post body (Author Section)
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
                    <img src="${LOGO_IMAGE}" alt="${AUTHOR_NAME}">
                </div>
                <div class="author-info">
                    <h3 class="author-name">${AUTHOR_NAME}</h3>
                    <p class="author-bio">AI Voice Agent Solutions by Kingstone Systems</p>
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
    const updatedAuthorSection = `<!-- Author Section -->
    <section class="author-section">
        <div class="container">
            <div class="author-card">
                <div class="author-avatar">
                    <img src="${LOGO_IMAGE}" alt="${AUTHOR_NAME}">
                </div>
                <div class="author-info">
                    <h3 class="author-name">${AUTHOR_NAME}</h3>
                    <p class="author-bio">AI Voice Agent Solutions by Kingstone Systems</p>
                </div>
            </div>
        </div>
    </section>
    <!-- /Author Section -->`;
    
    content = content.replace(authorSectionPattern, updatedAuthorSection);
    hasChanges = true;
  }

  if (hasChanges && content !== originalContent) {
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
  
  if (!fs.existsSync(blogDir)) {
    console.error(`Blog directory not found: ${blogDir}`);
    return;
  }
  
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  
  console.log(`Found ${files.length} blog HTML files`);
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    try {
      if (updateAuthorInFile(filePath)) {
        updatedCount++;
        console.log(`✓ Updated: ${file}`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${file}:`, error.message);
    }
  });
  
  console.log(`\nUpdated ${updatedCount} out of ${files.length} files with Kingstone Team branding`);
}

main();
