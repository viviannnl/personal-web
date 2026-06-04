import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const path = join(root, relativePath);
  if (!existsSync(path)) {
    failures.push(`Missing ${relativePath}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

const migrations = [
  'supabase/migrations/20260602000000_add_ama_rag_tables.sql',
];
const migration = migrations.map(read).join('\n');

for (const snippet of [
  'alter table public.questions',
  'add column if not exists bot_answer text',
  "add column if not exists answer_source text not null default 'pending'",
  'add column if not exists reviewed boolean not null default false',
  'create table if not exists public.vivian_style_examples',
  'create table if not exists public.vivian_knowledge',
  'alter table public.vivian_style_examples enable row level security',
  'alter table public.vivian_knowledge enable row level security',
]) {
  if (!migration.includes(snippet)) failures.push(`Migration missing: ${snippet}`);
}

const route = read('src/app/api/ama/bot/route.ts');
for (const snippet of [
  'export async function POST',
  'answerSource: "placeholder"',
  'real vivian-ish mode is still booting up — ask again soon. 🍵',
]) {
  if (!route.includes(snippet)) failures.push(`AMA bot route missing: ${snippet}`);
}
if (!/status:\s*400/.test(route)) failures.push('AMA bot route must reject invalid/empty content with HTTP 400');
if (/OPENAI_API_KEY|GOOGLE_MAPS_API_KEY|process\.env/.test(route)) {
  failures.push('AMA bot route skeleton must not reference model/API env vars yet');
}

const ama = read('src/os/apps/AmaApp.tsx');
for (const snippet of [
  'ask me anything — vivian-ish bot replies first, real vivian may answer later',
]) {
  if (!ama.includes(snippet)) failures.push(`AMA UI missing transparent copy: ${snippet}`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log('✓ AMA RAG foundation static checks passed');
