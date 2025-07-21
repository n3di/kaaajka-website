import Image from 'next/image';

export function ErrorWidget() {
  return (
    <div className="bg-black border border-red-300 rounded-xl p-4 flex items-center gap-4 max-w-md mx-auto shadow-md">
      <Image
        src="https://cdn.7tv.app/emote/63c8a6c330027778647b3de8/3x.gif"
        width={189}
        height={96}
        priority
        alt="NOWAYING"
        className="flex-shrink-0"
      />
      <div>
        <h2 className="text-lg font-semibold text-red-500 mb-1">
          😵 Coś poszło nie tak
        </h2>
        <p className="text-red-300 text-sm">
          Widżet nie działa prawidłowo. Upewnij się, że URL zawiera poprawny
          UUID i spróbuj odświeżyć stronę.
        </p>
      </div>
    </div>
  );
}
