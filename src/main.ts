import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";

import './assets/style/index.scss'
// el-message样式
import 'element-plus/es/components/message/style/css'

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia)

app.mount('#app')
