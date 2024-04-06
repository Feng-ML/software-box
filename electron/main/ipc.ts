
import { app, ipcMain, dialog, shell } from 'electron'
import { saveCategoryList, getCategoryList } from './store'
import { getFileDetail } from '../utils/file'

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: '选择文件',
        properties: ['openFile', 'multiSelections'],
        filters: [
            // { name: 'All Files', extensions: ['*'] },
            { name: 'software', extensions: ['exe', 'lnk'] }
        ]
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

    ipcMain.on('open-file', (event, filePath) => {
        if (filePath) shell.openPath(filePath)
    })

    // 持久化存储数据
    ipcMain.on('set-category-list', (event, data) => {
        saveCategoryList(data)
    })

    ipcMain.handle('get-category-list', () => {
        return getCategoryList()
    })
}
