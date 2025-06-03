import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy image requests to backend server
      '/lovable-uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      // Proxy API requests to backend server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    // Custom plugin to copy images during build
    {
      name: 'copy-images',
      writeBundle() {
        const sourceDir = 'public/lovable-uploads';
        const targetDir = 'dist/lovable-uploads';

        if (existsSync(sourceDir)) {
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
          }

          const files = readdirSync(sourceDir);
          files.forEach(file => {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file);
            copyFileSync(sourcePath, targetPath);
            console.log(`📸 Copied image: ${file}`);
          });
          console.log(`✅ Copied ${files.length} images to dist/lovable-uploads/`);
        } else {
          console.log('❌ Source directory public/lovable-uploads not found');
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize production build
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps for smaller bundle
    rollupOptions: {
      output: {
        // Code splitting for better performance
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          query: ['@tanstack/react-query'],
          icons: ['lucide-react']
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep image files with original names for easier debugging
          if (assetInfo.name && /\.(png|jpe?g|gif|svg)$/i.test(assetInfo.name)) {
            return 'assets/images/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize CSS
    cssMinify: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query'
    ]
  }
}));
