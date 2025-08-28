/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/apps/client',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'crystal-finch',
      project: 'javascript-react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
      '@ui': path.resolve(__dirname, './src/app/components/ui'),
    },
  },
  build: {
    outDir: '../dist/apps/client',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../coverage/apps/client',
      provider: 'v8' as const,
    },
    alias: {
      '@': path.resolve(__dirname, './src/app'),
      '@ui': path.resolve(__dirname, './src/app/components/ui'),
      '@/consts': path.resolve(__dirname, './src/app/consts'),
      '@/context': path.resolve(__dirname, './src/app/context'),
      '@/lib': path.resolve(__dirname, './src/app/lib'),
    },
  },
}));
