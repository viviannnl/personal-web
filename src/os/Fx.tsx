"use client";

// os/Fx.tsx — toast + matcha-rain context. Ported from the prototype kit.

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface Toast {
  id: string;
  text: string;
  icon: string;
}

interface Drop {
  id: string;
  x: number;
  delay: number;
  dur: number;
  rot: number;
  em: string;
}

interface FxValue {
  toast: (text: string, icon?: string) => void;
  matchaRain: () => void;
}

const FxCtx = createContext<FxValue | null>(null);

let _fxSeq = 0;
const uid = () => `fx-${Date.now().toString(36)}-${(_fxSeq++).toString(36)}`;

export function FxProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [rain, setRain] = useState<Drop[]>([]);

  const toast = useCallback((text: string, icon = "✦") => {
    const id = uid();
    setToasts((p) => [...p, { id, text, icon }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);

  const matchaRain = useCallback(() => {
    const drops: Drop[] = Array.from({ length: 36 }, (_, i) => ({
      id: `${i}-${Date.now()}`,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 1.8 + Math.random() * 1.6,
      rot: (Math.random() - 0.5) * 360,
      em: Math.random() > 0.5 ? "🍵" : "🌿",
    }));
    setRain(drops);
    setTimeout(() => setRain([]), 4200);
  }, []);

  return (
    <FxCtx.Provider value={{ toast, matchaRain }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="os-toast">
            <span className="os-toast-i">{t.icon}</span>
            {t.text}
          </div>
        ))}
      </div>
      {rain.length > 0 && (
        <div className="rain" aria-hidden="true">
          {rain.map((d) => (
            <span
              key={d.id}
              className="drop"
              style={
                {
                  left: `${d.x}vw`,
                  animationDelay: `${d.delay}s`,
                  animationDuration: `${d.dur}s`,
                  "--rot": `${d.rot}deg`,
                } as React.CSSProperties
              }
            >
              {d.em}
            </span>
          ))}
        </div>
      )}
    </FxCtx.Provider>
  );
}

export function useFx(): FxValue {
  const ctx = useContext(FxCtx);
  if (!ctx) throw new Error("useFx must be used within FxProvider");
  return ctx;
}
