"use client";

// terminal — vibesh REPL. Ported from the prototype.

import { useEffect, useRef, useState } from "react";
import { APPS, type AppId } from "../data";
import { playChord } from "../audio";
import { useOS } from "../OSContext";
import { useFx } from "../Fx";

const TERM_HELP = [
  "available commands:",
  "  help            this list",
  "  ls              list the apps",
  "  open <app>      launch an app (e.g. open piano)",
  "  whoami          who is this",
  "  matcha          ☔ → 🍵",
  "  chord           play a C-major chord",
  "  theme           toggle day / night",
  "  neofetch        system info, vibes included",
  "  joke            warning: 笑点很低",
  "  echo <text>     say it back",
  "  date            what time is it",
  "  clear           clean slate",
];
const JOKES = [
  "why do programmers prefer dark mode? because light attracts bugs. 🐛",
  "i told my matcha a joke. it couldn’t stop steaming. 🍵",
  "there are 10 types of people: those who get binary and those who don’t.",
  "i’d tell you a UDP joke but you might not get it.",
  "my code works and i don’t know why. my code doesn’t work and i don’t know why. balance.",
];
const NEOFETCH = [
  "   ╭───────╮   viv@vivos",
  "   │ ◠   ◡ │   ─────────────",
  "   │   ▽   │   os ......... VivOS 1.0",
  "   ╰───────╯   shell ...... vibesh",
  "               editor ..... vibe-coding",
  "               fuel ....... matcha (88%)",
  "               uptime ..... caffeinated",
  "               now ........ lofi + clack",
];

interface Line {
  t: "sys" | "in" | "out";
  text: string;
}

export default function TerminalApp() {
  const { open, toggleNight } = useOS();
  const fx = useFx();
  const [lines, setLines] = useState<Line[]>([
    { t: "sys", text: "VivOS terminal — vibesh 1.0" },
    { t: "sys", text: "type `help` to get started. ✦" },
  ]);
  const [val, setVal] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  const out = (arr: string[]) =>
    setLines((l) => [...l, ...arr.map((text) => ({ t: "out" as const, text }))]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { t: "in", text: cmd }]);
    if (!cmd) return;
    const [c, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    switch (c.toLowerCase()) {
      case "help":
        out(TERM_HELP);
        break;
      case "ls":
        out([APPS.map((a) => a.id).join("   ")]);
        break;
      case "open": {
        const app = APPS.find((a) => a.id === (arg.toLowerCase() as AppId));
        if (app) {
          open(app.id);
          out([`→ opening ${app.id}…`]);
        } else {
          out([`open: no app named “${arg}”. try \`ls\``]);
        }
        break;
      }
      case "whoami":
        out(["vivian — builder, pianist, matcha enthusiast. 笑点很低."]);
        break;
      case "matcha":
        fx.matchaRain();
        out(["☔ → 🍵 it’s raining matcha"]);
        break;
      case "chord":
        playChord();
        out(["♪ C major, for the soul"]);
        break;
      case "theme":
        toggleNight();
        out(["flipped the lights."]);
        break;
      case "neofetch":
        out(NEOFETCH);
        break;
      case "joke":
        out([JOKES[Math.floor(Math.random() * JOKES.length)]]);
        break;
      case "echo":
        out([arg || ""]);
        break;
      case "date":
        out([new Date().toString()]);
        break;
      case "vibes":
        out(["vibes: immaculate ✦"]);
        break;
      case "sudo":
        out(["nice try 😏 you already have root — it’s your site."]);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        out([`command not found: ${c} — try \`help\``]);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(val);
    setVal("");
  };

  return (
    <div className="term" onClick={() => inRef.current?.focus()}>
      <div className="term-feed">
        {lines.map((l, i) => (
          <div key={i} className={`tline ${l.t}`}>
            {l.t === "in" && <span className="tprompt">viv@vivos ~ %</span>}
            <span className="ttext">{l.text}</span>
          </div>
        ))}
        <form className="term-input" onSubmit={submit}>
          <span className="tprompt">viv@vivos ~ %</span>
          <input
            ref={inRef}
            value={val}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal input"
            onChange={(e) => setVal(e.target.value)}
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}
