<template>
  <main>
    <div id="menu">
      <BasicMenu />
    </div>

    <div id="content">
      <BoxContent />
    </div>
  </main>
</template>

<script lang="ts" setup>
import BasicMenu from "@/components/BasicMenu.vue"
import BoxContent from "./boxContent.vue"
</script>

<style scoped lang="scss">
main {
  display: flex;
  width: 100%;
  height: 100%;
}

#content {
  flex: 1;
  // background-color: aquamarine;
}
</style>