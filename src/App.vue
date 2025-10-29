<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  // 调用 store 中的 logout action
  authStore.logout()
  // 【优化】使用自定义模态框或提示组件代替 alert
  // alert('您已成功退出登录！')
  // 跳转到登录页面
  router.push('/login')
}
</script>

<template>
  <!-- 【新增】一个flex容器包裹整个应用 -->
  <div class="app-container">
    <header>
      <div class="wrapper">
        <h1 class="app-title">健康助手</h1>

        <nav>
          <div v-if="authStore.isAuthenticated" class="nav-links">
            <span class="welcome-msg">欢迎, {{ authStore.user?.username }}</span>
            <RouterLink to="/">首页</RouterLink>
            <RouterLink to="/qna">AI问答</RouterLink>
            <RouterLink to="/dashboard">仪表盘</RouterLink>
            <router-link to="/record-data">记录数据</router-link>
            <a @click="handleLogout" class="logout-link">退出</a>
          </div>
          <div v-else class="nav-links">
            <RouterLink to="/login">登录</RouterLink>
            <RouterLink to="/register">注册</RouterLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- 【新增】一个main标签包裹路由视图，用于撑开剩余空间 -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<!-- 【重要】这里的<style>标签没有 "scoped"，因为我们需要应用一些全局布局样式 -->
<style>
/* 1. 全局样式，确保页面基础占满屏幕且无外边距 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* 禁止body级别的滚动 */
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

/* 2. 应用容器，设置为flex布局 */
.app-container {
  display: flex;
  flex-direction: column; /* 垂直方向排列 */
  height: 100vh; /* 占满整个视口高度 */
  width: 100vw;
}

/* 3. 主内容区域，让它自动填满剩余空间 */
.main-content {
  flex-grow: 1; /* 这是撑开的关键 */
  overflow-y: auto; /* 如果内容溢出，让这个区域自己滚动 */
  /* 当切换到非AI问答页时，如果内容过长，滚动会在这里发生，而不是整个页面 */
}

/* --- 以下是您原有的header样式，我只在header选择器中加了一行 --- */

header {
  flex-shrink: 0; /* 【新增】防止header在flex布局中被压缩 */
  line-height: 1.5;
  border-bottom: 1px solid #e2e2e2;
  background-color: #fff; /* 建议为header添加背景色 */
  position: relative; /* 解决z-index可能出现的问题 */
  z-index: 10;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1280px; /* 您可以根据需要调整最大宽度 */
  margin: 0 auto;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

nav {
  width: auto;
  font-size: 1rem;
  text-align: right;
}

nav a,
.logout-link {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  cursor: pointer;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s;
}

nav a:first-of-type {
  border: 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:hover,
.logout-link:hover {
  color: hsla(160, 100%, 37%, 1);
}

.welcome-msg {
  padding-right: 1rem;
  font-weight: bold;
  color: #333;
}
</style>
