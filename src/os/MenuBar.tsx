"use client";

import { useEffect, useState } from "react";
import { greeting } from "./data";

interface Props {
  onPalette: () => void;
  night: boolean;
  onNight: () => void;
  nowApp: string | null;
}

export default function MenuBar({ onPalette, night, onNight, nowApp }: Props) {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="menubar">
      <div className="mb-left">
        <button className="mb-logo" onClick={onPalette} title="command palette (⌘K)">
          <span className="logo-dot" /> VivOS
        </button>
        <span className="mb-greet mono">{greeting()}, you</span>
      </div>
      <div className="mb-right">
        <span className="mb-chip mono">now: {nowApp || "idle ✦"}</span>
        <span className="mb-chip mono battery" title="matcha levels: critical-high">
          🍵 88%
        </span>
        <button className="mb-chip btn mono" onClick={onPalette}>
          ⌘K
        </button>
        <button
          className="mb-chip btn"
          onClick={onNight}
          title="day / night"
          aria-label="toggle day / night"
        >
          {night ? "☀️" : "🌙"}
        </button>
        <span className="mb-clock mono">{clock}</span>
      </div>
    </div>
  );
}
