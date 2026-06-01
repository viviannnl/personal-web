"use client";

// os/Window.tsx — window chrome (3 lights), drag, focus, maximize.

import { useRef } from "react";
import type { AppDef, AppId } from "./data";
import { REGISTRY } from "./registry";

export interface WinState {
  id: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  max: boolean;
}

function useDrag(onMove: (x: number, y: number) => void, onStart?: () => void) {
  const st = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(
    null,
  );

  const move = (e: PointerEvent) => {
    if (!st.current) return;
    const nx = st.current.ox + (e.clientX - st.current.sx);
    const ny = st.current.oy + (e.clientY - st.current.sy);
    onMove(Math.max(-40, nx), Math.max(0, ny));
  };
  const up = () => {
    st.current = null;
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  return (e: React.PointerEvent, x: number, y: number) => {
    if (e.button === 1 || e.button === 2) return;
    st.current = { sx: e.clientX, sy: e.clientY, ox: x, oy: y };
    onStart?.();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
}

interface Props {
  win: WinState;
  app: AppDef;
  focused: boolean;
  mobile: boolean;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  onMax: (id: AppId) => void;
}

export default function VWindow({
  win,
  app,
  focused,
  mobile,
  onFocus,
  onClose,
  onMove,
  onMax,
}: Props) {
  const startDrag = useDrag(
    (x, y) => onMove(win.id, x, y),
    () => onFocus(win.id),
  );
  const Comp = REGISTRY[app.id];

  const style: React.CSSProperties =
    win.max || mobile
      ? {
          left: mobile ? "4vw" : 24,
          top: mobile ? 64 : 52,
          width: mobile ? "92vw" : "calc(100vw - 48px)",
          height: mobile ? "calc(100dvh - 150px)" : "calc(100vh - 150px)",
          zIndex: win.z,
        }
      : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      className={`win acc-${app.accent} ${focused ? "on" : ""}`}
      style={style}
      onMouseDown={() => onFocus(win.id)}
      role="dialog"
      aria-label={app.name}
    >
      <header
        className="win-bar"
        onPointerDown={(e) => {
          if (!mobile && !win.max) startDrag(e, win.x, win.y);
        }}
        onDoubleClick={() => onMax(win.id)}
      >
        <div className="lights">
          <button
            className="light close"
            title="close"
            aria-label={`close ${app.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
          />
          <button
            className="light min"
            title="(it just wiggles)"
            aria-label="minimize (decorative)"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="light max"
            title="expand"
            aria-label={`maximize ${app.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onMax(win.id);
            }}
          />
        </div>
        <span className="win-title">
          <span className="win-ico">{app.icon}</span>
          {app.name}
        </span>
        <span className="win-spacer" />
      </header>
      <div className="win-body">
        {Comp ? <Comp /> : <div style={{ padding: 24 }}>missing: {app.id}</div>}
      </div>
    </section>
  );
}
