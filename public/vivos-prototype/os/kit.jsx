// os/kit.jsx — Window chrome, drag, synth, toasts, confetti. → window
const { useState: kS, useEffect: kE, useRef: kR, useCallback: kC, createContext: kCtx, useContext: kU } = React;

/* ---------------- WebAudio synth (piano keys + command fun) ---------------- */
let _actx = null;
function audioCtx() {
  if (!_actx) { try { _actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (_actx && _actx.state === 'suspended') _actx.resume();
  return _actx;
}
const NOTE_FREQ = { C:261.63, 'C#':277.18, D:293.66, 'D#':311.13, E:329.63, F:349.23, 'F#':369.99, G:392.0, 'G#':415.3, A:440.0, 'A#':466.16, B:493.88, C2:523.25, 'C2#':554.37, D2:587.33, 'D2#':622.25, E2:659.25 };
function playFreq(freq, dur = 0.7, when = 0) {
  const ctx = audioCtx(); if (!ctx) return;
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = 'triangle'; osc.frequency.value = freq;
  // soft attack + bell-ish decay so it reads as "piano"
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(t); osc.stop(t + dur + 0.05);
}
function playNote(name, dur) { if (NOTE_FREQ[name]) playFreq(NOTE_FREQ[name], dur); }
function playChord(names = ['C', 'E', 'G', 'C2']) { names.forEach((n, i) => NOTE_FREQ[n] && playFreq(NOTE_FREQ[n], 1.1, i * 0.02)); }
window.vivAudio = { playNote, playChord, playFreq };

/* ---------------- Toasts + matcha rain ---------------- */
const FxCtx = kCtx(null);
function FxProvider({ children }) {
  const [toasts, setToasts] = kS([]);
  const [rain, setRain] = kS([]);
  const toast = kC((text, icon = '✦') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, text, icon }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);
  const matchaRain = kC(() => {
    const drops = Array.from({ length: 36 }, (_, i) => ({
      id: i + '-' + Date.now(), x: Math.random() * 100, delay: Math.random() * 0.8,
      dur: 1.8 + Math.random() * 1.6, rot: (Math.random() - 0.5) * 360, em: Math.random() > 0.5 ? '🍵' : '🌿',
    }));
    setRain(drops);
    setTimeout(() => setRain([]), 4200);
  }, []);
  return (
    <FxCtx.Provider value={{ toast, matchaRain }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="os-toast"><span className="os-toast-i">{t.icon}</span>{t.text}</div>
        ))}
      </div>
      {rain.length > 0 && (
        <div className="rain" aria-hidden="true">
          {rain.map((d) => (
            <span key={d.id} className="drop" style={{ left: d.x + 'vw', animationDelay: d.delay + 's',
              animationDuration: d.dur + 's', '--rot': d.rot + 'deg' }}>{d.em}</span>
          ))}
        </div>
      )}
    </FxCtx.Provider>
  );
}
const useFx = () => kU(FxCtx);

/* ---------------- drag hook (owns nothing; reports new x/y) ---------------- */
function useDrag(onMove, onStart) {
  const st = kR(null);
  const down = (e, x, y) => {
    if (e.button === 1 || e.button === 2) return;
    const p = e.touches ? e.touches[0] : e;
    st.current = { sx: p.clientX, sy: p.clientY, ox: x, oy: y };
    if (onStart) onStart();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const move = (e) => {
    if (!st.current) return;
    const nx = st.current.ox + (e.clientX - st.current.sx);
    const ny = st.current.oy + (e.clientY - st.current.sy);
    onMove(Math.max(-40, nx), Math.max(0, ny));
  };
  const up = () => { st.current = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  return down;
}

/* ---------------- Window ---------------- */
function VWindow({ win, app, focused, mobile, onFocus, onClose, onMove, onMax }) {
  const startDrag = useDrag((x, y) => onMove(win.id, x, y), () => onFocus(win.id));
  const Comp = window[app.comp];
  const style = win.max || mobile
    ? { left: mobile ? '4vw' : 24, top: mobile ? 64 : 52, width: mobile ? '92vw' : 'calc(100vw - 48px)',
        height: mobile ? 'calc(100dvh - 150px)' : 'calc(100vh - 150px)', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };
  return (
    <section className={`win acc-${app.accent} ${focused ? 'on' : ''}`} style={style}
      onMouseDown={() => onFocus(win.id)} role="dialog" aria-label={app.name}>
      <header className="win-bar" onPointerDown={(e) => { if (!mobile && !win.max) startDrag(e, win.x, win.y); }}
        onDoubleClick={() => onMax(win.id)}>
        <div className="lights">
          <button className="light close" title="close" onClick={(e) => { e.stopPropagation(); onClose(win.id); }} />
          <button className="light min" title="(it just wiggles)" onClick={(e) => { e.stopPropagation(); }} />
          <button className="light max" title="expand" onClick={(e) => { e.stopPropagation(); onMax(win.id); }} />
        </div>
        <span className="win-title"><span className="win-ico">{app.icon}</span>{app.name}</span>
        <span className="win-spacer" />
      </header>
      <div className="win-body">{Comp ? <Comp /> : <div style={{ padding: 24 }}>missing: {app.comp}</div>}</div>
    </section>
  );
}

Object.assign(window, { FxProvider, useFx, useDrag, VWindow });
