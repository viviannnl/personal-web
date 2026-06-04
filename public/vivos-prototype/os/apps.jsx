// os/apps.jsx — window contents. → window
const { useState: pS, useEffect: pE, useRef: pR } = React;
const openApp = (id) => window.vivOpen && window.vivOpen(id);

/* ---------------- about.me ---------------- */
function AboutApp() {
  const V = window.VIV;
  return (
    <div className="about">
      <div className="about-head">
        <img className="about-av" src="assets/avatar.png" alt="Vivian" />
        <div>
          <h2 className="about-name">{V.user}</h2>
          <p className="about-handle mono">{V.handle} · {V.tagline}</p>
          <div className="chips">{V.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
        </div>
      </div>
      <div className="about-bio">
        {V.bio.map((b, i) => <p key={i}>{b}</p>)}
      </div>
      <div className="facts">
        {V.facts.map((f) => (
          <div key={f.k} className="fact"><span className="fact-k mono">{f.k}</span><span className="fact-v">{f.v}</span></div>
        ))}
      </div>
      <div className="about-cta">
        <button className="os-btn" onClick={() => openApp('builds')}>see what I’m building →</button>
        <button className="os-btn ghost" onClick={() => openApp('ama')}>ask me anything</button>
      </div>
    </div>
  );
}

/* ---------------- AMA.chat ---------------- */
function AmaApp() {
  const [msgs, setMsgs] = pS(() => {
    const out = [];
    [...window.QA_SEED].reverse().forEach((qa) => {
      out.push({ who: 'you', text: qa.q });
      out.push({ who: 'viv', text: qa.a });
    });
    return out;
  });
  const [val, setVal] = pS('');
  const [typing, setTyping] = pS(false);
  const endRef = pR(null);
  pE(() => { endRef.current && endRef.current.scrollIntoView({ block: 'nearest' }); }, [msgs, typing]);

  const send = (e) => {
    e.preventDefault();
    const q = val.trim(); if (!q) return;
    setMsgs((m) => [...m, { who: 'you', text: q }]); setVal(''); setTyping(true);
    // shape mirrors the real supabase insert; reply is async on the live site
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { who: 'viv', text: 'got it — saved to the wall. real-me replies async (笑点很低, so make it fun).', pending: true }]);
    }, 1100);
  };
  return (
    <div className="ama">
      <div className="ama-feed">
        <div className="ama-day mono">— ask me anything —</div>
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.who} ${m.pending ? 'pending' : ''}`}>{m.text}</div>
        ))}
        {typing && <div className="bubble viv typing"><span></span><span></span><span></span></div>}
        <div ref={endRef} />
      </div>
      <form className="ama-input" onSubmit={send}>
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="type a question…" />
        <button className="send" aria-label="send">➤</button>
      </form>
    </div>
  );
}

/* ---------------- piano.player (playable!) ---------------- */
const WHITE = ['C','D','E','F','G','A','B','C2','D2','E2'];
const BLACK = { C:'C#', D:'D#', F:'F#', G:'G#', A:'A#', C2:'D2#' }; // label only
const BLACK_AFTER = ['C','D','F','G','A','C2','D2']; // render a black key after these (not E/B)
function PianoApp() {
  const [active, setActive] = pS(null);
  const hit = (n) => { window.vivAudio.playNote(n); setActive(n); setTimeout(() => setActive((a) => a === n ? null : a), 180); };
  const whiteW = 100 / WHITE.length;
  return (
    <div className="piano">
      <div className="piano-keys" role="group" aria-label="playable piano">
        {WHITE.map((n) => (
          <button key={n} className={`wkey ${active === n ? 'down' : ''}`} onMouseDown={() => hit(n)}
            aria-label={n}><span className="klabel">{n.replace('2','')}</span></button>
        ))}
        {BLACK_AFTER.map((after) => {
          const idx = WHITE.indexOf(after);
          const note = after + '#';
          return (
            <button key={note} className={`bkey ${active === note ? 'down' : ''}`}
              style={{ left: `calc(${(idx + 1) * whiteW}% - ${0.5 * (whiteW * 0.62)}%)`, width: `${whiteW * 0.62}%` }}
              onMouseDown={() => { window.vivAudio.playNote(note); setActive(note); setTimeout(()=>setActive((a)=>a===note?null:a),180); }}
              aria-label={note} />
          );
        })}
      </div>
      <p className="piano-hint mono">↑ go on, press a key. <button className="lnk" onClick={() => window.vivAudio.playChord()}>play a chord</button></p>
      <div className="rec-list">
        <div className="rec-head mono">recordings — classical mostly, k-pop saved for the gym</div>
        {window.PIANO_VIDEOS.map((v) => (
          <div key={v.id} className="rec">
            <div className="rec-frame">
              <iframe src={`https://www.youtube.com/embed/${v.id}`} title={v.title} loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <div className="rec-meta"><b>{v.title}</b><span className="chip-sm mono">{v.tag}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- podcast.fm ---------------- */
function PodcastApp() {
  return (
    <div className="podcast">
      <div className="pod-banner">
        <span className="pod-eq"><i></i><i></i><i></i><i></i></span>
        <div><h2 lang="zh">蒙特利尔长舌妇</h2><p className="mono">on air · a Mandarin podcast with friends</p></div>
      </div>
      <div className="pod-embed">
        <iframe title="Spotify" src={window.PODCAST_EMBED} width="100%" height="100%"
          loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
      </div>
    </div>
  );
}

/* ---------------- yap.txt ---------------- */
function YapApp() {
  return (
    <div className="yap">
      <div className="yap-meta mono">~/yap.txt · {window.BLOG_POSTS.length} entries · autosaved</div>
      {window.BLOG_POSTS.map((p, i) => (
        <article key={i} className="note">
          <h3><span className="note-em">{p.emoji}</span>{p.title} <span className="note-tag mono">#{p.tag}</span></h3>
          <p>{p.body}</p>
        </article>
      ))}
      <div className="yap-cursor mono">▍</div>
    </div>
  );
}

/* ---------------- builds ---------------- */
function BuildsApp() {
  return (
    <div className="builds">
      <p className="builds-intro">the lab beneath the cozy. bias toward shipping, comfortable being wrong — that’s where the good stuff lives.</p>
      <div className="proj-grid">
        {window.PROJECTS.map((p) => (
          <div key={p.name} className={`proj acc-${p.accent} ${p.live ? '' : 'dim'}`}>
            <div className="proj-top"><h3>{p.name}</h3><span className={`tag ${p.live ? 'live' : ''} mono`}>{p.status}</span></div>
            <p>{p.blurb}</p>
            <div className="proj-foot">
              {p.open ? <button className="lnk mono" onClick={() => openApp(p.open)}>open ↗</button>
                : p.live && p.url !== '#' ? <a className="lnk mono" href={p.url} target="_blank" rel="noreferrer">visit ↗</a>
                : <span className="lnk mono muted">{p.live ? '' : 'soon™'}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- picks (recommendations) ---------------- */
function PicksApp() {
  const [tab, setTab] = pS('matcha');
  const tabs = window.PICK_TABS;
  const items = window.PICKS[tab] || [];
  const isMatcha = tab === 'matcha';
  return (
    <div className="picks">
      <div className="picks-note mono">⚠ {window.PICKS_NOTE}</div>
      <div className="picks-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`ptab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div className="picks-list">
        {items.map((it, i) => (
          <div key={i} className="pick">
            <div className="pick-top">
              <h3>{it.name}</h3>
              <span className="pick-rate" title={it.rate + '/5'}>
                {isMatcha ? '🍵'.repeat(it.rate) : '★'.repeat(it.rate)}
                <span className="pick-rate-off">{isMatcha ? '🍵'.repeat(5 - it.rate) : '★'.repeat(5 - it.rate)}</span>
              </span>
            </div>
            <div className="pick-meta mono">{it.area} · <span className="pick-tag">{it.tag}</span> <span className="pick-demo">sample</span></div>
            <p className="pick-note">“{it.note}”</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- terminal ---------------- */
const TERM_HELP = [
  'available commands:',
  '  help            this list',
  '  ls              list the apps',
  '  open <app>      launch an app (e.g. open piano)',
  '  whoami          who is this',
  '  matcha          ☔ → 🍵',
  '  chord           play a C-major chord',
  '  theme           toggle day / night',
  '  neofetch        system info, vibes included',
  '  joke            warning: 笑点很低',
  '  echo <text>     say it back',
  '  date            what time is it',
  '  clear           clean slate',
];
const JOKES = [
  'why do programmers prefer dark mode? because light attracts bugs. 🐛',
  'i told my matcha a joke. it couldn\u2019t stop steaming. 🍵',
  'there are 10 types of people: those who get binary and those who don\u2019t.',
  'i\u2019d tell you a UDP joke but you might not get it.',
  'my code works and i don\u2019t know why. my code doesn\u2019t work and i don\u2019t know why. balance.',
];
const NEOFETCH = [
  '   ╭───────╮   viv@vivos',
  '   │ ◠   ◡ │   ─────────────',
  '   │   ▽   │   os ......... VivOS 1.0',
  '   ╰───────╯   shell ...... vibesh',
  '               editor ..... vibe-coding',
  '               fuel ....... matcha (88%)',
  '               uptime ..... caffeinated',
  '               now ........ lofi + clack',
];
function TerminalApp() {
  const fx = window.useFx();
  const [lines, setLines] = pS(() => [
    { t: 'sys', text: 'VivOS terminal — vibesh 1.0' },
    { t: 'sys', text: 'type `help` to get started. ✦' },
  ]);
  const [val, setVal] = pS('');
  const endRef = pR(null), inRef = pR(null);
  pE(() => { endRef.current && endRef.current.scrollIntoView({ block: 'nearest' }); }, [lines]);

  const out = (arr) => setLines((l) => [...l, ...arr.map((text) => ({ t: 'out', text }))]);
  const run = (raw) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { t: 'in', text: cmd }]);
    if (!cmd) return;
    const [c, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');
    switch (c.toLowerCase()) {
      case 'help': out(TERM_HELP); break;
      case 'ls': out([window.APPS.map((a) => a.id).join('   ')]); break;
      case 'open': {
        const app = window.APPS.find((a) => a.id === arg.toLowerCase());
        if (app) { window.vivOpen && window.vivOpen(app.id); out(['→ opening ' + app.id + '…']); }
        else out(['open: no app named “' + arg + '”. try `ls`']);
        break;
      }
      case 'whoami': out(['vivian — builder, pianist, matcha enthusiast. 笑点很低.']); break;
      case 'matcha': fx.matchaRain(); out(['☔ → 🍵 it’s raining matcha']); break;
      case 'chord': window.vivAudio.playChord(); out(['♪ C major, for the soul']); break;
      case 'theme': window.vivToggleNight && window.vivToggleNight(); out(['flipped the lights.']); break;
      case 'neofetch': out(NEOFETCH); break;
      case 'joke': out([JOKES[Math.floor(Math.random() * JOKES.length)]]); break;
      case 'echo': out([arg || '']); break;
      case 'date': out([new Date().toString()]); break;
      case 'vibes': out(['vibes: immaculate ✦']); break;
      case 'sudo': out(['nice try 😏 you already have root — it’s your site.']); break;
      case 'clear': setLines([]); break;
      default: out(['command not found: ' + c + ' — try `help`']);
    }
  };
  const submit = (e) => { e.preventDefault(); run(val); setVal(''); };
  return (
    <div className="term" onClick={() => inRef.current && inRef.current.focus()}>
      <div className="term-feed">
        {lines.map((l, i) => (
          <div key={i} className={`tline ${l.t}`}>
            {l.t === 'in' && <span className="tprompt">viv@vivos ~ %</span>}
            <span className="ttext">{l.text}</span>
          </div>
        ))}
        <form className="term-input" onSubmit={submit}>
          <span className="tprompt">viv@vivos ~ %</span>
          <input ref={inRef} value={val} autoFocus spellCheck="false" autoComplete="off"
            onChange={(e) => setVal(e.target.value)} />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}

Object.assign(window, { AboutApp, AmaApp, PianoApp, PodcastApp, YapApp, BuildsApp, PicksApp, TerminalApp });
