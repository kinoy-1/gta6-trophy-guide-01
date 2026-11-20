# Leonida Ledger — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-01/kinoy-1/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-01/kinoy-1/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Tracker** — every trophy with its official name, description and grade; a checklist saved in the browser (localStorage), with export to a file and import back.
- **Filters** — by kind (story, missable, collectibles, activities, robbery, side quests, exploration, completion), by grade, and by search; hide earned, too.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the platinum** — three stages built from the official descriptions: the story (60–80 h), the 100% checklist (~100 h), then Strangers & side quests and cleanup (~10 h).
- **Missables** — the one trophy reported as possibly missable (Positive Mental Attitude, and only as a maybe), with the Chapter 1 balcony meditation spelled out, plus save discipline for a game with no mission replay.
- **A guide for every trophy, in our own words, with sources named** — what to do, where and how, and when it can be missed. Facts come from the sources listed beside each guide (PowerPyx's GTA 6 trophy guide, Exophase's trophy list, PSNProfiles); the text is written for this entry, never copied. Where no source has confirmed a method yet (Bad Luck, I Guess), the guide says so plainly instead of inventing one.

## Offline

`app/` is plain static files — no build step, no network request at run time. Serve it with any static file server, or open `app/index.html` from a local server:

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Open with `?demo` in the address to preview the tracker with sample progress (13 of 55 earned).

## Handing it in

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

- Official trophy names, descriptions and grades: the PlayStation list as published, via [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi).
- Guide facts: [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), cited beside each trophy.

No Rockstar Games logo or official artwork is used; the look is our own. License: MIT (see `LICENSE`).
