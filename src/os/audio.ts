// os/audio.ts — WebAudio piano synth. Ported from the prototype kit.
// Triangle oscillator with soft attack + bell-ish decay so it reads as "piano".

let _actx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_actx) {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      _actx = new Ctor();
    } catch {
      _actx = null;
    }
  }
  if (_actx && _actx.state === "suspended") void _actx.resume();
  return _actx;
}

export const NOTE_FREQ: Record<string, number> = {
  C: 261.63, "C#": 277.18, D: 293.66, "D#": 311.13, E: 329.63, F: 349.23,
  "F#": 369.99, G: 392.0, "G#": 415.3, A: 440.0, "A#": 466.16, B: 493.88,
  C2: 523.25, "C2#": 554.37, D2: 587.33, "D2#": 622.25, E2: 659.25,
};

export function playFreq(freq: number, dur = 0.7, when = 0): void {
  const ctx = audioCtx();
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function playNote(name: string, dur?: number): void {
  if (NOTE_FREQ[name]) playFreq(NOTE_FREQ[name], dur);
}

export function playChord(names: string[] = ["C", "E", "G", "C2"]): void {
  names.forEach((n, i) => NOTE_FREQ[n] && playFreq(NOTE_FREQ[n], 1.1, i * 0.02));
}
