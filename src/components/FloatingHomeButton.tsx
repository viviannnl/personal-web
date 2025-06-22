'use client'

import { useRouter, usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

const FloatingHomeButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Optional: Hide on homepage
  if (pathname === '/') return null;

  return (
    <button
      onClick={() => router.push('/')}
      className="fixed bottom-6 right-6 z-[9999] rounded-full bg-purple-600 text-white shadow-lg hover:shadow-2xl hover:scale-105 hover:brightness-110 transition-all duration-300 p-4 animate-glow cursor-pointer"
      aria-label="Go to Home"
    >
      <Home className="w-6 h-6" />
    </button>
  );
};

export default FloatingHomeButton;

