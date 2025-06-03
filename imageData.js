// Image data for Railway deployment
// This ensures images are always available regardless of file serving issues

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image metadata
export const imageMap = {
  '5f87692c-a4e5-4595-8ad0-26c2ce2c520e.png': {
    name: 'iQube Logo',
    contentType: 'image/png'
  },
  '2d10c74e-3a04-4e16-adec-d4b95a85bc81.png': {
    name: 'AI Icon', 
    contentType: 'image/png'
  },
  '4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png': {
    name: 'Company Logo',
    contentType: 'image/png'
  },
  '435cd307-815a-46db-ab2d-6b8c9843ed4c.png': {
    name: 'Additional Logo',
    contentType: 'image/png'
  }
};

// Function to get image buffer from multiple possible locations
export function getImageBuffer(filename) {
  const possiblePaths = [
    path.join(__dirname, 'dist', 'assets', 'images', filename),
    path.join(__dirname, 'dist', 'lovable-uploads', filename),
    path.join(__dirname, 'public', 'lovable-uploads', filename),
    path.join(__dirname, 'src', 'assets', 'images', filename)
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        console.log(`📸 Loading image ${filename} from: ${filePath}`);
        return fs.readFileSync(filePath);
      }
    } catch (error) {
      console.log(`❌ Failed to read ${filePath}:`, error.message);
    }
  }

  console.log(`❌ Image not found: ${filename}`);
  return null;
}

// Pre-load all images into memory for Railway
export const imageCache = {};

export function preloadImages() {
  console.log('🚀 Pre-loading images into memory...');
  
  Object.keys(imageMap).forEach(filename => {
    const buffer = getImageBuffer(filename);
    if (buffer) {
      imageCache[filename] = buffer;
      console.log(`✅ Cached ${imageMap[filename].name}: ${buffer.length} bytes`);
    } else {
      console.log(`❌ Failed to cache ${imageMap[filename].name}`);
    }
  });

  console.log(`📊 Cached ${Object.keys(imageCache).length}/${Object.keys(imageMap).length} images`);
}
