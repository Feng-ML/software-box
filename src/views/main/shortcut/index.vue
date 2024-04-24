<template>
  <div class="card shortcut-page">
    <div class="flex-center shortcut-row" v-for="(item, index) in shortcutList">
      <span>{{ item.name }}</span>
      <el-input
        v-model="shortcutMap[item.key]"
        style="width: 240px"
        placeholder="Press shortcut"
        readonly
        @focus="focusInput = item.key"
        @blur="focusInput = ''"
      >
        <template #suffix>
          <el-icon class="el-input__icon" @click="shortcutMap[item.key] = ''">
            <CloseBold />
          </el-icon>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, reactive, watch, toRaw } from 'vue'
import type { IShortcut } from '~/types/globalTypes'

const shortcutList = [
  { name: '显示/隐藏主页面', key: 'showMainWin' },
  { name: '显示/隐藏悬浮窗', key: 'showSoftwareDialog' },
  { name: '显示/隐藏悬浮球', key: 'showFloatingBall' }
]

const shortcutMap: IShortcut = reactive({
  showMainWin: '',
  showSoftwareDialog: '',
  showFloatingBall: ''
})
window.ipcRenderer.invoke('get-global-shortcut').then((res) => {
  if (res) Object.assign(shortcutMap, res)
  watch(shortcutMap, (newValue) => {
    window.ipcRenderer.send('set-global-shortcut', toRaw(newValue))
  })
})

let focusInput: string

// 记录快捷键
function recordShortcut(event: KeyboardEvent) {
  if (!focusInput) return

  if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) {
    const shortcut = []
    if (event.ctrlKey) shortcut.push('Ctrl')
    if (event.shiftKey) shortcut.push('Shift')
    if (event.altKey) shortcut.push('Alt')
    if (shortcut.length < 1) return

    shortcut.push(event.key)
    shortcutMap[focusInput] = shortcut.join('+')
  }
}

document.addEventListener('keydown', recordShortcut)
onUnmounted(() => {
  document.removeEventListener('keydown', recordShortcut)
})
</script>

<style lang="scss" scoped>
.shortcut-page {
  flex: 1;
  padding: 20px;
  margin: 12px 12px 12px 0;
}

.shortcut-row {
  justify-content: space-between;
  margin-bottom: 15px;

  .el-input,
  .el-input__icon,
  :deep .el-input__wrapper,
  :deep input {
    cursor: pointer !important;
  }
}
</style>
