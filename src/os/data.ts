// os/data.ts — VivOS content, app registry, commands. Ported from the prototype.

export type AccentKey = "purple" | "sky" | "coral" | "amber" | "matcha";

export type AppId =
  | "about"
  | "ama"
  | "piano"
  | "podcast"
  | "yap"
  | "builds"
  | "picks"
  | "terminal"
  | "settings";

export interface AppDef {
  id: AppId;
  name: string;
  icon: string;
  accent: AccentKey;
  w: number;
  h: number;
}

export interface LinkDef {
  id: string;
  name: string;
  icon: string;
  href: string;
}

export const VIV = {
  user: "Vivian Li",
  handle: "@viviannnl",
  tagline: "software engineer · builder · matcha-powered",
  bio: [
    "I build things to find out what becomes possible — not what's safe.",
    "Engineer by training, explorer by instinct. I'd rather ship a wrong thing today than plan a right thing forever.",
    "Drawn to people drawing new maps instead of following old ones.",
  ],
  facts: [
    { k: "fuel", v: "ceremonial matcha (no notes)" },
    { k: "plays", v: "classical piano · k-pop in the gym" },
    { k: "sport", v: "badminton (recreational, competitive heart)" },
    { k: "arc", v: "a consistent gym arc — it’s going ok!" },
    { k: "warning", v: "笑点很低 — I will laugh at your bad joke" },
    { k: "goal", v: "get rich, enjoy life, stay curious" },
  ],
  tags: [
    "curious",
    "experimental",
    "builder",
    "future-facing",
    "slightly rebellious",
    "approachable",
    "fast-moving",
  ],
};

// app registry — order matters for the dock
export const APPS: AppDef[] = [
  { id: "about", name: "about.me", icon: "🪪", accent: "purple", w: 560, h: 470 },
  { id: "ama", name: "AMA.chat", icon: "💬", accent: "sky", w: 460, h: 560 },
  { id: "piano", name: "piano.player", icon: "🎹", accent: "coral", w: 620, h: 520 },
  { id: "podcast", name: "podcast.fm", icon: "🎙️", accent: "amber", w: 460, h: 600 },
  { id: "yap", name: "yap.txt", icon: "📝", accent: "matcha", w: 540, h: 520 },
  { id: "builds", name: "builds", icon: "🛠️", accent: "purple", w: 600, h: 480 },
  { id: "picks", name: "picks", icon: "🗺️", accent: "matcha", w: 600, h: 560 },
  { id: "terminal", name: "terminal", icon: "🖥️", accent: "sky", w: 580, h: 420 },
  { id: "settings", name: "settings", icon: "⚙️", accent: "purple", w: 380, h: 440 },
];

// dock-only launchers (external)
export const LINKS: LinkDef[] = [
  { id: "github", name: "github", icon: "🐙", href: "https://github.com/viviannnl" },
];

export const PIANO_VIDEOS = [
  { id: "W2ESzbZUQq0", title: "Childhood Memories", tag: "a mood" },
  { id: "2Z2mr670q_o", title: "Widmung", tag: "Schumann / Liszt" },
  { id: "WPdKYKog35M", title: "Chopin Preludes", tag: "Chopin" },
];

export const PODCAST_EMBED =
  "https://open.spotify.com/embed/show/3r8xcegBmUhJnSJ4W91GFN?utm_source=generator&theme=0";

export const BLOG_POSTS = [
  {
    emoji: "🚀",
    title: "welcome to my yapping blog",
    tag: "meta",
    body: "thoughts, stories, updates. mostly yapping — that's the whole point.",
  },
  {
    emoji: "🎮",
    title: "where this came from",
    tag: "origin",
    body: 'played "Insomnia: Theater in the Head" and thought — i could build a little world too. so i did. you’re standing in version two.',
  },
  {
    emoji: "🍵",
    title: "vibe coding, but make it matcha",
    tag: "building",
    body: "let the model write the boring parts; argue with it about the fun parts. ceremonial matcha + a half-built idea is basically my whole personality rn.",
  },
  {
    emoji: "🎹",
    title: "why i still go to recitals",
    tag: "music",
    body: "something about a dark hall and one person doing one hard thing extremely well. open the piano app — i left the keys on.",
  },
];

export interface Project {
  name: string;
  status: string;
  live: boolean;
  url: string;
  accent: AccentKey;
  blurb: string;
  open?: AppId;
}

export const PROJECTS: Project[] = [
  {
    name: "lettergen.io",
    status: "shipped",
    live: true,
    url: "https://lettergen.io",
    accent: "matcha",
    blurb:
      "cover letters that don’t read like a robot wrote them (irony noted). my answer to the job-hunt grind.",
  },
  {
    name: "VivOS",
    status: "you’re in it",
    live: true,
    url: "#",
    accent: "purple",
    blurb:
      "this whole desktop. a personal operating system instead of a portfolio. drag stuff around.",
  },
  {
    name: "VivOS prototype",
    status: "archived",
    live: true,
    url: "/vivos-prototype/index.html",
    accent: "sky",
    blurb:
      "the original HTML prototype and design source for this desktop — preserved as a browsable artifact.",
  },
  {
    name: "VivOS handoff.md",
    status: "notes",
    live: true,
    url: "/vivos-prototype/HANDOFF.md",
    accent: "amber",
    blurb:
      "the markdown implementation handoff that mapped the prototype into the Next.js personal site.",
  },
  {
    name: "蒙特利尔长舌妇",
    status: "on air",
    live: true,
    url: "#",
    accent: "amber",
    open: "podcast",
    blurb:
      "a Mandarin podcast with friends. gossip, life abroad, us cackling at our own jokes.",
  },
  {
    name: "[ next experiment ]",
    status: "incubating",
    live: false,
    url: "#",
    accent: "sky",
    blurb:
      "whatever becomes possible that wasn’t last month. bias toward shipping, comfy being wrong.",
  },
];

export type CommandKind =
  | "night"
  | "matcha"
  | "chord"
  | "surprise"
  | "tidy"
  | "github";

export interface Command {
  id: string;
  label: string;
  hint: string;
  kind: CommandKind;
  icon: string;
}

export const COMMANDS: Command[] = [
  { id: "cmd-night", label: "Toggle day / night", hint: "theme", kind: "night", icon: "🌙" },
  { id: "cmd-matcha", label: "Make it rain matcha", hint: "fun", kind: "matcha", icon: "🍵" },
  { id: "cmd-chord", label: "Play a C-major chord", hint: "fun", kind: "chord", icon: "🎶" },
  { id: "cmd-surprise", label: "Surprise me", hint: "fun", kind: "surprise", icon: "✨" },
  { id: "cmd-tidy", label: "Tidy the desktop", hint: "window", kind: "tidy", icon: "🧹" },
  { id: "cmd-gh", label: "Open GitHub", hint: "link", kind: "github", icon: "🐙" },
];

// recommendations tabs — data is fetched live; no demo rows are shipped.
export const PICK_TABS = [
  { id: "matcha", label: "matcha", icon: "🍵" },
  { id: "eats", label: "eats", icon: "🍜" },
  { id: "bakeries", label: "bakeries", icon: "🥐" },
  { id: "classical", label: "classical", icon: "🎼" },
] as const;

export type PickCategory = (typeof PICK_TABS)[number]["id"];

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "still up";
  if (h < 12) return "good morning";
  if (h < 18) return "good afternoon";
  return "good evening";
}
