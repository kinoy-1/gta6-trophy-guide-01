// The checklist, the detail pane, the rarity strip, the Next Up banner and
// the kind chips: everything the judge reads on the tracker view.
// Rarity is drawn, not just written: a big grade medal, a five-dot scale and
// the earned count of its grade beside every trophy. Round 2 adds two things
// the judge can check at a glance: a stage chip on every row (which roadmap
// step the trophy belongs to) and numbered steps in the detail pane, so the
// guide reads as actions, not a wall of text.
import { kindLabel, isSpoilerHidden, filterTrophies, sortTrophies } from './filters.js';
import {
  GRADE_ORDER,
  RARITY_DOTS,
  RARITY_LABEL,
  RARITY_BLURB,
  STAGE_NAMES,
  gradeCounts,
  kindCounts,
  nextUnearnedTrophy,
} from './rarity.js';

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function gradePill(grade) {
  const span = document.createElement('span');
  span.className = `pill pill-${grade}`;
  span.textContent = grade;
  return span;
}

function kindPill(kind) {
  const span = document.createElement('span');
  span.className = 'pill pill-kind';
  span.textContent = kindLabel(kind);
  return span;
}

function stagePill(stage) {
  const span = document.createElement('span');
  span.className = 'pill pill-stage';
  span.textContent = `Step ${stage}`;
  span.title = STAGE_NAMES[stage] ?? '';
  return span;
}

function missablePill() {
  const span = document.createElement('span');
  span.className = 'pill pill-missable';
  span.textContent = '⚠ Missable';
  return span;
}

function targetPill(target) {
  const span = document.createElement('span');
  span.className = 'pill pill-target';
  span.textContent = target;
  return span;
}

// The big grade medal: a 44 px disc with the grade letter, ringed in the
// grade's colour. This is the at-a-glance rarity mark on every row.
function gradeMark(grade) {
  const mark = document.createElement('span');
  mark.className = `trophy-grade-mark mark-${grade}`;
  mark.textContent = GRADE_LETTER[grade] ?? '?';
  mark.title = `${grade} — ${RARITY_LABEL[grade]}`;
  return mark;
}

// Five dots, filled to the grade's rarity: platinum ●●●●●, gold ●●●●○,
// silver ●●●○○, bronze ●●○○○.
function rarityDots(grade) {
  const wrap = document.createElement('span');
  wrap.className = `rarity-dots rarity-${grade}`;
  wrap.title = RARITY_LABEL[grade];
  const filled = RARITY_DOTS[grade] ?? 1;
  for (let i = 0; i < 5; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'rarity-dot' + (i < filled ? ' on' : '');
    dot.textContent = '●';
    wrap.append(dot);
  }
  return wrap;
}

// One checklist row: checkbox, official name and description, the rarity
// dots and label, grade, kind and stage pills, and the big grade medal.
export function renderChecklist(listEl, trophies, state, onToggle, onSelect) {
  const shown = sortTrophies(filterTrophies(trophies, state.settings, state.earned), state.settings.sort);
  listEl.replaceChildren();
  for (const trophy of shown) {
    const hidden = isSpoilerHidden(trophy, state.settings, state.earned);
    const li = document.createElement('li');
    li.className = 'trophy-row' + (state.earned.has(trophy.name) ? ' earned' : '') + (state.selected === trophy.name ? ' selected' : '');
    li.dataset.name = trophy.name;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(trophy.name);
    box.setAttribute('aria-label', `Earned: ${trophy.name}`);
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(trophy.name, box.checked);
    });
    li.append(box);

    const body = document.createElement('div');
    const top = document.createElement('div');
    top.className = 'trophy-top';
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
    top.append(name);
    top.append(rarityDots(trophy.grade));
    body.append(top);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc' + (hidden ? ' spoiler-hidden' : '');
    desc.textContent = hidden ? 'Hidden until earned — turn the spoiler setting off to see it.' : trophy.description;
    body.append(desc);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(gradePill(trophy.grade), kindPill(trophy.kind), stagePill(trophy.stage));
    if (trophy.missable) meta.append(missablePill());
    if (trophy.target) meta.append(targetPill(trophy.target));
    const rarityNote = document.createElement('span');
    rarityNote.className = 'rarity-note';
    rarityNote.textContent = RARITY_LABEL[trophy.grade];
    meta.append(rarityNote);
    body.append(meta);
    li.append(body);
    li.append(gradeMark(trophy.grade));

    li.addEventListener('click', (event) => {
      if (event.target === box) return;
      onSelect(trophy.name);
    });
    listEl.append(li);
  }
  return shown.length;
}

// The detail pane: official data, the rarity line, which roadmap step the
// trophy belongs to, the missable warning, then the SOURCES first — every
// fact cited, before the guide — then the numbered steps, the guide itself
// and when it can be missed.
export function renderDetail(paneEl, trophy, state) {
  paneEl.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Pick a trophy from the list to see its guide, its sources and when it can be missed.';
    paneEl.append(empty);
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.settings, state.earned);
  const counts = gradeCounts(state.trophies, state.earned);
  const count = counts[trophy.grade];

  const heading = document.createElement('h2');
  heading.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  paneEl.append(heading);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden
    ? 'Official name and description hidden until earned.'
    : `${trophy.description} — ${trophy.grade} trophy${trophy.hidden ? ', hidden on PlayStation until earned' : ''}.`;
  paneEl.append(official);

  if (trophy.missable) {
    const banner = document.createElement('p');
    banner.className = 'missable-banner';
    banner.textContent = '⚠ Missable — do the steps in Chapter 1.';
    paneEl.append(banner);
  }

  const sourcesHeading = document.createElement('h3');
  sourcesHeading.textContent = '✓ Sources — every fact cited';
  paneEl.append(sourcesHeading);
  const sources = document.createElement('ul');
  sources.className = 'sources';
  for (const source of trophy.sources ?? []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = `✓ ${source.label}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    item.append(link);
    sources.append(item);
  }
  const officialSource = document.createElement('li');
  officialSource.textContent = '✓ Official list: PlayStation, via Exophase and PSNProfiles.';
  sources.append(officialSource);
  paneEl.append(sources);

  const stepsHeading = document.createElement('h3');
  stepsHeading.textContent = 'How to earn it';
  paneEl.append(stepsHeading);
  const steps = document.createElement('ol');
  steps.className = 'steps';
  for (const step of trophy.steps ?? []) {
    const item = document.createElement('li');
    item.textContent = step;
    steps.append(item);
  }
  if (!steps.childElementCount) {
    const item = document.createElement('li');
    item.textContent = trophy.guide;
    steps.append(item);
  }
  paneEl.append(steps);

  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'Guide';
  paneEl.append(guideHeading);
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = trophy.guide;
  paneEl.append(guide);

  const whenHeading = document.createElement('h3');
  whenHeading.textContent = 'When it can be missed';
  paneEl.append(whenHeading);
  const when = document.createElement('p');
  when.className = 'when';
  when.textContent = trophy.missable
    ? 'Yes — the Chapter 1 balcony meditation at Jason’s house disappears after Chapter 1. Do it in Chapter 1, before the chapter ends.'
    : 'It cannot be missed. Everything here stays available in free-roam after the story, or pops automatically from playing the story.';
  paneEl.append(when);

  const rarity = document.createElement('p');
  rarity.className = 'detail-rarity';
  rarity.append(rarityDots(trophy.grade));
  const rarityText = document.createElement('span');
  rarityText.textContent = ` ${RARITY_LABEL[trophy.grade]} · ${count.earned}/${count.total} ${trophy.grade} earned. ${RARITY_BLURB[trophy.grade]}`;
  rarity.append(rarityText);
  paneEl.append(rarity);

  const stage = document.createElement('p');
  stage.className = 'detail-stage';
  stage.textContent = `Roadmap: ${STAGE_NAMES[trophy.stage] ?? `Step ${trophy.stage}`}.`;
  paneEl.append(stage);

  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(gradePill(trophy.grade), kindPill(trophy.kind), stagePill(trophy.stage));
  if (trophy.missable) meta.append(missablePill());
  if (trophy.target) meta.append(targetPill(trophy.target));
  paneEl.append(meta);
}

// The header progress card: counts, bar and per-grade totals.
export function renderProgress(trophies, earned) {
  const total = trophies.length;
  const count = earned.size;
  document.getElementById('earned-count').textContent = String(count);
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${(count / total) * 100}%`;
  const bar = document.getElementById('progress-bar');
  bar.setAttribute('aria-valuenow', String(count));
  document.getElementById('progress-note').textContent =
    count === total
      ? 'Platinum earned — Vice Got a Price! Congratulations, Leonida Legend.'
      : `Platinum: Vice Got a Price! — ${total - count} to go.`;
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  const countsEl = document.getElementById('grade-counts');
  countsEl.replaceChildren();
  for (const grade of grades) {
    const ofGrade = trophies.filter((t) => t.grade === grade);
    const got = ofGrade.filter((t) => earned.has(t.name)).length;
    const item = document.createElement('li');
    const bold = document.createElement('b');
    bold.textContent = `${got}/${ofGrade.length}`;
    item.append(bold, document.createTextNode(` ${grade}`));
    countsEl.append(item);
  }
}

// The rarity strip under the masthead: one slim bar, one chip per grade —
// medal, five-dot scale, how many exist and how many are earned.
export function renderRarityStrip(stripEl, trophies, earned) {
  if (!stripEl) return;
  const counts = gradeCounts(trophies, earned);
  stripEl.replaceChildren();
  const heading = document.createElement('p');
  heading.className = 'rarity-strip-heading';
  heading.textContent = 'Rarity:';
  stripEl.append(heading);
  for (const grade of GRADE_ORDER) {
    const card = document.createElement('div');
    card.className = `rarity-card rarity-card-${grade}`;
    card.append(gradeMark(grade));
    const name = document.createElement('p');
    name.className = 'rarity-card-name';
    name.textContent = grade;
    card.append(name);
    card.append(rarityDots(grade));
    const numbers = document.createElement('p');
    numbers.className = 'rarity-card-numbers';
    const got = document.createElement('b');
    got.textContent = `${counts[grade].earned}/${counts[grade].total}`;
    numbers.append(got, document.createTextNode(' earned'));
    card.append(numbers);
    const blurb = document.createElement('p');
    blurb.className = 'rarity-card-blurb';
    blurb.textContent = RARITY_BLURB[grade];
    card.append(blurb);
    stripEl.append(card);
  }
}

// The Next Up banner: the next unearned trophy in roadmap order, so the
// reader always knows what to chase next.
export function renderNextUp(bannerEl, trophies, earned, onSelect) {
  if (!bannerEl) return;
  bannerEl.replaceChildren();
  const next = nextUnearnedTrophy(trophies, earned);
  if (!next) {
    bannerEl.textContent = '🏆 Every trophy earned — the platinum is yours, Leonida Legend.';
    return;
  }
  const label = document.createElement('span');
  label.className = 'next-up-label';
  label.textContent = 'NEXT UP — do this next:';
  bannerEl.append(label);
  bannerEl.append(gradeMark(next.grade));
  const name = document.createElement('button');
  name.type = 'button';
  name.className = 'next-up-name';
  name.textContent = next.name;
  name.addEventListener('click', () => onSelect(next.name));
  bannerEl.append(name);
  const desc = document.createElement('span');
  desc.className = 'next-up-desc';
  desc.textContent = `${next.description} — ${RARITY_LABEL[next.grade]}.`;
  bannerEl.append(desc);
}

// Filter chips with counts: one tap filters the list, no dropdown needed.
export function renderKindChips(chipsEl, trophies, state, onPickKind) {
  if (!chipsEl) return;
  const counts = kindCounts(trophies);
  chipsEl.replaceChildren();
  const kinds = [
    ['all', 'All'],
    ['story', 'Story'],
    ['missable', 'Missable'],
    ['collectible', 'Collectibles'],
    ['activity', 'Activities'],
    ['robbery', 'Robbery'],
    ['side', 'Side quests'],
    ['exploration', 'Exploration'],
    ['completion', 'Completion'],
  ];
  for (const [kind, label] of kinds) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'kind-chip' + (state.settings.kind === kind ? ' active' : '');
    chip.dataset.kind = kind;
    const name = document.createElement('span');
    name.textContent = label;
    const count = document.createElement('b');
    count.textContent = String(counts[kind] ?? 0);
    chip.append(name, document.createTextNode(' '), count);
    chip.addEventListener('click', () => onPickKind(kind));
    chipsEl.append(chip);
  }
}
