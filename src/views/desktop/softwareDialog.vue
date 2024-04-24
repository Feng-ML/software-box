<template>
  <div class="software-dialog">
    <SoftwareBox isDesktop />
  </div>
</template>

<script lang="ts" setup>
import SoftwareBox from '../main/softwareManagement/index.vue'
</script>

<style lang="scss" scoped>
.software-dialog {
  width: 100%;
  height: 100%;

  .software-box {
    width: 100%;
    height: 100%;
    margin: 0;
  }
}
</style>
