// Rarity at a glance: a trophy's grade IS its rarity signal.
//
// PlayStation publishes no per-trophy rarity percentage for this list, so
// nothing here invents one. This file encodes only what the official list
// states: how many trophies of each grade exist out of 55, and a five-dot
// scale drawn from that count — platinum the rarest, bronze the most common.
// The tracker draws the dots, the grade medal and the earned count beside
// every trophy, so rarity is readable in one glance at any size.
export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export const RARITY_DOTS = { platinum: 5, gold: 4, silver: 3, bronze: 2 };

export const RARITY_LABEL = {
  platinum: 'Rarest grade — 1 of 55',
  gold: 'Very rare grade — 2 of 55',
  silver: 'Rare grade — 6 of 55',
  bronze: 'Most common grade — 46 of 55',
};

export const RARITY_BLURB = {
  platinum: 'The single rarest trophy: it pops only when the other 54 are earned.',
  gold: 'Only two golds in the whole list — both for the biggest feats.',
  silver: 'Six silvers, all for long grinds or big story beats.',
  bronze: 'Forty-six bronzes — the bulk of the list, one per feat.',
};

// The roadmap's three stages, as the detail pane names them beside a trophy.
export const STAGE_NAMES = {
  1: 'Step 1 — Play the story',
  2: 'Step 2 — The 100% checklist',
  3: 'Step 3 — Side quests, then cleanup',
};

// Earned and total counts per grade, for the rarity strip and the detail pane.
export function gradeCounts(trophies, earned) {
  const counts = {};
  for (const grade of GRADE_ORDER) {
    const ofGrade = trophies.filter((t) => t.grade === grade);
    counts[grade] = {
      total: ofGrade.length,
      earned: ofGrade.filter((t) => earned.has(t.name)).length,
    };
  }
  return counts;
}

// The next trophy to chase, in roadmap order: stage 1 first, then stage 2,
// then stage 3, keeping the official list order inside each stage. The
// platinum itself is never "next up" — it pops when everything else is done.
export function nextUnearnedTrophy(trophies, earned) {
  const ordered = [...trophies].sort(
    (a, b) => (a.stage - b.stage) || (a.id - b.id),
  );
  return ordered.find((t) => t.grade !== 'platinum' && !earned.has(t.name)) ?? null;
}

// How many trophies of each kind the list holds, for the filter chips.
export function kindCounts(trophies) {
  const counts = { all: trophies.length, missable: 0 };
  for (const trophy of trophies) {
    counts[trophy.kind] = (counts[trophy.kind] ?? 0) + 1;
    if (trophy.missable) counts.missable += 1;
  }
  return counts;
}
