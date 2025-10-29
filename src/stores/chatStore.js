import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid' // 用于生成唯一ID

// 导入 EventSource polyfill 以获得更好的浏览器兼容性
import { EventSourcePolyfill } from 'event-source-polyfill'

export const useChatStore = defineStore('chat', {
  // --- STATE ---
  // 核心状态：从管理单一 messages 数组，升级为管理一个 conversations 数组
  state: () => ({
    conversations: [], // 所有对话的列表. e.g., [{ id, title, messages: [] }]
    activeConversationId: null, // 当前激活的对话ID
    isLoading: false, // 是否正在等待AI响应
    eventSource: null, // 用于管理SSE连接
  }),

  // --- GETTERS ---
  getters: {
    // 这个 getter 直接依赖 state 的属性，所以保留 (state) 参数
    activeConversation(state) {
      if (!state.activeConversationId) return null
      return state.conversations.find((c) => c.id === state.activeConversationId)
    },

    // 【修正】这个 getter 的逻辑依赖于上面的 activeConversation getter，
    // 它通过 `this` 来调用，所以它不需要 (state) 参数。我们直接移除它。
    activeMessages() {
      const activeConvo = this.activeConversation // 'this' 指向 store 实例
      return activeConvo ? activeConvo.messages : []
    },

    // 这个 getter 也直接依赖 state，所以保留 (state) 参数
    historicalConversations(state) {
      return state.conversations.map(({ id, title }) => ({ id, title })).reverse()
    },
  },

  // --- ACTIONS ---
  actions: {
    /**
     * 初始化 Store，从 localStorage 加载数据或创建新对话
     */
    initStore() {
      const savedState = localStorage.getItem('chatState')
      if (savedState) {
        const { conversations, activeConversationId } = JSON.parse(savedState)
        this.conversations = conversations
        this.activeConversationId = activeConversationId
      }
      // 如果没有历史记录，或者激活的ID无效，则创建一个新的
      if (!this.conversations.length || !this.activeConversation) {
        this.startNewConversation()
      }
    },

    /**
     * 持久化当前状态到 localStorage
     */
    _saveState() {
      const stateToSave = {
        conversations: this.conversations,
        activeConversationId: this.activeConversationId,
      }
      localStorage.setItem('chatState', JSON.stringify(stateToSave))
    },

    /**
     * 开始一个新对话
     */
    startNewConversation() {
      // 如果当前对话是空的，并且不是默认的第一个，则不创建新的
      if (
        this.activeConversation &&
        this.activeConversation.messages.length === 0 &&
        this.conversations.length > 1
      ) {
        return
      }

      const newConversation = {
        id: uuidv4(),
        title: '新的对话',
        messages: [],
      }
      this.conversations.push(newConversation)
      this.activeConversationId = newConversation.id
      this._saveState()
    },

    /**
     * 切换到指定的对话
     * @param {string} conversationId
     */
    switchConversation(conversationId) {
      this.activeConversationId = conversationId
      this._saveState()
    },

    /**
     * 发送问题并处理SSE流 (原 startQuestion 方法的升级版)
     * @param {string} question - 用户提出的问题
     * @param {string} token - 用户认证 token
     * @param {function} onStreamEnd - SSE结束后要执行的回调函数 (例如滚动)
     */
    async sendMessage(question, token, onStreamEnd) {
      if (!question.trim() || this.isLoading) return

      this.isLoading = true

      // 1. 将用户消息添加到当前对话
      const userMessage = { role: 'user', content: question }
      this.activeConversation.messages.push(userMessage)

      // 2. 如果是新对话的第一条消息，自动生成标题
      if (this.activeConversation.messages.length === 1) {
        this.activeConversation.title =
          question.substring(0, 20) + (question.length > 20 ? '...' : '')
      }

      // 3. 准备AI消息占位符
      const aiMessage = { role: 'ai', content: '' }
      this.activeConversation.messages.push(aiMessage)

      // --- SSE 请求逻辑 ---
      const url = `/api/ai/chat/sse`
      this.eventSource = new EventSourcePolyfill(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: this.activeConversation.messages.slice(0, -1), // 发送除AI占位符外的所有消息
        }),
      })

      this.eventSource.onmessage = (event) => {
        const data = event.data
        if (data === '[DONE]') {
          // AI响应结束
          this.isLoading = false
          this.eventSource.close()
          this.eventSource = null
          this._saveState() // 对话结束后保存状态
          onStreamEnd?.() // 调用回调
          return
        }
        // 将收到的数据块追加到AI消息内容中
        this.activeConversation.messages[this.activeConversation.messages.length - 1].content +=
          data
      }

      this.eventSource.onerror = (err) => {
        console.error('EventSource failed:', err)
        this.activeConversation.messages[this.activeConversation.messages.length - 1].content =
          '抱歉，发生了一个错误，请稍后再试。'
        this.isLoading = false
        this.eventSource.close()
        this.eventSource = null
        this._saveState() // 出错后也保存状态
      }
    },
  },
})
