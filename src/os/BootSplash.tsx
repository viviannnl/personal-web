"use client";

import { useEffect, useState } from "react";
import { greeting } from "./data";

export default function BootSplash({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 1900);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  const skip = () => {
    setGone(true);
    setTimeout(() => onDone(), 450);
  };

  return (
    <button className={`boot ${gone ? "gone" : ""}`} onClick={skip} aria-label="skip boot">
      <div className="boot-mark">
        <span className="logo-dot big" /> VivOS
      </div>
      <div className="boot-greet mono">
        {greeting()} — booting Vivian’s operating system
      </div>
      <div className="boot-bar">
        <span />
      </div>
      <div className="boot-skip mono">click to skip</div>
    </button>
  );
}
