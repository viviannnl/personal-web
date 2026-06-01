"use client";

// settings — day/night, motion & fun, wallpaper, system accent.
// Replaces the prototype's design-tool Tweaks panel; values persist via useTweaks.

import { useOS } from "../OSContext";
import type { Wallpaper } from "../useTweaks";

const WALLPAPERS: Wallpaper[] = ["mesh", "grid", "dawn"];
const ACCENTS = ["#8a5cf0", "#3aa3ff", "#ff7a9c", "#f0a020", "#5cc98a"];

export default function SettingsApp() {
  const { tweaks, setTweak } = useOS();

  return (
    <div className="settings">
      <div className="set-sect">System</div>
      <div className="set-row">
        <span>Night mode</span>
        <button
          type="button"
          className="set-toggle"
          role="switch"
          aria-checked={tweaks.night}
          aria-label="Night mode"
          data-on={tweaks.night ? "1" : "0"}
          onClick={() => setTweak("night", !tweaks.night)}
        >
          <i />
        </button>
      </div>
      <div className="set-row">
        <span>Motion &amp; fun</span>
        <button
          type="button"
          className="set-toggle"
          role="switch"
          aria-checked={tweaks.motion}
          aria-label="Motion and fun"
          data-on={tweaks.motion ? "1" : "0"}
          onClick={() => setTweak("motion", !tweaks.motion)}
        >
          <i />
        </button>
      </div>

      <div className="set-sect">Wallpaper</div>
      <div className="set-row">
        <span>Style</span>
        <div className="set-seg" role="radiogroup" aria-label="Wallpaper style">
          {WALLPAPERS.map((w) => (
            <button
              key={w}
              type="button"
              role="radio"
              aria-checked={tweaks.wallpaper === w}
              className={tweaks.wallpaper === w ? "on" : ""}
              onClick={() => setTweak("wallpaper", w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="set-sect">Accent</div>
      <div className="set-row">
        <span>System accent</span>
        <div className="set-swatches" role="radiogroup" aria-label="System accent">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={tweaks.accent === c}
              aria-label={c}
              title={c}
              className={`set-swatch ${tweaks.accent === c ? "on" : ""}`}
              style={{ background: c }}
              onClick={() => setTweak("accent", c)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
