'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DonatePayload } from '@/types';

type UseDonateQueueOptions = {
  onQueueEmpty?: () => void;
};

export function useDonateQueue({ onQueueEmpty }: UseDonateQueueOptions = {}) {
  const [queue, setQueue] = useState<DonatePayload[]>([]);
  const [current, setCurrent] = useState<DonatePayload | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedIds = useRef<Set<string>>(new Set());

  const addDonate = useCallback((donate: DonatePayload) => {
    if (processedIds.current.has(donate.id)) return;
    processedIds.current.add(donate.id);
    setQueue((q) => [...q, donate]);
  }, []);

  const removeCurrent = useCallback(() => {
    setIsProcessing(false);
    setCurrent(null);
  }, []);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0 && !isProcessing) {
      const next = queue[0];
      setQueue((q) => q.slice(1));
      setCurrent(next);
      setIsProcessing(true);
    }

    if (queue.length === 0 && current === null) {
      onQueueEmpty?.();
    }
  }, [queue, current, isProcessing, onQueueEmpty]);

  return {
    current,
    addDonate,
    removeCurrent,
    startProcessing,
    isProcessing,
  };
}
