'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingHomeButton from '@/components/FloatingHomeButton';

export default function BlogPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen relative bg-transparent">
      {/* Window image on the left */}
      <div className="flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <Image src="/window.png" alt="Window Icon" width={300} height={300} />
      </div>
      {/* Video-game style blog board on the right */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div
          className="bg-blue-200 border-4 border-black rounded-none shadow-lg p-8 max-w-2xl w-full"
          style={{
            boxShadow: '8px 8px 0 #222, 0 0 0 4px #fff',
            fontFamily: "'Press Start 2P', cursive",
            imageRendering: 'pixelated',
          }}
        >
          <h1 className="text-3xl mb-8 text-center video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Blog
          </h1>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl mb-2 video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                🚀 Welcome to my Yapping Blog!
              </h2>
              <p className="video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                Here you'll find my thoughts, stories, and updates!
              </p>
            </div>
            <div>
              <h2 className="text-xl mb-2 video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                Inspiration 
              </h2>
              <p className="video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                I played the game Insomnia: Theater in the head and thought I could do something related to video games.
              </p>
            </div>
          </div>
        </div>
      </div>
      <FloatingHomeButton />
    </div>
  );
}
