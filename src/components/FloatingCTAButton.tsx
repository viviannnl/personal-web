'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const FloatingCTAButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleCount(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    window.open('https://lettergen.io', '_blank');
  };

  return (
    <>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999]">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl animate-bounce-slow cursor-pointer border-2 border-white/20"
          style={{
            background: isHovered 
              ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: isHovered ? '400% 400%' : '100% 100%',
            animation: isHovered 
              ? 'gradientShift 2s ease infinite, bounce-slow 2s ease-in-out infinite, pulse-glow 1.5s ease-in-out infinite'
              : 'bounce-slow 2s ease-in-out infinite, pulse-glow 1.5s ease-in-out infinite'
          }}
        >
          {/* Sparkle effects */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={`${sparkleCount}-${i}`}
                className="absolute w-4 h-4 text-yellow-300 animate-sparkle opacity-0"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative flex items-center gap-3 z-10">
            <Zap className="w-6 h-6 animate-pulse" />
            <span className="font-extrabold tracking-wide">
              Generate Letters Now!
            </span>
            <ArrowRight 
              className={`w-6 h-6 transition-transform duration-300 ${
                isHovered ? 'translate-x-2' : ''
              }`} 
            />
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          {/* Ripple effect on hover */}
          {isHovered && (
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
          )}
        </button>

        {/* Floating text hint */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium animate-float shadow-lg border border-white/20">
            ✨ Click me for magic! ✨
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5),
                        0 0 40px rgba(147, 51, 234, 0.3),
                        0 0 60px rgba(147, 51, 234, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.8),
                        0 0 60px rgba(147, 51, 234, 0.5),
                        0 0 90px rgba(147, 51, 234, 0.3);
          }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default FloatingCTAButton;