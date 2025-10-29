<template>
  <div class="record-container">
    <h1>记录您的健康数据</h1>
    <p v-if="message" :class="['message', messageType]">{{ message }}</p>

    <div class="record-card">
      <h2>记录热量摄入</h2>
      <form @submit.prevent="handleSaveCalories">
        <div class="form-group">
          <label for="food-name">食物名称</label>
          <input
            id="food-name"
            v-model="calorieInput.foodName"
            type="text"
            placeholder="例如: 米饭一碗"
            required
          />
        </div>
        <div class="form-group">
          <label for="calories">摄入热量 (千卡)</label>
          <input
            id="calories"
            v-model.number="calorieInput.calories"
            type="number"
            placeholder="例如: 500"
            required
          />
        </div>
        <button type="submit">保存热量</button>
      </form>
    </div>

    <div class="record-card">
      <h2>记录今日锻炼</h2>
      <form @submit.prevent="handleSaveExercise">
        <div class="form-group">
          <label for="exercise-name">锻炼名称</label>
          <input
            id="exercise-name"
            v-model="exerciseInput.type"
            type="text"
            placeholder="例如: 跑步"
            required
          />
        </div>
        <div class="form-group">
          <label for="exercise-duration">锻炼时长 (分钟)</label>
          <input
            id="exercise-duration"
            v-model.number="exerciseInput.durationMinutes"
            type="number"
            placeholder="例如: 30"
            required
          />
        </div>
        <button type="submit">保存锻炼</button>
      </form>
    </div>

    <div class="record-card">
      <h2>记录今日睡眠</h2>
      <form @submit.prevent="handleSaveSleep">
        <div class="form-group">
          <label for="sleep-duration">睡眠时长 (小时)</label>
          <input
            id="sleep-duration"
            v-model.number="sleepInput.durationHours"
            type="number"
            step="0.1"
            placeholder="例如: 7.5"
            required
          />
        </div>
        <button type="submit">保存睡眠</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import healthService from '@/api/healthService.js'

// 用于显示成功或失败消息
const message = ref('')
const messageType = ref('') // 'success' or 'error'

// 为每个表单创建响应式数据对象
const calorieInput = ref({ foodName: '', calories: null })
const exerciseInput = ref({ type: '', durationMinutes: null })
const sleepInput = ref({ durationHours: null })

// 显示反馈消息并自动隐藏
const showMessage = (text, type, duration = 3000) => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, duration)
}

// 处理保存热量的逻辑
const handleSaveCalories = async () => {
  if (
    !calorieInput.value.foodName ||
    !calorieInput.value.calories ||
    calorieInput.value.calories <= 0
  ) {
    showMessage('请填写完整的食物名称和有效的热量值！', 'error')
    return
  }
  try {
    await healthService.saveCalorieRecord(calorieInput.value)
    showMessage('热量记录保存成功！', 'success')
    calorieInput.value = { foodName: '', calories: null } // 清空输入框
  } catch (error) {
    showMessage('保存失败，请稍后重试。', 'error')
    console.error('保存热量失败:', error)
  }
}

// 处理保存锻炼的逻辑
const handleSaveExercise = async () => {
  if (
    !exerciseInput.value.type ||
    !exerciseInput.value.durationMinutes ||
    exerciseInput.value.durationMinutes <= 0
  ) {
    showMessage('请填写完整的锻炼信息！', 'error')
    return
  }
  try {
    await healthService.saveExerciseRecord(exerciseInput.value)
    showMessage('锻炼记录保存成功！', 'success')
    exerciseInput.value = { type: '', durationMinutes: null } // 清空输入框
  } catch (error) {
    showMessage('保存失败，请稍后重试。', 'error')
    console.error('保存锻炼失败:', error)
  }
}

// 处理保存睡眠的逻辑
const handleSaveSleep = async () => {
  if (!sleepInput.value.durationHours || sleepInput.value.durationHours <= 0) {
    showMessage('请输入有效的睡眠时长！', 'error')
    return
  }
  try {
    await healthService.saveSleepRecord(sleepInput.value)
    showMessage('睡眠记录保存成功！', 'success')
    sleepInput.value.durationHours = null // 清空输入框
  } catch (error) {
    showMessage('保存失败，请稍后重试。', 'error')
    console.error('保存睡眠失败:', error)
  }
}
</script>

<style scoped>
.record-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.record-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.record-card h2 {
  margin-top: 0;
  color: #34495e;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

.message {
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #fff;
}

.message.success {
  background-color: #2ecc71;
}

.message.error {
  background-color: #e74c3c;
}
</style>
