<template>
  <div class="card setting-page">
    <div class="setting-title">基本设置</div>
    <div class="setting-row">
      <span>主题</span>
      <el-segmented v-model="setting.theme" :options="options">
        <template #default="{ item }">
          <div class="segmented-item">
            <el-icon size="20">
              <component :is="item.icon" />
            </el-icon>
          </div>
        </template>
      </el-segmented>
    </div>
    <div class="setting-row">
      <span>开机自动启动</span>
      <el-switch v-model="setting.isAutoStartup" />
    </div>
    <div class="setting-row">
      <span>启动打开主窗口</span>
      <el-switch v-model="setting.isOpenAtStartup" />
    </div>
    <div class="setting-row">
      <span>显示托盘图标</span>
      <el-switch v-model="setting.isShowTrayIcon" />
    </div>

    <div class="setting-title">软件管理</div>
    <div class="setting-row">
      <span>显示软件名称</span>
      <el-switch v-model="setting.isShowSoftwareName" />
    </div>
    <div class="setting-row">
      <span>显示软件名称提示</span>
      <el-switch v-model="setting.isShowSoftwareNameTooltip" />
    </div>
    <div class="setting-row">
      <span>图标大小</span>
      <el-slider
        v-model="setting.softwareSize"
        :min="30"
        :max="200"
        :step="10"
        :format-tooltip="(num: number) => num + '%'"
      />
    </div>

    <div class="setting-title">悬浮球</div>
    <div class="setting-row">
      <span>开启悬浮球</span>
      <el-switch v-model="setting.isBallShow" />
    </div>
    <div class="setting-row">
      <span>置顶</span>
      <el-switch v-model="setting.isBallAlwaysOnTop" />
    </div>
    <div class="setting-row">
      <span>透明度</span>
      <el-slider v-model="setting.ballTransparency" :min="20" :step="10" />
    </div>
    <div class="setting-row">
      <span>显示内容</span>
      <el-select v-model="setting.ballContent" placeholder="Select">
        <el-option
          v-for="item in ballContentOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div class="setting-title">软件悬浮窗</div>
    <div class="setting-row">
      <span>背景透明度</span>
      <el-slider v-model="setting.dialogTransparency" :step="10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import settingStore from '@/stores/setting'
import { Sunny, Moon } from '@element-plus/icons-vue'

const setting = settingStore().setting

const options = [
  {
    label: 'light',
    value: 'light',
    icon: Sunny
  },
  {
    label: 'dark',
    value: 'dark',
    icon: Moon
  }
]

const ballContentOptions = [
  {
    label: '图标',
    value: 'icon'
  },
  {
    label: '电子表',
    value: 'time'
  },
  {
    label: '时钟',
    value: 'clock'
  }
]
</script>

<style lang="scss">
.setting-page {
  padding: 20px;
  margin: 12px 12px 12px 0;
  flex: 1;
  overflow: auto;

  .setting-title {
    font-size: var(--el-font-size-large);
    margin-bottom: 20px;
    margin-top: 40px;
    color: var(--el-color-primary);

    &:first-child {
      margin-top: 0px;
    }
  }

  .setting-row {
    margin-left: 20px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--el-font-size-base);
  }

  .segmented-item {
    display: flex;
  }

  .el-segmented {
    --el-border-radius-base: 16px;
  }

  .el-slider,
  .el-select {
    width: 200px;
  }
}
</style>
