"use client";

import { useEffect, useState } from "react";
import { PIANO_VIDEOS } from "../data";
import { playNote, playChord } from "../audio";

const WHITE = ["C", "D", "E", "F", "G", "A", "B", "C2", "D2", "E2"];
// render a black key after these white keys (not E / B)
const BLACK_AFTER = ["C", "D", "F", "G", "A", "C2", "D2"];
// optional keyboard mapping while the piano is focused
const KEYMAP: Record<string, string> = {
  a: "C", w: "C#", s: "D", e: "D#", d: "E", f: "F", t: "F#",
  g: "G", y: "G#", h: "A", u: "A#", j: "B", k: "C2",
};

export default function PianoApp() {
  const [active, setActive] = useState<string | null>(null);

  const hit = (n: string) => {
    playNote(n);
    setActive(n);
    setTimeout(() => setActive((a) => (a === n ? null : a)), 180);
  };

  // nice-to-have: map a/s/d/f… → notes while the piano window is mounted+focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA"))
        return;
      const note = KEYMAP[e.key.toLowerCase()];
      if (note) {
        e.preventDefault();
        hit(note);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const whiteW = 100 / WHITE.length;

  return (
    <div className="piano">
      <div className="piano-keys" role="group" aria-label="playable piano">
        {WHITE.map((n) => (
          <button
            key={n}
            className={`wkey ${active === n ? "down" : ""}`}
            onMouseDown={() => hit(n)}
            aria-label={n}
          >
            <span className="klabel">{n.replace("2", "")}</span>
          </button>
        ))}
        {BLACK_AFTER.map((after) => {
          const idx = WHITE.indexOf(after);
          const note = `${after}#`;
          return (
            <button
              key={note}
              className={`bkey ${active === note ? "down" : ""}`}
              style={{
                left: `calc(${(idx + 1) * whiteW}% - ${0.5 * (whiteW * 0.62)}%)`,
                width: `${whiteW * 0.62}%`,
              }}
              onMouseDown={() => hit(note)}
              aria-label={note}
            />
          );
        })}
      </div>
      <p className="piano-hint mono">
        ↑ go on, press a key.{" "}
        <button className="lnk" onClick={() => playChord()}>
          play a chord
        </button>
      </p>
      <div className="rec-list">
        <div className="rec-head mono">
          recordings — classical mostly, k-pop saved for the gym
        </div>
        {PIANO_VIDEOS.map((v) => (
          <div key={v.id} className="rec">
            <div className="rec-frame">
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="rec-meta">
              <b>{v.title}</b>
              <span className="chip-sm mono">{v.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
