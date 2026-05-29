import { RoutePreset } from './types';

const normalizeLocationText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const routePresets: RoutePreset[] = [
  {
    id: 'balintawak-dau',
    keywords: ['balintawak', 'dau', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' }],
  },
  {
    id: 'balintawak-san-fernando',
    keywords: ['balintawak', 'san fernando', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'San Fernando' }],
  },
  {
    id: 'balintawak-bocaue',
    keywords: ['balintawak', 'bocaue', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Bocaue' }],
  },
  {
    id: 'mindanao-bocaue',
    keywords: ['mindanao', 'bocaue', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Mindanao Ave', exit: 'Bocaue' }],
  },
  {
    id: 'mindanao-san-fernando',
    keywords: ['mindanao', 'san fernando', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Mindanao Ave', exit: 'San Fernando' }],
  },
  {
    id: 'balintawak-sta-ines',
    keywords: ['balintawak', 'sta ines', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Sta Ines' }],
  },
  {
    id: 'balintawak-tipo',
    keywords: ['balintawak', 'tipo', 'nlex', 'sctex'],
    segments: [
      { expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' },
      { expressway: 'SCTEX', entry: 'Mabalacat', exit: 'Tipo' },
    ],
  },
  {
    id: 'balintawak-subic',
    keywords: ['balintawak', 'subic', 'nlex', 'sctex'],
    segments: [
      { expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' },
      { expressway: 'SCTEX', entry: 'Mabalacat', exit: 'Subic' },
    ],
  },
  {
    id: 'balintawak-tarlac-city',
    keywords: ['balintawak', 'tarlac', 'nlex', 'sctex'],
    segments: [
      { expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' },
      { expressway: 'SCTEX', entry: 'Mabalacat', exit: 'Tarlac' },
    ],
  },
  {
    id: 'balintawak-paniqui',
    keywords: ['balintawak', 'paniqui', 'nlex', 'sctex', 'tplex'],
    segments: [
      { expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' },
      { expressway: 'SCTEX', entry: 'Mabalacat', exit: 'Tarlac' },
      { expressway: 'TPLEX', entry: 'Tarlac', exit: 'Paniqui' },
    ],
  },
  {
    id: 'balintawak-pozorrubio',
    keywords: ['balintawak', 'pozorrubio', 'nlex', 'sctex', 'tplex'],
    segments: [
      { expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' },
      { expressway: 'SCTEX', entry: 'Mabalacat', exit: 'Tarlac' },
      { expressway: 'TPLEX', entry: 'Tarlac', exit: 'Pozorrubio' },
    ],
  },
  {
    id: 'balintawak-rosario',
    keywords: ['balintawak', 'rosario', 'la union', 'nlex', 'sctex', 'tplex'],
    minKeywordHits: 3,
    segments: [
      { expressway: 'NLEX', entry: 'Balintawak', exit: 'Dau' },
      { expressway: 'SCTEX', entry: 'Mabalacat', exit: 'Tarlac' },
      { expressway: 'TPLEX', entry: 'Tarlac', exit: 'Rosario' },
    ],
  },
  {
    id: 'alabang-calamba',
    keywords: ['alabang', 'calamba', 'slex', 'laguna'],
    segments: [{ expressway: 'SLEX', entry: 'Alabang', exit: 'Calamba' }],
  },
  {
    id: 'susana-calamba',
    keywords: ['susana', 'calamba', 'slex'],
    segments: [{ expressway: 'SLEX', entry: 'Susana Heights', exit: 'Calamba' }],
  },
  {
    id: 'alabang-sto-tomas',
    keywords: ['alabang', 'sto tomas', 'santo tomas', 'slex'],
    minKeywordHits: 3,
    segments: [{ expressway: 'SLEX', entry: 'Alabang', exit: 'Sto Tomas' }],
  },
  {
    id: 'calamba-batangas',
    keywords: ['calamba', 'batangas', 'slex', 'star', 'sto tomas'],
    minKeywordHits: 3,
    segments: [
      { expressway: 'SLEX', entry: 'Alabang', exit: 'Sto Tomas' },
      { expressway: 'STAR TOLLWAY', entry: 'Sto Tomas', exit: 'Batangas' },
    ],
  },
  {
    id: 'alabang-lipa',
    keywords: ['alabang', 'lipa', 'slex', 'star'],
    segments: [
      { expressway: 'SLEX', entry: 'Alabang', exit: 'Sto Tomas' },
      { expressway: 'STAR TOLLWAY', entry: 'Sto Tomas', exit: 'Lipa' },
    ],
  },
  {
    id: 'sto-tomas-batangas',
    keywords: ['sto tomas', 'santo tomas', 'batangas', 'star'],
    minKeywordHits: 3,
    segments: [{ expressway: 'STAR TOLLWAY', entry: 'Sto Tomas', exit: 'Batangas' }],
  },
  {
    id: 'sto-tomas-lipa',
    keywords: ['sto tomas', 'santo tomas', 'lipa', 'star'],
    minKeywordHits: 3,
    segments: [{ expressway: 'STAR TOLLWAY', entry: 'Sto Tomas', exit: 'Lipa' }],
  },
  {
    id: 'lipa-batangas',
    keywords: ['lipa', 'batangas', 'star'],
    segments: [{ expressway: 'STAR TOLLWAY', entry: 'Lipa', exit: 'Batangas' }],
  },
  {
    id: 'alabang-batangas',
    keywords: ['alabang', 'batangas', 'slex', 'star', 'sto tomas'],
    segments: [
      { expressway: 'SLEX', entry: 'Alabang', exit: 'Sto Tomas' },
      { expressway: 'STAR TOLLWAY', entry: 'Sto Tomas', exit: 'Batangas' },
    ],
  },
  {
    id: 'buendia-alabang',
    keywords: ['buendia', 'alabang', 'skyway'],
    segments: [{ expressway: 'SKYWAY', entry: 'Buendia', exit: 'Alabang' }],
  },
  {
    id: 'makati-alabang',
    keywords: ['makati', 'alabang', 'skyway'],
    segments: [{ expressway: 'SKYWAY', entry: 'Makati', exit: 'Alabang' }],
  },
  {
    id: 'naia-alabang',
    keywords: ['naia', 'airport', 'alabang', 'skyway'],
    minKeywordHits: 2,
    segments: [{ expressway: 'SKYWAY', entry: 'NAIA', exit: 'Alabang' }],
  },
  {
    id: 'balintawak-buendia',
    keywords: ['balintawak', 'buendia', 'skyway'],
    segments: [{ expressway: 'SKYWAY STAGE 3', entry: 'Balintawak', exit: 'Buendia' }],
  },
  {
    id: 'quezon-ave-buendia',
    keywords: ['quezon ave', 'buendia', 'skyway'],
    segments: [{ expressway: 'SKYWAY STAGE 3', entry: 'Quezon Ave', exit: 'Buendia' }],
  },
  {
    id: 'balintawak-plaza-dilao',
    keywords: ['balintawak', 'plaza dilao', 'skyway'],
    segments: [{ expressway: 'SKYWAY STAGE 3', entry: 'Balintawak', exit: 'Plaza Dilao' }],
  },
  {
    id: 'naia-skyway',
    keywords: ['naia', 'terminal 3', 'skyway', 'naiax'],
    minKeywordHits: 2,
    segments: [{ expressway: 'NAIAX', entry: 'NAIA Terminal 3', exit: 'Skyway' }],
  },
  {
    id: 'naia-macapagal',
    keywords: ['naia', 'terminal 3', 'macapagal', 'naiax'],
    minKeywordHits: 2,
    segments: [{ expressway: 'NAIAX', entry: 'NAIA Terminal 3', exit: 'Macapagal' }],
  },
  {
    id: 'paranaque-kawit',
    keywords: ['paranaque', 'kawit', 'cavitex'],
    segments: [{ expressway: 'CAVITEX', entry: 'Paranaque', exit: 'Kawit' }],
  },
  {
    id: 'paranaque-zapote',
    keywords: ['paranaque', 'zapote', 'cavitex'],
    segments: [{ expressway: 'CAVITEX', entry: 'Paranaque', exit: 'Zapote' }],
  },
  {
    id: 'paranaque-c5-link',
    keywords: ['paranaque', 'c5', 'link', 'cavitex'],
    minKeywordHits: 3,
    segments: [{ expressway: 'CAVITEX', entry: 'Kawit', exit: 'C5 Link' }],
  },
  {
    id: 'mamplasan-santa-rosa',
    keywords: ['mamplasan', 'santa rosa', 'calax'],
    segments: [{ expressway: 'CALAX', entry: 'Mamplasan', exit: 'Santa Rosa' }],
  },
  {
    id: 'mamplasan-laguna-blvd',
    keywords: ['mamplasan', 'laguna blvd', 'calax'],
    segments: [{ expressway: 'CALAX', entry: 'Mamplasan', exit: 'Laguna Blvd' }],
  },
  {
    id: 'mamplasan-silang',
    keywords: ['mamplasan', 'silang', 'calax'],
    segments: [{ expressway: 'CALAX', entry: 'Mamplasan', exit: 'Silang East' }],
  },
  {
    id: 'daang-hari-slex',
    keywords: ['daang hari', 'slex', 'mcx'],
    segments: [{ expressway: 'MCX', entry: 'Daang Hari', exit: 'SLEX' }],
  },
  // ── New presets for expanded entry/exit points ──────────────────────
  {
    id: 'magallanes-alabang',
    keywords: ['magallanes', 'alabang', 'slex'],
    segments: [{ expressway: 'SLEX', entry: 'Magallanes', exit: 'Alabang' }],
  },
  {
    id: 'magallanes-calamba',
    keywords: ['magallanes', 'calamba', 'slex'],
    segments: [{ expressway: 'SLEX', entry: 'Magallanes', exit: 'Calamba' }],
  },
  {
    id: 'magallanes-sto-tomas',
    keywords: ['magallanes', 'sto tomas', 'santo tomas', 'slex'],
    minKeywordHits: 3,
    segments: [{ expressway: 'SLEX', entry: 'Magallanes', exit: 'Sto Tomas' }],
  },
  {
    id: 'balintawak-meycauayan',
    keywords: ['balintawak', 'meycauayan', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Meycauayan' }],
  },
  {
    id: 'balintawak-marilao',
    keywords: ['balintawak', 'marilao', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Marilao' }],
  },
  {
    id: 'balintawak-tabang',
    keywords: ['balintawak', 'tabang', 'nlex', 'guiguinto'],
    minKeywordHits: 2,
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Tabang' }],
  },
  {
    id: 'balintawak-pulilan',
    keywords: ['balintawak', 'pulilan', 'nlex'],
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Pulilan' }],
  },
  {
    id: 'balintawak-santa-rita',
    keywords: ['balintawak', 'santa rita', 'nlex', 'guiguinto'],
    minKeywordHits: 2,
    segments: [{ expressway: 'NLEX', entry: 'Balintawak', exit: 'Santa Rita' }],
  },
  {
    id: 'tarlac-tipo',
    keywords: ['tarlac', 'tipo', 'sctex'],
    segments: [{ expressway: 'SCTEX', entry: 'Tarlac', exit: 'Tipo' }],
  },
  {
    id: 'tarlac-urdaneta',
    keywords: ['tarlac', 'urdaneta', 'tplex'],
    segments: [{ expressway: 'TPLEX', entry: 'Tarlac', exit: 'Urdaneta' }],
  },
  {
    id: 'tarlac-binalonan',
    keywords: ['tarlac', 'binalonan', 'tplex'],
    segments: [{ expressway: 'TPLEX', entry: 'Tarlac', exit: 'Binalonan' }],
  },
  {
    id: 'tarlac-sison',
    keywords: ['tarlac', 'sison', 'tplex'],
    segments: [{ expressway: 'TPLEX', entry: 'Tarlac', exit: 'Sison' }],
  },
  {
    id: 'sto-tomas-tanauan',
    keywords: ['sto tomas', 'tanauan', 'star'],
    segments: [{ expressway: 'STAR TOLLWAY', entry: 'Sto Tomas', exit: 'Tanauan' }],
  },
  {
    id: 'buendia-naia',
    keywords: ['buendia', 'naia', 'skyway'],
    segments: [{ expressway: 'SKYWAY', entry: 'Buendia', exit: 'NAIA' }],
  },
  {
    id: 'makati-naia',
    keywords: ['makati', 'naia', 'skyway'],
    segments: [{ expressway: 'SKYWAY', entry: 'Makati', exit: 'NAIA' }],
  },
  {
    id: 'balintawak-quezon-ave',
    keywords: ['balintawak', 'quezon ave', 'skyway'],
    segments: [{ expressway: 'SKYWAY STAGE 3', entry: 'Balintawak', exit: 'Quezon Ave' }],
  },
  {
    id: 'caloocan-espana-connector',
    keywords: ['caloocan', 'espana', 'nlex connector'],
    segments: [{ expressway: 'NLEX Connector', entry: 'Caloocan', exit: 'España' }],
  },
  {
    id: 'caloocan-magsaysay',
    keywords: ['caloocan', 'magsaysay', 'nlex connector'],
    segments: [{ expressway: 'NLEX Connector', entry: 'Caloocan', exit: 'Magsaysay' }],
  },
  {
    id: 'mamplasan-silang-aguinaldo',
    keywords: ['mamplasan', 'silang', 'aguinaldo', 'calax'],
    minKeywordHits: 3,
    segments: [{ expressway: 'CALAX', entry: 'Mamplasan', exit: 'Silang Aguinaldo' }],
  },
  {
    id: 'mamplasan-governors-drive',
    keywords: ['mamplasan', 'governor', 'general trias', 'calax'],
    minKeywordHits: 2,
    segments: [{ expressway: 'CALAX', entry: 'Mamplasan', exit: 'Governors Drive' }],
  },
  {
    id: 'naia-t1-macapagal',
    keywords: ['naia', 'terminal 1', 'macapagal', 'naiax'],
    minKeywordHits: 3,
    segments: [{ expressway: 'NAIAX', entry: 'NAIA Terminal 1&2', exit: 'Macapagal' }],
  },
];

export const findMatchingPreset = (pickup: string, dropoff: string) => {
  const routeText = `${normalizeLocationText(pickup)} ${normalizeLocationText(dropoff)}`.trim();
  if (!routeText) {
    return null;
  }

  const scored = routePresets
    .map((preset) => ({
      preset,
      score: preset.keywords.reduce(
        (count, keyword) =>
          routeText.includes(normalizeLocationText(keyword)) ? count + 1 : count,
        0,
      ),
    }))
    .filter(({ score, preset }) => score >= (preset.minKeywordHits ?? 2));

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.preset ?? null;
};

export { normalizeLocationText };
