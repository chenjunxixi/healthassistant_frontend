<template>
  <div class="qna-layout">
    <ChatHistorySidebar />

    <div class="chat-main">
      <div class="chat-container" ref="chatContainer">
        <div v-if="!activeMessages.length" class="welcome-container">
          <div class="welcome-logo">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="#007bff"
              />
              <path
                d="M12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z"
                fill="#007bff"
              />
            </svg>
          </div>
          <h2>随时可以开始提问</h2>
        </div>
        <div
          v-for="(msg, index) in activeMessages"
          :key="index"
          class="message-wrapper"
          :class="msg.role"
        >
          <div class="message-bubble">
            <p>{{ msg.content }}</p>
          </div>
        </div>
      </div>
      <div class="input-area">
        <input
          type="text"
          v-model="question"
          placeholder="输入您关于健康的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading">
          {{ isLoading ? '思考中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chatStore'
import ChatHistorySidebar from '@/components/ChatHistorySidebar.vue' // 导入侧边栏组件

const authStore = useAuthStore()
const chatStore = useChatStore()

// 从 store 中解构出需要用到的状态和 getter，并保持其响应性
const { activeMessages, isLoading, activeConversationId } = storeToRefs(chatStore)

const question = ref('')
const chatContainer = ref(null)

// 页面加载时，初始化 store (会从 localStorage 加载历史记录)
onMounted(() => {
  chatStore.initStore()
})

// 发送消息的函数
const sendMessage = () => {
  if (!question.value.trim()) return

  const token = authStore.token
  // 调用 store 中重构后的 action
  chatStore.sendMessage(question.value, token, scrollToBottom)
  question.value = ''
}

// 滚动到聊天窗口底部的辅助函数
const scrollToBottom = () => {
  // nextTick 确保 DOM 已经更新完毕再执行滚动
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 监听消息列表的变化，每当有新消息时，自动滚动到底部
watch(
  activeMessages,
  () => {
    scrollToBottom()
  },
  { deep: true },
) // deep: true 确保数组内部元素变化也能被监听到

// 监听对话ID的变化，当切换对话时，也自动滚动到底部
watch(activeConversationId, () => {
  scrollToBottom()
})
</script>

<style scoped>
/* 整体布局样式 */
.qna-layout {
  display: flex;
  height: 100%; /* 关键：占满由 App.vue 提供的父容器高度 */
  width: 100%;
  background-color: #fff;
}

/* 主聊天窗口样式 */
.chat-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
}

/* 当没有消息时的欢迎界面样式 */
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}

.welcome-logo {
  margin-bottom: 20px;
  opacity: 0.5;
}

.message-wrapper {
  display: flex;
  margin-bottom: 15px;
}
.message-wrapper.user {
  justify-content: flex-end;
}
.message-wrapper.ai {
  justify-content: flex-start;
}
.message-bubble {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.message-bubble p {
  margin: 0;
  white-space: pre-wrap;
}
.user .message-bubble {
  background-color: #007bff;
  color: white;
}
.ai .message-bubble {
  background-color: #e9ecef;
  color: #333;
}
.input-area {
  flex-shrink: 0; /* 防止输入区域被压缩 */
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}
.input-area input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 16px;
  outline: none;
}
.input-area button {
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.input-area button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
</style>
