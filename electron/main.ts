import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import path from 'node:path';
import { spawn } from 'child_process';
import * as log from 'electron-log';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
let backendProcess: any;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
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
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
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
}

function startBackendService() {
  try {
    let backendPath = '';
    if (VITE_DEV_SERVER_URL) {
      backendPath = path.join(__dirname, '../express/server.js');
    } else {
      backendPath = './express/server.js';
    }
    const backendProcess = spawn('node', [backendPath], {
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
      },
    });
    backendProcess.stdout.on('data', data => {
      log.info(`stdout: ${data}`);
    });

    backendProcess.stderr.on('data', data => {
      log.error(`stderr: ${data}`);
    });

    // 后端服务关闭事件
    backendProcess.on('close', code => {
      log.info(`后端服务已关闭，退出码：${code}`);
    });
  } catch (error) {
    log.error(error);
    renderMyNotificationPopup({
      title: '【错误】',
      message: '后端服务启动失败！请检查机器是否已安装Node环境！',
      type: 'warning',
      time: '',
    });
  }
}

let notificationPopup: BrowserWindow | null = null;

function renderMyNotificationPopup(content: {
  title: string;
  message: string;
  type: string;
  time: string;
}) {
  const { screen } = require('electron');

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

// 渲染弹窗页面
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

// 后台托管
let tray: Tray | null = null;

app.whenReady().then(() => {
  // 控制信息
  log.transports.file.file = path.join(
    path.join(__dirname, '../logs'),
    'error.log',
  );
  log.transports.file.level = 'error';

  try {
    startBackendService();
  } catch (err) {
    log.error(err);
  }

  const icon = nativeImage.createFromPath(
    path.join(process.env.PUBLIC, 'vite.svg'),
  );
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'github',
      type: 'normal',
    },
    {
      label: '测试页面',
      type: 'normal',
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
      click: () => {
        win?.show();
      },
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        win?.destroy();
        tray?.destroy();
        if (process.platform === 'darwin') {
          backendProcess?.kill();
        }
        app.quit();
      },
    },
  ]);

  tray.on('click', () => {
    win?.show();
  });

  tray.setContextMenu(contextMenu);
  tray.setToolTip('macOS-Notifications-In-Windows');
  createWindow();
});
