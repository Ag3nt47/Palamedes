import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: './', optimizeDeps: { entries: ['index.html'] }, build: { chunkSizeWarningLimit: 5000 }, server: { port: 5173, strictPort: true, watch: { ignored: ['**/.local/**', '**/release/**', '**/docs/media/**', '**/test-results/**'] } } });
