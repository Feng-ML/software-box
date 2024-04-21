<template>
  <div id="main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import settingStore from '@/stores/setting'
import { watchEffect } from 'vue'

const store = settingStore()
const setting = store.setting

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', setting.theme)
})
</script>

<style scoped>
#main {
  height: 100vh;
  overflow: hidden;
}
</style>
