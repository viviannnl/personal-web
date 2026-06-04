// ui.jsx — shared atoms: Btn, Card, Toast, Ambient, PageShell, BackHome. → window
const { useState, useEffect, useRef, createContext, useContext, useCallback } = React;

/* ---------------- Toast / easter-egg feedback ---------------- */
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [bursts, setBursts] = useState([]);
  const push = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3400);
  }, []);
  const burst = useCallback((emoji, x, y) => {
    if (!emoji) return;
    const id = Math.random().toString(36).slice(2);
    const parts = Array.from({ length: 7 }, (_, i) => ({
      i, dx: (Math.random() - 0.5) * 160, dy: -60 - Math.random() * 120, r: (Math.random() - 0.5) * 80,
    }));
    setBursts((p) => [...p, { id, emoji, x, y, parts }]);
    setTimeout(() => setBursts((p) => p.filter((b) => b.id !== id)), 1100);
  }, []);
  return (
    <ToastCtx.Provider value={{ push, burst }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="toast-emoji">{t.emoji}</span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>
      {bursts.map((b) => (
        <div key={b.id} className="burst" style={{ left: b.x, top: b.y }}>
          {b.parts.map((p) => (
            <span key={p.i} className="burst-p"
              style={{ '--dx': p.dx + 'px', '--dy': p.dy + 'px', '--r': p.r + 'deg' }}>{b.emoji}</span>
          ))}
        </div>
      ))}
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

/* ---------------- Buttons ---------------- */
function Btn({ kind = 'gold', children, onClick, href, ...rest }) {
  const cls = `btn btn-${kind}`;
  if (href) return <a className={cls} href={href} target="_blank" rel="noreferrer" {...rest}>{children}</a>;
  return <button className={cls} onClick={onClick} {...rest}>{children}</button>;
}

/* ---------------- Card ---------------- */
function Card({ children, className = '', ...rest }) {
  return <div className={`panel ${className}`} {...rest}>{children}</div>;
}

/* ---------------- Ambient particles (stars, motes, scanlines) ---------------- */
function Ambient({ theme, reduced }) {
  // stars positioned in window region (art coords mapped via stage), but here we float over scene
  const stars = useRef(
    Array.from({ length: 26 }, () => ({
      x: Math.random() * 38, y: Math.random() * 42,
      d: 1.6 + Math.random() * 3, delay: Math.random() * 4, s: 1 + Math.random() * 2,
    }))
  ).current;
  const motes = useRef(
    Array.from({ length: 18 }, () => ({
      x: Math.random() * 100, y: 40 + Math.random() * 60,
      d: 10 + Math.random() * 14, delay: Math.random() * 10, s: 2 + Math.random() * 3,
    }))
  ).current;
  if (reduced) return theme.scanlines ? <div className="scanlines" /> : null;
  return (
    <div className="ambient" aria-hidden="true">
      {stars.map((s, i) => (
        <span key={'st' + i} className="star"
          style={{ left: s.x + '%', top: s.y + '%', width: s.s, height: s.s,
            background: theme.starColor, animationDuration: s.d + 's', animationDelay: s.delay + 's',
            opacity: theme.ambientLevel }} />
      ))}
      {motes.map((m, i) => (
        <span key={'mo' + i} className="mote"
          style={{ left: m.x + '%', top: m.y + '%', width: m.s, height: m.s,
            background: theme.motesColor, animationDuration: m.d + 's', animationDelay: m.delay + 's',
            opacity: 0.5 * theme.ambientLevel }} />
      ))}
      {theme.scanlines && <div className="scanlines" />}
    </div>
  );
}

/* ---------------- Page shell (inner pages) ---------------- */
function PageShell({ bg, grade, children, narrow }) {
  return (
    <div className="page">
      {bg && <div className="page-bg" style={{ backgroundImage: `url(${bg})` }} />}
      <div className="page-grade" style={grade ? { background: grade } : undefined} />
      <div className={`page-inner ${narrow ? 'narrow' : ''}`}>{children}</div>
    </div>
  );
}

/* ---------------- Floating home / nav buttons ---------------- */
function FloatingHome({ onHome }) {
  return (
    <button className="fab fab-home" onClick={onHome} aria-label="Back to the room" title="Back to the room">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
    </button>
  );
}

/* ---------------- Section header ---------------- */
function PageTitle({ kicker, title, children }) {
  return (
    <header className="page-title">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className="big-title">{title}</h1>
      {children && <p className="page-lede">{children}</p>}
    </header>
  );
}

Object.assign(window, {
  ToastProvider, useToast, Btn, Card, Ambient, PageShell, FloatingHome, PageTitle,
});
