
import { app, ipcMain, dialog, shell } from 'electron'
import { saveStore, getStore } from './store'
import { getFileDetail, getImageDetail } from '../utils/file'
import { softwareDialog } from './index'

export default function () {
    // 文件选择
    ipcMain.handle('dialog:openFile', async (e, options = { type: '' }) => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            title: '选择文件',
            properties: ['openFile', 'multiSelections'],
            ...options
        })

        if (!canceled) {
            if (options.type === 'image') return getImageDetail(filePaths)
            return getFileDetail(filePaths)
        }
    })

    // 拖拽添加文件
    ipcMain.handle('drag-file-into', (event, filePaths) => {
        return getFileDetail(filePaths)
    })

    // 打开文件
    ipcMain.on('open-file', (event, filePath) => {
        if (filePath) shell.openPath(filePath)
    })

    // 软件列表数据
    ipcMain.on('set-category-list', (event, data) => {
        saveStore('categoryList', data)
        softwareDialog.webContents.send('refresh-page')
    })
    ipcMain.handle('get-category-list', () => {
        return getStore('categoryList')
    })
}
