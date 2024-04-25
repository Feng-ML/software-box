import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/main/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      component: HomeView,
      redirect: '/software-management',
      children: [
        {
          path: 'software-management',
          name: '软件管理',
          component: () => import('@/views/main/softwareManagement/index.vue')
        },
        {
          path: 'setting',
          name: '偏好设置',
          component: () => import('@/views/main/setting/index.vue'),
        },
        {
          path: 'shortcut',
          name: '快捷键',
          component: () => import('@/views/main/shortcut/index.vue'),
        }
      ]
    },
    {
      path: '/desktop',
      name: '桌面挂件',
      children: [
        {
          path: 'floatingBall',
          name: '悬浮球',
          component: () => import('@/views/desktop/floatingBall/index.vue')
        },
        {
          path: 'software-dialog',
          name: '软件管理悬浮',
          component: () => import('@/views/desktop/softwareDialog.vue')
        }
      ]
    }
  ]
})

export default router
