'use client'

import LayeredClickableImages from '@/components/LayeredClickableImages';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div
        className="absolute top-[7vh] w-full text-center z-50 pointer-events-none select-none"
      >
        <h1 className="relative right-[2vw] font-serif text-[22vmin] text-[#F7DC8B] [filter:drop-shadow(0_0_8px_rgba(248,226,168,0.8))_drop-shadow(0_0_32px_rgba(248,226,168,0.5))]">
          Vivian Li
        </h1>
      </div>

      <LayeredClickableImages
        layers={[
          {
            src: '/board.png',
            onClick: () => router.push('/qa'),
            tooltip: "Ask me questions!",
          },
          {
            src: '/laptop.png',
            onClick: () => window.open('https://github.com/viviannnl', '_blank'),
            tooltip: "My Github",
          },
          {
            src: '/mic.png',
            onClick: () => router.push('/podcast'),
            tooltip: "My (our) podcast",
          },
          {
            src: '/piano.png',
            onClick: () => router.push('/piano'),
            tooltip: "Watch me play piano!",
          },
          {
            src: '/window.png',
            onClick: () => router.push('/blog'),
            tooltip: "Yapping here",
          },
        ]}
      />
    </div>
  );
}
