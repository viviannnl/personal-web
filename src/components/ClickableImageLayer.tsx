import { useEffect, useRef } from 'react';

interface AnimationOptions {
  type?: 'fadeIn';
  duration?: number;
  delay?: number;
}

interface ClickableImageLayerProps {
  src: string;
  zIndex: number;
  setCanvasRef: (el: HTMLCanvasElement | null) => void;
  animation?: AnimationOptions;
  hoverEffect?: boolean;
}

const ClickableImageLayer: React.FC<ClickableImageLayerProps> = ({
  src,
  zIndex,
  setCanvasRef,
  animation,
  hoverEffect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const imgWidth = img.width;
      const imgHeight = img.height;
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
  }, [src]);

  const fadeClass =
    animation?.type === 'fadeIn' ? 'opacity-0 animate-fade-in' : '';

  const hoverClass = hoverEffect
    ? 'transition duration-300 ease-in-out hover:scale-110 hover:brightness-110'
    : '';

  const style: React.CSSProperties = {
    animationDuration: animation?.duration ? `${animation.duration}ms` : '800ms',
    animationDelay: animation?.delay ? `${animation.delay}ms` : '0ms',
    animationFillMode: 'forwards',
  };

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        setCanvasRef(el);
      }}
      data-src={src}
      className={`${fadeClass} ${hoverClass}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default ClickableImageLayer;
