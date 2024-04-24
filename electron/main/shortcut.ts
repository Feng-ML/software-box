import { ipcMain, globalShortcut } from 'electron'
import { saveStore, getStore } from './store'
import { showOrHideWin, showOrHideSoftwareDialog, showOrHideFloatingBall } from './index'
import type { IShortcut } from '~/types/globalTypes'

let shortcutStore: any = getStore('shortcut') || {}
let shortcutFn: IShortcut = {
  showMainWin: showOrHideWin,
  showSoftwareDialog: showOrHideSoftwareDialog,
  showFloatingBall: showOrHideFloatingBall
}
export function shortcutInit() {
  for (const key in shortcutStore) {
    if (Object.prototype.hasOwnProperty.call(shortcutStore, key)) {
      const element = shortcutStore[key];
      if (element) globalShortcut.register(element, shortcutFn[key])
    }
  }
}
// 监听快捷键变化
function shortcutChange(newValue: IShortcut, oldValue: IShortcut) {
  for (const key in newValue) {
    if (Object.prototype.hasOwnProperty.call(newValue, key)) {
      const newElement = newValue[key];
      const oldElement = oldValue[key];
      if (newElement !== oldElement) {
        if (oldElement && globalShortcut.isRegistered(oldElement)) globalShortcut.unregister(oldElement)
        if (newElement) globalShortcut.register(newElement, shortcutFn[key])
      }
    }
  }
}

// 监听全局快捷键
ipcMain.on('set-global-shortcut', (event, data: IShortcut) => {
  saveStore('shortcut', data)
  shortcutChange(data, shortcutStore)
  shortcutStore = data
})
ipcMain.handle('get-global-shortcut', () => {
  return getStore('shortcut')
})