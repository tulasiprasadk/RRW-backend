// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Base path is dynamic: Vercel can set VITE_BASE_PATH=/ (default keeps GH Pages subpath)
  base: process.env.VITE_BASE_PATH || "/rrnagar-coming-soon/",

  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
