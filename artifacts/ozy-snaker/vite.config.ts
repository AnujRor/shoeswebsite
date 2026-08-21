import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

// On Replit these are injected automatically.
// Locally they fall back to sensible defaults.
const port = Number(process.env.PORT ?? '5173');
const basePath = process.env.BASE_PATH ?? '/';

// Detect whether we're running inside Replit
const isReplit = Boolean(process.env.REPL_ID);

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' && isReplit
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    // Replit's proxied preview does not expose the Vite HMR websocket
    // reliably, which otherwise creates a browser console connection error.
    hmr: true,
    fs: {
      strict: false,
    },
    // Local-only proxy: forwards /api requests to the API server.
    // On Replit this is handled by the platform router so it has no effect.
    ...(!isReplit && {
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.API_PORT ?? '3000'}`,
          changeOrigin: true,
        },
      },
    }),
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
