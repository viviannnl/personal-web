// os/chrome.jsx — menu bar, dock, command palette, boot splash. → window
const { useState: cS, useEffect: cE, useRef: cR } = React;

/* ---------------- Menu bar ---------------- */
function MenuBar({ onPalette, night, onNight, nowApp }) {
  const [clock, setClock] = cS('');
  cE(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div className="menubar">
      <div className="mb-left">
        <button className="mb-logo" onClick={onPalette} title="command palette (⌘K)">
          <span className="logo-dot" /> VivOS
        </button>
        <span className="mb-greet mono">{window.greeting()}, you</span>
      </div>
      <div className="mb-right">
        <span className="mb-chip mono">now: {nowApp || 'idle ✦'}</span>
        <span className="mb-chip mono battery" title="matcha levels: critical-high">🍵 88%</span>
        <button className="mb-chip btn mono" onClick={onPalette}>⌘K</button>
        <button className="mb-chip btn" onClick={onNight} title="day / night">{night ? '☀️' : '🌙'}</button>
        <span className="mb-clock mono">{clock}</span>
      </div>
    </div>
  );
}

/* ---------------- Dock ---------------- */
function Dock({ apps, links, openIds, onOpen, onLink }) {
  return (
    <div className="dock-wrap">
      <div className="dock">
        {apps.map((a) => (
          <button key={a.id} className={`dock-i ${openIds.includes(a.id) ? 'open' : ''}`}
            onClick={() => onOpen(a.id)} data-label={a.name}>
            <span className="dock-ico">{a.icon}</span>
            <span className="dock-dot" />
          </button>
        ))}
        <span className="dock-sep" />
        {links.map((l) => (
          <button key={l.id} className="dock-i" onClick={() => onLink(l.href)} data-label={l.name}>
            <span className="dock-ico">{l.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Command palette ---------------- */
function CommandPalette({ open, onClose, apps, commands, onOpen, onCommand }) {
  const [q, setQ] = cS('');
  const [sel, setSel] = cS(0);
  const inputRef = cR(null);
  const items = React.useMemo(() => {
    const appItems = apps.map((a) => ({ id: a.id, label: a.name, hint: 'app', icon: a.icon, kind: 'open' }));
    const all = [...appItems, ...commands];
    const s = q.trim().toLowerCase();
    return s ? all.filter((i) => i.label.toLowerCase().includes(s) || (i.hint || '').includes(s)) : all;
  }, [q, apps, commands]);
  cE(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);
  cE(() => { setSel(0); }, [q]);
  if (!open) return null;
  const run = (it) => { if (!it) return; it.kind === 'open' ? onOpen(it.id) : onCommand(it); onClose(); };
  const key = (e) => {
    if (e.key === 'Escape') return onClose();
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); run(items[sel]); }
  };
  return (
    <div className="palette-scrim" onMouseDown={onClose}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()}>
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key}
          placeholder="jump to an app, or try a command…" className="palette-input" />
        <div className="palette-list">
          {items.map((it, i) => (
            <button key={it.id} className={`palette-item ${i === sel ? 'sel' : ''}`}
              onMouseEnter={() => setSel(i)} onClick={() => run(it)}>
              <span className="pi-ico">{it.icon}</span>
              <span className="pi-label">{it.label}</span>
              <span className="pi-hint mono">{it.hint}</span>
            </button>
          ))}
          {items.length === 0 && <div className="palette-empty mono">no matches — try “matcha” 🍵</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Boot splash ---------------- */
function BootSplash({ onDone }) {
  const [gone, setGone] = cS(false);
  cE(() => {
    const t1 = setTimeout(() => setGone(true), 1900);
    const t2 = setTimeout(() => onDone && onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className={`boot ${gone ? 'gone' : ''}`} onClick={() => { setGone(true); setTimeout(() => onDone && onDone(), 450); }}>
      <div className="boot-mark"><span className="logo-dot big" /> VivOS</div>
      <div className="boot-greet mono">{window.greeting()} — booting Vivian’s operating system</div>
      <div className="boot-bar"><span /></div>
      <div className="boot-skip mono">click to skip</div>
    </div>
  );
}

Object.assign(window, { MenuBar, Dock, CommandPalette, BootSplash });
