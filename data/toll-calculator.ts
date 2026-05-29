import { TollVehicleClass } from './types';
import {
  tollPhConnections,
  tollPhNetworks,
  tollPhPoints,
  tollRatesByVehicleClass,
} from './toll-ph-rates';

export type TollPoint = {
  id: number;
  name: string;
  expresswayId: string;
  expresswayName?: string;
  expresswaySequence?: number;
  tollNetworkId: string;
  rfid?: string;
  sequence?: number;
};

type TollConnector = {
  reachableConnectedPoint: TollPoint;
  externalConnectedPoint: TollPoint;
};

export type CalculatedTollSegment = {
  entryPoint: TollPoint;
  exitPoint: TollPoint;
  networkId: string;
  networkName: string;
  fee: number;
  rfid?: string;
};

export type TollRouteCalculation = {
  totalFee: number;
  autoSweepTotal: number;
  easyTripTotal: number;
  tollSegments: CalculatedTollSegment[];
  vehicleClass: TollVehicleClass;
  originPointId: number;
  destinationPointId: number;
};

export type TollPointMatch = {
  point: TollPoint;
  score: number;
  ambiguous: boolean;
};

export type TollTextRouteCalculation = TollRouteCalculation & {
  originMatch: TollPointMatch;
  destinationMatch: TollPointMatch;
};

const points = tollPhPoints as readonly TollPoint[];
const pointById = new Map(points.map((point) => [point.id, point]));
const networkNameById = new Map<string, string>(
  tollPhNetworks.map((network) => [network.id, network.name])
);

const normalizeTollText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const sortPoints = (a: TollPoint, b: TollPoint) => {
  const expresswaySequenceA = a.expresswaySequence ?? Number.MAX_SAFE_INTEGER;
  const expresswaySequenceB = b.expresswaySequence ?? Number.MAX_SAFE_INTEGER;
  if (expresswaySequenceA !== expresswaySequenceB) {
    return expresswaySequenceA - expresswaySequenceB;
  }

  const sequenceA = a.sequence ?? Number.MAX_SAFE_INTEGER;
  const sequenceB = b.sequence ?? Number.MAX_SAFE_INTEGER;
  if (sequenceA !== sequenceB) {
    return sequenceA - sequenceB;
  }

  return `${a.expresswayId} ${a.name}`.localeCompare(`${b.expresswayId} ${b.name}`);
};

const uniquePoints = (items: TollPoint[]) =>
  items.reduce<TollPoint[]>((unique, point) => {
    if (!unique.some((item) => item.id === point.id)) {
      unique.push(point);
    }
    return unique;
  }, []);

const getNetworkName = (networkId: string) => networkNameById.get(networkId) ?? networkId;

const getTollFee = (
  entryPoint: TollPoint,
  exitPoint: TollPoint,
  vehicleClass: TollVehicleClass
) => {
  const rateTable = tollRatesByVehicleClass[vehicleClass] as Record<
    string,
    Record<string, Record<string, number>>
  >;
  return rateTable[entryPoint.tollNetworkId]?.[entryPoint.name]?.[exitPoint.name] ?? 0;
};

const getReachablePoints = (pointId: number, vehicleClass: TollVehicleClass) => {
  const point = pointById.get(pointId);
  if (!point) {
    return [];
  }

  const rateTable = tollRatesByVehicleClass[vehicleClass] as Record<
    string,
    Record<string, Record<string, number>>
  >;
  const networkTable = rateTable[point.tollNetworkId] ?? {};
  const reachableNames = Object.keys(networkTable[point.name] ?? {});
  const reachable = points.filter(
    (item) => item.tollNetworkId === point.tollNetworkId && reachableNames.includes(item.name)
  );

  if (pointId === 1) {
    reachable.push(point);
  }

  return uniquePoints(reachable);
};

const getConnections = (pointIds: number[]) => {
  const pointIdSet = new Set(pointIds);
  const forward = tollPhConnections
    .filter((connection) => pointIdSet.has(connection.pointId))
    .map((connection) => ({
      reachableConnectedPoint: pointById.get(connection.pointId),
      externalConnectedPoint: pointById.get(connection.connectingPointId),
    }));
  const reverse = tollPhConnections
    .filter((connection) => pointIdSet.has(connection.connectingPointId))
    .map((connection) => ({
      reachableConnectedPoint: pointById.get(connection.connectingPointId),
      externalConnectedPoint: pointById.get(connection.pointId),
    }));

  return [...forward, ...reverse].filter((connection): connection is TollConnector =>
    Boolean(connection.reachableConnectedPoint && connection.externalConnectedPoint)
  );
};

const getReachableConnections = (origin: TollPoint, vehicleClass: TollVehicleClass) => {
  let connections = getConnections(
    getReachablePoints(origin.id, vehicleClass).map((point) => point.id)
  );
  let queue = [...connections];

  while (queue.length > 0) {
    const nextQueue = [...queue];
    queue = [];

    for (const connection of nextQueue) {
      const reachablePointIds = getReachablePoints(
        connection.externalConnectedPoint.id,
        vehicleClass
      ).map((point) => point.id);
      const nextConnections = getConnections(reachablePointIds).filter(
        (nextConnection) =>
          !connections.some(
            (item) => item.externalConnectedPoint.id === nextConnection.externalConnectedPoint.id
          )
      );

      connections = [...connections, ...nextConnections];
      queue = [...queue, ...nextConnections];
    }
  }

  return connections;
};

const buildSegment = (
  entryPoint: TollPoint,
  exitPoint: TollPoint,
  vehicleClass: TollVehicleClass
): CalculatedTollSegment => ({
  entryPoint,
  exitPoint,
  networkId: entryPoint.tollNetworkId,
  networkName: getNetworkName(entryPoint.tollNetworkId),
  fee: getTollFee(entryPoint, exitPoint, vehicleClass),
  rfid: entryPoint.rfid,
});

const splitByRfid = (segments: CalculatedTollSegment[]) =>
  segments.reduce(
    (totals, segment) => {
      if (segment.rfid === 'AUTOSWEEP') {
        totals.autoSweepTotal += segment.fee;
      } else if (segment.rfid === 'EASYTRIP') {
        totals.easyTripTotal += segment.fee;
      }
      return totals;
    },
    { autoSweepTotal: 0, easyTripTotal: 0 }
  );

export const tollCalculatorPoints = [...points].sort(sortPoints);

export const searchTollPoints = (query: string, limit = 12) => {
  const normalizedQuery = normalizeTollText(query);
  if (!normalizedQuery) {
    return tollCalculatorPoints.slice(0, limit);
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const compactQuery = queryTokens.join('');

  return tollCalculatorPoints
    .filter((point) => {
      const searchText = normalizeTollText(
        `${point.name} ${point.expresswayId} ${point.expresswayName ?? ''} ${point.tollNetworkId}`
      );
      const searchTokens = searchText.split(/\s+/).filter(Boolean);
      const compactSearch = searchTokens.join('');

      const spacedMatch = queryTokens.every((token) => searchText.includes(token));
      const compactMatch = compactQuery.length > 0 && compactSearch.includes(compactQuery);

      return spacedMatch || compactMatch;
    })
    .slice(0, Math.max(limit * 3, 40));
};

export const findBestTollPointMatch = (text: string): TollPointMatch | null => {
  const normalizedText = normalizeTollText(text);
  if (!normalizedText) {
    return null;
  }

  const compactQuery = normalizedText.replace(/\s+/g, '');

  const scored = points
    .map((point) => {
      const pointName = normalizeTollText(point.name);
      const expresswayId = normalizeTollText(point.expresswayId);
      const expresswayName = normalizeTollText(point.expresswayName ?? '');
      const compactPoint = pointName.replace(/\s+/g, '');
      const nameTokens = pointName.split(' ').filter(Boolean);
      const matchedNameTokens = nameTokens.filter((token) => normalizedText.includes(token));
      let score = 0;

      if (normalizedText === pointName) {
        score += 120;
      }
      if (normalizedText.includes(pointName)) {
        score += 90;
      }
      if (compactQuery.includes(compactPoint) || compactPoint.includes(compactQuery)) {
        score += 60;
      }
      if (matchedNameTokens.length > 0) {
        score += (matchedNameTokens.length / nameTokens.length) * 70;
      }
      if (expresswayId && normalizedText.includes(expresswayId)) {
        score += 20;
      }
      if (expresswayName && normalizedText.includes(expresswayName)) {
        score += 20;
      }

      return { point, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || sortPoints(a.point, b.point));

  const best = scored[0];
  if (!best) {
    return null;
  }

  return {
    point: best.point,
    score: best.score,
    ambiguous: scored.some(
      (item) => item.point.id !== best.point.id && Math.abs(item.score - best.score) < 1
    ),
  };
};

export const calculateTollRoute = (
  originPointId: number,
  destinationPointId: number,
  vehicleClass: TollVehicleClass = 1
): TollRouteCalculation | null => {
  const origin = pointById.get(originPointId);
  const destination = pointById.get(destinationPointId);
  if (!origin || !destination) {
    return null;
  }

  let totalFee = 0;
  let tollSegments: CalculatedTollSegment[] = [];

  if (origin.tollNetworkId === destination.tollNetworkId) {
    const segment = buildSegment(origin, destination, vehicleClass);
    tollSegments = [segment];
    totalFee = segment.fee;
  } else {
    let currentDestination = destination;
    const reachableConnections = getReachableConnections(origin, vehicleClass);

    for (let index = 0; index < reachableConnections.length; index += 1) {
      const connection = reachableConnections[index];

      if (currentDestination.tollNetworkId === origin.tollNetworkId) {
        const segment = buildSegment(origin, currentDestination, vehicleClass);
        tollSegments = [segment, ...tollSegments];
        totalFee += segment.fee;
        break;
      }

      const reachableFromExternal = getReachablePoints(
        connection.externalConnectedPoint.id,
        vehicleClass
      ).map((point) => point.id);

      if (reachableFromExternal.includes(currentDestination.id)) {
        const segment = buildSegment(
          connection.externalConnectedPoint,
          currentDestination,
          vehicleClass
        );
        tollSegments = [segment, ...tollSegments];
        totalFee += segment.fee;
        currentDestination = connection.reachableConnectedPoint;
        index = -1;
      }
    }
  }

  const totals = splitByRfid(tollSegments);

  return {
    totalFee,
    ...totals,
    tollSegments,
    vehicleClass,
    originPointId: origin.id,
    destinationPointId: destination.id,
  };
};

export const calculateTollRouteFromText = (
  originText: string,
  destinationText: string,
  vehicleClass: TollVehicleClass = 1
): TollTextRouteCalculation | null => {
  const originMatch = findBestTollPointMatch(originText);
  const destinationMatch = findBestTollPointMatch(destinationText);

  if (!originMatch || !destinationMatch) {
    return null;
  }

  const route = calculateTollRoute(originMatch.point.id, destinationMatch.point.id, vehicleClass);
  if (!route || route.totalFee <= 0 || route.tollSegments.length === 0) {
    return null;
  }

  return {
    ...route,
    originMatch,
    destinationMatch,
  };
};
