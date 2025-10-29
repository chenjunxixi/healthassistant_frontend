<script setup>
import { ref, onMounted, computed } from 'vue'
import healthService from '@/api/healthService'

// --- ECharts 按需引入 ---
// 1. 核心模块
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
// 2. 需要的图表类型
import { BarChart, LineChart } from 'echarts/charts'
// 3. 需要的组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components'
// 4. Vue-ECharts 组件
import VChart from 'vue-echarts'

// 注册ECharts组件和图表，这样可以减小打包体积
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
])
// --- ECharts 引入结束 ---

// 数据、加载状态和错误信息的响应式变量
const calorieHistory = ref([])
const exerciseHistory = ref([])
const sleepHistory = ref([])
const isLoading = ref(true)
const error = ref(null)

// 获取所有数据的方法 (保持不变)
const fetchAllData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [calorieRes, exerciseRes, sleepRes] = await Promise.all([
      healthService.getCalorieHistory(),
      healthService.getExerciseHistory(),
      healthService.getSleepHistory(),
    ])
    calorieHistory.value = calorieRes.data
    exerciseHistory.value = exerciseRes.data
    sleepHistory.value = sleepRes.data
  } catch (err) {
    error.value = '无法加载健康数据。请确保您已登录或稍后再试。'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// onMounted钩子 (保持不变)
onMounted(() => {
  fetchAllData()
})

// 【核心修改】使用计算属性(computed)来生成ECharts的配置对象
// 当原始数据变化时，图表配置会自动更新

// 热量图表配置
const calorieChartOption = computed(() => {
  // 对数据进行排序和截取
  const sortedData = [...calorieHistory.value].sort((a, b) => a.recordDate - b.recordDate).slice(-7)
  const dates = sortedData.map((r) =>
    new Date(r.recordDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
  )
  const values = sortedData.map((r) => r.calories)

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: '大卡' },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        name: '热量摄入',
      },
    ],
  }
})

// 锻炼图表配置
const exerciseChartOption = computed(() => {
  const sortedData = [...exerciseHistory.value]
    .sort((a, b) => a.recordDate - b.recordDate)
    .slice(-7)
  const dates = sortedData.map((r) =>
    new Date(r.recordDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
  )
  const values = sortedData.map((r) => r.durationMinutes)

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: '分钟' },
    series: [
      {
        data: values,
        type: 'bar',
        name: '锻炼时长',
      },
    ],
  }
})

// 睡眠图表配置
const sleepChartOption = computed(() => {
  const sortedData = [...sleepHistory.value].sort((a, b) => a.recordDate - b.recordDate).slice(-7)
  const dates = sortedData.map((r) =>
    new Date(r.recordDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
  )
  const values = sortedData.map((r) => r.durationHours.toFixed(1))

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: '小时' },
    series: [
      {
        data: values,
        type: 'line',
        name: '睡眠时长',
      },
    ],
  }
})
</script>

<template>
  <div class="dashboard">
    <h1>我的健康数据记录</h1>
    <div v-if="isLoading" class="loading">正在加载数据...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!isLoading && !error" class="grid-container">
      <div class="data-section">
        <h2>热量记录</h2>
        <v-chart class="chart" :option="calorieChartOption" autoresize />
      </div>

      <div class="data-section">
        <h2>锻炼记录</h2>
        <v-chart class="chart" :option="exerciseChartOption" autoresize />
      </div>

      <div class="data-section">
        <h2>睡眠记录</h2>
        <v-chart class="chart" :option="sleepChartOption" autoresize />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
.error {
  color: #d9534f;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}
.data-section {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.data-section h2 {
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
}
/* 【新增】为图表设置一个最小高度 */
.chart {
  height: 300px;
}
</style>
