import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const source = path.join(__dirname, '../src/assets/logo.png');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Generate PWA icons
    for (const size of sizes) {
      await sharp(source)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate Apple touch icon
    await sharp(source)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('Generated Apple touch icon');

    // Generate favicon
    await sharp(source)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));
    console.log('Generated favicon');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 