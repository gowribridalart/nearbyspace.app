import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for standard React code compatibility
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});