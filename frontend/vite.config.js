// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://organicfarming-683o.onrender.com', // Your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
