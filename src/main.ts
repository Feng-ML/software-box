import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// UI库
import ElementPlus from 'element-plus'
import './style/element.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册图标
export const iconNames = Object.keys(ElementPlusIconsVue)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
    .use(ElementPlus)

app.mount('#app')
