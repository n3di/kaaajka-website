// /app/components/TipAlertWidget.ts

'use client';

import { useEffect, useState } from 'react';
import { DonatePayload } from '@/types';
import { SocketManager } from '@/lib/SocketManager';
import { ErrorWidget } from './ErrorWidget';
import { useTipplyStatus } from '@/hooks/useTipplyStatus';
import { useDonateQueue } from '@/hooks/useDonateQueue';
import { matchTemplate } from '../lib/templates';

export default function TipAlertWidget({ type, uuid }: { type: string; uuid: string }) {
  const { isLoading, isValid } = useTipplyStatus(type, uuid);
  const { current, addDonate, removeCurrent } = useDonateQueue();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!uuid || !isValid) return;

    const socket = SocketManager.get(uuid);

    const unsubscribeTip = socket.onTip((donate: DonatePayload) => {
      addDonate(donate);
    });

    const unsubscribeConnect = socket.onConnect(() => setConnected(true));
    const unsubscribeDisconnect = socket.onDisconnect(() =>
      setConnected(false)
    );

    return () => {
      unsubscribeTip();
      unsubscribeConnect();
      unsubscribeDisconnect();
      SocketManager.disconnect(uuid);
    };
  }, [uuid, isValid, addDonate]);

  if (isValid === false) return <ErrorWidget />;
  if (isLoading || !connected)
    return <div className="text-white">⏳ Trwa ładowanie widoku...</div>;

  if (!current) return <p>Brak nowych tipów</p>;

  const template = matchTemplate(current);
  if (!template) return <p>Brak pasującego szablonu</p>;

  const Component = template.template;

  return (
    <Component
      donate={current}
      images={template.images}
      withCommission={true}
      beat={true}
      onAnimationEnd={removeCurrent} // ← usuń donate po zakończeniu animacji + dźwięku
      sound={template.sound} // ← przekaż konfigurację dźwięku
      speech={template.speech} // ← przekaż konfigurację TTS
    />
  );
}
