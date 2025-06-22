import { useEffect, useRef, useState } from 'react';
import ClickableImageLayer from './ClickableImageLayer';

interface Layer {
  src: string;
  onClick: () => void;
}

interface LayeredClickableImagesProps {
  layers: Layer[];
}

const LayeredClickableImages: React.FC<LayeredClickableImagesProps> = ({ layers }) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [redrawKey, setRedrawKey] = useState(0); // Forces re-render

  // Redraw all canvases on resize
  useEffect(() => {
    const handleResize = () => {
      setRedrawKey(prev => prev + 1); // Trigger update
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;

    for (let i = layers.length - 1; i >= 0; i--) {
      const canvas = canvasRefs.current[i];
      if (!canvas) continue;

      const rect = canvas.getBoundingClientRect();
      const px = x - rect.left;
      const py = y - rect.top;

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const pixel = ctx.getImageData(px, py, 1, 1).data;
      if (pixel[3] > 0) {
        layers[i].onClick();
        break;
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
    >
      {layers.map((layer, i) => (
        <ClickableImageLayer
          key={`${layer.src}-${redrawKey}`} // triggers re-render on resize
          src={layer.src}
          zIndex={i + 1}
          setCanvasRef={(el) => (canvasRefs.current[i] = el)}
        />
      ))}
    </div>
  );
};

export default LayeredClickableImages;
