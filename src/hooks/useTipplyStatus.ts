'use client'

import { useEffect, useState } from 'react';

export function useTipplyStatus(type: string, uuid?: string) {
  const [state, setState] = useState<{
    isLoading: boolean;
    isValid: boolean | null;
    error: string | null;
  }>({
    isLoading: true,
    isValid: null,
    error: null,
  });

  useEffect(() => {
    if (!uuid) {
      setState({ isLoading: false, isValid: false, error: 'Brak UUID' });
      return;
    }

    const controller = new AbortController();

    fetch(`https://tipply.pl/api/configuration/${type}/${uuid}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Widżet nie istnieje');
          throw new Error(`Błąd serwera (${res.status})`);
        }
        return res.json();
      })
      .then(() => setState({ isLoading: false, isValid: true, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setState({ isLoading: false, isValid: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [uuid, type]);

  return state;
}
