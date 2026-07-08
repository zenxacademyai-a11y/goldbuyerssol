import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("three") || id.includes("react-three")) {
                return "three";
              }
              if (id.includes("recharts") || id.includes("d3-") || id.includes("recharts-scale") || id.includes("eventemitter3")) {
                return "charts";
              }
              if (id.includes("motion") || id.includes("framer-motion")) {
                return "motion";
              }
              return "vendor";
            }
          }
        }
      }
    },
  };
});
