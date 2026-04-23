import { VitePWA } from 'vite-plugin-pwa'
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_THEME = "#4a6b5c";
const APP_BG = "#faf8f6";

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"]
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Meal Planner App",
        short_name: "MealCare",
        description: "Meal planner for elderly users",
        theme_color: APP_THEME,
        background_color: APP_BG,
        display: "standalone",
        icons: [
          { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
        ],
      },
    }),
  ],
});