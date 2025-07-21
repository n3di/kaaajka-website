// /app/lib/templates.ts

import { DonatePayload, SoundConfig, SpeechConfig } from '@/types';
import TipFrom5 from '@/components/TipAlertAnimations/TipFrom5';
import Default from '@/components/TipAlertAnimations/Default';
import TipFrom25 from '../components/TipAlertAnimations/TipFrom25';
import TipFrom50 from '../components/TipAlertAnimations/TipFrom50';
import TipFrom100 from '../components/TipAlertAnimations/TipFrom100';
import TipFrom150 from '../components/TipAlertAnimations/TipFrom150';
import TipFrom300 from '../components/TipAlertAnimations/TipFrom300';

interface Template {
  id: string; // unikalne id szablonu
  amountRange?: [number, number]; // zakres kwoty, np. [1, 5]
  predicate?: (donate: DonatePayload) => boolean; // dodatkowe warunki
  images: string[];
  sound?: SoundConfig;
  speech?: SpeechConfig;
  template: React.ComponentType<{
    donate: DonatePayload;
    images: string[]; // ← dodaj
    withCommission: boolean; // ← dodaj
    beat?: boolean; // ← dodaj
    onAnimationEnd: () => void;
    sound?: SoundConfig;
    speech?: SpeechConfig;
  }>;
}

export const templates: Template[] = [
  {
    id: 'tip-from-1',
    amountRange: [0, 499],
    images: [
      'https://tipply.pl/upload/media/user/0002/34/dcba4b98efb5425eb46114645dcf706bfbd7aad6.gif',
    ],
    sound: {
      url: 'https://dxokx05hbd6dq.cloudfront.net/upload/media/user/0006/64/6239c69f64f1624abbe87da76c5089366e57a4f5.mp3',
      volume: 0.4,
    },
    speech: {
      readNickname: true,
      readAmount: true,
      readMessage: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: Default,
  },
  {
    id: 'tip-from-5',
    amountRange: [500, 2499],
    images: [
      'https://tipply.pl/upload/media/user/0001/72/acf010c217f825445a764938dc97eb54b5e641c2.gif',
    ],
    sound: {
      url: 'https://tipply.pl/upload/media/user/0001/72/c969d09a03b032b2eb03922327b286b351ec855b.mpga',
      volume: 0.4,
    },
    speech: {
      readNickname: true,
      readAmount: true,
      readMessage: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom5,
  },
  {
    id: 'tip-from-25',
    amountRange: [2500, 4999],
    images: [
      'https://tipply.pl/upload/media/user/0001/72/842253ed2b3c1eeac7d9c828320ab73fbdd359d8.gif',
    ],
    sound: {
      url: 'https://tipply.pl/upload/media/user/0001/81/872a760d7279cc06997609c2fc76d6c0037807a3.mpga',
      volume: 0.3,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom25,
  },
  {
    id: 'tip-from-50',
    amountRange: [5000, 9999],
    images: [
      'https://tipply.pl/upload/media/user/0002/34/9f45a5dd1b56d79ec4fb669f2d4037150d116e5c.gif',
    ],
    sound: {
      url: 'https://tipply.pl/upload/media/user/0002/34/69c38da4097646a0fad6cc1b13defca0b8e3fddb.mpga',
      volume: 0.4,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom50,
  },
  {
    id: 'tip-from-100',
    amountRange: [10000, 14999],
    images: [
      'https://tipply.pl/upload/media/user/0001/73/a54b863f6743d45bd5d4e9f72a2282c7f4d07a6b.gif',
    ],
    sound: {
      url: 'https://dxokx05hbd6dq.cloudfront.net/upload/media/user/0006/64/6239c69f64f1624abbe87da76c5089366e57a4f5.mp3',
      volume: 0.3,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom100,
  },

  {
    id: 'tip-from-150',
    amountRange: [15000, 29999],
    images: [
      'https://tipply.pl/upload/media/user/0002/34/455ea418f572ed368e62f41fc0ed3be09ba4c494.gif',
    ],
    sound: {
      url: 'https://tipply.pl/upload/media/user/0002/34/67ea8e16cfea96f1bbb98a02e17b6c8abad6ef5d.mpga',
      volume: 1,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom150,
  },
  {
    id: 'tip-from-300',
    amountRange: [30000, 49999],
    images: [
      'https://tipply.pl/upload/media/user/0006/25/47168b05ea7a9cfd89f906886b7878ab26d74423.gif',
    ],
    sound: {
      url: 'https://dxokx05hbd6dq.cloudfront.net/upload/media/user/0006/24/fd39b0f90e08c23b55619c8c409709ac89c77afa.mp3',
      volume: 1,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom300,
  },
  {
    id: 'tip-from-500',
    amountRange: [50000, 99999],
    images: [
      'https://tipply.pl/upload/media/user/0006/25/47168b05ea7a9cfd89f906886b7878ab26d74423.gif',
    ],
    sound: {
      url: 'https://dxokx05hbd6dq.cloudfront.net/upload/media/user/0006/24/fd39b0f90e08c23b55619c8c409709ac89c77afa.mp3',
      volume: 1,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom5,
  },
  {
    id: 'tip-from-1000',
    amountRange: [100000, 200000],
    images: [
      'https://media.discordapp.net/stickers/1175218998296723506.webp?size=160&quality=lossless',
    ],
    sound: {
      url: 'https://dxokx05hbd6dq.cloudfront.net/upload/media/user/0006/52/eebc99ee8c6af6578afd29d443bbf540efd1e796.mp3',
      volume: 1,
    },
    speech: {
      readAmount: true,
      readMessage: true,
      readNickname: true,
      voiceType: 'GOOGLE_POLISH_FEMALE',
      volume: 0.4,
    },
    template: TipFrom5,
  },
  // inne szablony...
];

// Funkcja dopasowująca szablon do donatu
export function matchTemplate(donate: DonatePayload): Template | null {
  const matched = templates.filter((t) => {
    const inRange = t.amountRange
      ? donate.amount >= t.amountRange[0] && donate.amount <= t.amountRange[1]
      : true;
    const predicatePass = t.predicate ? t.predicate(donate) : true;
    return inRange && predicatePass;
  });

  if (matched.length === 0) return null;

  // Zwraca szablon z najwyższym dolnym progiem
  return matched.reduce((best, current) => {
    const bestMin = best.amountRange?.[0] ?? 0;
    const currentMin = current.amountRange?.[0] ?? 0;
    return currentMin > bestMin ? current : best;
  });
}

