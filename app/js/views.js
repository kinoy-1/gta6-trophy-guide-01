// The checklist and the detail pane: rendering the tracker view.
import { kindLabel, isSpoilerHidden, filterTrophies } from './filters.js';

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

function missablePill() {
  const span = document.createElement('span');
  span.className = 'pill pill-missable';
  span.textContent = 'Missable';
  return span;
}

function targetPill(target) {
  const span = document.createElement('span');
  span.className = 'pill pill-target';
  span.textContent = target;
  return span;
}

function gradeMark(grade) {
  const mark = document.createElement('span');
  mark.className = `trophy-grade-mark mark-${grade}`;
  mark.textContent = GRADE_LETTER[grade] ?? '?';
  mark.title = grade;
  return mark;
}

// One checklist row: checkbox, official name and description, grade and kind pills.
export function renderChecklist(listEl, trophies, state, onToggle, onSelect) {
  const shown = filterTrophies(trophies, state.settings, state.earned);
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
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
    body.append(name);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc' + (hidden ? ' spoiler-hidden' : '');
    desc.textContent = hidden ? 'Hidden until earned — turn the spoiler setting off to see it.' : trophy.description;
    body.append(desc);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(gradePill(trophy.grade), kindPill(trophy.kind));
    if (trophy.missable) meta.append(missablePill());
    if (trophy.target) meta.append(targetPill(trophy.target));
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

// The detail pane: official data, the guide in our own words, when it can be
// missed, and the named sources for every fact in the guide.
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

  const heading = document.createElement('h2');
  heading.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  paneEl.append(heading);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden
    ? 'Official name and description hidden until earned.'
    : `${trophy.description} — ${trophy.grade} trophy${trophy.hidden ? ', hidden on PlayStation until earned' : ''}.`;
  paneEl.append(official);

  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(gradePill(trophy.grade), kindPill(trophy.kind));
  if (trophy.missable) meta.append(missablePill());
  if (trophy.target) meta.append(targetPill(trophy.target));
  paneEl.append(meta);

  if (trophy.missable) {
    const banner = document.createElement('p');
    banner.className = 'missable-banner';
    banner.textContent = 'Potentially missable — read the guide below before the chapter ends.';
    paneEl.append(banner);
  }

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

  const sourcesHeading = document.createElement('h3');
  sourcesHeading.textContent = 'Sources';
  paneEl.append(sourcesHeading);
  const sources = document.createElement('ul');
  sources.className = 'sources';
  for (const source of trophy.sources ?? []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.label;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    item.append(link);
    sources.append(item);
  }
  const officialSource = document.createElement('li');
  officialSource.textContent = 'Official name, description and grade: the PlayStation list as published, via Exophase and PSNProfiles.';
  sources.append(officialSource);
  paneEl.append(sources);
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
