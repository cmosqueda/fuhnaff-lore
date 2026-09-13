import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this project from a /fuhnaff-lore subpath, so it
  // needs that as the base; Vercel (and any other root-domain host) serves
  // from "/". Vercel sets VERCEL=1 during its builds, so this picks the
  // right one automatically. Override with BASE_PATH if neither fits.
  base: process.env.BASE_PATH ?? (process.env.VERCEL ? "/" : "/fuhnaff-lore"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
