// scene.jsx — the living bedroom (home). Cover-scaled art stage + interactive objects + eggs. → window
const { useState: useS, useEffect: useE, useRef: useR } = React;
const ART_W = 1536, ART_H = 1024;

function useStageTransform() {
  const [t, setT] = useS({ scale: 1, ox: 0, oy: 0, vw: 0, vh: 0 });
  useE(() => {
    const calc = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const scale = Math.max(vw / ART_W, vh / ART_H);
      setT({ scale, ox: (vw - ART_W * scale) / 2, oy: (vh - ART_H * scale) / 2, vw, vh });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return t;
}

function HomeScene({ theme, go, found, onFound, lampOn, setLampOn }) {
  const t = useStageTransform();
  const [hover, setHover] = useS(null);
  const toast = window.useToast();

  const handleEgg = (egg, e) => {
    if (egg.action === 'lamp') { setLampOn((v) => !v); }
    if (egg.toast) toast.push(egg.toast);
    if (egg.burst) toast.burst(egg.burst, e.clientX, e.clientY);
    if (!found.includes(egg.id) && egg.id !== 'lamp') onFound(egg.id);
  };

  const stageStyle = {
    position: 'absolute', top: 0, left: 0, width: ART_W, height: ART_H,
    transform: `translate(${t.ox}px, ${t.oy}px) scale(${t.scale})`, transformOrigin: 'top left',
  };

  return (
    <div className={`home ${lampOn ? '' : 'lamp-off'}`}>
      {/* ART STAGE (everything aligned to 1536x1024) */}
      <div style={stageStyle}>
        <img src="assets/bedroom.png" className="room-bg" alt="Vivian's dusk bedroom"
          style={{ filter: theme.sceneFilter }} draggable="false" />

        {/* warm light pools (candle + lamps) */}
        <div className="lightpool candle-pool" />
        <div className="lightpool nlamp-pool" />
        <div className="lightpool desklamp-pool" />

        {/* twinkles confined to window sky (art coords) */}
        <Twinkles theme={theme} />

        {/* glow layers for nav objects */}
        {NAV_OBJECTS.map((o) => (
          <img key={o.id} src={o.layer} alt="" aria-hidden="true" draggable="false"
            className={`obj-glow ${hover === o.id ? 'on' : ''}`} />
        ))}

        {/* easter-egg glows */}
        {EGGS.map((eg) => (
          <div key={eg.id} className={`egg-glow ${hover === eg.id ? 'on' : ''}`}
            style={{ left: eg.hit.left, top: eg.hit.top, width: eg.hit.width, height: eg.hit.height,
              background: `radial-gradient(closest-side, ${eg.glow}, transparent)` }} />
        ))}

        {/* hero text — anchored under baked name, in art space */}
        <div className="hero-art">
          <p className="hero-kicker mono">software engineer · pianist · matcha-powered builder</p>
          <button className="hero-hint" onClick={() => go('projects')}>
            <span className="dot" /> currently shipping: lettergen.io <span className="arr">→</span>
          </button>
        </div>
        <div className="explore-cue mono">everything in this room is clickable ✦ poke around</div>

        {/* HOTSPOTS — nav */}
        {NAV_OBJECTS.map((o) => (
          <button key={o.id} className="hotspot"
            style={{ left: o.hit.left, top: o.hit.top, width: o.hit.width, height: o.hit.height }}
            onMouseEnter={() => setHover(o.id)} onMouseLeave={() => setHover((h) => h === o.id ? null : h)}
            onFocus={() => setHover(o.id)} onBlur={() => setHover((h) => h === o.id ? null : h)}
            onClick={() => go(o.route)} aria-label={o.label}>
            <span className={`sticker ${hover === o.id ? 'show' : ''}`}>{o.label}</span>
          </button>
        ))}

        {/* HOTSPOTS — eggs */}
        {EGGS.map((eg) => (
          <button key={eg.id} className="hotspot egg"
            style={{ left: eg.hit.left, top: eg.hit.top, width: eg.hit.width, height: eg.hit.height }}
            onMouseEnter={() => setHover(eg.id)} onMouseLeave={() => setHover((h) => h === eg.id ? null : h)}
            onFocus={() => setHover(eg.id)} onBlur={() => setHover((h) => h === eg.id ? null : h)}
            onClick={(e) => handleEgg(eg, e)} aria-label={eg.label}>
            <span className={`sticker egg-sticker ${hover === eg.id ? 'show' : ''}`}>{eg.label}</span>
          </button>
        ))}
      </div>

      {/* SCREEN-SPACE CHROME */}
      <div className="scene-grade" style={{ background: theme.sceneOverlay }} />

      {/* rooms quick-nav (fallback / accessibility) */}
      <nav className="rooms-nav">
        <span className="rooms-label mono">rooms</span>
        {NAV_OBJECTS.map((o) => (
          <button key={o.id} className="room-link" onClick={() => go(o.route)}>{o.sub}</button>
        ))}
      </nav>

      {/* matcha-leaf egg counter */}
      <div className="egg-counter mono" title="easter eggs found">
        🍵 <b>{found.length}</b><span className="egg-tot">/3 found</span>
      </div>
    </div>
  );
}

function Twinkles({ theme }) {
  const stars = useR(
    [[120,120],[210,90],[300,150],[150,210],[260,250],[95,300],[330,110],[200,330],
     [400,140],[470,200],[360,300],[440,360],[110,160],[280,190]]
    .map(([x,y]) => ({ x, y, d: 1.8 + Math.random()*2.6, delay: Math.random()*4, s: 2 + Math.random()*2.6 }))
  ).current;
  return (
    <div className="twinkles" aria-hidden="true">
      {stars.map((s, i) => (
        <span key={i} className="twinkle"
          style={{ left: s.x, top: s.y, width: s.s, height: s.s, background: theme.starColor,
            animationDuration: s.d + 's', animationDelay: s.delay + 's', opacity: theme.ambientLevel }} />
      ))}
    </div>
  );
}

Object.assign(window, { HomeScene });
