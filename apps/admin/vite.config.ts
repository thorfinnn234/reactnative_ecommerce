import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defaultClientConditions, defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Read @ecom/shared's TypeScript source directly instead of its built dist/.
    conditions: ['@ecom/source', ...defaultClientConditions],
  },
  server: {
    port: 5180,
    strictPort: true,
    // Dev-only proxy: the admin calls /api/* on its own origin, so no CORS setup is needed locally.
    proxy: {
      '/api': {
        target: 'http://localhost:4100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
