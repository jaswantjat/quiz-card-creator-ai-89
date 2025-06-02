#!/bin/bash

# Railway Build Script - Ensures images are copied during deployment
echo "🚀 Starting Railway build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev

# Install dev dependencies for build
echo "🔧 Installing dev dependencies for build..."
npm install --only=dev

# Build frontend
echo "🏗️ Building frontend..."
npm run build:frontend

# Copy images manually (backup method)
echo "📸 Copying images manually..."
mkdir -p dist/lovable-uploads
if [ -d "public/lovable-uploads" ]; then
    cp -r public/lovable-uploads/* dist/lovable-uploads/ 2>/dev/null || true
    echo "✅ Images copied from public/lovable-uploads/"
    ls -la dist/lovable-uploads/
else
    echo "❌ public/lovable-uploads directory not found"
fi

# Verify images exist
echo "🔍 Verifying images in dist directory..."
if [ -d "dist/lovable-uploads" ]; then
    echo "✅ dist/lovable-uploads exists"
    ls -la dist/lovable-uploads/
    echo "📊 Image count: $(ls -1 dist/lovable-uploads/ | wc -l)"
else
    echo "❌ dist/lovable-uploads does not exist"
fi

# Clean up dev dependencies
echo "🧹 Cleaning up dev dependencies..."
npm prune --omit=dev

echo "✅ Railway build complete!"
