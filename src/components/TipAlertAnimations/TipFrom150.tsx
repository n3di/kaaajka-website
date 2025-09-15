// /app/components/TipAlertAnimations/TipFrom150.tsx

'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DonatePayload, SoundConfig, SpeechConfig } from '@/types';
import 'animate.css';
import { AudioManager } from '@/lib/AudioManager';
import Image from 'next/image';
import MoneyRain from '@/components/MoneyRain';

interface TipFrom150Props {
  donate: DonatePayload;
  images: string[];
  withCommission: boolean;
  onAnimationEnd: () => void;
  sound?: SoundConfig;
  speech?: SpeechConfig;
}

const TipFrom150: React.FC<TipFrom150Props> = ({
  donate,
  images,
  withCommission,
  onAnimationEnd,
  sound,
  speech,
}) => {
  const [showTogether, setShowTogether] = useState(false);
  const [out, setOut] = useState(false);
  const hasPlayedRef = useRef<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowTogether(true), 1200);
    return () => clearTimeout(timeout);
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
      <MoneyRain count={150} />

      <div
        className={
          'donate sixth animate__animated ' + (out ? 'animate__fadeOutUp' : '')
        }
        onAnimationEnd={() => {
          if (out) onAnimationEnd();
        }}
      >
        {!showTogether && (
          <>
            <div className="halo h1 animate__animated animate__fadeInDownBig">
              !!! HALO !!!
            </div>
            <div className="halo h2 animate__animated animate__fadeInDownBig">
              !!! HALO !!!
            </div>
          </>
        )}
        {showTogether && (
          <div className="haloTogether animate__animated animate__flash">
            !!! HALO HALO !!!
          </div>
        )}

        {!!images.length && (
          <Image
            src={images[0]}
            alt="Tip"
            width={52}
            height={52}
            className="image animate__animated animate__fadeInRightBig"
            unoptimized
          />
        )}

        <div className="user animate__animated animate__fadeInUpBig">
          <span className="lala animate__animated animate__pulse">
            <span className="nickname"> {donate.nickname} </span>
            wleciał/a za
            <span className="amount"> {formatted} </span>
            Co jest !?
          </span>
        </div>

        <div className="text animate__animated animate__fadeInUpBig">
          {donate.message}
        </div>
      </div>
    </div>
  );
};

export default TipFrom150;
