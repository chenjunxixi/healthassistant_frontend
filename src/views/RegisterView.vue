<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
  errorMessage.value = ''
  if (password.value.length < 6) {
    errorMessage.value = '密码长度不能少于6位'
    return
  }
  try {
    await axios.post('http://localhost:8080/api/auth/register', {
      username: username.value,
      password: password.value,
    })
    alert('注册成功！现在您可以去登录了。')
    router.push('/login') // 注册成功后跳转到登录页
  } catch (error) {
    errorMessage.value = error.response ? error.response.data : '注册失败，请稍后再试。'
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="title">用户注册</h1>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" placeholder="请输入用户名" required />
        </div>
        <div class.input-group>
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入至少6位密码"
            required
          />
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="register-button">注册</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 您可以复用LoginView中的样式，或者自定义 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f0f2f5;
}
.register-box {
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
  margin-bottom: 24px;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  margin-bottom: 8px;
}
.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.register-button {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.error-message {
  color: red;
  text-align: center;
  margin-bottom: 16px;
}
</style>
