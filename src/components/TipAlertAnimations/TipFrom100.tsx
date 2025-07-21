// /app/components/TipAlertAnimations/TipFrom100.tsx

'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DonatePayload, SoundConfig, SpeechConfig } from '@/types';
import 'animate.css';
import { AudioManager } from '@/lib/AudioManager';
import Image from 'next/image';

interface TipFrom100Props {
  donate: DonatePayload;
  images: string[];
  withCommission: boolean;
  onAnimationEnd: () => void;
  sound?: SoundConfig;
  speech?: SpeechConfig;
}

const TipFrom100: React.FC<TipFrom100Props> = ({
  donate,
  images,
  withCommission,
  onAnimationEnd,
  sound,
  speech,
}) => {
  const [out, setOut] = useState(false);
  const hasPlayedRef = useRef<string | null>(null);
  const [holy, setHoly] = useState<string[]>([]);

  useEffect(() => {
    const holyStates = [
      ['HOLY', '', 'HOLY', 'HO', 'HO', 'HOLY'],
      ['HOLY', '', 'MOLY', '', '', ''],
      ['', 'HOLY', '', 'HOLY', 'HOLY', 'MOLY'],
    ];

    setHoly(holyStates[0]);

    const timeout1 = setTimeout(() => setHoly(holyStates[1]), 5000);
    const timeout2 = setTimeout(() => setHoly(holyStates[2]), 12000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

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
      <div className="holymoly">
        {[...Array(6)].map((_, i) => (
          <strong className="holy" key={`holy_${i}`}>
            {holy[i]}
          </strong>
        ))}
      </div>

      <div
        className={
          'donate fifth animate__animated ' +
          (out ? 'animate__fadeOutUp' : 'animate__fadeInDownBig')
        }
        onAnimationEnd={() => {
          if (out) onAnimationEnd();
        }}
      >
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

        <div className="user animate__animated animate__pulse">
          <div>
            Ale, że
            <span className="nickname"> {donate.nickname} </span>
            wpłacił
          </div>
          <div>
            <span className="amount"> {formatted}?? </span> OMG!
          </div>
        </div>

        <div className="text">{donate.message}</div>
      </div>
    </div>
  );
};

export default TipFrom100;
