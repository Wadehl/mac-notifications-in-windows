import { VITE_DEV_SERVER_URL } from '../config';
import path from 'node:path';
import { spawn } from 'child_process';
import * as log from 'electron-log';

function startBackendService() {
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

  return backendProcess;
}

export default startBackendService;
