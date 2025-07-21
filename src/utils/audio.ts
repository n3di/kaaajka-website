export async function playAudio(
  src: string,
  volume: number = 1.0
): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(src);
    audio.volume = volume;

    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);

    // Obsługa możliwego błędu przy play() (np. bez interakcji użytkownika)
    audio.play().catch((err) => {
      console.warn('[AUDIO] play() error:', err);
      reject(err);
    });
  });
}
