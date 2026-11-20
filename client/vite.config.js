import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development the API runs on port 3001. These paths are sent there,
// so the browser never has to deal with CORS while developing.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/game': 'http://localhost:3001',
      '/scores': 'http://localhost:3001',
    },
  },
});
