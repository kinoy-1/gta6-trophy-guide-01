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
// Rarity edition (2026-11-21): re-applied under the sealed recording; the hand-in below is unchanged.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
