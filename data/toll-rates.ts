import { TollRateTable } from './types';

const c = (class1: number) => class1;

const buildMatrix = (pairs: [string, string, number][]) => {
  return pairs.reduce<Record<string, Record<string, number>>>(
    (matrix, [entry, exit, fee]) => {
      matrix[entry] = { ...(matrix[entry] ?? {}), [exit]: fee };
      matrix[exit] = { ...(matrix[exit] ?? {}), [entry]: fee };
      return matrix;
    },
    {},
  );
};

const addAllPairs = (
  entries: string[],
  exits: string[],
  rateMap: Record<string, Record<string, number>>,
) => {
  const result: Record<string, Record<string, number>> = {};
  for (const entry of entries) {
    for (const exit of exits) {
      if (entry !== exit) {
        const baseEntry = rateMap[entry]?.[exit] ?? rateMap[exit]?.[entry];
        if (baseEntry !== undefined) {
          result[entry] = { ...(result[entry] ?? {}), [exit]: baseEntry };
        }
      }
    }
  }
  for (const k of Object.keys(rateMap)) {
    result[k] = { ...(result[k] ?? {}), ...rateMap[k] };
  }
  return result;
};

export const tollRates: TollRateTable = {
  // ── NLEX (North Luzon Expressway) ──────────────────────────────────────
  // Official: https://nlex.com.ph/toll-fees
  NLEX: addAllPairs(
    [
      'Balintawak',
      'Mindanao Ave',
      'Meycauayan',
      'Marilao',
      'Bocaue',
      'Tabang',
      'Santa Rita',
      'Pulilan',
      'San Fernando',
      'Mexico',
      'Angeles',
      'Dau',
      'Clark Spur',
      'Sta Ines',
    ],
    [
      'Balintawak',
      'Mindanao Ave',
      'Meycauayan',
      'Marilao',
      'Bocaue',
      'Tabang',
      'Santa Rita',
      'Pulilan',
      'San Fernando',
      'Mexico',
      'Angeles',
      'Dau',
      'Clark Spur',
      'Sta Ines',
    ],
    buildMatrix([
      ['Balintawak', 'Bocaue', c(75)],
      ['Balintawak', 'San Fernando', c(236)],
      ['Balintawak', 'Dau', c(355)],
      ['Balintawak', 'Sta Ines', c(438)],
      ['Mindanao Ave', 'Bocaue', c(61)],
      ['Mindanao Ave', 'San Fernando', c(222)],
      // TODO: verify rates below
      ['Balintawak', 'Mindanao Ave', c(30)],
      ['Balintawak', 'Meycauayan', c(45)],
      ['Balintawak', 'Marilao', c(57)],
      ['Balintawak', 'Tabang', c(108)],
      ['Balintawak', 'Santa Rita', c(140)],
      ['Balintawak', 'Pulilan', c(180)],
      ['Balintawak', 'Mexico', c(280)],
      ['Balintawak', 'Angeles', c(320)],
      ['Balintawak', 'Clark Spur', c(365)],
      ['Bocaue', 'San Fernando', c(160)],
      ['Bocaue', 'Dau', c(280)],
      ['Bocaue', 'Sta Ines', c(365)],
      ['San Fernando', 'Dau', c(120)],
      ['San Fernando', 'Sta Ines', c(200)],
      ['Dau', 'Sta Ines', c(85)],
      ['Dau', 'Clark Spur', c(20)],
      ['Clark Spur', 'Sta Ines', c(75)],
    ]),
  ),

  // ── SLEX (South Luzon Expressway) ──────────────────────────────────────
  // Official: https://www.smc-tollways.com (Autosweep)
  SLEX: addAllPairs(
    [
      'Magallanes',
      'Pasay Road',
      'Nichols',
      'Bicutan',
      'Sucat',
      'Alabang',
      'Filinvest',
      'Susana Heights',
      'San Pedro',
      'Santa Rosa',
      'Cabuyao',
      'Calamba',
      'Sto Tomas',
    ],
    [
      'Magallanes',
      'Pasay Road',
      'Nichols',
      'Bicutan',
      'Sucat',
      'Alabang',
      'Filinvest',
      'Susana Heights',
      'San Pedro',
      'Santa Rosa',
      'Cabuyao',
      'Calamba',
      'Sto Tomas',
    ],
    buildMatrix([
      ['Alabang', 'Calamba', c(214)],
      ['Alabang', 'Sto Tomas', c(282)],
      ['Susana Heights', 'Calamba', c(168)],
      // TODO: verify rates below
      ['Magallanes', 'Nichols', c(22)],
      ['Magallanes', 'Bicutan', c(35)],
      ['Magallanes', 'Sucat', c(50)],
      ['Magallanes', 'Alabang', c(87)],
      ['Magallanes', 'Filinvest', c(94)],
      ['Magallanes', 'Susana Heights', c(99)],
      ['Magallanes', 'San Pedro', c(126)],
      ['Magallanes', 'Santa Rosa', c(190)],
      ['Magallanes', 'Cabuyao', c(210)],
      ['Magallanes', 'Calamba', c(240)],
      ['Magallanes', 'Sto Tomas', c(310)],
      ['Nichols', 'Bicutan', c(18)],
      ['Nichols', 'Sucat', c(32)],
      ['Nichols', 'Alabang', c(68)],
      ['Nichols', 'Calamba', c(220)],
      ['Bicutan', 'Sucat', c(16)],
      ['Bicutan', 'Alabang', c(52)],
      ['Sucat', 'Alabang', c(38)],
      ['Alabang', 'Filinvest', c(10)],
      ['Alabang', 'Susana Heights', c(15)],
      ['Alabang', 'San Pedro', c(44)],
      ['Alabang', 'Santa Rosa', c(129)],
      ['Alabang', 'Cabuyao', c(170)],
      ['Filinvest', 'Calamba', c(206)],
      ['Filinvest', 'Sto Tomas', c(274)],
      ['Susana Heights', 'Sto Tomas', c(256)],
      ['San Pedro', 'Santa Rosa', c(60)],
      ['San Pedro', 'Calamba', c(110)],
      ['San Pedro', 'Sto Tomas', c(180)],
      ['Santa Rosa', 'Calamba', c(48)],
      ['Santa Rosa', 'Sto Tomas', c(105)],
      ['Cabuyao', 'Calamba', c(30)],
      ['Cabuyao', 'Sto Tomas', c(80)],
      ['Calamba', 'Sto Tomas', c(55)],
    ]),
  ),

  // ── SKYWAY (Metro Manila Skyway, Stage 1 & 2) ─────────────────────────
  // Official: https://www.smc-tollways.com (Autosweep)
  SKYWAY: addAllPairs(
    [
      'Buendia',
      'Makati',
      'NAIA',
      'C-5',
      'Sucat',
      'Alabang',
      'Skyway Main Toll Plaza',
      'South Station',
    ],
    [
      'Buendia',
      'Makati',
      'NAIA',
      'C-5',
      'Sucat',
      'Alabang',
      'Skyway Main Toll Plaza',
      'South Station',
    ],
    buildMatrix([
      ['Buendia', 'Alabang', c(264)],
      ['Makati', 'Alabang', c(214)],
      ['NAIA', 'Alabang', c(164)],
      // TODO: verify rates below
      ['Buendia', 'NAIA', c(99)],
      ['Buendia', 'C-5', c(140)],
      ['Buendia', 'Sucat', c(190)],
      ['Buendia', 'Skyway Main Toll Plaza', c(240)],
      ['Buendia', 'South Station', c(264)],
      ['Makati', 'NAIA', c(75)],
      ['Makati', 'C-5', c(120)],
      ['Makati', 'Sucat', c(165)],
      ['Makati', 'Skyway Main Toll Plaza', c(214)],
      ['Makati', 'South Station', c(214)],
      ['NAIA', 'C-5', c(38)],
      ['NAIA', 'Sucat', c(85)],
      ['NAIA', 'Skyway Main Toll Plaza', c(135)],
      ['NAIA', 'South Station', c(164)],
      ['C-5', 'Sucat', c(48)],
      ['C-5', 'Alabang', c(100)],
      ['C-5', 'Skyway Main Toll Plaza', c(100)],
      ['C-5', 'South Station', c(120)],
      ['Sucat', 'Alabang', c(55)],
      ['Sucat', 'Skyway Main Toll Plaza', c(55)],
      ['Sucat', 'South Station', c(75)],
      ['Alabang', 'Skyway Main Toll Plaza', c(5)],
      ['Alabang', 'South Station', c(15)],
      ['Skyway Main Toll Plaza', 'South Station', c(10)],
    ]),
  ),

  // ── SKYWAY STAGE 3 (Balintawak to Buendia) ────────────────────────────
  // Official: https://www.smc-tollways.com (Autosweep)
  'SKYWAY STAGE 3': addAllPairs(
    ['Balintawak', 'Sgt Rivera', 'Quezon Ave', 'Araneta', 'España', 'Plaza Dilao', 'Buendia'],
    ['Balintawak', 'Sgt Rivera', 'Quezon Ave', 'Araneta', 'España', 'Plaza Dilao', 'Buendia'],
    buildMatrix([
      ['Balintawak', 'Buendia', c(274)],
      ['Quezon Ave', 'Buendia', c(200)],
      ['Balintawak', 'Plaza Dilao', c(191)],
      // TODO: verify rates below
      ['Balintawak', 'Sgt Rivera', c(30)],
      ['Balintawak', 'Quezon Ave', c(65)],
      ['Balintawak', 'Araneta', c(98)],
      ['Balintawak', 'España', c(140)],
      ['Sgt Rivera', 'Quezon Ave', c(35)],
      ['Sgt Rivera', 'Buendia', c(245)],
      ['Quezon Ave', 'Araneta', c(35)],
      ['Quezon Ave', 'España', c(78)],
      ['Quezon Ave', 'Plaza Dilao', c(130)],
      ['Araneta', 'España', c(42)],
      ['Araneta', 'Plaza Dilao', c(94)],
      ['Araneta', 'Buendia', c(175)],
      ['España', 'Plaza Dilao', c(52)],
      ['España', 'Buendia', c(130)],
      ['Plaza Dilao', 'Buendia', c(82)],
    ]),
  ),

  // ── SCTEX (Subic-Clark-Tarlac Expressway) ─────────────────────────────
  // Official: https://nlex.com.ph/toll-fees
  SCTEX: addAllPairs(
    [
      'Tipo',
      'Dinalupihan',
      'Floridablanca',
      'Porac',
      'Clark South',
      'Mabalacat',
      'Clark North',
      'Concepcion',
      'Hacienda Luisita',
      'Tarlac',
    ],
    [
      'Tipo',
      'Dinalupihan',
      'Floridablanca',
      'Porac',
      'Clark South',
      'Mabalacat',
      'Clark North',
      'Concepcion',
      'Hacienda Luisita',
      'Tarlac',
    ],
    buildMatrix([
      ['Mabalacat', 'Subic', c(348)],
      ['Mabalacat', 'Tarlac', c(104)],
      ['Tarlac', 'Tipo', c(272)],
      // TODO: verify rates below
      ['Mabalacat', 'Tipo', c(348)],
      ['Mabalacat', 'Dinalupihan', c(310)],
      ['Mabalacat', 'Floridablanca', c(230)],
      ['Mabalacat', 'Porac', c(160)],
      ['Mabalacat', 'Clark South', c(40)],
      ['Mabalacat', 'Clark North', c(55)],
      ['Mabalacat', 'Concepcion', c(72)],
      ['Mabalacat', 'Hacienda Luisita', c(88)],
      ['Tipo', 'Dinalupihan', c(20)],
      ['Tipo', 'Floridablanca', c(120)],
      ['Tipo', 'Porac', c(190)],
      ['Tipo', 'Clark South', c(310)],
      ['Tipo', 'Clark North', c(320)],
      ['Tipo', 'Concepcion', c(220)],
      ['Tipo', 'Hacienda Luisita', c(250)],
      ['Porac', 'Clark South', c(120)],
      ['Porac', 'Mabalacat', c(160)],
      ['Clark South', 'Mabalacat', c(40)],
      ['Clark South', 'Tarlac', c(140)],
      ['Clark North', 'Tarlac', c(85)],
      ['Concepcion', 'Tarlac', c(35)],
      ['Hacienda Luisita', 'Tarlac', c(18)],
    ]),
  ),

  // ── TPLEX (Tarlac-Pangasinan-La Union Expressway) ──────────────────────
  // Official: https://www.smc-tollways.com (Autosweep)
  TPLEX: addAllPairs(
    [
      'Tarlac',
      'Victoria',
      'Paniqui',
      'Urdaneta',
      'Binalonan',
      'Pozorrubio',
      'Sison',
      'Rosario',
    ],
    [
      'Tarlac',
      'Victoria',
      'Paniqui',
      'Urdaneta',
      'Binalonan',
      'Pozorrubio',
      'Sison',
      'Rosario',
    ],
    buildMatrix([
      ['Tarlac', 'Paniqui', c(104)],
      ['Tarlac', 'Pozorrubio', c(340)],
      ['Tarlac', 'Rosario', c(390)],
      // TODO: verify rates below
      ['Tarlac', 'Victoria', c(35)],
      ['Tarlac', 'Urdaneta', c(175)],
      ['Tarlac', 'Binalonan', c(220)],
      ['Tarlac', 'Sison', c(365)],
      ['Paniqui', 'Urdaneta', c(75)],
      ['Paniqui', 'Pozorrubio', c(235)],
      ['Paniqui', 'Rosario', c(285)],
      ['Urdaneta', 'Binalonan', c(48)],
      ['Urdaneta', 'Pozorrubio', c(170)],
      ['Urdaneta', 'Sison', c(190)],
      ['Urdaneta', 'Rosario', c(218)],
      ['Binalonan', 'Pozorrubio', c(120)],
      ['Binalonan', 'Sison', c(145)],
      ['Binalonan', 'Rosario', c(172)],
      ['Pozorrubio', 'Sison', c(25)],
      ['Pozorrubio', 'Rosario', c(52)],
      ['Sison', 'Rosario', c(28)],
    ]),
  ),

  // ── CALAX (Cavite-Laguna Expressway) ──────────────────────────────────
  // Official: https://calax.com.ph/toll-rates
  CALAX: addAllPairs(
    [
      'Mamplasan',
      'Santa Rosa',
      'Laguna Blvd',
      'Silang East',
      'Silang Aguinaldo',
      'Governors Drive',
    ],
    [
      'Mamplasan',
      'Santa Rosa',
      'Laguna Blvd',
      'Silang East',
      'Silang Aguinaldo',
      'Governors Drive',
    ],
    buildMatrix([
      ['Mamplasan', 'Santa Rosa', c(47)],
      ['Mamplasan', 'Laguna Blvd', c(64)],
      ['Mamplasan', 'Silang East', c(112)],
      // TODO: verify rates below
      ['Mamplasan', 'Silang Aguinaldo', c(181)],
      ['Mamplasan', 'Governors Drive', c(239)],
      ['Santa Rosa', 'Laguna Blvd', c(18)],
      ['Santa Rosa', 'Silang East', c(65)],
      ['Santa Rosa', 'Silang Aguinaldo', c(135)],
      ['Santa Rosa', 'Governors Drive', c(193)],
      ['Laguna Blvd', 'Silang East', c(48)],
      ['Laguna Blvd', 'Silang Aguinaldo', c(118)],
      ['Laguna Blvd', 'Governors Drive', c(176)],
      ['Silang East', 'Silang Aguinaldo', c(70)],
      ['Silang East', 'Governors Drive', c(128)],
      ['Silang Aguinaldo', 'Governors Drive', c(58)],
    ]),
  ),

  // ── CAVITEX (Manila-Cavite Expressway) ────────────────────────────────
  // Official: https://peatc.ph/toll-rates
  CAVITEX: addAllPairs(
    ['Paranaque', 'C5 Link', 'Las Pinas', 'Zapote', 'Bacoor', 'Kawit'],
    ['Paranaque', 'C5 Link', 'Las Pinas', 'Zapote', 'Bacoor', 'Kawit'],
    buildMatrix([
      ['Paranaque', 'Kawit', c(73)],
      ['Paranaque', 'Zapote', c(35)],
      ['Kawit', 'C5 Link', c(98)],
      // TODO: verify rates below
      ['Paranaque', 'C5 Link', c(42)],
      ['Paranaque', 'Las Pinas', c(28)],
      ['Paranaque', 'Bacoor', c(56)],
      ['Zapote', 'Bacoor', c(22)],
      ['Zapote', 'Kawit', c(39)],
      ['Zapote', 'C5 Link', c(63)],
      ['Bacoor', 'Kawit', c(18)],
      ['Bacoor', 'C5 Link', c(42)],
      ['Las Pinas', 'Zapote', c(10)],
      ['Las Pinas', 'Kawit', c(48)],
      ['C5 Link', 'Las Pinas', c(17)],
    ]),
  ),

  // ── NAIAX (NAIA Expressway) ──────────────────────────────────────────
  // Official: https://www.smc-tollways.com
  NAIAX: addAllPairs(
    [
      'NAIA Terminal 3',
      'NAIA Terminal 1&2',
      'Skyway',
      'Macapagal',
      'CAVITEX',
      'Entertainment City',
    ],
    [
      'NAIA Terminal 3',
      'NAIA Terminal 1&2',
      'Skyway',
      'Macapagal',
      'CAVITEX',
      'Entertainment City',
    ],
    buildMatrix([
      ['NAIA Terminal 3', 'Skyway', c(45)],
      ['NAIA Terminal 3', 'Macapagal', c(45)],
      ['Macapagal', 'Skyway', c(45)],
      // TODO: verify rates below
      ['NAIA Terminal 3', 'NAIA Terminal 1&2', c(25)],
      ['NAIA Terminal 3', 'CAVITEX', c(35)],
      ['NAIA Terminal 3', 'Entertainment City', c(35)],
      ['NAIA Terminal 1&2', 'Skyway', c(45)],
      ['NAIA Terminal 1&2', 'Macapagal', c(35)],
      ['NAIA Terminal 1&2', 'CAVITEX', c(25)],
      ['NAIA Terminal 1&2', 'Entertainment City', c(25)],
      ['Skyway', 'CAVITEX', c(45)],
      ['Skyway', 'Entertainment City', c(45)],
      ['Macapagal', 'CAVITEX', c(12)],
      ['Macapagal', 'Entertainment City', c(10)],
    ]),
  ),

  // ── MCX (Muntinlupa-Cavite Expressway) ────────────────────────────────
  // Fixed ₱23 Class 1 toll (as of Sep 2025 Wikipedia)
  MCX: buildMatrix([
    ['Daang Hari', 'SLEX', c(23)],
    ['Daang Hari', 'MCX Toll Plaza', c(23)],
  ]),

  // ── STAR TOLLWAY (Southern Tagalog Arterial Road) ─────────────────────
  // Official: https://www.smc-tollways.com (Autosweep)
  'STAR TOLLWAY': addAllPairs(
    [
      'Sto Tomas',
      'Tanauan',
      'Malvar',
      'Lipa',
      'San Jose',
      'Ibaan',
      'Batangas',
    ],
    [
      'Sto Tomas',
      'Tanauan',
      'Malvar',
      'Lipa',
      'San Jose',
      'Ibaan',
      'Batangas',
    ],
    buildMatrix([
      ['Sto Tomas', 'Lipa', c(72)],
      ['Sto Tomas', 'Batangas', c(104)],
      ['Lipa', 'Batangas', c(48)],
      // TODO: verify rates below
      ['Sto Tomas', 'Tanauan', c(24)],
      ['Sto Tomas', 'Malvar', c(48)],
      ['Sto Tomas', 'San Jose', c(114)],
      ['Sto Tomas', 'Ibaan', c(142)],
      ['Tanauan', 'Malvar', c(24)],
      ['Tanauan', 'Lipa', c(48)],
      ['Tanauan', 'Batangas', c(80)],
      ['Malvar', 'Lipa', c(24)],
      ['Malvar', 'Batangas', c(56)],
      ['Lipa', 'San Jose', c(42)],
      ['Lipa', 'Ibaan', c(70)],
      ['San Jose', 'Ibaan', c(28)],
      ['San Jose', 'Batangas', c(30)],
      ['Ibaan', 'Batangas', c(18)],
    ]),
  ),

  // ── NLEX Connector ──────────────────────────────────────────────────
  // Official: https://nlex.com.ph/toll-fees
  'NLEX Connector': addAllPairs(
    ['Caloocan', 'España', 'Magsaysay', 'Sta Mesa'],
    ['Caloocan', 'España', 'Magsaysay', 'Sta Mesa'],
    buildMatrix([
      ['Caloocan', 'España', c(86)],
      ['Caloocan', 'Magsaysay', c(86)],
      ['España', 'Magsaysay', c(43)],
      // TODO: verify rates below
      ['Caloocan', 'Sta Mesa', c(105)],
      ['España', 'Sta Mesa', c(52)],
      ['Magsaysay', 'Sta Mesa', c(20)],
    ]),
  ),
};

export const expressways = Object.keys(tollRates);
