import { io } from 'socket.io-client';

type ShowNotificationPopupFunction = (...args: any[]) => void;

export const useSocket = (
  showNotificationPopup: ShowNotificationPopupFunction,
  socketUrl?: string,
) => {
  const socket = io(socketUrl || 'http://localhost:3000');
  socket.on('showNotificationPopup', showNotificationPopup);

  function destroySocket(socketInstance: any) {
    socketInstance.off('showNotificationPopup', showNotificationPopup);
    socketInstance.disconnect();
  }

  return { socket, destroySocket };
};
