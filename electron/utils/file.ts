import fs from 'fs';
import { app, nativeImage, shell } from 'electron'
import { basename, extname } from 'node:path'

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
    for (let i = 0; i < filePaths.length; i++) {
        let path = filePaths[i]
        // 处理快捷方式
        if (/\.lnk$/.test(path)) path = filePaths[i] = shell.readShortcutLink(path).target
        allPromises.push(app.getFileIcon(path, { size: 'large' }))
    }
    return Promise.all(allPromises).then(res => {
        return res.map((item, index) => {
            return {
                id: new Date().valueOf().toString() + index,
                path: filePaths[index],
                name: basename(filePaths[index], extname(filePaths[index])),
                icon: item.toDataURL()
            }
        })
    })
}