export const experiments = [
  {
    slug: 'lenticular-index',
    title: 'Lenticular Index',
    date: '2026-07-21',
    tags: ['interaction', 'css', 'motion', 'typography'],
    summary: 'A typographic tilt print whose optical ribs flip between two messages as the viewing angle shifts.',
    concept:
      'Translate lenticular printmaking into a browser material: horizontal position changes the viewing angle, interlaced faces crossfade, and CSS 3D ribs give the poster physical depth.',
    href: './experiments/lenticular-index/?v=20260721',
    accent: '#d8ff36',
    preview: 'lenticular',
  },
  {
    slug: 'signal-descent',
    title: 'Signal Descent',
    date: '2026-07-20',
    tags: ['interaction', 'canvas', 'motion', 'broadcast'],
    summary: 'A tactile lunar downlink whose scan beam resolves noise, relief, and telemetry into signal lock.',
    concept:
      'Turn the Apollo 11 broadcast into direct manipulation: scrub a phosphor beam across a noisy lunar carrier until fragmented relief and typography resolve into Tranquility Base.',
    href: './experiments/signal-descent/?v=20260721',
    accent: '#a8ff76',
    preview: 'signal',
  },
  {
    slug: 'temporal-slit',
    title: 'Temporal Slit',
    date: '2026-07-16',
    tags: ['interaction', 'canvas', 'motion', 'typography'],
    summary: 'A draggable scan head that stretches recent motion into a field of typographic time slices.',
    concept:
      'Make motion history directly manipulable: scan across a live editorial signal and let gesture velocity control how much of the recent past becomes visible.',
    href: './experiments/temporal-slit/?v=20260721',
    accent: '#dfff37',
    preview: 'slit',
  },
  {
    slug: 'chromatic-press',
    title: 'Chromatic Press',
    date: '2026-07-15',
    tags: ['interaction', 'canvas', 'motion', 'print'],
    summary: 'A tactile CMYK proof whose four ink plates separate, lag, and settle into register.',
    concept:
      'Turn print registration into direct manipulation: pull one target to expose the distinct weight of four process-color plates, then release them into one sharp impression.',
    href: './experiments/chromatic-press/?v=20260721',
    accent: '#00a9ce',
    preview: 'press',
  },
  {
    slug: 'contour-chorus',
    title: 'Contour Chorus',
    date: '2026-07-14',
    tags: ['interaction', 'canvas', 'motion', 'typography'],
    summary: 'A topographic line field conducted by pointer position, velocity, and fading echoes.',
    concept:
      'Turn gesture into editorial terrain: pointer velocity raises precise contour interference while clicks pin short-lived resonances around a typographic monument.',
    href: './experiments/contour-chorus/?v=20260721',
    accent: '#ff674c',
    preview: 'contour',
  },
  {
    slug: 'config-signal-loom',
    title: 'Config Signal Loom',
    date: '2026-07-07',
    tags: ['figma', 'tool', 'motion'],
    summary: 'A post-Config sketch where conference themes become draggable product idea signals.',
    concept:
      'Turn Figma Config themes into a living map of plugin and workflow ideas, clustering code layers, motion, shaders, and collaboration into buildable prompts.',
    href: './experiments/config-signal-loom/?v=20260721',
    accent: '#8a63ff',
    preview: 'loom',
  },
  {
    slug: 'civic-burst-field',
    title: 'Civic Burst Field',
    date: '2026-07-04',
    tags: ['holiday', 'canvas', 'motion'],
    summary: 'A Fourth-of-July interaction study about heat, sound, night light, and burst physics.',
    concept:
      'Use the ritual of a public holiday as a physics constraint: touch or click to launch civic bursts that behave like heat, echoes, and neighborhood light.',
    href: './experiments/civic-burst-field/?v=20260721',
    accent: '#ff5d2e',
    preview: 'burst',
  },
  {
    slug: 'command-gravity',
    title: 'Command Gravity',
    date: '2026-07-08',
    tags: ['interaction', 'motion', 'tool'],
    summary: 'A command palette where search results behave like weighted objects in a spatial field.',
    concept:
      'Explore what happens when a command palette reveals relevance through gravity, magnetic clustering, and keyboard focus rather than a flat filtered list.',
    href: './experiments/command-gravity/?v=20260721',
    accent: '#111827',
    preview: 'command',
  },
  {
    slug: 'tension-type',
    title: 'Tension Type',
    date: '2026-07-11',
    tags: ['typography', 'canvas', 'motion'],
    summary: 'An elastic type field that turns pointer velocity into visible typographic tension.',
    concept:
      'Treat typography as a responsive material: pull a phrase away from its baseline, watch neighboring glyphs absorb the force, then release it into a damped editorial wave.',
    href: './experiments/tension-type/?v=20260721',
    accent: '#ff4d24',
    preview: 'tension',
  },
  {
    slug: 'crease-memory',
    title: 'Crease Memory',
    date: '2026-07-13',
    tags: ['interaction', 'canvas', 'motion', 'typography'],
    summary: 'A two-sided editorial poster revealed through one tactile, draggable crease.',
    concept:
      'Treat a digital surface like printed matter: dragging one fold exposes a second reading through clipped geometry, material shadow, and a damped snap.',
    href: './experiments/crease-memory/?v=20260721',
    accent: '#d9ff57',
    preview: 'crease',
  },
];

export function getAllTags(items) {
  return [...new Set(items.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b));
}

export function filterExperiments(items, tag) {
  if (tag === 'all') {
    return items;
  }

  return items.filter((item) => item.tags.includes(tag));
}

export function searchExperiments(items, value) {
  const query = value.trim().toLowerCase();

  if (!query) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.summary,
      item.concept,
      item.date,
      ...item.tags,
    ].join(' ').toLowerCase();

    return haystack.includes(query);
  });
}

export function formatDisplayDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
