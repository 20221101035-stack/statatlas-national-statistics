// data.js — the figures behind StatAtlas.
//
// Every number below is a 2023 figure from the World Bank's World
// Development Indicators (WDI), rounded for display. Population is
// indicator SP.POP.TOTL (mid-year estimate), GDP is NY.GDP.MKTP.CD
// (current US dollars), life expectancy at birth is SP.DYN.LE00.IN,
// land area is AG.SRF.TOTL.K2 (square kilometres, including inland
// water). GDP per capita and population density are computed here
// from those four series, never typed in by hand.
//
// Anchor checks (World Bank, December 2024 release): world GDP 2023
// $106,172bn; United States $27,721bn; China $17,795bn; Germany
// $4,526bn; Japan $4,204bn; India $3,568bn; United Kingdom $3,381bn;
// France $3,052bn; Italy $2,301bn; Brazil $2,174bn. Population:
// India 1,438,069,596; China 1,410,710,000; United States 336,755,052;
// world 8,091,734,930. The remaining rows use the same WDI vintage.
// Life expectancy is rounded to whole years. Figures are shown
// rounded; the site never invents a number it cannot source.

export const DATA_YEAR = 2023;

export const WORLD = {
  population: 8091734930,
  gdpUsd: 106171668000000,
  lifeExpectancy: 71,
  landSqKm: 148940000,
};

// pop: people. gdp: current US dollars. life: years at birth.
// area: square kilometres. region: one of the six world regions.
export const COUNTRIES = [
  { code: 'USA', name: 'United States', region: 'North America', pop: 336755052, gdp: 27720709000000, life: 78, area: 9833517 },
  { code: 'CHN', name: 'China', region: 'Asia', pop: 1410710000, gdp: 17794783000000, life: 79, area: 9596961 },
  { code: 'IND', name: 'India', region: 'Asia', pop: 1438069596, gdp: 3567552000000, life: 68, area: 3287263 },
  { code: 'JPN', name: 'Japan', region: 'Asia', pop: 124516000, gdp: 4204495000000, life: 84, area: 377975 },
  { code: 'DEU', name: 'Germany', region: 'Europe', pop: 84669326, gdp: 4525704000000, life: 82, area: 357588 },
  { code: 'GBR', name: 'United Kingdom', region: 'Europe', pop: 68350000, gdp: 3380855000000, life: 82, area: 243610 },
  { code: 'FRA', name: 'France', region: 'Europe', pop: 68172977, gdp: 3051832000000, life: 83, area: 551695 },
  { code: 'ITA', name: 'Italy', region: 'Europe', pop: 58997201, gdp: 2300941000000, life: 84, area: 302073 },
  { code: 'CAN', name: 'Canada', region: 'North America', pop: 39566248, gdp: 2139840000000, life: 83, area: 9984670 },
  { code: 'BRA', name: 'Brazil', region: 'South America', pop: 216422446, gdp: 2173666000000, life: 76, area: 8515767 },
  { code: 'RUS', name: 'Russia', region: 'Europe', pop: 144444000, gdp: 2021421000000, life: 73, area: 17098246 },
  { code: 'KOR', name: 'South Korea', region: 'Asia', pop: 51712619, gdp: 1712793000000, life: 83, area: 100410 },
  { code: 'AUS', name: 'Australia', region: 'Oceania', pop: 26638544, gdp: 1687713000000, life: 83, area: 7692024 },
  { code: 'MEX', name: 'Mexico', region: 'North America', pop: 129739759, gdp: 1788887000000, life: 75, area: 1964375 },
  { code: 'IDN', name: 'Indonesia', region: 'Asia', pop: 277534122, gdp: 1371000000000, life: 71, area: 1904569 },
  { code: 'TUR', name: 'Turkey', region: 'Asia', pop: 85326000, gdp: 1108000000000, life: 77, area: 785350 },
  { code: 'SAU', name: 'Saudi Arabia', region: 'Asia', pop: 33702000, gdp: 1067583000000, life: 79, area: 2149690 },
  { code: 'CHE', name: 'Switzerland', region: 'Europe', pop: 8864000, gdp: 884940000000, life: 84, area: 41285 },
  { code: 'NLD', name: 'Netherlands', region: 'Europe', pop: 17811000, gdp: 1118000000000, life: 82, area: 41865 },
  { code: 'SWE', name: 'Sweden', region: 'Europe', pop: 10548000, gdp: 593268000000, life: 83, area: 447430 },
  { code: 'NOR', name: 'Norway', region: 'Europe', pop: 5519000, gdp: 579267000000, life: 83, area: 323802 },
  { code: 'ESP', name: 'Spain', region: 'Europe', pop: 48592000, gdp: 1581000000000, life: 84, area: 505935 },
  { code: 'POL', name: 'Poland', region: 'Europe', pop: 36753736, gdp: 808427000000, life: 79, area: 312679 },
  { code: 'ARG', name: 'Argentina', region: 'South America', pop: 45773884, gdp: 646075000000, life: 78, area: 2780400 },
  { code: 'ZAF', name: 'South Africa', region: 'Africa', pop: 60414495, gdp: 380034000000, life: 66, area: 1219090 },
  { code: 'NGA', name: 'Nigeria', region: 'Africa', pop: 223804632, gdp: 362815000000, life: 55, area: 923768 },
  { code: 'EGY', name: 'Egypt', region: 'Africa', pop: 112716598, gdp: 395926000000, life: 72, area: 1002450 },
  { code: 'KEN', name: 'Kenya', region: 'Africa', pop: 55100586, gdp: 107729000000, life: 63, area: 580876 },
  { code: 'VNM', name: 'Vietnam', region: 'Asia', pop: 98858950, gdp: 429717000000, life: 75, area: 331340 },
  { code: 'THA', name: 'Thailand', region: 'Asia', pop: 71756000, gdp: 514945000000, life: 76, area: 513120 },
  { code: 'SGP', name: 'Singapore', region: 'Asia', pop: 5917648, gdp: 501428000000, life: 84, area: 734 },
  { code: 'NZL', name: 'New Zealand', region: 'Oceania', pop: 5223000, gdp: 252655000000, life: 83, area: 268838 },
];

export const REGIONS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

// Derived figures, computed from the sourced series above.
export function gdpPerCapita(c) {
  return c.gdp / c.pop;
}

export function density(c) {
  return c.pop / c.area;
}

export function worldGdpPerCapita() {
  return WORLD.gdpUsd / WORLD.population;
}

export function worldDensity() {
  return WORLD.population / WORLD.landSqKm;
}

export function byCode(code) {
  return COUNTRIES.find((c) => c.code === code) ?? null;
}

export function sortedBy(key, descending = true) {
  const valueOf = {
    pop: (c) => c.pop,
    gdp: (c) => c.gdp,
    gdpPerCapita: (c) => gdpPerCapita(c),
    life: (c) => c.life,
    area: (c) => c.area,
    density: (c) => density(c),
    name: (c) => c.name,
  }[key] ?? ((c) => c.pop);
  const rows = [...COUNTRIES].sort((a, b) => {
    const va = valueOf(a);
    const vb = valueOf(b);
    if (typeof va === 'string') return descending ? vb.localeCompare(va) : va.localeCompare(vb);
    return descending ? vb - va : va - vb;
  });
  return rows;
}
