import { type CalculatedQuote, type QuoteForm } from '../data';

export const parseMoney = (value: string) => {
  const parsed = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatPhp = (value: number) =>
  `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatDateShort = (value: string | Date) => {
  const date = new Date(value);
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const buildQuoteNumber = (idSeed: string, issuedAt: string) => {
  const suffix = idSeed.replace(/\D/g, '').slice(-4).padStart(4, '0');
  const ymd = formatDateShort(issuedAt).replace(/-/g, '');
  return `NLRJ-${ymd}-${suffix}`;
};

export const calculateQuote = (form: QuoteForm): CalculatedQuote => {
  const distanceKm = parseMoney(form.distanceKm);
  const dieselPrice = parseMoney(form.dieselPrice);
  const liters = distanceKm / 10;
  const fuelCost = liters * dieselPrice * 2;
  const tollTotal = (form.usesHighway
    ? form.tollSegments.reduce((sum, segment) => sum + segment.fee, 0)
    : 0) * 2;
  const otherCostsTotal = form.otherCosts.reduce((sum, item) => sum + parseMoney(item.amount), 0);
  const rateAmount = parseMoney(form.rate);

  return {
    liters,
    fuelCost,
    tollTotal,
    otherCostsTotal,
    rateAmount,
    grandTotal: fuelCost + tollTotal + otherCostsTotal + rateAmount,
  };
};
