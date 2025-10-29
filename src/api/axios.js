// src/api/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建一个Axios实例
const apiClient = axios.create({
  // 设置我们后端API的基础URL
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 创建一个请求拦截器 (Request Interceptor)
// 这是一个魔法：在每次请求被发送出去之前，都会先执行这里的代码
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token // 从Pinia store中获取token

    if (token) {
      // 如果token存在，就在请求头中添加 Authorization
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

export default apiClient
