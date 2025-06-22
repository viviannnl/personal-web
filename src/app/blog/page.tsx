'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingHomeButton from '@/components/FloatingHomeButton';

const posts = [
  {
    title: '🚀 Welcome to my Yapping Blog!',
    content: "Here you'll find my thoughts, stories, and updates!",
  },
  {
    title: 'Inspiration',
    content:
      'I played the game "Insomnia: Theater in the Head" and thought I could do something related to video games.',
  },
];

export default function BlogPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1229] text-gray-200 overflow-x-hidden">
      <main className="container mx-auto px-4 py-16 text-center">
        <Image
          src="/window.png"
          alt="Window Icon"
          width={400}
          height={400}
          className="mx-auto mb-0 animate-float [filter:drop-shadow(0_0_25px_rgba(248,226,168,0.3))]"
        />
        <h1
          className="text-5xl font-serif font-bold text-[#f8e2a8] mb-12"
          style={{ textShadow: '0 0 15px rgba(248, 226, 168, 0.4)' }}
        >
          My Blog
        </h1>
        <div className="space-y-8 max-w-3xl mx-auto">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 rounded-lg shadow-lg p-8 text-left ring-1 ring-white/10"
            >
              <h2 className="text-3xl font-serif font-bold text-[#f8e2a8] mb-4">
                {post.title}
              </h2>
              <p className="text-lg font-serif text-gray-300 leading-relaxed">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      </main>
      <FloatingHomeButton />
    </div>
  );
}
