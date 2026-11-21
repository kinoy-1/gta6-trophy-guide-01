// Leonida Ledger — a GTA VI trophy guide and tracker for make.fun's
// gta6-trophy-guide-01 bounty. Node 22, standard library only.
//
// The guide itself is app/: plain static files (index.html, style.css, js/
// modules and app/data/trophies.json) that open in desktop Chrome and work
// with the network off. This program hands it in: it copies app/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json
// with the vendored make.fun library. Leave vendor/makefun-frontend.ts as it
// is: the scorer requires dossier.json to be byte for byte what its own copy
// writes.
//
// Round-2 revision (2026-11-21, second and last guard round): the guide now
// carries numbered steps for all 55 trophies, a sort control for the
// checklist, a stage chip on every row, and a compact cover layout — the
// checklist and the cited step-by-step guide are visible in the first screen.
// The hand-in below also checks the gate's own limits before writing the
// dossier: 3–4 screenshots, each a JPEG or PNG of at most 256 KiB, and a
// trophy file holding all 55 trophies with a guide and steps each.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The guide and its screenshots must be present before anything is handed in.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: the guide was not built.');
}
if (!existsSync(join(here, 'app', 'data', 'trophies.json'))) {
  throw new Error('app/data/trophies.json is missing: the trophy list was not built.');
}
if (!existsSync(join(here, 'screenshots'))) {
  throw new Error('screenshots/ is missing: take the screenshots first.');
}

// The gate's own limits, checked here so a bad hand-in fails loudly instead
// of silently: 3–4 screenshots, each a JPEG or PNG of at most 256 KiB.
const shots = readdirSync(join(here, 'screenshots')).filter((name) => !name.startsWith('.')).sort();
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`screenshots/ holds ${shots.length} images: the gate takes 3 to 4.`);
}
for (const name of shots) {
  const path = join(here, 'screenshots', name);
  const bytes = statSync(path).size;
  if (!/\.(png|jpe?g)$/i.test(name)) throw new Error(`screenshots/${name} is not a PNG or JPEG.`);
  if (bytes > 262144) throw new Error(`screenshots/${name} is ${bytes} bytes: the gate caps each at 256 KiB.`);
}

// The trophy file must name all 55 official trophies, each with a guide and
// numbered steps — the gate refuses a trophy with no guide.
const doc = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophies = doc.trophies ?? doc;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`trophies.json holds ${Array.isArray(trophies) ? trophies.length : 0} trophies: the gate needs 55.`);
}
for (const trophy of trophies) {
  if (typeof trophy.name !== 'string' || !trophy.name) throw new Error('A trophy has no name.');
  if (typeof trophy.guide !== 'string' || !trophy.guide.trim()) throw new Error(`"${trophy.name}" has no guide.`);
  if (!Array.isArray(trophy.steps) || trophy.steps.length === 0) throw new Error(`"${trophy.name}" has no steps.`);
}

// Clear only the contents of the handed-in folders, never the output
// directory itself: the grader owns /output, so this program must not remove it.
function clearContents(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

mkdirSync(out, { recursive: true });
clearContents(join(out, 'app'));
clearContents(join(out, 'screenshots'));
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 48 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

console.log(`Leonida Ledger handed in to ${out}.`);
