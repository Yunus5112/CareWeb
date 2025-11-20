import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // GitHub Pages için base URL
  // Repo adı: CareWeb → base: '/CareWeb/'
  base: '/CareWeb/',
  
  // Build optimizasyonları
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // terser yerine esbuild (daha hızlı)
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
});
