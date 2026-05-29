import { type QuoteForm, type QuoteTheme, type Settings } from '../data';

export const defaultSettings: Settings = {
  businessName: 'NLRJ Trucking Services',
  contactNumber: '',
  defaultDieselPrice: '65',
  theme: 'Navy',
};

export const themeOptions: QuoteTheme[] = [
  'Navy',
  'Graphite',
  'Forest',
  'Burgundy',
  'Teal',
  'Slate',
];
export const tollVehicleClassOptions = ['Class 1', 'Class 2', 'Class 3'];

export const themeStyles: Record<
  QuoteTheme,
  {
    accent: string;
    highlight: string;
    ink: string;
    watermark: string;
    outerBg: string;
    paperBorder: string;
  }
> = {
  Navy: {
    accent: '#0B1B33',
    highlight: '#F97316',
    ink: '#0B1B33',
    watermark: 'rgba(11,27,51,0.05)',
    outerBg: '#eef2f7',
    paperBorder: '#d6dde8',
  },
  Graphite: {
    accent: '#1F2937',
    highlight: '#EA580C',
    ink: '#111827',
    watermark: 'rgba(31,41,55,0.06)',
    outerBg: '#f1f5f9',
    paperBorder: '#d1d5db',
  },
  Forest: {
    accent: '#14532D',
    highlight: '#FB923C',
    ink: '#1B4332',
    watermark: 'rgba(20,83,45,0.06)',
    outerBg: '#ecfdf5',
    paperBorder: '#bbf7d0',
  },
  Burgundy: {
    accent: '#7F1D1D',
    highlight: '#F59E0B',
    ink: '#7F1D1D',
    watermark: 'rgba(127,29,29,0.06)',
    outerBg: '#fef2f2',
    paperBorder: '#fecaca',
  },
  Teal: {
    accent: '#134E4A',
    highlight: '#F97316',
    ink: '#134E4A',
    watermark: 'rgba(19,78,74,0.06)',
    outerBg: '#f0fdfa',
    paperBorder: '#99f6e4',
  },
  Slate: {
    accent: '#334155',
    highlight: '#FB923C',
    ink: '#1E293B',
    watermark: 'rgba(51,65,85,0.06)',
    outerBg: '#f8fafc',
    paperBorder: '#cbd5e1',
  },
};

export const appThemeStyles: Record<
  QuoteTheme,
  {
    screenBg: string;
    cardBg: string;
    sectionIconBg: string;
    sectionIconColor: string;
    primaryBtnBg: string;
    primaryBtnText: string;
    tabBg: string;
    tabActiveBg: string;
    tabActiveText: string;
    tabInactiveIcon: string;
  }
> = {
  Navy: {
    screenBg: '#eef2f7',
    cardBg: '#ffffff',
    sectionIconBg: '#eff6ff',
    sectionIconColor: '#1d4ed8',
    primaryBtnBg: '#111827',
    primaryBtnText: '#ffffff',
    tabBg: '#111827',
    tabActiveBg: '#ffffff',
    tabActiveText: '#111827',
    tabInactiveIcon: '#ffffff',
  },
  Graphite: {
    screenBg: '#f3f4f6',
    cardBg: '#ffffff',
    sectionIconBg: '#e5e7eb',
    sectionIconColor: '#374151',
    primaryBtnBg: '#1f2937',
    primaryBtnText: '#ffffff',
    tabBg: '#1f2937',
    tabActiveBg: '#ffffff',
    tabActiveText: '#111827',
    tabInactiveIcon: '#ffffff',
  },
  Forest: {
    screenBg: '#ecfdf5',
    cardBg: '#ffffff',
    sectionIconBg: '#dcfce7',
    sectionIconColor: '#166534',
    primaryBtnBg: '#14532d',
    primaryBtnText: '#ffffff',
    tabBg: '#14532d',
    tabActiveBg: '#ffffff',
    tabActiveText: '#14532d',
    tabInactiveIcon: '#ffffff',
  },
  Burgundy: {
    screenBg: '#fef2f2',
    cardBg: '#ffffff',
    sectionIconBg: '#fee2e2',
    sectionIconColor: '#991b1b',
    primaryBtnBg: '#7f1d1d',
    primaryBtnText: '#ffffff',
    tabBg: '#7f1d1d',
    tabActiveBg: '#ffffff',
    tabActiveText: '#7f1d1d',
    tabInactiveIcon: '#ffffff',
  },
  Teal: {
    screenBg: '#f0fdfa',
    cardBg: '#ffffff',
    sectionIconBg: '#ccfbf1',
    sectionIconColor: '#0f766e',
    primaryBtnBg: '#134e4a',
    primaryBtnText: '#ffffff',
    tabBg: '#134e4a',
    tabActiveBg: '#ffffff',
    tabActiveText: '#134e4a',
    tabInactiveIcon: '#ffffff',
  },
  Slate: {
    screenBg: '#f8fafc',
    cardBg: '#ffffff',
    sectionIconBg: '#e2e8f0',
    sectionIconColor: '#334155',
    primaryBtnBg: '#334155',
    primaryBtnText: '#ffffff',
    tabBg: '#334155',
    tabActiveBg: '#ffffff',
    tabActiveText: '#334155',
    tabInactiveIcon: '#ffffff',
  },
};

export const createDefaultForm = (dieselPrice = defaultSettings.defaultDieselPrice): QuoteForm => ({
  customerName: '',
  pickup: '',
  dropoff: '',
  distanceKm: '',
  dieselPrice,
  usesHighway: false,
  tollVehicleClass: 1,
  tollSegments: [],
  otherCosts: [],
  rate: '',
  rateType: 'NCR Rate',
  ratePeriod: '',
  vehicleType: 'L300',
});
