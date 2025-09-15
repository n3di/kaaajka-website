// /app/components/TipAlertAnimations/Default.ts

'use client';
import React, { useEffect, useState } from 'react';
import { DonatePayload, SoundConfig, SpeechConfig } from '@/types';
import 'animate.css';
import { AudioManager } from '@/lib/AudioManager';
import Image from 'next/image';

interface DefaultProps {
  donate: DonatePayload;
  images: string[];
  withCommission: boolean;
  beat?: boolean;
  onAnimationEnd: () => void;
  sound?: SoundConfig; // ← DODAJ te dwie linijki
  speech?: SpeechConfig; // ← DODAJ te dwie linijki
}

const Default: React.FC<DefaultProps> = ({
  donate,
  images,
  withCommission,
  onAnimationEnd,
  sound,
  speech,
}) => {
  const [out, setOut] = useState(false);

  const hasPlayedRef = React.useRef<string | null>(null);

  useEffect(() => {
    // Zabezpieczenie przed podwójnym wywołaniem (Strict Mode)
    if (hasPlayedRef.current === donate.id || out) {
      console.log('useEffect early return because out=true or already played');
      return;
    }

    hasPlayedRef.current = donate.id;

    console.log('useEffect startPlayback', { donateId: donate.id, out });

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

  useEffect(() => {
    if (out) onAnimationEnd();
  }, [out, onAnimationEnd]);


  const amount = withCommission
    ? donate.amount - donate.commission
    : donate.amount;

  const formatted = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount / 100);

  return (
    <div className="wrapper">
      <div className="donate">
        {!!images.length && (
          <Image
            src="https://tipply.pl/upload/media/user/0006/25/47168b05ea7a9cfd89f906886b7878ab26d74423.gif"
            alt="Tip"
            width={52}
            height={52}
            className="image"
            unoptimized
          />
        )}

        <div className={'user animate__animated animate__pulse'}>
          <span className="nickname">{donate.nickname} </span>
          wrzuca
          <span className="amount"> {formatted}</span>
        </div>

        <div className="message">{donate.message}</div>
      </div>
    </div>
  );  
};

export default Default;
