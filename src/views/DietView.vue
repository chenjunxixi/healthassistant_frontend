<!-- <script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { recognizeFoodApi } from '@/api/healthService.js'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

// 组件化建议：导入侧边栏组件
// import NutritionSummary from '@/components/diet/NutritionSummary.vue';
import RecentHistory from '@/components/diet/RecentHistory.vue'
// import HealthTips from '@/components/diet/HealthTips.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// --- 状态管理 ---
const selectedFile = ref(null)
const previewUrl = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const recognitionResult = ref(null) // 存储完整的识别响应

const fileInput = ref(null)

// --- 计算属性 ---
const foodInfo = computed(() => recognitionResult.value?.foodInfo)
const uploadedImageUrl = computed(() => recognitionResult.value?.uploadedImageUrl)

// --- 方法 ---
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = '图片文件不能超过5MB'
    return
  }
  const validTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    errorMessage.value = '请选择有效的图片文件（JPG, PNG, GIF）'
    return
  }

  errorMessage.value = ''
  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => (previewUrl.value = e.target.result)
  reader.readAsDataURL(file)
}

const triggerFileInput = () => fileInput.value.click()

const resetUpload = () => {
  selectedFile.value = null
  previewUrl.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const submitRecognition = async () => {
  if (!selectedFile.value) {
    errorMessage.value = '请先选择一张图片'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  recognitionResult.value = null

  const formData = new FormData()
  formData.append('foodImage', selectedFile.value)

  try {
    const response = await recognizeFoodApi(formData)
    recognitionResult.value = response.data
    successMessage.value = response.data.success
  } catch (error) {
    errorMessage.value = error.response?.data?.error || '识别失败，请稍后再试。'
  } finally {
    isLoading.value = false
  }
}

// --- 图表数据 (示例) ---
const chartData = reactive({
  labels: ['蛋白质', '碳水化合物', '脂肪'],
  datasets: [
    {
      backgroundColor: ['#007bff', '#28a745', '#ffc107'],
      data: [68, 180, 45],
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}
</script>

<template>
  <div class="row">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <i class="fas fa-camera me-2"></i><strong>智能食物识别</strong>
        </div>
        <div class="card-body">
          <div v-if="errorMessage" class="alert alert-error-custom">
            <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success-custom">
            <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
          </div>

          <form @submit.prevent="submitRecognition">
            <div class="upload-area" @click="!previewUrl && triggerFileInput()">
              <div v-if="!previewUrl">
                <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                <h5>点击或拖拽上传食物图片</h5>
                <p class="text-muted">支持 JPG、PNG、GIF 格式，最大 5MB</p>
                <input
                  ref="fileInput"
                  type="file"
                  class="d-none"
                  @change="handleFileChange"
                  accept="image/*"
                />
              </div>
              <div v-else>
                <img :src="previewUrl" class="preview-image" alt="预览图片" />
                <div class="mt-3">
                  <button
                    type="button"
                    class="btn btn-outline-secondary me-2"
                    @click.stop="resetUpload"
                  >
                    <i class="fas fa-times me-1"></i>重新选择
                  </button>
                  <button type="submit" class="btn btn-success btn-lg" :disabled="isLoading">
                    <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-search'"></i>
                    {{ isLoading ? '正在识别...' : '开始识别' }}
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div v-if="foodInfo" class="result-card">
            <h4 class="mb-4"><i class="fas fa-utensils me-2 text-primary"></i>识别结果</h4>
            <div class="row">
              <div class="col-md-4 text-center">
                <img :src="uploadedImageUrl" class="preview-image" alt="上传的食物图片" />
              </div>
              <div class="col-md-8">
                <h3 class="text-primary mb-3">{{ foodInfo.name }}</h3>
                <div class="mb-4">
                  <span class="calorie-badge"
                    ><i class="fas fa-fire me-1"></i>{{ foodInfo.calories }} 大卡</span
                  >
                </div>
                <div class="mb-4">
                  <h6 class="text-muted">识别详情：</h6>
                  <p class="text-dark">{{ foodInfo.description }}</p>
                </div>
                <div class="mt-4">
                  <h5 class="mb-3">营养成分估算</h5>
                  <div class="row">
                    <div class="col-3">
                      <div class="nutrition-item">
                        <div class="text-primary fw-bold fs-5">{{ foodInfo.protein }}g</div>
                        <div class="text-muted small">蛋白质</div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="nutrition-item">
                        <div class="text-success fw-bold fs-5">{{ foodInfo.carbs }}g</div>
                        <div class="text-muted small">碳水化合物</div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="nutrition-item">
                        <div class="text-warning fw-bold fs-5">{{ foodInfo.fat }}g</div>
                        <div class="text-muted small">脂肪</div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="nutrition-item">
                        <div class="text-info fw-bold fs-5">{{ foodInfo.fiber }}g</div>
                        <div class="text-muted small">膳食纤维</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card sidebar-card mb-4">
        <div class="card-header">
          <i class="fas fa-chart-pie me-2"></i><strong>今日营养摄入</strong>
        </div>
        <div class="card-body">
          <div class="stats-card mb-3">
            <div class="stats-number">1,240</div>
            <p class="text-muted mb-2">已摄入卡路里</p>
            <div class="progress-custom">
              <div class="progress-bar-custom" style="width: 65%"></div>
            </div>
            <small class="text-muted">目标: 1,900 大卡 (65%)</small>
          </div>
          <div style="height: 150px">
            <Doughnut :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <RecentHistory />

      <div class="card sidebar-card mt-3">
        <div class="card-header">
          <i class="fas fa-lightbulb me-2"></i><strong>健康小贴士</strong>
        </div>
        <div class="card-body">
          <div class="alert alert-info mb-0">
            <i class="fas fa-info-circle me-2"></i>
            <strong>今日建议：</strong>蛋白质摄入略低，建议增加豆类或乳制品。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 将JSP文件中的<style>标签内的所有CSS内容，原封不动地复制到这里 */
.upload-area {
  border: 2px dashed #007bff;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
}
.upload-area:hover {
  border-color: #0056b3;
  background-color: #e3f2fd;
}
.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}
.result-card {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  margin-top: 20px;
}
.nutrition-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}
.calorie-badge {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
}
.alert-error-custom {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}
.alert-success-custom {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e9ecef;
}
.stats-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
}
.progress-custom {
  height: 15px;
  border-radius: 15px;
  background-color: #e9ecef;
  overflow: hidden;
}
.progress-bar-custom {
  background: linear-gradient(45deg, #28a745, #20c997);
  height: 100%;
}
.sidebar-card {
  height: fit-content;
}
</style> -->
