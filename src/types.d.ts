// /types.ts
export interface DonatePayload {
  receiver_id: string;
  nickname: string;
  email: string;
  message: string;
  amount: number;
  commission: number;
  test: boolean;
  resent: boolean;
  source: string;
  payment_id: string | null;
  audio_url: string | null;
  goal_id: string | null;
  id: string;
  created_at: string;
  goal_title: string | null;
  tts_nickname_amazon_jacek?: string | null;
  tts_message_amazon_jacek?: string | null;
  tts_amount_amazon_jacek?: string | null;
}

export type VoiceType = 'AMAZON_JACEK' | 'AMAZON_OLAF' | 'GOOGLE_POLISH_FEMALE';

export interface SoundConfig {
  url: string;
  volume: number; // 0..1
}

export interface SpeechConfig {
  readNickname: boolean;
  readAmount: boolean;
  readMessage: boolean;
  voiceType: VoiceType;
  volume: number; // 0..1
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
