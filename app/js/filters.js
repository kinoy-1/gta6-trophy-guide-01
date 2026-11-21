// Filtering, sorting and the spoiler rule: which trophies a view shows, in
// what order, and what is hidden.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  robbery: 'Robbery',
  side: 'Side quests',
  exploration: 'Exploration',
  completion: 'Completion',
};

export function kindLabel(kind) {
  return KIND_LABELS[kind] ?? kind;
}

// A trophy counts as a story trophy when its kind is story. Those are the ones
// the spoiler setting hides until they are earned.
export function isStoryTrophy(trophy) {
  return trophy.kind === 'story';
}

// With spoilers on, an unearned story trophy shows no name or description.
export function isSpoilerHidden(trophy, settings, earned) {
  return settings.spoiler && isStoryTrophy(trophy) && !earned.has(trophy.name);
}

export function matchesSearch(trophy, query) {
  if (!query) return true;
  const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind} ${(trophy.steps ?? []).join(' ')}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  return trophy.kind === kind;
}

export function filterTrophies(trophies, settings, earned) {
  return trophies.filter((trophy) => {
    if (settings.grade !== 'all' && trophy.grade !== settings.grade) return false;
    if (!matchesKind(trophy, settings.kind)) return false;
    if (settings.hideEarned && earned.has(trophy.name)) return false;
    return matchesSearch(trophy, settings.search.trim());
  });
}

// How rare a grade is, for sorting: platinum first, then gold, silver, bronze.
const GRADE_RANK = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

// Three orders for the checklist: the roadmap order (stage, then official
// list order), rarest grade first, or name A–Z. Finding a trophy should take
// a glance, whatever order the reader thinks in.
export function sortTrophies(trophies, sort) {
  const list = [...trophies];
  if (sort === 'rarest') {
    return list.sort(
      (a, b) => (GRADE_RANK[a.grade] - GRADE_RANK[b.grade]) || (a.stage - b.stage) || (a.id - b.id),
    );
  }
  if (sort === 'az') {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return list.sort((a, b) => (a.stage - b.stage) || (a.id - b.id));
}
