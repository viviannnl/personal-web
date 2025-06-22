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
        },
        {
          src: '/laptop.png',
          onClick: () => window.open('https://github.com/viviannnl', '_blank'),
        },
        {
          src: '/mic.png',
          onClick: () => router.push('/podcast'),
        },
        {
          src: '/piano.png',
          onClick: () => router.push('/piano'),
        },
        {
          src: '/window.png',
          onClick: () => router.push('/blog'),
        },
      ]}
    />
  );
}
