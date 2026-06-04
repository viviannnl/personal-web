// data.jsx — themes (3 directions), content, helpers. Exposed on window.
const THEMES = {
  cozy: {
    key: 'cozy',
    name: 'Cozy Dusk',
    vars: {
      '--bg': '#1a1229',
      '--bg2': '#16101f',
      '--surface': '#241a38',
      '--surface2': '#2f2348',
      '--raised': '#3a2c57',
      '--line': 'rgba(255,255,255,.08)',
      '--line-gold': 'rgba(248,226,168,.16)',
      '--gold': '#f8e2a8',
      '--gold-deep': '#e9c46a',
      '--ember': '#f0a868',
      '--accent': '#b79cf0',
      '--accent2': '#f0a0c0',
      '--ink': '#ece6f5',
      '--ink-soft': '#bdb2cf',
      '--ink-mute': '#8a7ea0',
      '--glow': '0 0 8px rgba(248,226,168,.5), 0 0 26px rgba(248,226,168,.28)',
    },
    sceneFilter: 'saturate(1) brightness(1)',
    sceneOverlay: 'radial-gradient(60% 50% at 50% 18%, rgba(0,0,0,0), rgba(18,12,28,.35))',
    scanlines: false,
    starColor: 'rgba(248,238,210,.9)',
    motesColor: 'rgba(248,226,168,.5)',
    ambientLevel: 0.6,
  },
  living: {
    key: 'living',
    name: 'Living Room',
    vars: {
      '--bg': '#1c1430',
      '--bg2': '#160f26',
      '--surface': '#2a1d3f',
      '--surface2': '#352552',
      '--raised': '#43305f',
      '--line': 'rgba(255,255,255,.09)',
      '--line-gold': 'rgba(248,226,168,.2)',
      '--gold': '#f8e2a8',
      '--gold-deep': '#e9c46a',
      '--ember': '#f4b366',
      '--accent': '#f0a868',
      '--accent2': '#b79cf0',
      '--ink': '#f0eaf7',
      '--ink-soft': '#c7bcd8',
      '--ink-mute': '#938aa8',
      '--glow': '0 0 10px rgba(248,226,168,.6), 0 0 32px rgba(248,226,168,.34)',
    },
    sceneFilter: 'saturate(1.12) brightness(1.06) contrast(1.02)',
    sceneOverlay: 'radial-gradient(45% 40% at 72% 55%, rgba(240,168,104,.22), rgba(0,0,0,0) 70%), radial-gradient(70% 60% at 50% 20%, rgba(0,0,0,0), rgba(20,14,34,.32))',
    scanlines: false,
    starColor: 'rgba(255,244,214,.95)',
    motesColor: 'rgba(248,200,140,.6)',
    ambientLevel: 1,
  },
  lab: {
    key: 'lab',
    name: 'Midnight Lab',
    vars: {
      '--bg': '#0e0a1c',
      '--bg2': '#08060f',
      '--surface': '#14112a',
      '--surface2': '#1c1838',
      '--raised': '#241f44',
      '--line': 'rgba(111,227,224,.14)',
      '--line-gold': 'rgba(111,227,224,.22)',
      '--gold': '#f6e6b0',
      '--gold-deep': '#d9c98a',
      '--ember': '#6fe3e0',
      '--accent': '#6fe3e0',
      '--accent2': '#b06ff0',
      '--ink': '#e6f6f7',
      '--ink-soft': '#a9b6cf',
      '--ink-mute': '#6f7a9c',
      '--glow': '0 0 10px rgba(111,227,224,.6), 0 0 30px rgba(176,111,240,.4)',
    },
    sceneFilter: 'saturate(1.2) brightness(.92) contrast(1.08) hue-rotate(-12deg)',
    sceneOverlay: 'radial-gradient(50% 45% at 50% 12%, rgba(111,227,224,.16), rgba(0,0,0,0) 65%), linear-gradient(160deg, rgba(176,111,240,.14), rgba(8,6,16,.5))',
    scanlines: true,
    starColor: 'rgba(150,240,238,.95)',
    motesColor: 'rgba(140,220,240,.6)',
    ambientLevel: 1,
  },
};

// ---- Home scene: navigation objects (coords in 1536x1024 art space) ----
const NAV_OBJECTS = [
  { id: 'piano',  layer: 'assets/piano.png',  route: 'piano',    label: 'Watch me play 🎹', sub: 'piano',
    hit: { left: 430, top: 415, width: 575, height: 500 } },
  { id: 'laptop', layer: 'assets/laptop.png', route: 'projects', label: 'What I\u2019m building', sub: 'projects',
    hit: { left: 242, top: 622, width: 205, height: 150 } },
  { id: 'mic',    layer: 'assets/mic.png',    route: 'podcast',  label: 'Our podcast 🎙️', sub: 'podcast',
    hit: { left: 212, top: 778, width: 100, height: 235 } },
  { id: 'window', layer: 'assets/window.png', route: 'blog',     label: 'Yapping out here', sub: 'blog',
    hit: { left: 40, top: 55, width: 540, height: 420 } },
  { id: 'board',  layer: 'assets/board.png',  route: 'qa',       label: 'Ask me anything ✎', sub: 'Q&A',
    hit: { left: 1250, top: 80, width: 258, height: 500 } },
];

// ---- Easter-egg hotspots (no layer png; glow + effect) ----
const EGGS = [
  { id: 'cat',    hit: { left: 1288, top: 712, width: 145, height: 120 }, glow: 'rgba(248,200,220,.55)',
    label: 'pspsps', toast: { emoji: '🐱', text: 'meow. (the cat approves of your curiosity)' }, burst: '🐾' },
  { id: 'candle', hit: { left: 1078, top: 628, width: 110, height: 120 }, glow: 'rgba(240,168,104,.6)',
    label: 'make a wish', toast: { emoji: '🕯️', text: '一个愿望已记录 — wish logged. (to get rich & enjoy life, obviously)' }, burst: '✨' },
  { id: 'lamp',   hit: { left: 1018, top: 505, width: 120, height: 175 }, glow: 'rgba(255,210,140,.6)',
    label: 'toggle the cozy', toast: null, burst: null, action: 'lamp' },
  { id: 'arch',   hit: { left: 1022, top: 92,  width: 132, height: 285 }, glow: 'rgba(183,156,240,.55)',
    label: '???', toast: { emoji: '🪟', text: '> a small window into the build. (psst — check the projects)' }, burst: '·' },
];

// ---- Content ----
const PIANO_VIDEOS = [
  { src: 'https://www.youtube.com/embed/W2ESzbZUQq0', title: 'Childhood Memories', tag: 'original mood' },
  { src: 'https://www.youtube.com/embed/2Z2mr670q_o', title: 'Widmung', tag: 'Schumann / Liszt' },
  { src: 'https://www.youtube.com/embed/WPdKYKog35M', title: 'Chopin Preludes', tag: 'Chopin' },
];

const PODCAST_EMBED = 'https://open.spotify.com/embed/show/3r8xcegBmUhJnSJ4W91GFN?utm_source=generator&theme=0';

const BLOG_POSTS = [
  { emoji: '🚀', title: 'Welcome to my Yapping Blog!', date: 'pinned', tag: 'meta',
    body: "Here you'll find my thoughts, stories, and updates. Mostly thoughts. Okay, mostly yapping." },
  { emoji: '🎮', title: 'Inspiration', date: 'a while ago', tag: 'origin story',
    body: 'I played the game "Insomnia: Theater in the Head" and thought I could do something related to video games. This whole room kind of grew out of that feeling.' },
  { emoji: '🍵', title: 'vibe coding, but make it matcha', date: 'recent', tag: 'building',
    body: "Spent the weekend letting the model write the boring parts while I argued with it about the fun parts. Ceremonial-grade matcha + a half-built idea is basically my entire personality right now." },
  { emoji: '🎹', title: 'why I still go to recitals', date: 'recent', tag: 'music',
    body: "Something about sitting in a dark hall watching someone do one hard thing extremely well. Classical mostly, k-pop in the gym. No I will not be taking questions (ok actually I will — that\u2019s what the board is for)." },
];

const QA_SEED = [
  { id: 3, content: 'are you actually going to read this?', answer: 'every single one. fair warning: 笑点很低, so a mediocre joke will absolutely work on me.' },
  { id: 2, content: 'piano or coding?', answer: 'coding pays for the piano. piano keeps the coding sane. it\u2019s a whole ecosystem.' },
  { id: 1, content: 'what are you building right now?', answer: 'things that should not be possible yet. ask me again next week, the answer changes a lot.' },
];

const PROJECTS = [
  { name: 'lettergen.io', kind: 'shipped', live: true, url: 'https://lettergen.io', accent: 'gold',
    blurb: 'Cover letters that don\u2019t sound like a robot wrote them (the irony is not lost on me). My answer to the job-hunt grind.' },
  { name: 'this room', kind: 'always tinkering', live: true, url: '#', accent: 'accent',
    blurb: 'The site you\u2019re standing in. A cozy bedroom that\u2019s secretly a personal operating system. Click everything.' },
  { name: '蒙特利尔长舌妇', kind: 'on air', live: true, url: '#', accent: 'ember', route: 'podcast',
    blurb: 'A Mandarin podcast with friends. Gossip, life abroad, and us laughing at our own jokes.' },
  { name: '[ next experiment ]', kind: 'incubating', live: false, url: '#', accent: 'accent2',
    blurb: 'Whatever becomes possible that wasn\u2019t last month. Bias toward shipping, comfortable being wrong.' },
];

const NOW = [
  { k: 'building', v: 'vibe-coding small tools, fast' },
  { k: 'drinking', v: 'ceremonial matcha (no notes)' },
  { k: 'playing', v: 'Chopin · k-pop in the gym' },
  { k: 'training', v: 'badminton + a consistent gym arc (it\u2019s going ok!)' },
  { k: 'chasing', v: 'leverage — what\u2019s possible now that wasn\u2019t' },
];

Object.assign(window, {
  THEMES, NAV_OBJECTS, EGGS, PIANO_VIDEOS, PODCAST_EMBED,
  BLOG_POSTS, QA_SEED, PROJECTS, NOW,
});
