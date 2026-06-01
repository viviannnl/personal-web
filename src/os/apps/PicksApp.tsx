"use client";

// picks (recommendations) — structure only for now.
// The live recommendations backend isn't wired yet, so rather than ship demo or
// unverifiable rows we render the real tab structure with an honest empty state.
// When the recommendations API lands, fetch per-category and render `.pick` rows
// (🍵×rating for matcha, ★×rating elsewhere) with loading / empty / error states.

import { useState } from "react";
import { PICK_TABS, type PickCategory } from "../data";

const EMPTY_COPY: Record<PickCategory, string> = {
  matcha: "the matcha map is being whisked up. check back soon. 🍵",
  eats: "the eats list is still simmering. check back soon.",
  bakeries: "fresh bakery picks are still proofing. check back soon.",
  classical: "the classical shortlist is being tuned. check back soon.",
};

export default function PicksApp() {
  const [tab, setTab] = useState<PickCategory>("matcha");
  const active = PICK_TABS.find((t) => t.id === tab);

  return (
    <div className="picks">
      <div className="picks-tabs" role="tablist" aria-label="recommendation categories">
        {PICK_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`ptab ${tab === t.id ? "on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <div className="picks-empty" role="tabpanel">
        <span className="pe-emoji">{active?.icon}</span>
        <span className="pe-title">{active?.label} — coming soon</span>
        <span className="pe-sub">{EMPTY_COPY[tab]}</span>
      </div>
    </div>
  );
}
