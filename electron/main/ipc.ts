
import { app, ipcMain, dialog, shell } from 'electron'
import { saveCategoryList, getCategoryList } from './store'
import { getFileDetail, getImageDetail } from '../utils/file'
import { softwareDialog } from './index'

async function handleFileOpen(e, options = { type: '' }) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: '选择文件',
        properties: ['openFile', 'multiSelections'],
        ...options
    })

    if (!canceled) {
        if (options.type === 'image') return getImageDetail(filePaths)
        return getFileDetail(filePaths)
    }
}

export default function () {
    ipcMain.handle('dialog:openFile', handleFileOpen)

    ipcMain.handle('drag-file-into', (event, filePaths) => {
        return getFileDetail(filePaths)
    })

    ipcMain.on('open-file', (event, filePath) => {
        if (filePath) shell.openPath(filePath)
    })

    // 持久化存储数据
    ipcMain.on('set-category-list', (event, data) => {
        saveCategoryList(data)
        softwareDialog.webContents.send('category-list-change', data)
    })

    ipcMain.handle('get-category-list', () => {
        return getCategoryList()
    })
}
