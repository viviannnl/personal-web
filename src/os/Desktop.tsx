"use client";

// os/Desktop.tsx — window manager (open/close/focus/z/max) + chrome + ⌘K + commands.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  APPS,
  COMMANDS,
  LINKS,
  type AppId,
  type Command,
} from "./data";
import { playChord } from "./audio";
import { useFx } from "./Fx";
import { OSContext, type OSValue } from "./OSContext";
import type { Tweaks } from "./useTweaks";
import VWindow, { type WinState } from "./Window";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import CommandPalette from "./CommandPalette";

const appById = (id: AppId) => APPS.find((a) => a.id === id)!;

function useMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const f = () => setM(window.innerWidth < 760);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return m;
}

interface Props {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
}

export default function Desktop({ tweaks, setTweak }: Props) {
  const mobile = useMobile();
  const fx = useFx();
  const [wins, setWins] = useState<WinState[]>([]);
  const [focusId, setFocusId] = useState<AppId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const zRef = useRef(10);

  const focus = useCallback((id: AppId) => {
    zRef.current += 1;
    const z = zRef.current;
    setWins((w) => w.map((x) => (x.id === id ? { ...x, z } : x)));
    setFocusId(id);
  }, []);

  const open = useCallback(
    (id: AppId) => {
      const app = appById(id);
      if (!app) return;
      setWins((w) => {
        if (w.find((x) => x.id === id)) {
          zRef.current += 1;
          const z = zRef.current;
          return w.map((x) => (x.id === id ? { ...x, z } : x));
        }
        const n = w.length;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const x =
          id === "about" ? Math.max(24, (vw - app.w) / 2 - 40) : 110 + n * 34;
        const y =
          id === "about" ? Math.max(64, (vh - app.h) / 2 - 30) : 78 + n * 30;
        zRef.current += 1;
        return [
          ...w,
          { id, x, y, w: app.w, h: app.h, z: zRef.current, max: false },
        ];
      });
      setFocusId(id);
    },
    [],
  );

  const close = useCallback(
    (id: AppId) => setWins((w) => w.filter((x) => x.id !== id)),
    [],
  );
  const move = useCallback(
    (id: AppId, x: number, y: number) =>
      setWins((w) => w.map((p) => (p.id === id ? { ...p, x, y } : p))),
    [],
  );
  const toggleMax = useCallback(
    (id: AppId) =>
      setWins((w) => w.map((x) => (x.id === id ? { ...x, max: !x.max } : x))),
    [],
  );

  const setNight = useCallback(
    (v: boolean) => setTweak("night", v),
    [setTweak],
  );
  const toggleNight = useCallback(
    () => setTweak("night", !tweaks.night),
    [setTweak, tweaks.night],
  );

  // boot → open about (or an app named by ?app=)
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("app");
    const target = APPS.find((a) => a.id === (param as AppId))?.id ?? "about";
    const t = setTimeout(() => open(target), 100);
    return () => clearTimeout(t);
  }, [open]);

  // ⌘K
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const tidy = useCallback(() => {
    setWins((w) =>
      w.map((x, i) => ({ ...x, x: 110 + i * 34, y: 78 + i * 30, max: false })),
    );
    fx.toast("tidied. ✨ a rare moment of order", "🧹");
  }, [fx]);

  const runCommand = useCallback(
    (cmd: Command) => {
      switch (cmd.kind) {
        case "night":
          setNight(!tweaks.night);
          break;
        case "matcha":
          fx.matchaRain();
          fx.toast("it’s raining matcha 🍵", "🍵");
          break;
        case "chord":
          playChord();
          fx.toast("C major, for the soul", "🎶");
          break;
        case "tidy":
          tidy();
          break;
        case "github":
          window.open("https://github.com/viviannnl", "_blank");
          break;
        case "surprise": {
          const r = Math.random();
          if (r < 0.34) {
            fx.matchaRain();
            fx.toast("surprise: matcha 🍵", "🍵");
          } else if (r < 0.67) {
            playChord(["C", "E", "G", "B", "D2"]);
            fx.toast("surprise: a fancy chord ✨", "🎶");
          } else {
            const ids = APPS.map((a) => a.id);
            open(ids[Math.floor(Math.random() * ids.length)]);
          }
          break;
        }
      }
    },
    [fx, open, setNight, tidy, tweaks.night],
  );

  const openIds = wins.map((w) => w.id);
  const topWin = wins.reduce<WinState | null>(
    (a, b) => (!a || b.z > a.z ? b : a),
    null,
  );
  const nowApp = topWin ? appById(topWin.id).name : null;

  const osValue: OSValue = useMemo(
    () => ({ open, toggleNight, tweaks, setTweak }),
    [open, toggleNight, tweaks, setTweak],
  );

  return (
    <OSContext.Provider value={osValue}>
      <div
        className={`desktop wp-${tweaks.wallpaper}`}
        onMouseDown={() => setPaletteOpen(false)}
      >
        <div className="bg-grid" />
        <div className="bg-blobs" />

        {!mobile && (
          <div className="sticky">
            <b>psst —</b> drag the windows. press <kbd>⌘K</kbd> for commands. the
            piano actually plays. 🍵
            <span className="sticky-tape" />
          </div>
        )}

        <MenuBar
          onPalette={() => setPaletteOpen((p) => !p)}
          night={tweaks.night}
          onNight={toggleNight}
          nowApp={nowApp}
        />

        {wins.map((win) => (
          <VWindow
            key={win.id}
            win={win}
            app={appById(win.id)}
            mobile={mobile}
            focused={focusId === win.id}
            onFocus={focus}
            onClose={close}
            onMove={move}
            onMax={toggleMax}
          />
        ))}

        <Dock
          apps={APPS}
          links={LINKS}
          openIds={openIds}
          onOpen={open}
          onLink={(h) => window.open(h, "_blank")}
        />

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          apps={APPS}
          commands={COMMANDS}
          onOpen={open}
          onCommand={runCommand}
        />
      </div>
    </OSContext.Provider>
  );
}
