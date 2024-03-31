
import { app, ipcMain, dialog } from 'electron'
import { basename, extname } from 'node:path'
import { saveCategoryList, getCategoryList } from './store'

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: '选择文件',
        properties: ['openFile', 'multiSelections']
    })

    if (!canceled) {
        const allPromises = []
        for (let i = 0; i < filePaths.length; i++) {
            allPromises.push(app.getFileIcon(filePaths[i]))
        }
        return Promise.all(allPromises).then(res => {
            return res.map((item, index) => {
                return {
                    path: filePaths[index],
                    name: basename(filePaths[index], extname(filePaths[index])),
                    icon: item.toDataURL()
                }
            })
        })
    }
}

export default function () {
    ipcMain.handle('dialog:openFile', handleFileOpen)

    // 持久化存储数据
    ipcMain.on('set-category-list', (event, data) => {
        console.log("设置成功", data);

        saveCategoryList(data)
    })

    ipcMain.handle('get-category-list', () => {
        return getCategoryList()
    })
}
