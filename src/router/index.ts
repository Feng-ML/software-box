import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          component: () => import('@/views/softwareManagement/index.vue')
        }
      ]
    },
  ]
})

export default router
