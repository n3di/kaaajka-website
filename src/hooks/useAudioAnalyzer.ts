import { useEffect, useRef, useState } from 'react';

export type BeatCallback = () => void;

export function useAudioAnalyzer(
  audio: HTMLAudioElement | null,
  onBeat: BeatCallback,
  options?: { threshold?: number; interval?: number }
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const threshold = options?.threshold ?? 150;
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!audio) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;

    if (!AudioCtx) {
      console.warn('AudioContext not supported');
      return;
    }
    
    const context = new AudioCtx();
    audioContextRef.current = context;

    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(context.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    let lastBeatTime = 0;

    const detect = (time: number) => {
      analyser.getByteFrequencyData(dataArray);
      const avgBass = dataArray.slice(0, 5).reduce((a, b) => a + b, 0) / 5;

      if (avgBass > threshold && time - lastBeatTime > 200) {
        lastBeatTime = time;
        onBeat();
      }

      rafIdRef.current = requestAnimationFrame(detect);
    };

    rafIdRef.current = requestAnimationFrame(detect);
    setIsAnalyzing(true);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (context) context.close();
      setIsAnalyzing(false);
    };
  }, [audio, onBeat, threshold]);

  return { isAnalyzing };
}
