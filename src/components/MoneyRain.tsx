'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MoneyRainProps {
  count?: number;
}

const MoneyRain: React.FC<MoneyRainProps> = ({ count = 150 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLSpanElement[] = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      el.className = 'rain';
      container.appendChild(el);
      elements.push(el);

      const delay = Math.random() * 20;
      const duration = 5 + Math.random() * 5;
      const left = Math.random() * 100;
      const rotate = Math.random() * 90;

      gsap.set(el, {
        position: 'absolute',
        left: `${left}%`,
        top: '-100%',
        rotate,
        width: 52,
        height: 52,
        opacity: 1,
      });

      gsap.to(el, {
        top: '110%',
        opacity: 0,
        duration,
        delay,
        repeat: -1,
        ease: 'none',
      });
    }

    return () => {
      elements.forEach((el) => el.remove());
    };
  }, [count]);

  return <div className="moneyRain" ref={containerRef} />;
};

export default MoneyRain;

