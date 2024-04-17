import fs from 'fs';
import { app, nativeImage, shell, dialog } from 'electron'
import { basename, extname, join } from 'node:path'
import { generateRandomId } from '../utils/common'

const imageUrl = join(app.getAppPath(), 'src/assets/images/')

export const readFile = (path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const readFileInfo = (path: string): Promise<fs.Stats> => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
};

// 根据路径获取文件详情
export const getFileDetail = (filePaths: string[] | string) => {
    if (!Array.isArray(filePaths)) filePaths = [filePaths]

    const allPromises = []
    const allowPaths = []
    const dirIndexs = []
    for (let i = 0; i < filePaths.length; i++) {
        let path = filePaths[i]
        // 处理快捷方式
        try {
            if (/\.lnk$/.test(path)) path = shell.readShortcutLink(path).target
        } catch (error) {
            dialog.showErrorBox('错误', `读取快捷方式失败，请添加文件的原始路径！（${path}）`)
            continue
        }

        // 判断是否为文件夹
        if (fs.statSync(path).isDirectory()) {
            allPromises.push(Promise.resolve(nativeImage.createFromPath(imageUrl + 'directory.png')))
            allowPaths.push(path)
            dirIndexs.push(i)
        } else {
            if (/\.(exe|bat|vbs|url)$/i.test(path)) {
                allPromises.push(app.getFileIcon(path, { size: 'large' }))
                allowPaths.push(path)
            } else {
                dialog.showMessageBox({ type: 'warning', title: '不支持的文件类型', message: `请选择'exe', 'lnk', 'bat', 'vbs', 'url'文件（${path}）` })
            }
        }
    }
    return Promise.all(allPromises).then(res => {
        return res.map((item, index) => {
            return {
                id: generateRandomId(20),
                path: allowPaths[index],
                name: dirIndexs.includes(index) ? basename(allowPaths[index]) : basename(allowPaths[index], extname(allowPaths[index])),
                icon: item.toDataURL(),
                info: fs.statSync(allowPaths[index])
            }
        })
    })
}

// 根据路径获取图片详情
export const getImageDetail = (filePaths: string[] | string) => {
    if (!Array.isArray(filePaths)) filePaths = [filePaths]

    const allPromises = []
    for (let i = 0; i < filePaths.length; i++) {
        let path = filePaths[i]
        allPromises.push(readFileInfo(path))
    }
    return Promise.all(allPromises).then(res => {
        return res.map((item, index) => {
            return {
                name: basename(filePaths[index], extname(filePaths[index])),
                path: filePaths[index],
                info: item,
                img: nativeImage.createFromPath(filePaths[index])
            }
        })
    })
}