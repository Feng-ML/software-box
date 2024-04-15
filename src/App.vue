<template>
  <div id="main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
#main {
  height: 100vh;
}
</style>
