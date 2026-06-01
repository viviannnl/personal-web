"use client";

import { PODCAST_EMBED } from "../data";

export default function PodcastApp() {
  return (
    <div className="podcast">
      <div className="pod-banner">
        <span className="pod-eq">
          <i />
          <i />
          <i />
          <i />
        </span>
        <div>
          <h2 lang="zh">蒙特利尔长舌妇</h2>
          <p className="mono">on air · a Mandarin podcast with friends</p>
        </div>
      </div>
      <div className="pod-embed">
        <iframe
          title="Spotify"
          src={PODCAST_EMBED}
          width="100%"
          height="100%"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>
    </div>
  );
}
