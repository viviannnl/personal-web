// os/data.jsx — VivOS content, app registry, commands. → window
const VIV = {
  user: 'Vivian Li',
  handle: '@viviannnl',
  // playful, distilled — surfaces the builder + the approachable goofball
  tagline: 'software engineer · builder · matcha-powered',
  bio: [
    "I build things to find out what becomes possible — not what's safe.",
    "Engineer by training, explorer by instinct. I'd rather ship a wrong thing today than plan a right thing forever.",
    "Drawn to people drawing new maps instead of following old ones.",
  ],
  // the goofy human side
  facts: [
    { k: 'fuel', v: 'ceremonial matcha (no notes)' },
    { k: 'plays', v: 'classical piano · k-pop in the gym' },
    { k: 'sport', v: 'badminton (recreational, competitive heart)' },
    { k: 'arc', v: 'a consistent gym arc — it\u2019s going ok!' },
    { k: 'warning', v: '笑点很低 — I will laugh at your bad joke' },
    { k: 'goal', v: 'get rich, enjoy life, stay curious' },
  ],
  tags: ['curious', 'experimental', 'builder', 'future-facing', 'slightly rebellious', 'approachable', 'fast-moving'],
};

// app registry — order matters for the dock
const APPS = [
  { id: 'about',   name: 'about.me',     icon: '🪪', accent: 'purple', w: 560, h: 470, comp: 'AboutApp' },
  { id: 'ama',     name: 'AMA.chat',     icon: '💬', accent: 'sky',    w: 460, h: 560, comp: 'AmaApp' },
  { id: 'piano',   name: 'piano.player', icon: '🎹', accent: 'coral',  w: 620, h: 520, comp: 'PianoApp' },
  { id: 'podcast', name: 'podcast.fm',   icon: '🎙️', accent: 'amber',  w: 460, h: 600, comp: 'PodcastApp' },
  { id: 'yap',     name: 'yap.txt',      icon: '📝', accent: 'matcha', w: 540, h: 520, comp: 'YapApp' },
  { id: 'builds',  name: 'builds',       icon: '🛠️', accent: 'purple', w: 600, h: 480, comp: 'BuildsApp' },
  { id: 'picks',   name: 'picks',        icon: '🗺️', accent: 'matcha', w: 600, h: 560, comp: 'PicksApp' },
  { id: 'terminal',name: 'terminal',     icon: '🖥️', accent: 'sky',    w: 580, h: 420, comp: 'TerminalApp' },
];
// dock-only launchers (external)
const LINKS = [
  { id: 'github', name: 'github', icon: '🐙', href: 'https://github.com/viviannnl' },
];

const PIANO_VIDEOS = [
  { id: 'W2ESzbZUQq0', title: 'Childhood Memories', tag: 'a mood' },
  { id: '2Z2mr670q_o', title: 'Widmung', tag: 'Schumann / Liszt' },
  { id: 'WPdKYKog35M', title: 'Chopin Preludes', tag: 'Chopin' },
];
const PODCAST_EMBED = 'https://open.spotify.com/embed/show/3r8xcegBmUhJnSJ4W91GFN?utm_source=generator&theme=0';

const BLOG_POSTS = [
  { emoji: '🚀', title: 'welcome to my yapping blog', tag: 'meta',
    body: "thoughts, stories, updates. mostly yapping — that's the whole point." },
  { emoji: '🎮', title: 'where this came from', tag: 'origin',
    body: 'played "Insomnia: Theater in the Head" and thought — i could build a little world too. so i did. you\u2019re standing in version two.' },
  { emoji: '🍵', title: 'vibe coding, but make it matcha', tag: 'building',
    body: "let the model write the boring parts; argue with it about the fun parts. ceremonial matcha + a half-built idea is basically my whole personality rn." },
  { emoji: '🎹', title: 'why i still go to recitals', tag: 'music',
    body: "something about a dark hall and one person doing one hard thing extremely well. open the piano app — i left the keys on." },
];

const QA_SEED = [
  { id: 3, q: 'are you actually going to read this?', a: 'every single one. fair warning: 笑点很低, so a mid joke will 100% land on me.' },
  { id: 2, q: 'piano or coding?', a: 'coding pays for the piano. piano keeps the coding sane. symbiosis.' },
  { id: 1, q: 'what are you building right now?', a: 'things that shouldn\u2019t be possible yet. ask again next week — answer changes a lot.' },
];

const PROJECTS = [
  { name: 'lettergen.io', status: 'shipped', live: true, url: 'https://lettergen.io', accent: 'matcha',
    blurb: 'cover letters that don\u2019t read like a robot wrote them (irony noted). my answer to the job-hunt grind.' },
  { name: 'VivOS', status: 'you\u2019re in it', live: true, url: '#', accent: 'purple',
    blurb: 'this whole desktop. a personal operating system instead of a portfolio. drag stuff around.' },
  { name: '蒙特利尔长舌妇', status: 'on air', live: true, url: '#', accent: 'amber', open: 'podcast',
    blurb: 'a Mandarin podcast with friends. gossip, life abroad, us cackling at our own jokes.' },
  { name: '[ next experiment ]', status: 'incubating', live: false, url: '#', accent: 'sky',
    blurb: 'whatever becomes possible that wasn\u2019t last month. bias toward shipping, comfy being wrong.' },
];

// command palette entries (apps are appended at runtime)
const COMMANDS = [
  { id: 'cmd-night', label: 'Toggle day / night', hint: 'theme', kind: 'night', icon: '🌙' },
  { id: 'cmd-matcha', label: 'Make it rain matcha', hint: 'fun', kind: 'matcha', icon: '🍵' },
  { id: 'cmd-chord', label: 'Play a C-major chord', hint: 'fun', kind: 'chord', icon: '🎶' },
  { id: 'cmd-surprise', label: 'Surprise me', hint: 'fun', kind: 'surprise', icon: '✨' },
  { id: 'cmd-tidy', label: 'Tidy the desktop', hint: 'window', kind: 'tidy', icon: '🧹' },
  { id: 'cmd-gh', label: 'Open GitHub', hint: 'link', kind: 'github', icon: '🐙' },
];

// recommendations — DEMO DATA. swap for the real list once the recs API ships.
const PICKS_NOTE = 'demo picks · these swap for Vivian’s real list once the recs API is live';
const PICKS = {
  matcha: [
    { name: 'Nana’s Green Tea', area: 'downtown', note: 'thick ceremonial usucha, no sugar needed. my reset button.', rate: 5, tag: 'usucha' },
    { name: 'Matcha Lab', area: 'mile end', note: 'the latte that converted three of my friends.', rate: 4, tag: 'latte' },
    { name: 'Quiet Leaf', area: 'plateau', note: 'tiny counter, perfect whisk, zero seating. grab & walk.', rate: 4, tag: 'to-go' },
  ],
  eats: [
    { name: 'Late-night Noodle Co.', area: 'chinatown', note: 'open till 2am — exactly what post-deploy hunger needs.', rate: 5, tag: 'noodles' },
    { name: 'Aunty’s Table', area: 'home-style', note: 'tastes like someone’s mom is worried you’re not eating.', rate: 5, tag: 'comfort' },
    { name: 'Shoōyu Bar', area: 'old town', note: 'ramen for special occasions / bad days. both qualify often.', rate: 4, tag: 'ramen' },
  ],
  bakeries: [
    { name: 'Butter & Crumb', area: 'mile end', note: 'a croissant with the right amount of structural chaos.', rate: 5, tag: 'croissant' },
    { name: 'Rise', area: 'downtown', note: 'sourdough that makes me feel like i have my life together.', rate: 4, tag: 'sourdough' },
    { name: 'Sugar Hour', area: 'plateau', note: 'matcha basque cheesecake. yes. obviously.', rate: 5, tag: 'matcha 🍵' },
  ],
  classical: [
    { name: 'Schumann — Widmung', area: 'Liszt transcription', note: 'the one i keep coming back to. devotion, then fireworks.', rate: 5, tag: 'piece' },
    { name: 'Chopin — Preludes Op.28', area: 'all 24', note: 'a whole emotional weather system in 40 minutes.', rate: 5, tag: 'piece' },
    { name: 'the little recital hall', area: 'friday nights', note: 'front row, small hall, one hard thing done extremely well.', rate: 4, tag: 'venue' },
  ],
};
const PICK_TABS = [
  { id: 'matcha', label: 'matcha', icon: '🍵' },
  { id: 'eats', label: 'eats', icon: '🍜' },
  { id: 'bakeries', label: 'bakeries', icon: '🥐' },
  { id: 'classical', label: 'classical', icon: '🎼' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'still up';
  if (h < 12) return 'good morning';
  if (h < 18) return 'good afternoon';
  return 'good evening';
}

Object.assign(window, {
  VIV, APPS, LINKS, PIANO_VIDEOS, PODCAST_EMBED, BLOG_POSTS, QA_SEED, PROJECTS, COMMANDS, greeting,
  PICKS, PICKS_NOTE, PICK_TABS,
});
