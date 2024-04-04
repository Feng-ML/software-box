
import { app, ipcMain, dialog } from 'electron'
import { basename, extname } from 'node:path'
import { saveCategoryList, getCategoryList } from './store'
import { getFileDetail } from '../utils/file'

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: '选择文件',
        properties: ['openFile', 'multiSelections']
    })

    if (!canceled) {
        return getFileDetail(filePaths)
    }
}

export default function () {
    ipcMain.handle('dialog:openFile', handleFileOpen)

    ipcMain.handle('drag-file-into', (event, filePaths) => {
        return getFileDetail(filePaths)
    })

    // 持久化存储数据
    ipcMain.on('set-category-list', (event, data) => {
        saveCategoryList(data)
    })

    ipcMain.handle('get-category-list', () => {
        return getCategoryList()
    })
}
