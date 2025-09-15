// /app/components/TipAlertAnimations/TipFrom50.tsx

'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DonatePayload, SoundConfig, SpeechConfig } from '@/types';
import { AudioManager } from '@/lib/AudioManager';
import Image from 'next/image';
import GsapTipAnimation from './GsapTipAnimation';

interface TipFrom50Props {
  donate: DonatePayload;
  images: string[];
  withCommission: boolean;
  onAnimationEnd: () => void;
  sound?: SoundConfig;
  speech?: SpeechConfig;
}

const TipFrom50: React.FC<TipFrom50Props> = ({
  donate,
  images,
  withCommission,
  onAnimationEnd,
  sound,
  speech,
}) => {
  const [out, setOut] = useState(false);
  const hasPlayedRef = useRef<string | null>(null);

  useEffect(() => {
    if (hasPlayedRef.current === donate.id || out) return;
    hasPlayedRef.current = donate.id;

    const startPlayback = async () => {
      const audioManager = AudioManager.getInstance();

      if (sound?.url) {
        await audioManager.playSound(sound.url, sound.volume);
      }

      if (speech) {
        const parts: string[] = [];

        if (speech.readNickname) parts.push(donate.nickname);
        if (speech.readAmount) {
          const amount = withCommission
            ? donate.amount - donate.commission
            : donate.amount;
          const formatted = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
          }).format(amount / 100);
          parts.push(formatted);
        }
        if (speech.readMessage && donate.message) {
          parts.push(donate.message);
        }

        const fullText = parts.join('. ');
        if (fullText.trim().length > 0) {
          await audioManager.playTTS(fullText, speech.volume, 'pl-PL');
        }
      }

      await new Promise((res) => setTimeout(res, 1000));
      setOut(true);
    };

    startPlayback();
  }, [donate.amount, donate.commission, donate.id, donate.message, donate.nickname, out, sound?.url, sound?.volume, speech, withCommission]);

  const amount = withCommission
    ? donate.amount - donate.commission
    : donate.amount;

  const formatted = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount / 100);

  return (
    <div className="donateHolder">
      <GsapTipAnimation out={out} onAnimationEnd={onAnimationEnd}>
        <div className="donate fourth">
          {!!images.length && (
            <Image
              src={images[0]}
              alt="Tip"
              width={52}
              height={52}
              className="image"
              unoptimized
            />
          )}

          <div className="user">
            WOWOW!!
            <span className="nickname"> {donate.nickname} </span>
            daje
            <span className="amount"> {formatted} </span>
            !! TAK O!
          </div>

          <div className="text">{donate.message}</div>
        </div>
      </GsapTipAnimation>
    </div>
  );
};

export default TipFrom50;
