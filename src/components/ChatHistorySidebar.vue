<template>
  <div class="sidebar">
    <button class="new-chat-btn" @click="startNewConversation">+ 新的对话</button>
    <div class="history-list">
      <div
        v-for="convo in historicalConversations"
        :key="convo.id"
        class="history-item"
        :class="{ active: convo.id === activeConversationId }"
        @click="switchConversation(convo.id)"
      >
        {{ convo.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()
const { historicalConversations, activeConversationId } = storeToRefs(chatStore)

const startNewConversation = () => {
  chatStore.startNewConversation()
}

const switchConversation = (id) => {
  chatStore.switchConversation(id)
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #f0f4f9;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #e0e0e0;
}
.new-chat-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  margin-bottom: 15px;
}
.new-chat-btn:hover {
  background-color: #f7f7f7;
}
.history-list {
  flex-grow: 1;
  overflow-y: auto;
}
.history-item {
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 5px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-item:hover {
  background-color: #e4eaf1;
}
.history-item.active {
  background-color: #d1dcfb;
  font-weight: 600;
}
</style>
