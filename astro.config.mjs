// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

// Astro config for Vercel deployment
// CBC AI System - Kenyan lesson plan generator
export default defineConfig({
  output: "server",
  adapter: vercel(),
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
