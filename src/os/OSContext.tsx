"use client";

// os/OSContext.tsx — shared desktop API for apps (open windows, toggle theme, tweaks).

import { createContext, useContext } from "react";
import type { AppId } from "./data";
import type { Tweaks } from "./useTweaks";

export interface OSValue {
  open: (id: AppId) => void;
  toggleNight: () => void;
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
}

export const OSContext = createContext<OSValue | null>(null);

export function useOS(): OSValue {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within the Desktop");
  return ctx;
}
