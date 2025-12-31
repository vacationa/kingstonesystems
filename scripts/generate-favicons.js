import sharp from 'sharp';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = resolve(__dirname, '../public/assets/logo.svg');
const outputDir = resolve(__dirname, '../public');

// Read the SVG file
const svgBuffer = readFileSync(svgPath);

// Define sizes to generate
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'favicon-192x192.png' },
];

// Generate PNG files
for (const { size, name } of sizes) {
  try {
    const buffer = await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 127, g: 0, b: 255, alpha: 1 } // #7F00FF
      })
      .png()
      .toBuffer();
    
    writeFileSync(resolve(outputDir, name), buffer);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${name}:`, error.message);
  }
}

// Generate favicon.ico (multi-size ICO file)
// ICO format requires multiple sizes, so we'll create a 16x16 version as favicon.ico
try {
  const icoBuffer = await sharp(svgBuffer)
    .resize(16, 16, {
      fit: 'contain',
      background: { r: 127, g: 0, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();
  
  // For ICO format, we'll save as PNG but name it favicon.ico
  // Note: True ICO format would require a special library, but PNG works for most browsers
  // For Google, we can also use a 32x32 PNG renamed to .ico
  const ico32Buffer = await sharp(svgBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 127, g: 0, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();
  
  // Save as favicon.ico (Google accepts PNG content in .ico file)
  writeFileSync(resolve(outputDir, 'favicon.ico'), ico32Buffer);
  console.log(`✓ Generated favicon.ico (32x32)`);
} catch (error) {
  console.error(`✗ Failed to generate favicon.ico:`, error.message);
}

console.log('\n✓ Favicon generation complete!');

