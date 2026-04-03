import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Redirect all 404s to index.html for client-side routing
    historyApiFallback: true,
  },
});
