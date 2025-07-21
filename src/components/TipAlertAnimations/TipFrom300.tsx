// /app/components/TipAlertAnimations/TipFrom300.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { DonatePayload, SoundConfig, SpeechConfig } from '@/types';
import 'animate.css';
import { AudioManager } from '@/lib/AudioManager';
import Image from 'next/image';

interface TipFrom300Props {
  donate: DonatePayload;
  images: string[];
  withCommission: boolean;
  onAnimationEnd: () => void;
  sound?: SoundConfig;
  speech?: SpeechConfig;
}

const TipFrom300: React.FC<TipFrom300Props> = ({
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

  const amount = withCommission
    ? donate.amount - donate.commission
    : donate.amount;

  const formatted = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount / 100);

  return (
    <div className="donateHolder">
      <div
        className={'animate__animated ' + (out ? 'animate__fadeOutUp' : '')}
        onAnimationEnd={() => {
          if (out) onAnimationEnd();
        }}
      >
        <div className="moneyRain">
          {[...Array(150)].map((_, i) => (
            <i className="rain" key={`rain_${i}`} />
          ))}
        </div>

        <div
          className={
            'haloFloats animate__animated ' + (out ? 'animate__fadeOutUp' : '')
          }
        >
          {[...Array(30)].map((_, i) => (
            <strong className="halo" key={`haloFloat_${i}`}>
              HALO
            </strong>
          ))}
        </div>

        <div
          className={
            'donate seventh animate__animated ' +
            (out ? 'animate__fadeOutUp' : '')
          }
        >
          <div className="coZaPojeb animate__animated animate__flash">
            <span className="co animate__animated animate__fadeInDownBig">
              !!! CO
            </span>
            <span className="za animate__animated animate__fadeInDownBig">
              {' '}
              ZA{' '}
            </span>
            <span className="pojeb animate__animated animate__fadeInDownBig">
              POJEB !!!
            </span>
          </div>

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
            <span className="donateInfo animate__animated animate__pulse">
              <span className="nickname"> {donate.nickname} </span>
              <br />
              <span className="wtf">pierdolnął/ęła</span>
              <br />
              <span className="wtf">!! WTF !!</span>
              <span className="amount"> {formatted} </span>
              <span className="wtf">!! WTF !!</span>
            </span>
          </div>

          <div className="text animate__animated animate__fadeInUpBig">
            {donate.message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipFrom300;
