// Progress store: earned trophy names in localStorage, with export and import.
// Round 2 adds one saved setting: how the checklist is sorted.
export const PROGRESS_KEY = 'leonida-ledger-progress-v1';
export const SETTINGS_KEY = 'leonida-ledger-settings-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned].sort()));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      spoiler: Boolean(parsed.spoiler),
      hideEarned: Boolean(parsed.hideEarned),
      grade: typeof parsed.grade === 'string' ? parsed.grade : 'all',
      kind: typeof parsed.kind === 'string' ? parsed.kind : 'all',
      search: typeof parsed.search === 'string' ? parsed.search : '',
      sort: typeof parsed.sort === 'string' ? parsed.sort : 'roadmap',
    };
  } catch {
    return { spoiler: false, hideEarned: false, grade: 'all', kind: 'all', search: '', sort: 'roadmap' };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Download the earned list as a JSON file the user can keep or share.
export function exportProgress(earned) {
  const payload = {
    app: 'Leonida Ledger — GTA VI trophy tracker',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'gta6-trophy-progress.json';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

// Read an exported progress file back into a Set of earned trophy names.
export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('Not a Leonida Ledger progress file.');
  return new Set(names.filter((n) => typeof n === 'string'));
}
