// /app/lib/socket/SocketManager.ts

import { TipplySocket } from './TipplySocket';

const instanceMap = new Map<string, TipplySocket>();

export const SocketManager = {
  get(uuid: string): TipplySocket {
    if (!instanceMap.has(uuid)) {
      instanceMap.set(uuid, new TipplySocket(uuid));
    }
    return instanceMap.get(uuid)!;
  },

  disconnect(uuid: string) {
    const instance = instanceMap.get(uuid);
    if (instance) {
      instance.disconnect();
      instanceMap.delete(uuid);
    }
  },

  disconnectAll() {
    for (const [uuid, instance] of instanceMap.entries()) {
      instance.disconnect();
      instanceMap.delete(uuid);
    }
  },
};
