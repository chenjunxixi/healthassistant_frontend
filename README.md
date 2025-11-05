# Health Assistant 前端（Vue 3 + Vite）

本仓库为 Health Assistant 的网页前端，基于 Vue 3 + Vite 构建，使用 Pinia 进行状态管理，集成 axios、vue-router，并支持 Chart.js / ECharts 可视化。

- 后端仓库：[healthassistant_backend](https://github.com/chenjunxixi/healthassistant_backend)
- Android 客户端：[healthassistant_app](https://github.com/chenjunxixi/healthassistant_app)

## 技术栈

- 框架与构建：Vue 3、Vite、vite-plugin-vue-devtools
- 状态管理：Pinia（持久化：pinia-plugin-persistedstate）
- 路由：vue-router
- 网络：axios、EventSource Polyfill
- 可视化：Chart.js、ECharts（vue-chartjs、vue-echarts）
- 代码规范：ESLint、Prettier

package.json 关键依赖：
- vue ^3.5.x、vue-router ^4.5.x、pinia ^3.x
- axios ^1.10.x
- chart.js ^4.5.x、echarts ^5.6.x
- vite ^7.x、@vitejs/plugin-vue

## 开发环境要求

- Node.js ≥ 18（建议使用 LTS 版本）
- npm ≥ 9（或使用 pnpm/yarn，自行替换命令）

## 本地开发

1. 安装依赖
   ```bash
   npm install
   ```

2. 启动开发服务器（默认端口：5173）
   ```bash
   npm run dev
   ```

3. 构建生产包
   ```bash
   npm run build
   ```

4. 预览构建产物
   ```bash
   npm run preview
   ```

5. 代码检查与格式化
   ```bash
   npm run lint
   npm run format
   ```

## 与后端联调

本项目在 `vite.config.js` 配置了开发代理，将以 `/api` 开头的请求转发到后端：

```js
// 片段：vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      // 如后端有自定义 Context Path，可按需开启 rewrite
      // rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

- 请确保本地已启动后端（默认端口 8080）
- 前端请求请以 `/api` 为前缀，避免跨域问题（生产部署时由网关/反向代理处理）

## 目录结构（简要）

- `src/` 前端源码目录（组件、路由、状态、API 封装等）
- `public/` 静态资源目录
- `index.html` 应用入口页面
- `eslint.config.js`、`.prettierrc.json` 代码规范配置
- `vite.config.js` 构建与开发代理配置

## 环境变量（可选）

如需区分不同环境的接口地址或开关特性，可使用 Vite 环境文件：
- `.env.development`、`.env.production` 等
- 变量需以 `VITE_` 前缀，例如：`VITE_API_BASE=/api`

示例（如你希望在代码中通过 import.meta.env 使用）：
```
VITE_API_BASE=/api
```

## 部署建议

- 生产环境建议通过 Nginx/Apache 等静态服务器托管 `dist/`
- 结合后端部署，使用同域名的反向代理将 `/api` 转发至后端服务，避免跨域

## 常见问题

- 端口占用：修改 `package.json` 的 `dev` 命令或 `vite.config.js` 的服务器配置
- 接口 404/跨域：核对后端地址、代理规则、请求是否带 `/api` 前缀
- 图表不显示：确认数据格式与组件挂载时机，检查控制台错误
