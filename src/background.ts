// electron 主进程文件
import { app, BrowserWindow } from 'electron';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,      // 是否可以在渲染进程中使用node的api
            contextIsolation: false,    // 是否启用沙盒
            webSecurity: false,         // 是否启用安全策略(跨域)
        },
    });

    win.webContents.openDevTools();

    if (process.argv[2]) {
        win.loadURL(process.argv[2]).then(() => {
            win.show()
        });
    } else {
        win.loadFile('index.html').then(() => {
            win.show()
        });
    }
};

app.whenReady().then(() => {
    createWindow()
});