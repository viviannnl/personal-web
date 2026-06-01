"use client";

import { BLOG_POSTS } from "../data";

export default function YapApp() {
  return (
    <div className="yap">
      <div className="yap-meta mono">
        ~/yap.txt · {BLOG_POSTS.length} entries · autosaved
      </div>
      {BLOG_POSTS.map((p, i) => (
        <article key={i} className="note">
          <h3>
            <span className="note-em">{p.emoji}</span>
            {p.title} <span className="note-tag mono">#{p.tag}</span>
          </h3>
          <p>{p.body}</p>
        </article>
      ))}
      <div className="yap-cursor mono">▍</div>
    </div>
  );
}
