'use client'

// src/app/piano/page.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
      {/* Piano image on the left */}
      <div className="flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <Image src="/piano.png" alt="Piano Icon" width={400} height={400} />
      </div>
      {/* Video grid on the right */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Piano Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
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
                <h2 className="text-lg font-semibold">{video.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}