"use client";

// os/Root.tsx — top-level client root: tweaks + boot splash + desktop.

import { useEffect, useState } from "react";
import { FxProvider } from "./Fx";
import { useTweaks } from "./useTweaks";
import BootSplash from "./BootSplash";
import Desktop from "./Desktop";

export default function Root() {
  const [tweaks, setTweak] = useTweaks();
  const [booted, setBooted] = useState(false);

  // reflect tweaks onto <html> (night / reduced-motion / accent)
  useEffect(() => {
    const r = document.documentElement;
    r.classList.toggle("night", tweaks.night);
    r.classList.toggle("reduced", !tweaks.motion);
    r.style.setProperty("--accent", tweaks.accent);
  }, [tweaks.night, tweaks.motion, tweaks.accent]);

  return (
    <FxProvider>
      {!booted && <BootSplash onDone={() => setBooted(true)} />}
      <Desktop tweaks={tweaks} setTweak={setTweak} />
    </FxProvider>
  );
}
