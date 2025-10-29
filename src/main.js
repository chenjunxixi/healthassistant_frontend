import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 导入插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建 pinia 实例
const pinia = createPinia()
// 使用插件
pinia.use(piniaPluginPersistedstate)

// 将 pinia 实例应用到 app
app.use(pinia)
app.use(router)

app.mount('#app')
