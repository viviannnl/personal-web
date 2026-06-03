"use client";

import { useOS } from "../OSContext";

const LINKEDIN_URL = "https://www.linkedin.com/in/vivian-lii/";

export default function AboutApp() {
  const { open } = useOS();
  return (
    <div className="about">
      <div className="about-cta">
        <button className="os-btn" onClick={() => open("builds")}>
          see what I’m building →
        </button>
        <button className="os-btn ghost" onClick={() => open("ama")}>
          ask me anything
        </button>
        <a className="os-btn ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
      </div>
    </div>
  );
}
