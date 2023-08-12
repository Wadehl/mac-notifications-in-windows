import { app, nativeImage, Tray, Menu } from 'electron';
import type { BrowserWindow } from 'electron';
import path from 'node:path';

function createTray(win: BrowserWindow, service: any, markdown: BrowserWindow) {
  const icon = nativeImage.createFromPath(
    path.join(process.env.PUBLIC, 'vite.svg'),
  );
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'markdown editor👾',
      type: 'normal',
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+M' : 'Alt+Shift+M',
      click: () => {
        markdown?.show();
      },
    },
    {
      label: 'debugger🐝',
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
          service?.kill();
        }
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('macOS-Notifications-In-Windows');

  tray.on('click', () => {
    win?.show();
  });

  return tray;
}

export default createTray;
