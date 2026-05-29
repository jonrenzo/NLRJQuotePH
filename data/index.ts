export type {
  Screen,
  QuoteTheme,
  Settings,
  OtherCost,
  TollVehicleClass,
  TollSegment,
  TollRateTable,
  RoutePresetSegment,
  RoutePreset,
  SuggestionStatus,
  QuoteForm,
  CalculatedQuote,
  SavedQuote,
} from './types';

export { SETTINGS_KEY, QUOTES_KEY } from './types';
export { tollRates, expressways } from './toll-rates';
export {
  tollPhConnections,
  tollPhExpressways,
  tollPhNetworks,
  tollPhPoints,
  tollPhSource,
  tollRatesByVehicleClass,
} from './toll-ph-rates';
export type {
  CalculatedTollSegment,
  TollPoint,
  TollPointMatch,
  TollRouteCalculation,
  TollTextRouteCalculation,
} from './toll-calculator';
export {
  calculateTollRoute,
  calculateTollRouteFromText,
  findBestTollPointMatch,
  searchTollPoints,
  tollCalculatorPoints,
} from './toll-calculator';
export { routePresets, findMatchingPreset, normalizeLocationText } from './route-presets';
