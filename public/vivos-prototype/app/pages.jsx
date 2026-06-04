// pages.jsx — inner pages. Each gets its own room scene + shared kit. → window
const { useState: uS, useEffect: uE } = React;

/* ---------------- Ask Me Anything ---------------- */
function QAPage({ theme }) {
  const [qas, setQas] = uS(null);          // null = loading
  const [content, setContent] = uS('');
  const [sending, setSending] = uS(false);
  const toast = window.useToast();

  uE(() => { const id = setTimeout(() => setQas(window.QA_SEED), 700); return () => clearTimeout(id); }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setTimeout(() => {                       // mock the supabase insert
      setQas((p) => [{ id: Date.now(), content: content.trim(), answer: null }, ...(p || [])]);
      setContent(''); setSending(false);
      toast.push({ emoji: '✎', text: 'got it — I read every one. answer coming soon.' });
    }, 600);
  };

  return (
    <PageShell narrow grade={theme.sceneOverlay}>
      <PageTitle kicker="// ask-me-anything.tsx" title="Ask Me Anything">
        No question too small or too weird. 笑点很低, so jokes are encouraged.
      </PageTitle>

      <form className="ama-form" onSubmit={submit}>
        <textarea className="field area" rows="3" value={content} disabled={sending}
          onChange={(e) => setContent(e.target.value)} placeholder="Type your question here…" />
        <div className="ama-actions">
          <span className="mono hint-mute">↩ stored to the question wall</span>
          <Btn kind="gold" disabled={sending}>{sending ? 'sending…' : 'Ask question'}</Btn>
        </div>
      </form>

      <div className="qa-wall">
        {qas === null && [0,1,2].map((i) => (
          <Card key={i} className="qa-item"><div className="skel" style={{width:'55%'}} /><div className="skel" style={{width:'85%',marginTop:10}} /></Card>
        ))}
        {qas && qas.length === 0 && (
          <div className="empty"><div className="empty-emoji">🌙</div><p className="mono">no questions yet — be the first</p></div>
        )}
        {qas && qas.map((qa) => (
          <Card key={qa.id} className="qa-item">
            <p className="qa-q">Q: {qa.content}</p>
            {qa.answer ? <p className="qa-a">A: {qa.answer}</p>
              : <p className="qa-pending mono">⋯ awaiting Vivian's reply</p>}
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ---------------- Podcast ---------------- */
function PodcastPage({ theme }) {
  return (
    <PageShell bg="assets/podcast_room.png" grade="linear-gradient(180deg, rgba(14,9,24,.55), rgba(14,9,24,.78))" narrow>
      <PageTitle kicker="// on air" title="Podcast Series">
        <span lang="zh">蒙特利尔长舌妇</span> — a Mandarin podcast with friends. Gossip, life abroad, and us cackling at our own jokes.
      </PageTitle>
      <Card className="embed-card">
        <iframe title="Spotify — 蒙特利尔长舌妇" src={window.PODCAST_EMBED} width="100%" height="352"
          loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ border: 0, borderRadius: 14 }} />
      </Card>
      <p className="caption mono">▶ best paired with a late-night walk</p>
    </PageShell>
  );
}

/* ---------------- Piano ---------------- */
function PianoPage({ theme }) {
  return (
    <PageShell bg="assets/piano_room.png" grade="linear-gradient(180deg, rgba(18,12,28,.5), rgba(18,12,28,.82))">
      <div className="page-inner-pad">
        <PageTitle kicker="// recital mode" title="🎹 Piano">
          Classical mostly — Chopin, Schumann — k-pop saved for the gym. Recordings from the room.
        </PageTitle>
        <div className="video-grid">
          {window.PIANO_VIDEOS.map((v, i) => (
            <Card key={i} className="video-card">
              <div className="video-frame">
                <iframe src={v.src} title={v.title} loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen style={{ border: 0 }} />
              </div>
              <div className="video-meta">
                <h3>{v.title}</h3>
                <span className="chip-tag mono">{v.tag}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ---------------- Blog ---------------- */
function BlogPage({ theme }) {
  return (
    <PageShell narrow grade={theme.sceneOverlay}>
      <div className="blog-icon"><img src="assets/window.png" alt="" aria-hidden="true" /></div>
      <PageTitle kicker="// dev/null/thoughts" title="My Yapping Blog">
        Thoughts, stories, updates. Mostly yapping — that's the whole point.
      </PageTitle>
      <div className="blog-list">
        {window.BLOG_POSTS.map((p, i) => (
          <Card key={i} className="blog-post">
            <div className="blog-head">
              <span className="blog-emoji">{p.emoji}</span>
              <h2>{p.title}</h2>
            </div>
            <p className="blog-body">{p.body}</p>
            <div className="blog-foot">
              <span className="chip-tag mono">#{p.tag}</span>
              <span className="mono blog-date">{p.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ---------------- Projects (the new "CTA" home) ---------------- */
function ProjectsPage({ theme, go }) {
  return (
    <PageShell narrow grade={theme.sceneOverlay}>
      <PageTitle kicker="// ~/builds" title="What I'm Building">
        The lab beneath the cozy. Bias toward shipping, comfortable being wrong — that's where the interesting stuff is.
      </PageTitle>

      <div className="now-strip">
        <span className="now-title mono">now</span>
        {window.NOW.map((n, i) => (
          <span key={i} className="now-item"><b className="mono">{n.k}</b> {n.v}</span>
        ))}
      </div>

      <div className="proj-grid">
        {window.PROJECTS.map((p, i) => (
          <Card key={i} className={`proj-card a-${p.accent} ${p.live ? '' : 'dim'}`}>
            <div className="proj-top">
              <h3>{p.name}</h3>
              <span className={`status ${p.live ? 'live' : 'soon'} mono`}>{p.kind}</span>
            </div>
            <p className="proj-blurb">{p.blurb}</p>
            <div className="proj-foot">
              {p.route ? <button className="proj-link mono" onClick={() => go(p.route)}>open ↗</button>
                : p.live && p.url !== '#' ? <a className="proj-link mono" href={p.url} target="_blank" rel="noreferrer">visit ↗</a>
                : <span className="proj-link mono muted">{p.live ? 'you\u2019re in it' : 'soon™'}</span>}
            </div>
          </Card>
        ))}
      </div>

      <div className="gh-row">
        <Btn kind="ghost" href="https://github.com/viviannnl">→ my GitHub</Btn>
      </div>
    </PageShell>
  );
}

Object.assign(window, { QAPage, PodcastPage, PianoPage, BlogPage, ProjectsPage });
