import path from 'node:path';
import { BrowserWindow, ipcMain } from 'electron';

import { VITE_DEV_SERVER_URL } from '../config';

async function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'vite.svg'),
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程中使用node api
      contextIsolation: false, // 关闭渲染进程的沙箱模式
      webSecurity: false, // 允许跨域请求
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
  });

  if (VITE_DEV_SERVER_URL) {
    await win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    await win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
  // 开发者工具
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      event.preventDefault();
      win?.webContents.openDevTools();
    }
  });

  win.on('close', event => {
    event.preventDefault();
    win?.hide();
  });

  // 窗口控制事件
  ipcMain.on('expandWindow', (_IpcMainEvent, flag: boolean) => {
    win?.setFullScreen(flag);
  });

  ipcMain.on('closeWindow', () => {
    win?.hide();
  });

  ipcMain.on('minimizeWindow', () => {
    win?.minimize();
  });

  // 窗口移动
  let throttleTimer: number | null | ReturnType<typeof setTimeout> = null;

  ipcMain.on('start-dragging', (_IpcMainEvent, { deltaX, deltaY }) => {
    if (!throttleTimer) {
      // 当接收到渲染进程发送的 'start-dragging' 事件时，更新窗口位置
      const bounds = win?.getBounds();
      win?.setPosition(bounds?.x + deltaX, bounds?.y + deltaY);
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 5);
    }
  });

  return win;
}

export default createWindow;
