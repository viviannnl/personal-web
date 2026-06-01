"use client";

import type { AppDef, AppId, LinkDef } from "./data";

interface Props {
  apps: AppDef[];
  links: LinkDef[];
  openIds: AppId[];
  onOpen: (id: AppId) => void;
  onLink: (href: string) => void;
}

export default function Dock({ apps, links, openIds, onOpen, onLink }: Props) {
  return (
    <div className="dock-wrap">
      <div className="dock">
        {apps.map((a) => (
          <button
            key={a.id}
            className={`dock-i ${openIds.includes(a.id) ? "open" : ""}`}
            onClick={() => onOpen(a.id)}
            data-label={a.name}
            aria-label={a.name}
          >
            <span className="dock-ico">{a.icon}</span>
            <span className="dock-dot" />
          </button>
        ))}
        <span className="dock-sep" />
        {links.map((l) => (
          <button
            key={l.id}
            className="dock-i"
            onClick={() => onLink(l.href)}
            data-label={l.name}
            aria-label={`${l.name} (opens in a new tab)`}
          >
            <span className="dock-ico">{l.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
