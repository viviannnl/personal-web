'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PodcastPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen relative">
      {/* Light element in the top left */}
      <div className="absolute left-0 top-0 z-20">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="light transform transition duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110 focus:outline-none"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Image src="/light.gif" alt="Light Icon" width={450} height={450} />
        </button>
      </div>
      {/* Mic image on the left */}
      <div className="flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <Image src="/mic.png" alt="Mic Icon" width={200} height={200} />
      </div>
      {/* Podcast embed on the right */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Podcast Series</h1>
        <div className="w-full max-w-2xl">
          <iframe 
            src="https://open.spotify.com/embed/show/3r8xcegBmUhJnSJ4W91GFN?utm_source=generator" 
            width="100%" height="352" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  );
}
