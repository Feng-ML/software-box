export declare type ISetting = {
  theme: string,
  isAutoStartup: boolean,
  isOpenAtStartup: boolean,
  isShowTrayIcon: boolean,
  isBallShow: boolean,
  isBallAlwaysOnTop: boolean,
}

export declare type IShortcut = {
  [key: string]: any,
  showMainWin,
  showSoftwareDialog,
  showFloatingBall
}