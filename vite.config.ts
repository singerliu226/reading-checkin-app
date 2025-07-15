import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 为Zeabur部署优化配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // 使用esbuild代替terser，速度更快
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    }
  },
  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
    hmr: {
      port: 3000,
    }
  },
  // 预览服务器配置
  preview: {
    port: 3000,
    host: true,
  },
  // 环境变量配置
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  }
})

