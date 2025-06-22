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
    <div className="flex min-h-screen relative">
      {/* Piano image on the left */}
      <div className="flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <Image src="/piano.png" alt="Piano Icon" width={400} height={400} />
      </div>
      {/* Pixel Piano Board on the right */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div
          className="bg-blue-100 border-4 border-black rounded-none shadow-lg p-8 max-w-4xl w-full flex flex-col items-center"
          style={{
            boxShadow: '8px 8px 0 #222, 0 0 0 4px #fff',
            fontFamily: "'Press Start 2P', cursive",
            imageRendering: 'pixelated',
          }}
        >
          <h1
            className="text-3xl font-bold mb-6 video-game-font flex items-center gap-2"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            <span role="img" aria-label="music">🎹</span> Piano Videos
          </h1>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
                  <h2 className="text-lg font-semibold video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
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