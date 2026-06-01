"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppDef, AppId, Command } from "./data";

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: string;
  kind: "open" | Command["kind"];
}

interface Props {
  open: boolean;
  onClose: () => void;
  apps: AppDef[];
  commands: Command[];
  onOpen: (id: AppId) => void;
  onCommand: (cmd: Command) => void;
}

export default function CommandPalette({
  open,
  onClose,
  apps,
  commands,
  onOpen,
  onCommand,
}: Props) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => {
    const appItems: Item[] = apps.map((a) => ({
      id: a.id,
      label: a.name,
      hint: "app",
      icon: a.icon,
      kind: "open",
    }));
    const cmdItems: Item[] = commands.map((c) => ({
      id: c.id,
      label: c.label,
      hint: c.hint,
      icon: c.icon,
      kind: c.kind,
    }));
    const all = [...appItems, ...cmdItems];
    const s = q.trim().toLowerCase();
    return s
      ? all.filter(
          (i) =>
            i.label.toLowerCase().includes(s) || i.hint.toLowerCase().includes(s),
        )
      : all;
  }, [q, apps, commands]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setSel(0);
  }, [q]);

  if (!open) return null;

  const run = (it?: Item) => {
    if (!it) return;
    if (it.kind === "open") {
      onOpen(it.id as AppId);
    } else {
      const cmd = commands.find((c) => c.id === it.id);
      if (cmd) onCommand(cmd);
    }
    onClose();
  };

  const key = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(items.length - 1, s + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      run(items[sel]);
    }
  };

  return (
    <div className="palette-scrim" onMouseDown={onClose}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={key}
          placeholder="jump to an app, or try a command…"
          className="palette-input"
          aria-label="command palette"
        />
        <div className="palette-list">
          {items.map((it, i) => (
            <button
              key={it.id}
              className={`palette-item ${i === sel ? "sel" : ""}`}
              onMouseEnter={() => setSel(i)}
              onClick={() => run(it)}
            >
              <span className="pi-ico">{it.icon}</span>
              <span className="pi-label">{it.label}</span>
              <span className="pi-hint mono">{it.hint}</span>
            </button>
          ))}
          {items.length === 0 && (
            <div className="palette-empty mono">no matches — try “matcha” 🍵</div>
          )}
        </div>
      </div>
    </div>
  );
}
