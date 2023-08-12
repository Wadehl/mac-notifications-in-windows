import { app } from 'electron';
import path from 'node:path';
import * as log from 'electron-log';

// renderer
import createWindow from './renderer';
import startBackendService from './service';
import createTray from './renderer/tray';
import initNotification from './renderer/notification';
import initMarkdown from './renderer/markdown';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

const init = () => {
  // initLog
  log.transports.file.fileName = path.join(
    path.join(__dirname, '../logs'),
    'error.log',
  );
  log.transports.file.level = 'error';

  initNotification();
};

app.whenReady().then(async () => {
  init();

  const backendProcess = startBackendService();
  const win = await createWindow();
  const markdown = initMarkdown();

  createTray(win, backendProcess, markdown);
});
