// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// Simple Astro config for Vercel deployment
// CBC AI System - No Wix dependencies needed
export default defineConfig({
  output: "server",
  integrations: [
    tailwind(),
    react(),
  ],
  vite: {
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
      ],
    },
  },
});
