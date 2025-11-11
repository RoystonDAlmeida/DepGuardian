import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  // Server config (only affects local dev, Vercel ignores this)
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [path.resolve(__dirname)],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  
  // Build configuration for production
  build: {
    outDir: "dist", // Changed from "dist/spa"
    sourcemap: false, // Disable for smaller bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  
  // Base URL (use if deploying to subdirectory)
  base: "/",
});
