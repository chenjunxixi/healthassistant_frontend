import apiClient from './axios' // 导入我们配置好的Axios实例

export default {
  // --- 获取数据 ---
  getCalorieHistory() {
    return apiClient.get('/calories')
  },
  getExerciseHistory() {
    return apiClient.get('/exercises')
  },
  getSleepHistory() {
    return apiClient.get('/sleep')
  },
  getLatestBodyMetrics() {
    return apiClient.get('/bodymetrics/latest')
  },
  getBodyMetricsHistory() {
    return apiClient.get('/bodymetrics/history')
  },

  // --- 保存数据 ---

  /**
   * 保存一条新的热量记录
   * @param {object} calorieData - e.g., { "foodName": "米饭", "calories": 500 }
   */
  saveCalorieRecord(calorieData) {
    return apiClient.post('/calories', calorieData)
  },

  /**
   * 保存一条新的锻炼记录
   * @param {object} exerciseData - e.g., { "type": "跑步", "durationMinutes": 30 }
   */
  saveExerciseRecord(exerciseData) {
    return apiClient.post('/exercises', exerciseData)
  },

  /**
   * 保存一条新的睡眠记录
   * @param {object} sleepData - e.g., { "durationHours": 8 }
   */
  saveSleepRecord(sleepData) {
    return apiClient.post('/sleep', sleepData)
  },
}
