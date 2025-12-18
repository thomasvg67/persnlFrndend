import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BASE_URL, {
  withCredentials: true,
  path: '/socket.io',
  autoConnect: false, // Important!
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'] // Enable both
});
export default socket;