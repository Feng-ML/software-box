<template>
  <div class="software-dialog" :style="`--card-transparency: ${setting.dialogTransparency / 100}`">
    <SoftwareBox isDesktop />
  </div>
</template>

<script lang="ts" setup>
import SoftwareBox from '../main/softwareManagement/index.vue'
import settingStore from '@/stores/setting'

const setting = settingStore().setting
</script>

<style lang="scss" scoped>
.software-dialog {
  --card-transparency: 0.775;

  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, var(--card-transparency));

  .software-box {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .card {
    background-color: transparent;
    border: none;
  }
}

[data-theme='dark'] .software-dialog {
  background-color: rgba(0, 0, 0, var(--card-transparency)) !important;
}
</style>
