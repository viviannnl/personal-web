'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingHomeButton from '@/components/FloatingHomeButton';

export default function PodcastPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen relative">
      {/* Mic image on the left */}
      <div className="flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <Image src="/mic.png" alt="Mic Icon" width={200} height={200} />
      </div>
      {/* Podcast embed on the right */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div
          className="bg-yellow-200 border-4 border-black rounded-none shadow-lg p-8 max-w-2xl w-full flex flex-col items-center"
          style={{
            boxShadow: '8px 8px 0 #222, 0 0 0 4px #fff',
            fontFamily: "'Press Start 2P', cursive",
            imageRendering: 'pixelated',
          }}
        >
          <h1 className="text-3xl font-bold mb-6 video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Podcast Series
          </h1>
          <div className="w-full">
            <iframe
              src="https://open.spotify.com/embed/show/3r8xcegBmUhJnSJ4W91GFN?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
      <FloatingHomeButton />
    </div>
  );
}
