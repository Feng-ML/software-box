<template>
  <div class="home">
    <WinTitleBar />

    <div class="home-container">
      <div class="home-menu">
        <BasicMenu :list="routeList" @menuClick="selectMenu" />
      </div>
      <RouterView />
    </div>
  </div>

  <Background />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import WinTitleBar from '@/components/WinTitleBar.vue'
import Background from '@/components/Background.vue'
import BasicMenu from '@/components/BasicMenu.vue'

const router = useRouter()
const routeList = [
  {
    name: '软件管理',
    path: '/software-management',
    icon: 'memo'
  },
  {
    name: '偏好设置',
    path: '/setting',
    icon: 'Tools'
  }
]

const selectMenu = (index: number) => {
  router.push(routeList[index].path || '/')
}
</script>

<style lang="scss">
.home {
  --title-bar-height: 60px;

  height: 100vh;
  width: 100vw;
  // overflow: hidden;
}

.home-container {
  height: calc(100% - var(--title-bar-height));
  display: flex;
}
</style>
