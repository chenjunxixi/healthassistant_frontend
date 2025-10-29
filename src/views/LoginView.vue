<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // 导入我们的Auth Store
import { useRouter } from 'vue-router' // 导入路由

const username = ref('')
const password = ref('')
const errorMessage = ref('') // 用于显示错误信息

const authStore = useAuthStore() // 获取Auth Store的实例
const router = useRouter() // 获取路由的实例

const handleLogin = async () => {
  errorMessage.value = '' // 重置错误信息
  try {
    // 1. 使用Axios发送POST请求到后端登录接口
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value,
    })

    // 2. 检查响应中是否有token
    if (response.data && response.data.token) {
      // 模拟的用户数据，未来可以从另一个API获取或从token中解析
      const userData = { username: username.value }

      // 3. 调用Pinia store中的login方法，保存token和用户信息
      authStore.login(response.data.token, userData)

      alert('登录成功！')

      // 4. 登录成功后，跳转到首页
      router.push('/')
    } else {
      errorMessage.value = '登录失败，未收到Token。'
    }
  } catch (error) {
    // 5. 如果请求失败，显示错误信息
    console.error('登录失败:', error.response ? error.response.data : error.message)
    errorMessage.value = error.response ? error.response.data : '网络错误，请稍后再试。'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">用户登录</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="login-button">登录</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* ... 样式部分保持不变 ... */
.error-message {
  color: red;
  text-align: center;
  margin-bottom: 16px;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f0f2f5;
}
.login-box {
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}
.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.login-button:hover {
  background-color: #0056b3;
}
</style>
