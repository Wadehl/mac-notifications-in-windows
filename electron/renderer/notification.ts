import { BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { VITE_DEV_SERVER_URL } from '../config';

interface RenderContent {
  title: string;
  message: string;
  type: string;
  time: string;
}

function initNotification(): {
  renderMyNotificationPopup: (content: RenderContent) => void;
} {
  let notificationPopup: BrowserWindow | null = null;
  function renderMyNotificationPopup(content: RenderContent) {
    const { width } = screen.getPrimaryDisplay().workAreaSize;

    const offsetX = width - 370;

    notificationPopup = new BrowserWindow({
      width: 500,
      height: 200,
      // useContentSize: true,
      x: offsetX,
      y: 30,
      frame: false,
      transparent: true,
      icon: path.join(process.env.PUBLIC, 'icon.png'),
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true, // 允许在渲染进程中使用node api
        contextIsolation: false, // 关闭渲染进程的沙箱模式
        webSecurity: false, // 允许跨域请求
        // preload: path.join(__dirname, 'preload.js'),
      },
    });
    notificationPopup.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') {
        event.preventDefault();
        notificationPopup?.webContents.openDevTools();
      }
    });

    if (VITE_DEV_SERVER_URL) {
      notificationPopup.loadURL(
        `${VITE_DEV_SERVER_URL}/#/notification?customMessage=${content.message}&customTitle=${content.title}&type=${content.type}&time=${content.time}`,
      );
    } else {
      notificationPopup.loadFile(path.join(process.env.DIST, 'index.html'), {
        hash: 'notification',
        query: {
          customMessage: content.message,
          customTitle: content.title,
          type: content.type,
          time: content.time,
        },
      });
    }
  }

  // 渲染弹窗页面;
  ipcMain.on('customRenderMessage', (_IpcMainEvent, content) => {
    if (notificationPopup) {
      notificationPopup.destroy();
      notificationPopup = null;
    }
    renderMyNotificationPopup(content);
  });

  ipcMain.on('destroyNotificationPopup', () => {
    notificationPopup?.destroy();
    notificationPopup = null;
  });

  return { renderMyNotificationPopup };
}

export default initNotification;
