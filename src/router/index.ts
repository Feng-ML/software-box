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
          path: 'User',
          name: '个人中心',
          component: () => import('@/views/main/user/index.vue'),
          redirect: '/user/setting',
          children: [
            {
              path: 'setting',
              name: '设置',
              component: () => import('@/views/main/user/setting/index.vue')
            },
          ]
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
          component: () => import('@/views/desktop/floatingBall.vue')
        },
        {
          path: 'software-management',
          name: '软件管理悬浮',
          component: () => import('@/views/main/softwareManagement/index.vue')
        }
      ]
    }
  ]
})

export default router
