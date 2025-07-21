if (!process.env.NEXT_PUBLIC_WS_URL) {
  throw new Error('Missing NEXT_PUBLIC_WS_URL in .env');
}

export const AppConfig = {
  ws: {
    url: process.env.NEXT_PUBLIC_WS_URL!,
  },
};
