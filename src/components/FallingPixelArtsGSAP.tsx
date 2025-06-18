'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Pixel {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  element: HTMLDivElement | null;
}

const FallingPixelArtsGSAP: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];

    const createPixel = (id: number): Pixel => {
      const pixel = document.createElement('div');
      pixel.className = 'absolute rounded-sm opacity-80';
      
      const size = 4 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      pixel.style.width = `${size}px`;
      pixel.style.height = `${size}px`;
      pixel.style.backgroundColor = color;
      
      containerRef.current?.appendChild(pixel);

      return {
        id,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size,
        color,
        rotation: Math.random() * 360,
        element: pixel
      };
    };

    // Create initial pixels
    const numPixels = 30;
    for (let i = 0; i < numPixels; i++) {
      pixelsRef.current.push(createPixel(i));
    }

    // Animate pixels
    const animatePixel = (pixel: Pixel) => {
      if (!pixel.element) return;

      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;

      gsap.set(pixel.element, {
        x: `${pixel.x}vw`,
        y: `${pixel.y}vh`,
        rotation: pixel.rotation,
        opacity: 0
      });

      gsap.to(pixel.element, {
        y: '110vh',
        rotation: pixel.rotation + 360,
        opacity: 0.8,
        duration: duration,
        delay: delay,
        ease: 'none',
        onComplete: () => {
          // Reset pixel position and restart animation
          gsap.set(pixel.element, {
            y: `${-10 - Math.random() * 20}vh`,
            x: `${Math.random() * 100}vw`,
            opacity: 0
          });
          animatePixel(pixel);
        }
      });
    };

    // Start animations
    pixelsRef.current.forEach(animatePixel);

    // Cleanup
    return () => {
      pixelsRef.current.forEach(pixel => {
        if (pixel.element) {
          gsap.killTweensOf(pixel.element);
          pixel.element.remove();
        }
      });
      pixelsRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
    />
  );
};

export default FallingPixelArtsGSAP; 