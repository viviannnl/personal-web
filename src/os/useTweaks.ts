"use client";

// os/useTweaks.ts — day/night, motion, wallpaper, accent. Persisted to localStorage.
// (The prototype persisted via a design-tool host protocol; in production we use
//  localStorage so the user's choices survive reloads.)

import { useCallback, useEffect, useState } from "react";

export type Wallpaper = "mesh" | "grid" | "dawn";

export interface Tweaks {
  night: boolean;
  motion: boolean;
  wallpaper: Wallpaper;
  accent: string;
}

export const TWEAK_DEFAULTS: Tweaks = {
  night: false,
  motion: true,
  wallpaper: "mesh",
  accent: "#8a5cf0",
};

const STORAGE_KEY = "vivos.tweaks";

function load(): Tweaks {
  if (typeof window === "undefined") return TWEAK_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return TWEAK_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Tweaks>;
    return { ...TWEAK_DEFAULTS, ...parsed };
  } catch {
    return TWEAK_DEFAULTS;
  }
}

export function useTweaks(): [
  Tweaks,
  <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void,
] {
  // Start from defaults for a stable SSR/first paint, then hydrate from storage.
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);

  useEffect(() => {
    setTweaks(load());
  }, []);

  const setTweak = useCallback(
    <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
      setTweaks((prev) => {
        const next = { ...prev, [key]: value };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable — keep in-memory only */
        }
        return next;
      });
    },
    [],
  );

  return [tweaks, setTweak];
}
