// LayeredClickableImages.tsx
import { useEffect, useRef, useState } from 'react';
import ClickableImageLayer from './ClickableImageLayer';

interface Layer {
  src: string;
  onClick: () => void;
  animation?: {
    type?: 'fadeIn';
    duration?: number;
    delay?: number;
  };
  hoverEffect?: boolean;
  tooltip?: string;
}

interface LayeredClickableImagesProps {
  layers: Layer[];
}

const LayeredClickableImages: React.FC<LayeredClickableImagesProps> = ({ layers }) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [redrawKey, setRedrawKey] = useState(0);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setRedrawKey((prev) => prev + 1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });

    let hoveringInteractive = false;

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
        hoveringInteractive = true;
        setHoveredTooltip(layers[i].tooltip ?? null);
        break;
      }
    }

    if (!hoveringInteractive) {
      setHoveredTooltip(null);
    }

    setIsHoveringInteractive(hoveringInteractive);
  };

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
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        cursor: isHoveringInteractive ? 'pointer' : 'default',
      }}
    >
      {layers.map((layer, i) => (
        <ClickableImageLayer
          key={`${layer.src}-${redrawKey}`}
          src={layer.src}
          zIndex={i + 1}
          animation={layer.animation}
          hoverEffect={layer.hoverEffect}
          setCanvasRef={(el) => (canvasRefs.current[i] = el)}
        />
      ))}

      {hoveredTooltip && mousePos && (
        <div
          style={{
            position: 'fixed',
            top: mousePos.y + 12,
            left: mousePos.x + 12,
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            transform: 'translateY(5px)',
            opacity: 0,
            animation: 'fadeInTooltip 200ms ease-out forwards',
          }}
        >
          {hoveredTooltip}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInTooltip {
          from {
            transform: translateY(5px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LayeredClickableImages;
