import { defineConfig,loadEnv } from "vite";
import path from 'path'
import createVitePlugins from "./vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        src: path.resolve(__dirname, 'src'),
        '@root': path.resolve(__dirname),
        lodash: 'lodash-es',
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    plugins: createVitePlugins(env),
    server: {
      port: 15282,
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:5282", // 本地node服务
          changeOrigin: true,
          // rewrite: p => p.replace(/^\/api/, "")
        },
        "/socket.io": {
          target: "http://localhost:5282/socket.io", // 本地node服务
          ws: true,
          changeOrigin: true,
        },
      }
    }
  }
});
