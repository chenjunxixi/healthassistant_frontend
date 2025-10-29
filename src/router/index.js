import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import RecordDataView from '../views/RecordDataView.vue'
// 注意：这里需要从 @/stores/auth 导入 useAuthStore
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/qna',
      name: 'qna',
      component: () => import('../views/AiQnaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/record-data',
      name: 'record-data',
      component: RecordDataView,
      meta: { requiresAuth: true },
    },
    {
      path: '/diet',
      name: 'diet',
      component: () => import('../views/DietView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 这是正确的写法
router.beforeEach((to, from, next) => {
  // 在路由守卫函数内部获取 store 实例
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果需要认证但用户未登录，则重定向到登录页
    next({ name: 'login' })
  } else {
    // 否则，正常放行
    next()
  }
})

export default router
