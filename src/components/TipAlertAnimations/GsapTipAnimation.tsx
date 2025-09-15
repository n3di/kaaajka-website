'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GsapTipAnimationProps {
  out: boolean;
  onAnimationEnd: () => void;
  children: React.ReactNode;
}

const GsapTipAnimation: React.FC<GsapTipAnimationProps> = ({
  out,
  onAnimationEnd,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!out) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: -100 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        y: -100,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: onAnimationEnd,
      });
    }
  }, [out, onAnimationEnd]);

  return <div ref={ref}>{children}</div>;
};

export default GsapTipAnimation;

