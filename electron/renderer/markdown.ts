import { ipcMain, dialog, BrowserWindow } from 'electron';
import initNotification from './notification';

import fs from 'fs-extra';
import dayjs from 'dayjs';
import path from 'node:path';
import { VITE_DEV_SERVER_URL } from '../config';

// 持久化
import Store from 'electron-store';

const store = new Store();

const { renderMyNotificationPopup } = initNotification();

const initMarkdown = async () => {
  const markdown = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'vite.svg'),
    minWidth: 1000,
    minHeight: 800,
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
    await markdown.loadURL(VITE_DEV_SERVER_URL);
  } else {
    await markdown.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // 开发者工具
  markdown.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      event.preventDefault();
      markdown?.webContents.openDevTools();
    }
    if (input.key === 'Ctrl+S') {
      event.preventDefault();
      markdown?.webContents.send('saveMarkdown');
    }
  });

  markdown.on('close', event => {
    event.preventDefault();
    markdown?.hide();
  });

  // 窗口控制事件
  ipcMain.on('expandWindow', (_IpcMainEvent, flag: boolean) => {
    markdown?.setFullScreen(flag);
  });

  ipcMain.on('closeWindow', () => {
    markdown?.hide();
  });

  ipcMain.on('minimizeWindow', () => {
    markdown?.minimize();
  });

  // 窗口移动
  let throttleTimer: number | null | ReturnType<typeof setTimeout> = null;

  ipcMain.on('start-dragging', (_IpcMainEvent, { deltaX, deltaY }) => {
    if (!throttleTimer) {
      // 当接收到渲染进程发送的 'start-dragging' 事件时，更新窗口位置
      const bounds = markdown?.getBounds();
      markdown?.setPosition(bounds?.x + deltaX, bounds?.y + deltaY);
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 5);
    }
  });

  const saveMarkdown = async (text: string) => {
    let path = {
      filePath: '',
    };

    if (store.get('lastSavePath')) {
      path.filePath = store.get('lastSavePath') as string;
    } else {
      Object.assign(
        path,
        await dialog.showSaveDialog({
          defaultPath: 'markdown.md',
          filters: [{ name: 'Markdown Files', extensions: ['md'] }],
        }),
      );
      store.set('lastSavePath', path.filePath);
    }
    try {
      await fs.writeFile(path.filePath as string, text);
      renderMyNotificationPopup({
        title: '保存成功',
        message: `保存路径为: ${path.filePath}`,
        time: dayjs().format('HH:mm:ss'),
        type: 'warning',
      });
    } catch (e) {
      renderMyNotificationPopup({
        title: '保存失败',
        message: `错误信息: ${e}`,
        time: dayjs().format('HH:mm:ss'),
        type: 'error',
      });
    }
  };

  ipcMain.on('saveMarkdown', async (_event, text) => {
    await saveMarkdown(text);
  });

  return markdown;
};

export default initMarkdown;
