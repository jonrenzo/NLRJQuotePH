export const SETTINGS_KEY = 'nlrjquote.settings.v1';
export const QUOTES_KEY = 'nlrjquote.quotes.v1';

export type Screen = 'home' | 'quote' | 'preview' | 'settings';

export type QuoteTheme = 'Navy' | 'Graphite' | 'Forest' | 'Burgundy' | 'Teal' | 'Slate';

export type Settings = {
  businessName: string;
  contactNumber: string;
  defaultDieselPrice: string;
  theme: QuoteTheme;
  logoUri?: string;
};

export type OtherCost = {
  id: string;
  label: string;
  amount: string;
};

export type TollVehicleClass = 1 | 2 | 3;

export type TollSegment = {
  id: string;
  expressway: string;
  entry: string;
  exit: string;
  fee: number;
  entryPointId?: number;
  exitPointId?: number;
  rfid?: string;
};

export type TollRateTable = Record<string, Record<string, Record<string, number>>>;

export type RoutePresetSegment = { expressway: string; entry: string; exit: string };

export type RoutePreset = {
  id: string;
  keywords: string[];
  minKeywordHits?: number;
  segments: RoutePresetSegment[];
};

export type SuggestionStatus = 'idle' | 'suggested' | 'confirmed';

export type QuoteForm = {
  customerName: string;
  pickup: string;
  dropoff: string;
  distanceKm: string;
  dieselPrice: string;
  usesHighway: boolean;
  tollVehicleClass: TollVehicleClass;
  tollSegments: TollSegment[];
  otherCosts: OtherCost[];
  rate: string;
  rateType: 'NCR Rate' | 'Provincial Rate';
  ratePeriod: string;
  vehicleType: string;
};

export type CalculatedQuote = {
  liters: number;
  fuelCost: number;
  tollTotal: number;
  otherCostsTotal: number;
  rateAmount: number;
  grandTotal: number;
};

export type SavedQuote = QuoteForm &
  CalculatedQuote & {
    id: string;
    status: 'Draft' | 'Saved';
    issuedAt: string;
    createdAt: string;
    updatedAt: string;
  };
