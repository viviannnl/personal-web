import { useEffect } from 'react';

interface ClickableImageLayerProps {
  src: string;
  zIndex: number;
  setCanvasRef: (el: HTMLCanvasElement | null) => void;
}

const ClickableImageLayer: React.FC<ClickableImageLayerProps> = ({
  src,
  zIndex,
  setCanvasRef,
}) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.querySelector(`canvas[data-src="${src}"]`) as HTMLCanvasElement;
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

  return (
    <canvas
      ref={setCanvasRef}
      data-src={src}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ClickableImageLayer;
