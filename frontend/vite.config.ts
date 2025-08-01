import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from 'rollup-plugin-visualizer';

// Custom plugin to inject "built by scout" tag
function injectBuiltByScoutPlugin() {
  return {
    name: 'inject-built-by-scout',
    transformIndexHtml(html: string) {
      // Inject the scout tag script reference
      const scriptTag = '<script defer src="/scout-tag.js"></script>';
      
      // Inject the script before the closing body tag
      return html.replace('</body>', scriptTag + '\n  </body>');
    }
  };
}

// Performance optimization plugin
function performancePlugin() {
  return {
    name: 'performance-hints',
    generateBundle(options, bundle) {
      // Analyze bundle size and warn about large chunks
      const chunkSizeThreshold = 500 * 1024; // 500KB
      
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && 'code' in chunk) {
          const size = new Blob([chunk.code]).size;
          if (size > chunkSizeThreshold) {
            console.warn(`Large chunk detected: ${fileName} (${(size / 1024).toFixed(2)}KB)`);
          }
        }
      });
    }
  };
}

// Vite configuration with performance optimizations for RitKART
// Includes code splitting, lazy loading, bundle analysis, and production optimizations
export default defineConfig({
  plugins: [
    react({
      // Enable React optimization
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && [
            'babel-plugin-transform-remove-console',
            { exclude: ['error', 'warn'] }
          ]
        ].filter(Boolean)
      }
    }),
    tailwindcss(),
    injectBuiltByScoutPlugin(),
    // splitVendorChunkPlugin(), // Removed due to conflict with manual chunks
    performancePlugin(),
    // Bundle analyzer in development
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Performance optimizations
  build: {
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 600,
    
    // Enable source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Optimize dependencies
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Keep React together to avoid useLayoutEffect issues
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('clsx')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          
          // App chunks based on file paths
          if (id.includes('pages/auth/')) {
            return 'auth-pages';
          }
          if (id.includes('pages/Product') || id.includes('pages/SearchResults')) {
            return 'product-pages';
          }
          if (id.includes('pages/Cart') || id.includes('pages/Checkout') || id.includes('pages/OrderSuccess')) {
            return 'cart-pages';
          }
          if (id.includes('pages/admin/')) {
            return 'admin-pages';
          }
          if (id.includes('pages/account/') || id.includes('pages/Wishlist') || id.includes('pages/ComparisonPage')) {
            return 'account-pages';
          }
        },
        
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `styles/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Optimize chunk file names
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      },
      
      // External dependencies (if using CDN)
      external: process.env.USE_CDN ? [
        'react',
        'react-dom'
      ] : []
    },
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : []
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // Target modern browsers for better optimization
    target: 'es2020',
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize CSS
    cssMinify: true
  },
  
  // Development server optimizations
  server: {
    // Enable HTTP/2 in development
    https: false,
    
    // Improve HMR performance
    hmr: {
      overlay: true
    },
    
    // Optimize file watching
    watch: {
      usePolling: false,
      interval: 100
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'date-fns',
      'recharts'
    ],
    exclude: [
      // Exclude large libraries that should be lazy loaded
    ]
  },
  

  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
