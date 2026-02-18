// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// Clean Astro config for Vercel deployment
// CBC AI System - No Wix dependencies
export default defineConfig({
  output: "server",
  integrations: [
    tailwind(),
    react(),
  ],
});

