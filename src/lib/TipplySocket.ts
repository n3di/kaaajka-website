// /app/lib/socket/TipplySocket.ts

import io from 'socket.io-client';
import { DonatePayload } from '@/types';
import { AppConfig } from '@/config';

type TipHandler = (donate: DonatePayload) => void;
type Callback = () => void;

export class TipplySocket {
  private socket: SocketIOClient.Socket;
  private tipHandlers = new Set<TipHandler>();
  private connectHandlers = new Set<Callback>();
  private disconnectHandlers = new Set<Callback>();

  constructor(uuid: string) {
    this.socket = io(`${AppConfig.ws.url}${uuid}`, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    this.socket.on('connect', () => {
      console.info(`[WS ${uuid}] ✅ Connected`);
      this.connectHandlers.forEach((cb) => cb());
    });

    this.socket.on('disconnect', (reason: string) => {
      console.warn(`[WS ${uuid}] ❌ Disconnected: ${reason}`);
      this.disconnectHandlers.forEach((cb) => cb());
    });

    this.socket.on('tip', (data: unknown) => {
      let parsed: DonatePayload | null = null;
      try {
        parsed =
          typeof data === 'string' ? JSON.parse(data) : (data as DonatePayload);
        if (!parsed?.amount || !parsed?.receiver_id) {
          throw new Error('Invalid payload');
        }
      } catch (err) {
        console.error(`[WS ${uuid}] ❌ Parse error`, err);
        return;
      }

      console.info(`[WS ${uuid}] 💸 TIP received`, parsed);
      this.tipHandlers.forEach((cb) => cb(parsed!));
    });

    this.socket.on('error', (err: Error) => {
      console.error(`[WS ${uuid}] 🧨 Error`, err);
    });
  }

  onTip(cb: TipHandler) {
    this.tipHandlers.add(cb);
    return () => this.tipHandlers.delete(cb);
  }

  onConnect(cb: Callback) {
    this.connectHandlers.add(cb);
    return () => this.connectHandlers.delete(cb);
  }

  onDisconnect(cb: Callback) {
    this.disconnectHandlers.add(cb);
    return () => this.disconnectHandlers.delete(cb);
  }

  disconnect() {
    this.socket.disconnect();
    this.tipHandlers.clear();
    this.connectHandlers.clear();
    this.disconnectHandlers.clear();
  }

  get isConnected() {
    return this.socket.connected;
  }
}
