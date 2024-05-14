<template>
  <div id="main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import settingStore from '@/stores/setting'

const setting = settingStore().setting

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
