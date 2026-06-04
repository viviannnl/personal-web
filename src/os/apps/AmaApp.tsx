"use client";

// AMA.chat — wired to the existing Supabase `questions` table.
// Contract preserved exactly: rows are { id, content, answer? }; submit inserts
// [{ content }] (same shape as today). Each row renders a `you:` bubble (content)
// and, when answered, a `viv:` bubble (answer); unanswered rows show a pending note.

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";

interface QA {
  id: number;
  content: string;
  answer?: string | null;
}

type LoadState = "loading" | "ready" | "error";

export default function AmaApp() {
  const [qas, setQAs] = useState<QA[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [val, setVal] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("id", { ascending: true });
      if (!live) return;
      if (error) {
        setState("error");
        return;
      }
      setQAs((data as QA[]) ?? []);
      setState("ready");
    })();
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [qas, sending, state]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = val.trim();
    if (!content || sending) return;
    setSending(true);
    setConfirmed(false);

    // optimistic bubble
    const optimistic: QA = { id: -Date.now(), content, answer: null };
    setQAs((m) => [...m, optimistic]);
    setVal("");

    const { data, error } = await supabase
      .from("questions")
      .insert([{ content }])
      .select()
      .single();

    if (error) {
      // roll back the optimistic bubble and surface the failure inline
      setQAs((m) => m.filter((q) => q.id !== optimistic.id));
      setVal(content);
      setSending(false);
      window.alert("couldn’t save your question — please try again.");
      return;
    }

    if (data) {
      setQAs((m) => m.map((q) => (q.id === optimistic.id ? (data as QA) : q)));
    }
    setSending(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3200);
  };

  return (
    <div className="ama">
      <div className="ama-feed">
        <div className="ama-day mono">— ask me anything —</div>
        <div className="ama-state mono">
          ask me anything — vivian-ish bot replies first, real vivian may answer later
        </div>

        {state === "loading" && (
          <div className="ama-state mono">loading the wall…</div>
        )}
        {state === "error" && (
          <div className="ama-state err mono">
            couldn’t load the wall right now. try reopening this window.
          </div>
        )}
        {state === "ready" && qas.length === 0 && (
          <div className="ama-state mono">
            no questions yet — be the first to ask. 🍵
          </div>
        )}

        {qas.map((qa) => (
          <div key={qa.id} style={{ display: "contents" }}>
            <div className="bubble you">{qa.content}</div>
            {qa.answer ? (
              <div className="bubble viv">{qa.answer}</div>
            ) : (
              <div className="bubble viv pending">
                saved to the wall — real-me replies async (笑点很低, so make it fun).
              </div>
            )}
          </div>
        ))}

        {confirmed && (
          <div className="ama-day mono">✦ saved to the wall</div>
        )}
        <div ref={endRef} />
      </div>
      <form className="ama-input" onSubmit={send}>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="type a question…"
          disabled={sending}
          aria-label="your question"
        />
        <button className="send" aria-label="send" disabled={sending || !val.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
}
