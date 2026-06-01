"use client";

import Image from "next/image";
import { VIV } from "../data";
import { useOS } from "../OSContext";

export default function AboutApp() {
  const { open } = useOS();
  return (
    <div className="about">
      <div className="about-head">
        <Image
          className="about-av"
          src="/avatar.png"
          alt="Vivian"
          width={88}
          height={88}
        />
        <div>
          <h2 className="about-name">{VIV.user}</h2>
          <p className="about-handle mono">
            {VIV.handle} · {VIV.tagline}
          </p>
          <div className="chips">
            {VIV.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="about-bio">
        {VIV.bio.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
      </div>
      <div className="facts">
        {VIV.facts.map((f) => (
          <div key={f.k} className="fact">
            <span className="fact-k mono">{f.k}</span>
            <span className="fact-v">{f.v}</span>
          </div>
        ))}
      </div>
      <div className="about-cta">
        <button className="os-btn" onClick={() => open("builds")}>
          see what I’m building →
        </button>
        <button className="os-btn ghost" onClick={() => open("ama")}>
          ask me anything
        </button>
      </div>
    </div>
  );
}
