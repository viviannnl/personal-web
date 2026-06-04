// os/app.jsx — desktop window-manager + root App + tweaks + mount.
const { useState: aS, useEffect: aE, useRef: aR, useCallback: aC } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "night": false,
  "wallpaper": "mesh",
  "accent": "#8a5cf0",
  "motion": true
}/*EDITMODE-END*/;

function useMobile() {
  const [m, setM] = aS(typeof window !== 'undefined' && window.innerWidth < 760);
  aE(() => { const f = () => setM(window.innerWidth < 760); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return m;
}

function Desktop({ night, setNight, accent, wallpaper }) {
  const mobile = useMobile();
  const fx = window.useFx();
  const [wins, setWins] = aS([]);
  const [focusId, setFocusId] = aS(null);
  const [paletteOpen, setPaletteOpen] = aS(false);
  const zRef = aR(10);
  const appById = (id) => window.APPS.find((a) => a.id === id);

  const focus = aC((id) => { zRef.current += 1; const z = zRef.current;
    setWins((w) => w.map((x) => x.id === id ? { ...x, z } : x)); setFocusId(id); }, []);

  const open = aC((id) => {
    const app = appById(id); if (!app) return;
    setWins((w) => {
      if (w.find((x) => x.id === id)) { return w; }      // already open → focus handled below
      const n = w.length;
      const vw = window.innerWidth, vh = window.innerHeight;
      const x = id === 'about' ? Math.max(24, (vw - app.w) / 2 - 40) : 110 + n * 34;
      const y = id === 'about' ? Math.max(64, (vh - app.h) / 2 - 30) : 78 + n * 30;
      zRef.current += 1;
      return [...w, { id, x, y, w: app.w, h: app.h, z: zRef.current, max: false }];
    });
    setFocusId(id);
    requestAnimationFrame(() => focus(id));
  }, [focus]);

  const close = aC((id) => setWins((w) => w.filter((x) => x.id !== id)), []);
  const move = aC((id, x, y) => setWins((w) => w.map((x2) => x2.id === id ? { ...x2, x, y } : x2)), []);
  const toggleMax = aC((id) => setWins((w) => w.map((x) => x.id === id ? { ...x, max: !x.max } : x)), []);

  // expose for apps
  aE(() => { window.vivOpen = open; window.vivLink = (h) => window.open(h, '_blank'); window.vivToggleNight = () => setNight((n) => !n); }, [open, setNight]);

  // boot → open about
  aE(() => { const t = setTimeout(() => open('about'), 100); return () => clearTimeout(t); }, [open]);

  // ⌘K
  aE(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((p) => !p); }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const tidy = aC(() => {
    setWins((w) => w.map((x, i) => ({ ...x, x: 110 + i * 34, y: 78 + i * 30, max: false })));
    fx.toast('tidied. ✨ a rare moment of order', '🧹');
  }, [fx]);

  const runCommand = aC((it) => {
    switch (it.kind) {
      case 'night': setNight((n) => !n); break;
      case 'matcha': fx.matchaRain(); fx.toast('it’s raining matcha 🍵', '🍵'); break;
      case 'chord': window.vivAudio.playChord(); fx.toast('C major, for the soul', '🎶'); break;
      case 'tidy': tidy(); break;
      case 'github': window.open('https://github.com/viviannnl', '_blank'); break;
      case 'surprise': {
        const r = Math.random();
        if (r < 0.34) { fx.matchaRain(); fx.toast('surprise: matcha 🍵', '🍵'); }
        else if (r < 0.67) { window.vivAudio.playChord(['C','E','G','B','D2']); fx.toast('surprise: a fancy chord ✨', '🎶'); }
        else { const ids = window.APPS.map((a) => a.id); open(ids[Math.floor(Math.random() * ids.length)]); }
        break;
      }
      default: break;
    }
  }, [fx, open, setNight, tidy]);

  const openIds = wins.map((w) => w.id);
  const topWin = wins.reduce((a, b) => (!a || b.z > a.z ? b : a), null);
  const nowApp = topWin ? appById(topWin.id).name : null;

  return (
    <div className={`desktop wp-${wallpaper}`} onMouseDown={() => setPaletteOpen(false)}>
      <div className="bg-grid" />
      <div className="bg-blobs" />

      {/* welcome sticky */}
      {!mobile && (
        <div className="sticky">
          <b>psst —</b> drag the windows. press <kbd>⌘K</kbd> for commands.
          the piano actually plays. 🍵
          <span className="sticky-tape" />
        </div>
      )}

      <window.MenuBar onPalette={() => setPaletteOpen((p) => !p)} night={night} onNight={() => setNight((n) => !n)} nowApp={nowApp} />

      {wins.map((win) => (
        <window.VWindow key={win.id} win={win} app={appById(win.id)} mobile={mobile}
          focused={focusId === win.id} onFocus={focus} onClose={close} onMove={move} onMax={toggleMax} />
      ))}

      <window.Dock apps={window.APPS} links={window.LINKS} openIds={openIds}
        onOpen={open} onLink={(h) => window.open(h, '_blank')} />

      <window.CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)}
        apps={window.APPS} commands={window.COMMANDS} onOpen={open} onCommand={runCommand} />
    </div>
  );
}

function Root() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [booted, setBooted] = aS(false);
  const setNight = aC((v) => setTweak('night', typeof v === 'function' ? v(t.night) : v), [t.night, setTweak]);

  aE(() => {
    const r = document.documentElement;
    r.classList.toggle('night', !!t.night);
    r.classList.toggle('reduced', !t.motion);
    r.style.setProperty('--accent', t.accent);
  }, [t.night, t.motion, t.accent]);

  return (
    <window.FxProvider>
      {!booted && <window.BootSplash onDone={() => setBooted(true)} />}
      <Desktop night={t.night} setNight={setNight} accent={t.accent} wallpaper={t.wallpaper} />

      <window.TweaksPanel>
        <window.TweakSection label="System" />
        <window.TweakToggle label="Night mode" value={t.night} onChange={(v) => setTweak('night', v)} />
        <window.TweakToggle label="Motion & fun" value={t.motion} onChange={(v) => setTweak('motion', v)} />
        <window.TweakSection label="Wallpaper" />
        <window.TweakRadio label="Style" value={t.wallpaper} options={['mesh', 'grid', 'dawn']}
          onChange={(v) => setTweak('wallpaper', v)} />
        <window.TweakSection label="Accent" />
        <window.TweakColor label="System accent" value={t.accent}
          options={['#8a5cf0', '#3aa3ff', '#ff7a9c', '#f0a020', '#5cc98a']}
          onChange={(v) => setTweak('accent', v)} />
      </window.TweaksPanel>
    </window.FxProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
