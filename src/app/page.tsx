'use client'

import LayeredClickableImages from '@/components/LayeredClickableImages';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  console.log('hi');
  return (
    <LayeredClickableImages
      layers={[
        {
          src: '/board.png',
          onClick: () => router.push('/qa'),
          tooltip: "Q&A board",
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
          tooltip: "Piano pieces I've played",
        },
        {
          src: '/window.png',
          onClick: () => router.push('/blog'),
          tooltip: "Yapping here",
        },
      ]}
    />
  );
}
