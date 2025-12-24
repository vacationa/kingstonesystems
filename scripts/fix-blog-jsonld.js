import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTHOR_NAME = 'Adhiraj Hangal';

/**
 * Fix JSON-LD and author information in a blog HTML file
 */
function fixJsonLdInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let hasChanges = false;

  // 1. Fix extra closing braces in JSON-LD (}} -> })
  const doubleBracePattern = /(\}\s*)\}\s*<\/script>/;
  if (doubleBracePattern.test(content)) {
    content = content.replace(doubleBracePattern, '$1</script>');
    hasChanges = true;
  }

  // 2. Update author field in JSON-LD using regex (more robust)
  // Match author field that might be Organization or Person
  const authorPattern = /"author"\s*:\s*\{[^}]*"@type"\s*:\s*"[^"]*"[^}]*\}/;
  const authorReplacement = `"author": {
        "@type": "Person",
        "name": "${AUTHOR_NAME}",
        "image": "https://kingstonesystems.com/assets/AdhirajProfile.png"
      }`;
  
  if (authorPattern.test(content)) {
    content = content.replace(authorPattern, authorReplacement);
    hasChanges = true;
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
  
  console.log(`Found ${files.length} blog HTML files`);
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fixJsonLdInFile(filePath)) {
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  });
  
  console.log(`\nFixed ${fixedCount} files`);
}

main();



