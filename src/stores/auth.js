// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // 状态：Token 和用户信息
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user')))

  // Getter：一个计算属性，用于方便地判断用户是否已登录
  const isAuthenticated = computed(() => !!token.value)

  // Action：登录方法
  function login(newToken, userData) {
    user.value = userData
    token.value = newToken
    // 将Token和用户信息存入浏览器的localStorage，以便刷新页面后状态不丢失
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', newToken)
  }

  // Action：登出方法
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, login, logout }
})
