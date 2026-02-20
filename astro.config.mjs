// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Simple Astro config for Vercel deployment
// CBC AI System - No Wix dependencies needed
export default defineConfig({
  output: "server",
  integrations: [
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
// Built with CBC AI System
