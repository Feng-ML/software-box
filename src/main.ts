import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/style/index.scss'
// el-message样式
import 'element-plus/es/components/message/style/css'
// element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册图标
export const iconNames = Object.keys(ElementPlusIconsVue)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)

app.mount('#app')
