// The roadmap to the platinum and the missables page, both built from the
// official descriptions: which chapters and missions, which collectibles and
// counts, in what order.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Step 1 — Play the story',
    time: '60–80 hours',
    text: 'Finish all five chapters and take the optional missions as they appear. The story trophies come from the chapters themselves (Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma) and from named missions — Gone Fishing, Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown, Operation Savage Glory and the final mission. Scan vehicles and study animals as you go: 200 of 277 vehicles and 100 of 255 animals count toward the 100% checklist later. Do the Chapter 1 balcony meditation now — it is the one thing that may not wait.',
    trophyKinds: ['story'],
  },
  {
    stage: 2,
    title: 'Step 2 — The 100% checklist',
    time: 'About 100 hours',
    text: 'After the credits, the 100% checklist opens under Progress, then Stats, then 100% Completion. Its thresholds are forgiving — closer to 60% true completion. Work through it: any 100 optional missions, 300 stunts, any 70 of 80 challenges, all 42 shooting-range golds, all 14 drone-race locations, all 8 bank vaults, all 39 gang operations, 15 of 18 meditations, 15 Target Decks, and the rest of the collectibles. A Long Road, the gold for 100%, is the hardest trophy in the list and the gate to the platinum.',
    trophyKinds: ['completion', 'collectible', 'robbery', 'exploration'],
  },
  {
    stage: 3,
    title: 'Step 3 — Strangers & side quests, then cleanup',
    time: 'About 10 hours',
    text: 'Finish the 8 Strangers & Freaks strands that count (Kirk, Kyle, Yago and Pilot Pete) and the side-character final missions — Andy, Kenton, Billy, Randy, Tyrone and Bret — then sweep up whatever is left: the vague trophies, the partner trophies and the 500 criminal-profile actions. By now most of the list is done; the tracker shows exactly what remains.',
    trophyKinds: ['side', 'activity'],
  },
];

export function renderRoadmap(container, trophies, earned) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const section = document.createElement('section');
    section.className = 'stage';
    const heading = document.createElement('h2');
    heading.textContent = stage.title;
    section.append(heading);
    const time = document.createElement('p');
    time.className = 'stage-time';
    time.textContent = stage.time;
    section.append(time);
    const text = document.createElement('p');
    text.textContent = stage.text;
    section.append(text);
    const list = document.createElement('ul');
    list.className = 'stage-trophies';
    for (const trophy of trophies.filter((t) => t.stage === stage.stage)) {
      const item = document.createElement('li');
      if (earned.has(trophy.name)) item.className = 'earned';
      item.textContent = trophy.name;
      list.append(item);
    }
    section.append(list);
    container.append(section);
  }
}

export function renderMissables(container, trophies, earned) {
  container.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  for (const trophy of missable) {
    const card = document.createElement('article');
    card.className = 'missable-card';
    const heading = document.createElement('h2');
    heading.textContent = `⚠ ${trophy.name}`;
    card.append(heading);
    const official = document.createElement('p');
    official.className = 'official';
    official.textContent = `${trophy.description} — ${trophy.grade} trophy. ${earned.has(trophy.name) ? 'Earned ✓' : 'Not earned yet.'}`;
    card.append(official);
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    card.append(guide);
    const sources = document.createElement('p');
    sources.textContent = 'Sources: ' + (trophy.sources ?? []).map((s) => s.label).join('; ') + '.';
    card.append(sources);
    container.append(card);
  }
  const reassurance = document.createElement('p');
  reassurance.className = 'section-intro';
  reassurance.textContent =
    'Everything else is safe: all 12 story trophies pop from playing the missions, every side-character line stays available after the story, and nothing on the 100% checklist can be missed. The game has no mission replay, so the save discipline above is the only insurance you need.';
  container.append(reassurance);
}
