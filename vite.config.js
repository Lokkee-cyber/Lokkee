import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
    proxy: {
      '/__local-content': {
        target: 'http://127.0.0.1:4179',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
  },
});
