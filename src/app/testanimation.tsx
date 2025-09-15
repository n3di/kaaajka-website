'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

type Donate = {
  nickname: string;
  amount: number;
  message: string;
};

type Props = {
  donate: Donate;
  sound?: { url: string };
  speech?: { text: string };
  onAnimationEnd?: () => void;
};

export default function SimpleGsapAnimation({
  donate,
  sound,
  speech,
  onAnimationEnd,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nicknameRef = useRef<HTMLSpanElement>(null);
  const amountRef = useRef<HTMLSpanElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isCancelled = false;

    // AudioContext i audioEl
    let audioEl: HTMLAudioElement | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaElementAudioSourceNode | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
      });

      // Animacja wejścia
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      tl.from(imageRef.current, { scale: 0, rotate: 720, duration: 1 }, '<');
      tl.from(nicknameRef.current, { y: -100, opacity: 0 }, '-=0.5');
      tl.from(amountRef.current, { scale: 0, opacity: 0 }, '-=0.6');
      tl.from(messageRef.current, { y: 100, opacity: 0 }, '-=0.6');
    }, containerRef);

    // Beat pulse effect
    const beatPulse = () => {
      if (!containerRef.current) return;
      ctx.add(() => {
        gsap.fromTo(
          containerRef.current,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
          }
        );
      });
    };

    // Funkcja do odtwarzania speech (text-to-speech), zwraca promise
    function playSpeech(text: string): Promise<void> {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }

    // Funkcja do odtwarzania audio z beat detection, zwraca promise zakończoną po odtworzeniu
    function playAudio(url: string): Promise<void> {
      return new Promise((resolve) => {
        audioEl = new Audio(url);
        audioEl.crossOrigin = 'anonymous';

        audioEl.onended = () => {
          resolve();
        };

        audioEl.onerror = () => {
          // Jeśli błąd z audio, zakończ odtwarzanie żeby nie wieszać animacji
          resolve();
        };

        audioEl.play().catch(() => {
          // Jeśli nie uda się odpalić audio (np. autoplay policy)
          resolve();
        });

        // Inicjalizacja AudioContext i beat detection
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        source = audioCtx.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const detectBeat = () => {
          if (isCancelled || !analyser) return;

          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

          if (avg > 150) {
            beatPulse();
          }

          requestAnimationFrame(detectBeat);
        };

        detectBeat();
      });
    }

    // Kolejność odtwarzania: speech -> audio -> animacja fadeout -> onAnimationEnd
    (async () => {
      if (speech?.text) {
        await playSpeech(speech.text);
      }

      if (sound?.url) {
        await playAudio(sound.url);
      }

      if (isCancelled) return;

      // Animacja wyjścia (fade out)
      await new Promise<void>((resolve) => {
        ctx.add(() => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => resolve(),
          });
        });
      });

      if (!isCancelled) onAnimationEnd?.();
    })();

    return () => {
      isCancelled = true;

      // Cancel TTS
      window.speechSynthesis.cancel();

      // Stop audio
      if (audioEl) {
        audioEl.pause();
        audioEl.src = '';
      }

      // Close audio context
      if (audioCtx) {
        audioCtx.close();
      }

      ctx.revert();
    };
  }, [donate, sound, speech, onAnimationEnd]);
  

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white"
    >
      <div className="flex flex-col items-center text-center">
        <div ref={imageRef}>
          <Image
            src="https://tipply.pl/upload/media/user/0002/34/dcba4b98efb5425eb46114645dcf706bfbd7aad6.gif"
            alt="Donate Visual"
            width={150}
            height={150}
            unoptimized
            className="mb-4"
          />
        </div>

        <span
          ref={nicknameRef}
          className="text-5xl font-bold text-green-400 drop-shadow-lg"
        >
          {donate.nickname}
        </span>

        <span
          ref={amountRef}
          className="text-4xl font-extrabold mt-2 text-yellow-400"
        >
          {donate.amount.toFixed(2)} PLN
        </span>

        <div
          ref={messageRef}
          className="mt-4 text-2xl italic max-w-2xl text-white/90"
        >
          {donate.message}
        </div>
      </div>
    </div>
  );
}