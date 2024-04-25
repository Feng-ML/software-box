export declare type ISetting = {
  theme: 'light' | 'dark',
  isAutoStartup: boolean,
  isOpenAtStartup: boolean,
  isShowTrayIcon: boolean,
  isBallShow: boolean,
  isBallAlwaysOnTop: boolean,
  transparency: number
}

export declare type IShortcut = {
  [key: string]: any,
  showMainWin,
  showSoftwareDialog,
  showFloatingBall
}