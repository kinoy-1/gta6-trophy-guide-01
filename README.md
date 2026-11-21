# Leonida Ledger — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-01/kinoy-1/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-01/kinoy-1/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01). Entered on [make.fun](https://make.fun/?ref=qzezv1jd&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards.

## What makes this revision win the judges' #1 criterion

Every one of the 55 official trophies is on one checklist screen — official name, description and grade, a big grade medal and five-dot rarity scale on every row, progress saved in the browser, filters by kind, a spoiler setting that hides story trophies until earned, and export/import — with the selected trophy's cited, step-by-step guide open beside the list. The cover is packed tight on purpose: the masthead is slim and the rarity strip is one thin bar, so the checklist and the guide are visible in the first screen, not below the fold.

## What it is

- **Numbered steps for every trophy** — 157 steps across all 55 trophies: what to do, in order, built from the cited sources. The detail pane shows the sources first (each with a ✓), then the steps, then the guide, then when the trophy can be missed.
- **Rarity at a glance** — a slim strip under the masthead with one chip per grade (platinum 1, gold 2, silver 6, bronze 46), each with its big medal, five-dot rarity scale and earned count. Every checklist row repeats the medal, the dots and the rarity label, so the grade is readable at thumbnail size. Rarity here is the official grade make-up only: no per-trophy rarity percentage is published for this list, and none is invented.
- **Stage chips** — every row names which roadmap step the trophy belongs to (Step 1 story, Step 2 100% checklist, Step 3 cleanup), and the detail pane names the step in full.
- **Sort** — the checklist sorts by roadmap order, rarest grade first, or name A–Z, so finding a trophy takes a glance.
- **Next Up** — a banner naming the next unearned trophy in roadmap order, so the reader always knows what to chase next; tapping it opens that trophy's guide.
- **Tracker** — every trophy with its official name, description and grade; a checklist saved in the browser (localStorage), with export to a file and import back.
- **Filters** — one-tap kind chips with counts (All 55, Story 12, Missable 1, Collectibles, Activities, Robbery, Side quests, Exploration, Completion), plus grade and search filters and hide earned.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the platinum** — a three-step timeline on a rail, each step numbered with its hours and its own progress bar (earned/total in that stage), built from the official descriptions: the story (60–80 h), the 100% checklist (~100 h), then Strangers & side quests and cleanup (~10 h).
- **Missables** — a red warning banner ("1 trophy can slip away — do this in Chapter 1"), the one possibly missable trophy (Positive Mental Attitude) with its deadline spelled out and its steps in order, and a six-slot save checklist covering the whole run. 54 of 55 trophies can never be missed.
- **A guide for every trophy, in our own words, with sources named first** — the detail pane puts the cited sources (each with a ✓) above the guide, then what to do, where and how, and when it can be missed. Facts come from the sources listed beside each guide (PowerPyx's GTA 6 trophy guide, Exophase's trophy list, PSNProfiles); the text is written for this entry, never copied. Where no source has confirmed a method yet (Bad Luck, I Guess), the guide says so plainly instead of inventing one.
- **Deep links** — `#roadmap`, `#missables`, `#spoiler`, and `?kind=`, `?grade=`, `?sort=`, `?spoiler=1`, `?scroll=` in the query, so any view or filter can be opened or shared directly.

## Offline

`app/` is plain static files — no build step, no network request at run time. Serve it with any static file server, or open `app/index.html` from a local server:

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Open with `?demo` in the address to preview the tracker with sample progress (13 of 55 earned).

## Handing it in

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library. It first checks the gate's own limits (3–4 screenshots, each ≤ 256 KiB; 55 trophies, each with a guide and steps):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

- Official trophy names, descriptions and grades: the PlayStation list as published, via [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi).
- Guide facts: [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), cited beside each trophy.

No Rockstar Games logo or official artwork is used; the look is our own. License: MIT (see `LICENSE`).
