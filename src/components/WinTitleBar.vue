<template>
  <div class="win-title-bar">
    <img draggable="false" src="@/../public/favicon.ico" alt="" />
    <span>软件助手</span>
    <div class="win-tool">
      <el-icon @click="winToolClick('mini')">
        <SemiSelect />
      </el-icon>
      <!-- <el-icon @click="winToolClick('max')">
                <FullScreen />
            </el-icon> -->
      <el-icon @click="winToolClick('close')">
        <CloseBold />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
const winToolClick = (type: string) => {
  window.ipcRenderer.send('win-tool-click', type)
}
</script>

<style lang="scss">
.win-title-bar {
  height: var(--title-bar-height);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: drag;

  img {
    width: 30px;
    margin-right: 6px;
  }

  span {
    display: block;
    font-weight: bold;
    font-size: 20px;
  }

  .win-tool {
    // padding: 0 20px;
    position: absolute;
    right: 0;

    .el-icon {
      cursor: pointer;
      margin-right: 20px;
      -webkit-app-region: no-drag;
    }
  }
}
</style>
