import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const about = read("src/os/apps/AboutApp.tsx");
const data = read("src/os/data.ts");

const removedBuildCards = [
  "VivOS prototype",
  "VivOS handoff.md",
  "蒙特利尔长舌妇",
  "[ next experiment ]",
];

for (const title of removedBuildCards) {
  if (data.includes(title)) {
    throw new Error(`Removed build card is still present in src/os/data.ts: ${title}`);
  }
}

const removedAboutTextMarkers = [
  "about-name",
  "about-handle",
  "about-bio",
  "facts",
  "VIV.",
];

for (const marker of removedAboutTextMarkers) {
  if (about.includes(marker)) {
    throw new Error(`about.me still contains removed text/metadata marker: ${marker}`);
  }
}

if (!about.includes("https://www.linkedin.com/in/vivian-lii/")) {
  throw new Error("about.me is missing Vivian's LinkedIn link");
}

for (const label of [
  "Vivian Li",
  "李怡然",
  "heyy, welcome to VivOS — have fun",
  "see what I’m building →",
  "ask me anything",
]) {
  if (!about.includes(label)) {
    throw new Error(`about.me is missing expected text/button: ${label}`);
  }
}

console.log("VivOS content checks passed");
