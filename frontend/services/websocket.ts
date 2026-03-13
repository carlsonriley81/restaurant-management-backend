import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/env';
import { getItem, STORAGE_KEYS } from '@/utils/storage';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = getItem<string>(STORAGE_KEYS.accessToken);
    socket = io(env.wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function reconnectSocket(): void {
  disconnectSocket();
  getSocket();
}
