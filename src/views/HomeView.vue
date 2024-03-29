<template>
  <main>
    <div id="menu"><BasicMenu></BasicMenu></div>

    <div id="content">内容区域</div>
  </main>
</template>

<script lang="ts" setup>
import BasicMenu from "@/components/BasicMenu.vue"
</script>

<style scoped lang="scss">
main {
  display: flex;
  width: 100%;
  height: 100%;
}
#content {
  flex: 1;
  background-color: aquamarine;
}
</style>