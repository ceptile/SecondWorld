import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()],
  base: '/SecondWorld/',
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          physics: ['cannon-es'],
          audio: ['howler'],
          postprocessing: ['postprocessing']
        }
      }
    },
    assetsInlineLimit: 0
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    exclude: ['vite-plugin-wasm']
  },
  assetsInclude: ['**/*.hdr', '**/*.glb', '**/*.gltf', '**/*.wasm']
});
