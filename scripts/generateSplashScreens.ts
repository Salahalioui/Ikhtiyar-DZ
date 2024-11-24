import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const splashScreens = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' }, // iPad Pro 12.9"
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388.png' }, // iPad Pro 11"
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' }, // iPad Mini, Air
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' }, // iPhone X/XS
  { width: 1242, height: 2688, name: 'apple-splash-1242-2688.png' }  // iPhone XS Max
];

const source = path.join(__dirname, '../src/assets/splash.png');
const outputDir = path.join(__dirname, '../public/splash');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSplashScreens() {
  try {
    for (const screen of splashScreens) {
      await sharp(source)
        .resize(screen.width, screen.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(path.join(outputDir, screen.name));
      console.log(`Generated ${screen.name}`);
    }
  } catch (error) {
    console.error('Error generating splash screens:', error);
  }
}

generateSplashScreens(); 