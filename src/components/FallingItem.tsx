'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import Image from 'next/image';
import styles from './FallingItem.module.css';

const FallingItem = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      // Reset the elements to their initial state
      gsap.set(".fall-item", {
        y: 100 - window.innerHeight,
        opacity: 0,
        rotation: 10,
      });

      // Then animate them in
      gsap.to(".fall-item", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: "bounce.out",
        rotation: 0,
      });
    }
  }, [pathname]);

  const router = useRouter();

  return (
    <div className={`${styles.container}`}>
      <div className='background-item grid grid-cols-3 gap-4'>
        <div className="light transform transition duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110">
            <Image src="/light.gif" alt="Light Icon" width={450} height={450} />
        </div>
        <div
          className="board transform transition duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
          onClick={() => router.push('/qa')}
          style={{ cursor: 'pointer' }}
        >
          <Image src="/board.png" alt="Board Icon" width={300} height={300} />
        </div>
        <div 
          className="window transform transition duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110"
          onClick={() => router.push('/blog')}
          style={{ cursor: 'pointer' }}
        >
            <Image src="/window.png" alt="Window Icon" width={300} height={300} />
        </div>
      </div>
      <div
        className={`fall-item ${styles.fallItem} ${styles.mic} hover:brightness-110`}
        id='mic'
        onClick={() => router.push('/podcast')}
        style={{ cursor: 'pointer' }}
      >
        <Image src="/mic.png" alt="Mic Icon" width={200} height={200} />
      </div>
      <div 
      className={`fall-item ${styles.fallItem} ${styles.piano} hover:brightness-110`} 
      id='piano'
      onClick={() => router.push('/piano')}
      style={{ cursor: 'pointer'}}>
        <Image src="/piano.png" alt="Piano Icon" width={400} height={400} />
      </div>
      <div className={`fall-item ${styles.fallItem} ${styles.badmintonBird} hover:brightness-110`} id='badminton_bird'>
        <Image src="/badminton_bird.png" alt="Badminton Bird Icon" width={260} height={260} />
      </div>
      <div className={`fall-item ${styles.fallItem} ${styles.badmintonRacket} hover:brightness-110`} id='badminton_racket'>
        <Image src="/badminton_racket.png" alt="Badminton Racket Icon" width={300} height={300} />
      </div>
      <div
        className={`fall-item ${styles.fallItem} ${styles.laptop} hover:brightness-110`}
        id='laptop'
        onClick={() => window.open('https://github.com/viviannnl', '_blank')}
        style={{ cursor: 'pointer' }}
      >
        <Image src="/laptop.png" alt="Laptop Icon" width={350} height={350} />
      </div>
    </div>
  );
};

export default FallingItem;

