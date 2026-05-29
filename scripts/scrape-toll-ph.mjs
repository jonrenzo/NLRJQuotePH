import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const DEFAULT_URL = 'https://toll.ph/';
const DEFAULT_OUT_DIR = 'data';
const DEFAULT_LAST_UPDATED = '2026-02-01';

const KNOWN_TOLL_NETWORKS = [
  { id: 'TPLEX', name: 'TPLEX', rfid: 'AUTOSWEEP', sequence: 1 },
  { id: 'NLEX_SCTEX', name: 'NLEX/SCTEX', rfid: 'EASYTRIP', sequence: 2 },
  { id: 'SKYWAY3', name: 'Skyway Stage 3', rfid: 'AUTOSWEEP', sequence: 3 },
  { id: 'NLEX_CONNECTOR', name: 'NLEX Connector', rfid: 'EASYTRIP', sequence: 3 },
  { id: 'NLEX_HARBOR_LINK', name: 'NLEX Harbor Link', rfid: 'EASYTRIP', sequence: 3 },
  { id: 'NAIAX', name: 'NAIAX', rfid: 'AUTOSWEEP', sequence: 4 },
  { id: 'SLEX_SKYWAY_MCX', name: 'SLEX/SKYWAY/MCX', rfid: 'AUTOSWEEP', sequence: 5 },
  { id: 'CAVITEX', name: 'CAVITEX', rfid: 'EASYTRIP', sequence: 6 },
  { id: 'CALAX', name: 'CALAX', rfid: 'EASYTRIP', sequence: 7 },
  { id: 'STAR', name: 'STAR', rfid: 'AUTOSWEEP', sequence: 8 },
];

const KNOWN_EXPRESSWAY_NAMES = {
  CALAX: 'Cavite-Laguna Expressway',
  CAVITEX: 'Cavite Expressway',
  NAIAX: 'Ninoy Aquino International Airport Expressway',
  NLEX: 'North Luzon Expressway',
  'NLEX CONN': 'NLEX Connector',
  'NLEX HARBOR': 'NLEX Harbor Link',
  SCTEX: 'Subic-Clark-Tarlac Expressway',
  SKYWAY: 'Skyway',
  SKYWAY3: 'SkyWay Stage 3',
  SLEX: 'South Luzon Expressway',
  STAR: 'Southern Tagalog Arterial Road',
  TPLEX: 'Tarlac-Pangasinan-La Union Expressway',
};

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg.startsWith('--')) {
    args.set(arg.slice(2), process.argv[i + 1]);
    i += 1;
  }
}

const inputPath = args.get('input');
const sourceUrl = args.get('url') ?? DEFAULT_URL;
const outDir = args.get('out-dir') ?? DEFAULT_OUT_DIR;

const readHtml = async () => {
  if (inputPath) {
    return readFile(inputPath, 'utf8');
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sourceUrl}: ${response.status} ${response.statusText}`);
  }
  return response.text();
};

const extractDataLiteral = (html) => {
  const marker = 'const data = ';
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error('Unable to find SvelteKit data payload.');
  }

  const literalStart = html.indexOf('[', start + marker.length);
  if (literalStart === -1) {
    throw new Error('Unable to find SvelteKit data array.');
  }

  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let i = literalStart; i < html.length; i += 1) {
    const char = html[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '[' || char === '{' || char === '(') {
      depth += 1;
      continue;
    }

    if (char === ']' || char === '}' || char === ')') {
      depth -= 1;
      if (depth === 0) {
        return html.slice(literalStart, i + 1);
      }
    }
  }

  throw new Error('Unable to close SvelteKit data payload.');
};

const compareBySequenceThenName = (a, b) => {
  const sequenceA = a.sequence ?? Number.MAX_SAFE_INTEGER;
  const sequenceB = b.sequence ?? Number.MAX_SAFE_INTEGER;
  if (sequenceA !== sequenceB) {
    return sequenceA - sequenceB;
  }
  return a.name.localeCompare(b.name);
};

const sortObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.keys(value)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sorted, key) => {
      sorted[key] = sortObject(value[key]);
      return sorted;
    }, {});
};

const setFee = (table, networkId, entryName, exitName, fee) => {
  table[networkId] ??= {};
  table[networkId][entryName] ??= {};
  table[networkId][entryName][exitName] = fee;
};

const buildTables = (records) => {
  const byClass = { 1: {}, 2: {}, 3: {} };

  for (const record of records) {
    const classTable = byClass[record.vehicleClass];
    if (!classTable) {
      throw new Error(`Unsupported vehicle class: ${record.vehicleClass}`);
    }

    setFee(classTable, record.tollNetworkId, record.entry.name, record.exit.name, record.fee);
    if (record.reversible) {
      setFee(classTable, record.tollNetworkId, record.exit.name, record.entry.name, record.fee);
    }
  }

  return sortObject(byClass);
};

const normalizePoint = (value, expressway) => ({
  id: value.id,
  name: value.name,
  expresswayId: value.expresswayId,
  expresswayName: expressway?.name ?? KNOWN_EXPRESSWAY_NAMES[value.expresswayId],
  expresswaySequence: value.expresswaySequence ?? expressway?.sequence,
  tollNetworkId: value.tollNetworkId ?? expressway?.tollNetworkId,
  rfid: value.rfid,
  sequence: value.sequence,
});

const inferExpressways = (points) =>
  Object.values(
    points.reduce((expressways, point) => {
      expressways[point.expresswayId] ??= {
        id: point.expresswayId,
        name: point.expresswayName,
        tollNetworkId: point.tollNetworkId,
        sequence: point.expresswaySequence,
      };
      return expressways;
    }, {})
  ).sort(compareBySequenceThenName);

const toPointLookup = (points) => new Map(points.map((point) => [point.id, point]));

const toRecord = (row, pointLookup) => {
  const entryPoint = row.entryPoint ?? row.entry_point;
  const exitPoint = row.exitPoint ?? row.exit_point;
  const entry = pointLookup.get(entryPoint.id) ?? normalizePoint(entryPoint, row.entryExpressway);
  const exit = pointLookup.get(exitPoint.id) ?? normalizePoint(exitPoint, row.exitExpressway);
  const entryNetworkId = entry.tollNetworkId;
  const exitNetworkId = exit.tollNetworkId;

  if (!entryNetworkId || !exitNetworkId) {
    throw new Error(`Unable to resolve network for ${entryPoint.id} -> ${exitPoint.id}`);
  }

  if (entryNetworkId !== exitNetworkId) {
    throw new Error(`Cross-network row detected: ${entryNetworkId} -> ${exitNetworkId}`);
  }

  return {
    vehicleClass: row.toll_matrix.vehicleClass,
    fee: Number(row.toll_matrix.fee),
    reversible: row.toll_matrix.reversible,
    tollNetworkId: entryNetworkId,
    entry: {
      pointId: entry.id,
      name: entry.name,
      expresswayId: entry.expresswayId,
      expresswayName: entry.expresswayName,
      tollNetworkId: entry.tollNetworkId,
      rfid: entry.rfid,
    },
    exit: {
      pointId: exit.id,
      name: exit.name,
      expresswayId: exit.expresswayId,
      expresswayName: exit.expresswayName,
      tollNetworkId: exit.tollNetworkId,
      rfid: exit.rfid,
    },
  };
};

const formatTs = (value) => JSON.stringify(value, null, 2);

const main = async () => {
  const html = await readHtml();
  const literal = extractDataLiteral(html);
  const payload = vm.runInNewContext(`(${literal})`);
  const data = payload?.[1]?.data;

  if (!data?.tollMatrix?.length) {
    throw new Error('No toll matrix records found in payload.');
  }

  const inputExpressways = [...(data.expressways ?? [])].sort(compareBySequenceThenName);
  const inputTollNetworks = [...(data.tollNetworks ?? [])];
  const expresswayLookup = new Map(
    inputExpressways.map((expressway) => [expressway.id, expressway])
  );
  const points = [...data.points]
    .map((item) => {
      if (item.point) {
        return normalizePoint(item.point, item.expressway);
      }
      return normalizePoint(item, expresswayLookup.get(item.expresswayId));
    })
    .sort(compareBySequenceThenName);
  const presentNetworkIds = new Set(points.map((point) => point.tollNetworkId));
  const tollNetworks =
    inputTollNetworks.length > 0
      ? inputTollNetworks
      : KNOWN_TOLL_NETWORKS.filter((network) => presentNetworkIds.has(network.id));
  const expressways = inputExpressways.length > 0 ? inputExpressways : inferExpressways(points);
  const pointLookup = toPointLookup(points);
  const records = data.tollMatrix
    .map((row) => toRecord(row, pointLookup))
    .sort((a, b) => {
      if (a.vehicleClass !== b.vehicleClass) {
        return a.vehicleClass - b.vehicleClass;
      }
      if (a.tollNetworkId !== b.tollNetworkId) {
        return a.tollNetworkId.localeCompare(b.tollNetworkId);
      }
      if (a.entry.pointId !== b.entry.pointId) {
        return a.entry.pointId - b.entry.pointId;
      }
      return a.exit.pointId - b.exit.pointId;
    });
  const tollRatesByVehicleClass = buildTables(records);
  const connections = [...(data.connections ?? [])].map((row) => {
    const point = pointLookup.get(row.point?.id ?? row.connection?.pointId);
    const connectingPoint = pointLookup.get(
      row.connecting_point?.id ?? row.connection?.connectingPointId
    );

    if (!point || !connectingPoint) {
      throw new Error('Unable to resolve calculator connection points.');
    }

    return {
      pointId: point.id,
      connectingPointId: connectingPoint.id,
    };
  });
  const scrapedAt = new Date().toISOString();

  const metadata = {
    sourceName: 'toll.ph Calculator',
    sourceUrl,
    officialSourceName: 'Toll Regulatory Board',
    officialSourceUrl: 'https://trb.gov.ph/',
    lastUpdated: DEFAULT_LAST_UPDATED,
    scrapedAt,
    recordCount: records.length,
    vehicleClasses: [1, 2, 3],
  };

  const output = {
    metadata,
    tollNetworks,
    expressways,
    points,
    connections,
    records,
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'toll-ph-matrix.json'), `${JSON.stringify(output, null, 2)}\n`);

  const ts = `// Generated by scripts/scrape-toll-ph.mjs from ${sourceUrl}
// Source page last updated: ${DEFAULT_LAST_UPDATED}

export type TollPhVehicleClass = 1 | 2 | 3;
export type TollPhRateTable = Record<string, Record<string, Record<string, number>>>;

export const tollPhSource = ${formatTs(metadata)} as const;

export const tollPhNetworks = ${formatTs(tollNetworks)} as const;

export const tollPhExpressways = ${formatTs(expressways)} as const;

export const tollPhPoints = ${formatTs(points)} as const;

export const tollPhConnections = ${formatTs(connections)} as const;

export const tollRatesByVehicleClass: Record<TollPhVehicleClass, TollPhRateTable> = {
  1: ${formatTs(tollRatesByVehicleClass[1])},
  2: ${formatTs(tollRatesByVehicleClass[2])},
  3: ${formatTs(tollRatesByVehicleClass[3])},
};
`;

  await writeFile(path.join(outDir, 'toll-ph-rates.ts'), ts);

  console.log(
    JSON.stringify(
      {
        wrote: [path.join(outDir, 'toll-ph-matrix.json'), path.join(outDir, 'toll-ph-rates.ts')],
        recordCount: records.length,
        recordsByClass: records.reduce((counts, record) => {
          counts[record.vehicleClass] = (counts[record.vehicleClass] ?? 0) + 1;
          return counts;
        }, {}),
        networkCount: tollNetworks.length,
        pointCount: points.length,
        connectionCount: connections.length,
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
