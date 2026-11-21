// Boot: load the official list, wire the tracker, roadmap and missables views,
// and keep progress in localStorage. No network request is ever made: the only
// fetch is the trophy list in app/data/trophies.json, a file of this app.
//
// Deep links, for screenshots and sharing: #roadmap, #missables, #tracker and
// #spoiler in the hash, and ?kind=, ?grade= and ?spoiler=1 in the query —
// e.g. ?demo&kind=story&spoiler=1 opens the tracker filtered to story
// trophies with spoilers hidden.
import { loadEarned, saveEarned, loadSettings, saveSettings, exportProgress, importProgressFile } from './store.js';
import { renderChecklist, renderDetail, renderProgress, renderRarityStrip, renderNextUp, renderKindChips } from './views.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

// A fixed sample set, used only when the page is opened with ?demo: it lets a
// reader preview the tracker with progress already filled in.
const DEMO_EARNED = [
  'Just Like Paradise', 'Paradise Lost', 'Trust', 'Baited My Tackle',
  'Stick Fiddler', 'Whip It Good', 'In The Beginning…', 'Treat Yo Self',
  'Little Boxes', 'On the Spot', 'Master of None', 'One Last Thing',
  'Cunning Stunts',
];

const state = {
  trophies: [],
  earned: loadEarned(),
  settings: loadSettings(),
  selected: null,
  view: 'tracker',
};

function seedDemoProgress() {
  const params = new URLSearchParams(location.search);
  if (!params.has('demo')) return;
  if (sessionStorage.getItem('leonida-ledger-demo-seeded')) return;
  sessionStorage.setItem('leonida-ledger-demo-seeded', '1');
  state.earned = new Set(DEMO_EARNED);
  saveEarned(state.earned);
}

function applyQueryLinks() {
  const params = new URLSearchParams(location.search);
  const kind = params.get('kind');
  if (kind) state.settings.kind = kind;
  const grade = params.get('grade');
  if (grade) state.settings.grade = grade;
  if (params.get('spoiler') === '1') state.settings.spoiler = true;
  saveSettings(state.settings);
}

function selectedTrophy() {
  return state.trophies.find((t) => t.name === state.selected) ?? null;
}

function renderAll() {
  renderProgress(state.trophies, state.earned);
  renderRarityStrip(document.getElementById('rarity-strip'), state.trophies, state.earned);
  renderNextUp(
    document.getElementById('next-up'),
    state.trophies,
    state.earned,
    onSelectTrophy,
  );
  renderKindChips(
    document.getElementById('kind-chips'),
    state.trophies,
    state,
    onPickKind,
  );
  const shown = renderChecklist(
    document.getElementById('trophy-list'),
    state.trophies,
    state,
    onToggleEarned,
    onSelectTrophy,
  );
  document.getElementById('shown-count').textContent = `Showing ${shown} of ${state.trophies.length} trophies.`;
  document.getElementById('filter-note').textContent = state.settings.spoiler
    ? 'Spoilers on: unearned story trophies are hidden.'
    : '';
  renderDetail(document.getElementById('detail-pane'), selectedTrophy(), state);
  renderRoadmap(document.getElementById('roadmap-stages'), state.trophies, state.earned);
  renderMissables(document.getElementById('missables-list'), state.trophies, state.earned);
  document.getElementById('missable-count').textContent = String(state.trophies.filter((t) => t.missable).length);
}

function onToggleEarned(name, checked) {
  if (checked) state.earned.add(name);
  else state.earned.delete(name);
  saveEarned(state.earned);
  renderAll();
}

function onSelectTrophy(name) {
  state.selected = name;
  renderAll();
  document.getElementById('detail-pane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function onPickKind(kind) {
  state.settings.kind = kind;
  saveSettings(state.settings);
  document.getElementById('kind-filter').value = kind;
  renderAll();
}

function showView(view) {
  state.view = view;
  for (const section of document.querySelectorAll('.view')) {
    section.classList.toggle('active', section.id === `view-${view}`);
  }
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === view);
  }
}

function wireToolbar() {
  const settings = state.settings;
  const search = document.getElementById('search');
  const grade = document.getElementById('grade-filter');
  const kind = document.getElementById('kind-filter');
  const hideEarned = document.getElementById('hide-earned');
  const spoiler = document.getElementById('spoiler-toggle');
  search.value = settings.search;
  grade.value = settings.grade;
  kind.value = settings.kind;
  hideEarned.checked = settings.hideEarned;
  spoiler.checked = settings.spoiler;

  search.addEventListener('input', () => {
    settings.search = search.value;
    saveSettings(settings);
    renderAll();
  });
  grade.addEventListener('change', () => {
    settings.grade = grade.value;
    saveSettings(settings);
    renderAll();
  });
  kind.addEventListener('change', () => {
    settings.kind = kind.value;
    saveSettings(settings);
    renderAll();
  });
  hideEarned.addEventListener('change', () => {
    settings.hideEarned = hideEarned.checked;
    saveSettings(settings);
    renderAll();
  });
  spoiler.addEventListener('change', () => {
    settings.spoiler = spoiler.checked;
    saveSettings(settings);
    renderAll();
  });

  document.getElementById('export-btn').addEventListener('click', () => {
    exportProgress(state.earned);
  });
  document.getElementById('import-file').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProgressFile(file);
      const known = new Set(state.trophies.map((t) => t.name));
      state.earned = new Set([...imported].filter((name) => known.has(name)));
      saveEarned(state.earned);
      renderAll();
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies and start over?')) return;
    state.earned = new Set();
    saveEarned(state.earned);
    renderAll();
  });
}

function wireTabs() {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  }
}

async function bootLeonidaLedger() {
  seedDemoProgress();
  applyQueryLinks();
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  state.trophies = doc.trophies;
  state.selected = 'Positive Mental Attitude';
  wireToolbar();
  wireTabs();
  // Deep links: #roadmap, #missables, #tracker, #spoiler (combinable).
  for (const token of location.hash.replace(/^#/, '').split('&')) {
    if (token === 'roadmap' || token === 'missables' || token === 'tracker') showView(token);
    if (token === 'spoiler') {
      state.settings.spoiler = true;
      saveSettings(state.settings);
      document.getElementById('spoiler-toggle').checked = true;
    }
  }
  renderAll();
}

bootLeonidaLedger();
