'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import FloatingHomeButton from '@/components/FloatingHomeButton';

type QA = {
  id: number;
  content: string;
  answer?: string | null;
};

export default function QAPage() {
  const [qas, setQAs] = useState<QA[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Q&A pairs
  useEffect(() => {
    const fetchQAs = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data) setQAs(data);
    };
    fetchQAs();
  }, []);

  // Handle question submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('questions')
      .insert([{ content }])
      .select()
      .single();
    if (!error && data) {
      setQAs([data, ...qas]);
      setContent('');
    }
    setLoading(false);
  };

  const router = useRouter();

  return (
    <div className="flex min-h-screen relative bg-transparent">
      {/* Board image on the left */}
      <div className="flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <Image src="/board.png" alt="Board Icon" width={300} height={300} />
      </div>
      {/* Pixel Q&A board on the right */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div
          className="bg-yellow-200 border-4 border-black rounded-none shadow-lg p-8 max-w-2xl w-full"
          style={{
            boxShadow: '8px 8px 0 #222, 0 0 0 4px #fff',
            fontFamily: "'Press Start 2P', cursive",
            imageRendering: 'pixelated',
          }}
        >
          <h1 className="text-2xl md:text-3xl mb-8 text-center video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Q&amp;A
          </h1>
          {/* Question form */}
          <form onSubmit={handleSubmit} className="mb-8 flex flex-col items-center">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Ask a question..."
              className="video-game-font border-2 border-black rounded-none px-4 py-2 mb-2 w-full"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
              disabled={loading}
            />
            <button
              type="submit"
              className="video-game-font bg-black text-yellow-200 px-6 py-2 border-2 border-black rounded-none"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Ask'}
            </button>
          </form>
          {/* Q&A list */}
          <div className="space-y-8">
            {qas.map(qa => (
              <div key={qa.id}>
                <h2 className="text-lg md:text-xl mb-2 video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                  Q: {qa.content}
                </h2>
                {qa.answer && (
                  <p className="video-game-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                    A: {qa.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FloatingHomeButton />
    </div>
  );
}
