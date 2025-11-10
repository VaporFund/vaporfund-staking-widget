import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * CDN build configuration
 *
 * This builds a standalone UMD bundle that includes React and all dependencies.
 * The bundle can be loaded directly via <script> tag without any build tools.
 *
 * Output: dist/vaporfund-widget.min.js
 *
 * Usage:
 * <script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
 * <script>
 *   VaporWidget.init({
 *     container: '#my-widget',
 *     apiKey: 'vf_test_xxxxx'
 *   });
 * </script>
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist/cdn',
    lib: {
      entry: resolve(__dirname, 'src/cdn.tsx'),
      name: 'VaporWidget',
      formats: ['umd'],
      fileName: () => 'vaporfund-widget.min.js'
    },
    rollupOptions: {
      // Don't externalize anything - bundle everything
      // This makes it a true standalone bundle
      output: {
        // Ensure global name is set
        name: 'VaporWidget',
        // Inline all assets
        inlineDynamicImports: true,
        // Set globals for any peer dependencies (none in this case)
        globals: {},
      }
    },
    // Optimization
    sourcemap: true, // Keep sourcemap for debugging
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
        drop_debugger: true,
        pure_funcs: ['console.debug'],
      },
      mangle: {
        // Don't mangle VaporWidget global
        reserved: ['VaporWidget']
      }
    },
    // Target modern browsers
    target: 'es2015',
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB (React + Widget)
  },
  // CSS handling
  css: {
    postcss: './postcss.config.js',
  },
  // Define environment
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
