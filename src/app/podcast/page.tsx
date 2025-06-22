'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingHomeButton from '@/components/FloatingHomeButton';

export default function PodcastPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#1a1229] text-gray-200 overflow-x-hidden">
      <main className="container mx-auto px-4 py-16 text-center">
        <h1
          className="text-5xl font-serif font-bold text-[#f8e2a8] mb-12"
          style={{ textShadow: '0 0 15px rgba(248, 226, 168, 0.4)' }}
        >
          Podcast Series
        </h1>
        <div className="max-w-3xl mx-auto bg-slate-900/40 p-2 rounded-xl ring-1 ring-white/10 shadow-lg">
          <iframe
            src="https://open.spotify.com/embed/show/3r8xcegBmUhJnSJ4W91GFN?utm_source=generator&theme=0"
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </main>
      <FloatingHomeButton />
    </div>
  );
}
