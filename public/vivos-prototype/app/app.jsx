// app.jsx — App shell: routing, theme application, tweaks, mount.
const { useState: aS, useEffect: aE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "living",
  "ambient": true,
  "lamp": true,
  "hints": false
}/*EDITMODE-END*/;

const VIEWS = {
  qa: window.QAPage, podcast: window.PodcastPage, piano: window.PianoPage,
  blog: window.BlogPage, projects: window.ProjectsPage,
};

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const theme = window.THEMES[t.direction] || window.THEMES.living;

  const [view, setView] = aS(() => localStorage.getItem('viv_view') || 'home');
  const [found, setFound] = aS(() => {
    try { return JSON.parse(localStorage.getItem('viv_eggs') || '[]'); } catch { return []; }
  });
  const prefersReduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduced = !t.ambient || prefersReduced;

  // apply theme css vars + flags to root
  aE(() => {
    const r = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => r.style.setProperty(k, v));
    r.dataset.dir = theme.key;
    r.classList.toggle('reduced', reduced);
    r.classList.toggle('show-hints', !!t.hints);
  }, [theme, reduced, t.hints]);

  aE(() => { localStorage.setItem('viv_view', view); }, [view]);
  aE(() => { localStorage.setItem('viv_eggs', JSON.stringify(found)); }, [found]);

  const go = (route) => { setView(route); };
  const onFound = (id) => setFound((p) => p.includes(id) ? p : [...p, id]);
  const setLampOn = (next) => setTweak('lamp', typeof next === 'function' ? next(t.lamp) : next);

  const Page = VIEWS[view];

  return (
    <window.ToastProvider>
      <div className="app-root">
        <div className="ambient-host"><window.Ambient theme={theme} reduced={reduced} /></div>

        <div className="view-fade" key={view}>
          {view === 'home'
            ? <window.HomeScene theme={theme} go={go} found={found} onFound={onFound}
                lampOn={t.lamp} setLampOn={setLampOn} />
            : Page ? <Page theme={theme} go={go} /> : null}
        </div>

        {view !== 'home' && <window.FloatingHome onHome={() => go('home')} />}

        <window.TweaksPanel>
          <window.TweakSection label="Direction" />
          <window.TweakRadio label="Mood" value={t.direction}
            options={['cozy', 'living', 'lab']}
            onChange={(v) => setTweak('direction', v)} />
          <window.TweakSection label="The room" />
          <window.TweakToggle label="Ambient motion" value={t.ambient}
            onChange={(v) => setTweak('ambient', v)} />
          <window.TweakToggle label="Cozy lamp on" value={t.lamp}
            onChange={(v) => setTweak('lamp', v)} />
          <window.TweakToggle label="Always show labels" value={t.hints}
            onChange={(v) => setTweak('hints', v)} />
        </window.TweaksPanel>
      </div>
    </window.ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
