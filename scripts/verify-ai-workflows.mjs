import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "public/ai-workflows/code-change-workflow-presentation.html",
  "src/os/apps/ShareDocsApp.tsx",
];

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required AI workflow share file: ${file}`);
  }
  const stat = fs.statSync(fullPath);
  if (stat.size < 1000) {
    throw new Error(`AI workflow share file looks too small: ${file} (${stat.size} bytes)`);
  }
}

const removedPersonalWebDoc = path.join(root, "docs/ai-workflows/code-change-workflow.md");
if (fs.existsSync(removedPersonalWebDoc)) {
  throw new Error("Code Change Workflow markdown should live in viviannnl/ai-workflows, not personal-web");
}

const data = fs.readFileSync(path.join(root, "src/os/data.ts"), "utf8");
for (const expected of [
  '| "share-docs"',
  'id: "share-docs"',
  'name: "share.doc"',
]) {
  if (!data.includes(expected)) {
    throw new Error(`src/os/data.ts is missing ${expected}`);
  }
}

const registry = fs.readFileSync(path.join(root, "src/os/registry.ts"), "utf8");
for (const expected of [
  'import ShareDocsApp from "./apps/ShareDocsApp";',
  '"share-docs": ShareDocsApp',
]) {
  if (!registry.includes(expected)) {
    throw new Error(`src/os/registry.ts is missing ${expected}`);
  }
}

const app = fs.readFileSync(path.join(root, "src/os/apps/ShareDocsApp.tsx"), "utf8");
for (const expected of [
  "/ai-workflows/code-change-workflow-presentation.html",
  "https://github.com/viviannnl/ai-workflows/blob/main/code-change-workflow.md",
]) {
  if (!app.includes(expected)) {
    throw new Error(`ShareDocsApp.tsx is missing ${expected}`);
  }
}

const oldPersonalWebMarkdownUrl =
  "https://github.com/viviannnl/personal-web/blob/redesign/vivos-ui-refresh/docs/ai-workflows/code-change-workflow.md";
if (app.includes(oldPersonalWebMarkdownUrl)) {
  throw new Error("ShareDocsApp.tsx still links to the old personal-web markdown URL");
}

const html = fs.readFileSync(
  path.join(root, "public/ai-workflows/code-change-workflow-presentation.html"),
  "utf8",
);
if (!html.includes("Code Change Workflow") || !html.includes("Verification")) {
  throw new Error("Presentation HTML does not look like the code-change workflow artifact");
}

console.log("AI workflow share artifacts verified");
