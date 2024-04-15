import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu, nativeImage, screen } from 'electron'
import { release } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ipcHandler from './ipc'

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const appIcon = join(process.env.VITE_PUBLIC, 'favicon.ico')
const appTitle = 'Software-box'

export let win: BrowserWindow | null = null
function createWindow() {
  Menu.setApplicationMenu(null) // null值取消顶部菜单栏
  win = new BrowserWindow({
    title: 'Main window',
    width: 1400,
    height: 800,
    icon: appIcon,
    // frame: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true, // 是否可以在渲染进程中使用node的api

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,  // 是否启用沙盒
      // webSecurity: false,       // 是否启用安全策略(跨域)
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // 右键菜单
  ipcMain.on('show-context-menu', (event) => {
    const template = [
      {
        label: '图标设置',
        click: () => { event.sender.send('context-menu-command', '修改') }
      },
      {
        label: '图标删除',
        click: () => { event.sender.send('context-menu-command', '删除') }
      },
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
  })

  // 关闭窗口最小化托盘
  win.on("close", (event) => {
    if (!isAppQuit) {
      win.hide();
      win.setSkipTaskbar(true);
      event.preventDefault();
    }
  });
}

// 创建系统托盘
let tray
let isAppQuit = false
function createTray() {
  // 托盘图标
  const icon = nativeImage.createFromPath(appIcon)
  tray = new Tray(icon)
  tray.setToolTip(appTitle)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示悬浮球', click: () => {
        floatingBall.show()
        floatingBall.setAlwaysOnTop(true)
      }
    },
    { label: '隐藏悬浮球', click: () => { floatingBall.hide() } },
    { label: '退出', click: () => { isAppQuit = true; app.quit() } }
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide()
      win.setSkipTaskbar(true);
    } else {
      win.show()
      win.setSkipTaskbar(false);
    }
  })
}

// 创建悬浮球
let floatingBall: BrowserWindow | null = null
function createFloatingBall() {
  const ballSize = 60
  const winWidth = ballSize
  const winHeight = ballSize

  floatingBall = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    type: 'toolbar',  //创建的窗口类型为工具栏窗口
    frame: false,  //要创建无边框窗口
    resizable: false, //禁止窗口大小缩放
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload,
      devTools: false //关闭调试工具
    },
    transparent: true, //设置透明
    hasShadow: false, //不显示阴影
    alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
    // backgroundColor: '#eee',
  })

  //通过获取用户屏幕的宽高来设置悬浮球的初始位置
  const [screenWidth, screenHeight] = [screen.getPrimaryDisplay().workAreaSize.width, screen.getPrimaryDisplay().workAreaSize.height]
  floatingBall.setPosition(screenWidth - 160, screenHeight - 320) //设置悬浮球位置
  const routeUrl = '#/desktop/floatingBall'
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    floatingBall.loadURL(url + routeUrl)
  } else {
    floatingBall.loadFile(indexHtml, { hash: routeUrl })
  }

  function setPos(x, y) {
    // 不用setPosition，因为在Win系统下移动窗口尺寸可能会改变
    floatingBall.setBounds({ x, y, width: winWidth, height: winHeight })
  }

  floatingBall.on('close', () => {
    floatingBall = null
  })

  ipcMain.on('ball-move', (e, { x, y }) => {
    setPos(x, y)
  })

  ipcMain.on('ball-moved', (e) => {
    const [left, top] = floatingBall.getPosition()

    // 悬浮球侧边吸附
    if (top <= 0) setPos(left, 0)
    if (top > screenHeight - winHeight) setPos(left, screenHeight - winHeight)
    if (left <= 0) {
      setPos(-winWidth / 2, top)
      floatingBall.webContents.send('adsorb-aside', 'left')
    }
    if (left >= screenWidth - winWidth) {
      setPos(screenWidth - winWidth / 2, top)
      floatingBall.webContents.send('adsorb-aside', 'right')
    }
  })

  ipcMain.on('ball-click', () => {
    const [left, top] = floatingBall.getPosition()
    const leftPos = left < screenWidth / 2 ? left + winWidth + 30 : left - 630
    softwareDialog.setPosition(leftPos, top - 50)
    softwareDialog.show()
  })
}

// 创建软件悬浮框
export let softwareDialog: BrowserWindow | null = null
function createSoftwareDialog() {
  softwareDialog = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    frame: false,  //要创建无边框窗口
    resizable: false, //禁止窗口大小缩放
    maximizable: false,
    minimizable: false,
    alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
    skipTaskbar: true,
    webPreferences: {
      preload,
      devTools: false //关闭调试工具
    }
    // transparent: true, //设置透明
    // hasShadow: false, //不显示阴影
  })

  const routeUrl = '#/desktop/software-management'
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    softwareDialog.loadURL(url + routeUrl)
  } else {
    softwareDialog.loadFile(indexHtml, { hash: routeUrl })
  }

  softwareDialog.on('blur', () => {
    softwareDialog.hide()
  })
}

app.whenReady().then(() => {
  ipcHandler()
  createWindow()
  createTray()
  createFloatingBall()
  createSoftwareDialog()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})


//禁止程序多开
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到win这个窗口
    if (win) {
      win.show();
      win.setSkipTaskbar(false);
      win.focus();
    }
  });
} else {
  app.quit()
}

// New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })