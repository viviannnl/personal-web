'use client'

// src/app/piano/page.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingHomeButton from '@/components/FloatingHomeButton';

const videos = [
  { src: "https://www.youtube.com/embed/W2ESzbZUQq0", title: "Childhood Memories" },
  { src: "https://www.youtube.com/embed/2Z2mr670q_o", title: "Widmung" },
  { src: "https://www.youtube.com/embed/WPdKYKog35M", title: "Chopin Preludes" },
  // Add more videos as needed
];

export default function PianoPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen relative bg-[#1a1229] text-gray-200">
      {/* Piano image on the left */}
      <div className="flex flex-col items-center justify-center p-8 z-10">
        <Image
          src="/piano.png"
          alt="Piano Icon"
          width={400}
          height={400}
          className="animate-float [filter:drop-shadow(0_0_25px_rgba(248,226,168,0.25))]"
        />
      </div>
      {/* Video list on the right */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="bg-black/20 rounded-lg p-8 max-w-4xl w-full flex flex-col items-center">
          <h1
            className="text-5xl font-serif font-bold text-[#f8e2a8] mb-8 flex items-center gap-4"
            style={{ textShadow: '0 0 15px rgba(248, 226, 168, 0.4)' }}
          >
            <span role="img" aria-label="music">
              🎹
            </span>{' '}
            Piano Videos
          </h1>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#f8e2a8]/20 hover:scale-105"
              >
                <div className="w-full aspect-video bg-black">
                  <iframe
                    src={video.src}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-serif font-semibold text-[#f8e2a8]">
                    {video.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FloatingHomeButton />
    </div>
  );
}