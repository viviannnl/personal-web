'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

const FallingItem = () => {
  useEffect(() => {
    gsap.from(".fall-item", {
      y: 100-window.innerHeight,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: "bounce.out",
      rotation: 10,
    });
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div className="fall-item absolute bottom-0 left-1/4 transform -translate-x-1/2 z-10">
        <Image src="/mic.png" alt="Mic Icon" width={360} height={360} />
      </div>
      <div className="fall-item absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20">
        <Image src="/piano.png" alt="Piano Icon" width={360} height={360} />
      </div>
      <div className="fall-item absolute bottom-0 left-3/4 transform -translate-x-1/2 z-30">
        <Image src="/badminton_bird.png" alt="Badminton Bird Icon" width={360} height={360} />
      </div>
      <div className="fall-item absolute bottom-0 left-7/8 transform -translate-x-1/2 z-40">
        <Image src="/badminton_racket.png" alt="Badminton Racket Icon" width={360} height={360} />
      </div>
    </div>
  );
}

export default FallingItem;