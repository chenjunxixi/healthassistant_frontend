import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // 【【【 新增的核心配置 】】】
  server: {
    proxy: {
      // 规则：所有以 /api 开头的请求，都将被代理转发
      '/api': {
        // 目标服务器：指向您的Spring Boot后端地址
        target: 'http://localhost:8080',

        // 必需：更改请求源（origin），允许跨域
        changeOrigin: true,

        // 可选：如果您后端的Context Path不是'/'，可能需要重写路径
        // 在我们当前的情况下，不需要重写，所以注释掉
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
