import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";

import './assets/style/index.scss'
// el-message样式
import 'element-plus/es/components/message/style/css'
// element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia = createPinia()

// 注册图标
export const iconNames = Object.keys(ElementPlusIconsVue)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).use(pinia)

app.mount('#app')
