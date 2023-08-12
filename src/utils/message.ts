import { ipcRenderer } from 'electron';

const message = {
  success: (message: string, title = '', time = '') => {
    ipcRenderer.send('customRenderMessage', {
      title,
      message,
      type: 'success',
      time,
    });
  },
  warn: (message: string, title = '', time = '') => {
    ipcRenderer.send('customRenderMessage', {
      title,
      message,
      type: 'warning',
      time,
    });
  },
  error: (message: string, title = '', time = '') => {
    ipcRenderer.send('customRenderMessage', {
      title,
      message,
      type: 'error',
      time,
    });
  },
};

export default message;
