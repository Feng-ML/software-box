export declare type ISetting = {
  theme: 'light' | 'dark',
  isAutoStartup: boolean,
  isOpenAtStartup: boolean,
  isShowTrayIcon: boolean,

  isShowSoftwareName: boolean,

  isBallShow: boolean,
  isBallAlwaysOnTop: boolean,
  ballTransparency: number,
  ballContent: 'icon' | 'time' | 'clock',

  dialogTransparency: number
}

export declare type IShortcut = {
  [key: string]: any,
  showMainWin,
  showSoftwareDialog,
  showFloatingBall
}