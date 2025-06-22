'use client';

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

  console.log(qas);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1229] text-gray-200 overflow-x-hidden">
      <main className="container mx-auto px-4 pt-24 pb-16 text-center">
        <h1
          className="text-5xl font-serif font-bold text-[#f8e2a8] mb-16"
          style={{ textShadow: '0 0 15px rgba(248, 226, 168, 0.4)' }}
        >
          Ask Me Anything
        </h1>

        {/* Question form */}
        <form
          onSubmit={handleSubmit}
          className="mb-12 max-w-2xl mx-auto flex flex-col items-center"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your question here..."
            className="w-full bg-slate-900/40 border border-white/10 rounded-lg px-4 py-3 font-serif text-lg text-[#f8e2a8] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f8e2a8]/50 transition-shadow duration-300"
            rows={3}
            disabled={loading}
          />
          <button
            type="submit"
            className="mt-4 px-8 py-3 bg-[#f8e2a8] text-[#1a1229] font-bold font-serif rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Ask Question'}
          </button>
        </form>

        {/* Q&A list */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {qas.map((qa, idx) => (
            <div
              key={qa.id}
              className="bg-slate-900/40 rounded-lg shadow-lg p-6 text-left ring-1 ring-white/10"
            >
              <h2 className="text-xl font-serif font-semibold text-[#f8e2a8] mb-2">
                Q: {qa.content}
              </h2>
              {qa.answer && (
                <p className="font-serif text-gray-300 leading-relaxed">
                  A: {qa.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
      <FloatingHomeButton />
    </div>
  );
}
