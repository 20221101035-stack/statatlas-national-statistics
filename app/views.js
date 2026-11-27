// views.js — one renderer per page of StatAtlas.
// Each view returns HTML for #view; main.js wires the links,
// the search box and the table sorting after the HTML lands.

import { COUNTRIES, DATA_YEAR, REGIONS, WORLD, byCode, density, gdpPerCapita, sortedBy, worldDensity, worldGdpPerCapita } from './data.js';
import { formatArea, formatDensity, formatMoney, formatMoneyPerPerson, formatPeople, formatShare, formatYears } from './format.js';
import { groupedBars, horizontalBars, versusWorld } from './charts.js';

const COMPARE_COLORS = ['#0f4c81', '#0e7c7b', '#e8a33d'];

function countryLink(c) {
  return `<a href="#/country/${c.code}">${c.name}</a>`;
}

function statCard(label, value, note) {
  return `<div class="stat-card"><div class="stat-value">${value}</div><div class="stat-label">${label}</div><div class="stat-note">${note}</div></div>`;
}

function sourceLine() {
  return `<p class="source-note">Source: World Bank, World Development Indicators, ${DATA_YEAR} `
    + `(population SP.POP.TOTL · GDP NY.GDP.MKTP.CD · life expectancy SP.DYN.LE00.IN · land area AG.SRF.TOTL.K2). `
    + `GDP per capita and density are computed from those series. <a href="#/sources">How we source figures →</a></p>`;
}

// ---- Home -----------------------------------------------------------------

export function homeView() {
  const topPop = sortedBy('pop').slice(0, 10);
  const topGdp = sortedBy('gdp').slice(0, 10);
  const topRich = sortedBy('gdpPerCapita').slice(0, 5);
  const popRows = topPop.map((c) => ({
    label: c.name, value: c.pop, display: formatPeople(c.pop), href: `#/country/${c.code}`,
  }));
  const gdpRows = topGdp.map((c) => ({
    label: c.name, value: c.gdp, display: formatMoney(c.gdp), href: `#/country/${c.code}`,
  }));
  return `
  <section class="hero">
    <p class="eyebrow">National statistics · ${DATA_YEAR} · World Bank</p>
    <h1>Every country, measured.<br>Every figure, sourced.</h1>
    <p class="lede">StatAtlas gathers the headline numbers for ${COUNTRIES.length} countries — how many people live there, how much they produce, how long they live — from the World Bank's World Development Indicators, and lets you rank, compare and explore them. No estimates we made up, no figures without a source.</p>
    <form class="search" id="home-search" role="search">
      <label class="visually-hidden" for="home-q">Search countries</label>
      <input id="home-q" type="search" placeholder="Search a country — try “Japan” or “Nigeria”…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <div id="home-results" class="search-results" aria-live="polite"></div>
  </section>
  <section class="world-strip" aria-label="The world in 2023">
    ${statCard('World population', formatPeople(WORLD.population), `across ${COUNTRIES.length} countries profiled here`)}
    ${statCard('World GDP', formatMoney(WORLD.gdpUsd), 'total output of every economy, 2023')}
    ${statCard('World GDP per person', formatMoneyPerPerson(worldGdpPerCapita()), 'current US dollars, 2023')}
    ${statCard('World life expectancy', formatYears(WORLD.lifeExpectancy), 'at birth, 2023')}
  </section>
  <div class="two-col">
    <section class="panel">
      <h2>Most people</h2>
      <p class="panel-sub">Population, ${DATA_YEAR} — the ten largest countries hold ${formatShare(topPop.reduce((s, c) => s + c.pop, 0), WORLD.population)} of humanity.</p>
      ${horizontalBars(popRows, { ariaLabel: 'Ten most populous countries, 2023', width: 560, labelWidth: 130, valueWidth: 90 })}
      <p class="panel-link"><a href="#/rankings?sort=pop">See the full population ranking →</a></p>
    </section>
    <section class="panel">
      <h2>Biggest economies</h2>
      <p class="panel-sub">GDP in current US dollars, ${DATA_YEAR} — the ten largest economies produce ${formatShare(topGdp.reduce((s, c) => s + c.gdp, 0), WORLD.gdpUsd)} of world output.</p>
      ${horizontalBars(gdpRows, { ariaLabel: 'Ten largest economies by GDP, 2023', width: 560, labelWidth: 130, valueWidth: 90 })}
      <p class="panel-link"><a href="#/rankings?sort=gdp">See the full GDP ranking →</a></p>
    </section>
  </div>
  <section class="panel">
    <h2>Richest per person</h2>
    <p class="panel-sub">GDP per capita, ${DATA_YEAR} — total output divided by population. Small, high-output economies top this list, not the biggest countries.</p>
    <ol class="rich-list">
      ${topRich.map((c, i) => `<li><span class="rank-num">${i + 1}</span> ${countryLink(c)} <span class="rich-value">${formatMoneyPerPerson(gdpPerCapita(c))} per person</span><span class="rich-pop"> · ${formatPeople(c.pop)} people</span></li>`).join('')}
    </ol>
    <p class="panel-link"><a href="#/rankings?sort=gdpPerCapita">Rank all ${COUNTRIES.length} by GDP per person →</a></p>
  </section>
  <section class="panel">
    <h2>Browse by region</h2>
    <div class="region-grid">
      ${REGIONS.map((r) => {
        const members = COUNTRIES.filter((c) => c.region === r);
        const pop = members.reduce((s, c) => s + c.pop, 0);
        return `<a class="region-card" href="#/rankings?region=${encodeURIComponent(r)}"><strong>${r}</strong><span>${members.length} countr${members.length === 1 ? 'y' : 'ies'} · ${formatPeople(pop)} people</span></a>`;
      }).join('')}
    </div>
  </section>
  ${sourceLine()}`;
}

// ---- Rankings ---------------------------------------------------------------

const COLUMNS = [
  { key: 'name', label: 'Country' },
  { key: 'region', label: 'Region' },
  { key: 'pop', label: `Population ${DATA_YEAR}` },
  { key: 'gdp', label: `GDP ${DATA_YEAR}` },
  { key: 'gdpPerCapita', label: 'GDP per person' },
  { key: 'life', label: 'Life expectancy' },
  { key: 'area', label: 'Land area' },
  { key: 'density', label: 'Density' },
];

export function rankingsView(params) {
  const sort = COLUMNS.some((c) => c.key === params.get('sort')) ? params.get('sort') : 'pop';
  const region = params.get('region') ?? '';
  const query = (params.get('q') ?? '').trim().toLowerCase();
  let rows = sortedBy(sort, sort !== 'name');
  if (region) rows = rows.filter((c) => c.region === region);
  if (query) rows = rows.filter((c) => c.name.toLowerCase().includes(query));
  const body = rows.map((c, i) => `<tr>
      <td class="rank-cell">${i + 1}</td>
      <td class="country-cell">${countryLink(c)}</td>
      <td>${c.region}</td>
      <td class="num">${formatPeople(c.pop)}</td>
      <td class="num">${formatMoney(c.gdp)}</td>
      <td class="num">${formatMoneyPerPerson(gdpPerCapita(c))}</td>
      <td class="num">${formatYears(c.life)}</td>
      <td class="num">${formatArea(c.area)}</td>
      <td class="num">${formatDensity(density(c))}</td>
    </tr>`).join('');
  return `
  <section class="page-head">
    <h1>Rankings</h1>
    <p class="lede">All ${COUNTRIES.length} countries, every headline indicator, ${DATA_YEAR}. Click a column heading to re-sort; filter by region or search by name.</p>
  </section>
  <form class="filters" id="rankings-filters">
    <label>Region
      <select id="filter-region" name="region">
        <option value="">All regions</option>
        ${REGIONS.map((r) => `<option value="${r}"${r === region ? ' selected' : ''}>${r}</option>`).join('')}
      </select>
    </label>
    <label>Search
      <input id="filter-q" name="q" type="search" value="${query.replace(/"/g, '&quot;')}" placeholder="Country name…" autocomplete="off">
    </label>
    <button type="submit">Apply</button>
    ${region || query ? `<a class="clear-link" href="#/rankings?sort=${sort}">Clear filters</a>` : ''}
  </form>
  <div class="table-wrap">
  <table class="rankings">
    <thead><tr>
      <th>#</th>
      ${COLUMNS.map((col) => `<th${col.key === 'name' || col.key === 'region' ? '' : ' class="num"'}><a href="#/rankings?sort=${col.key}${region ? `&amp;region=${encodeURIComponent(region)}` : ''}${query ? `&amp;q=${encodeURIComponent(query)}` : ''}">${col.label}${sort === col.key ? ' ↓' : ''}</a></th>`).join('')}
    </tr></thead>
    <tbody>${body || '<tr><td colspan="9" class="empty">No countries match those filters. <a href="#/rankings">Show all countries</a>.</td></tr>'}</tbody>
  </table>
  </div>
  <p class="table-note">Showing ${rows.length} of ${COUNTRIES.length} countries. Population and GDP are World Bank WDI ${DATA_YEAR} values; GDP per person and density are computed from them. Life expectancy is rounded to whole years.</p>
  ${sourceLine()}`;
}

// ---- Compare ----------------------------------------------------------------

export function compareView(params) {
  const picked = (params.get('countries') ?? 'USA,CHN,IND').split(',').filter(Boolean).slice(0, 3);
  const selected = picked.map((code) => byCode(code)).filter(Boolean);
  while (selected.length < 3) selected.push(null);
  const series = selected.filter(Boolean).map((c, i) => ({ label: c.name, color: COMPARE_COLORS[i] }));
  const indicators = [
    { label: 'Population', values: selected.map((c) => (c ? c.pop : 0)), displays: selected.map((c) => (c ? formatPeople(c.pop) : '—')) },
    { label: 'GDP', values: selected.map((c) => (c ? c.gdp : 0)), displays: selected.map((c) => (c ? formatMoney(c.gdp) : '—')) },
    { label: 'GDP per person', values: selected.map((c) => (c ? gdpPerCapita(c) : 0)), displays: selected.map((c) => (c ? formatMoneyPerPerson(gdpPerCapita(c)) : '—')) },
    { label: 'Life expectancy', values: selected.map((c) => (c ? c.life : 0)), displays: selected.map((c) => (c ? formatYears(c.life) : '—')) },
    { label: 'Land area', values: selected.map((c) => (c ? c.area : 0)), displays: selected.map((c) => (c ? formatArea(c.area) : '—')) },
    { label: 'Density', values: selected.map((c) => (c ? density(c) : 0)), displays: selected.map((c) => (c ? formatDensity(density(c)) : '—')) },
  ];
  const pickedCodes = selected.filter(Boolean).map((c) => c.code).join(',');
  const pickers = [0, 1, 2].map((slot) => `
    <label>Country ${slot + 1}
      <select data-slot="${slot}" class="compare-pick">
        <option value="">— pick a country —</option>
        ${COUNTRIES.map((c) => `<option value="${c.code}"${selected[slot]?.code === c.code ? ' selected' : ''}>${c.name}</option>`).join('')}
      </select>
    </label>`).join('');
  const cards = selected.map((c, i) => (c ? `
    <article class="compare-card" style="--card-color: ${COMPARE_COLORS[i]}">
      <h3>${countryLink(c)}</h3>
      <p class="compare-region">${c.region}</p>
      <dl>
        <div><dt>Population</dt><dd>${formatPeople(c.pop)}</dd></div>
        <div><dt>GDP</dt><dd>${formatMoney(c.gdp)}</dd></div>
        <div><dt>GDP per person</dt><dd>${formatMoneyPerPerson(gdpPerCapita(c))}</dd></div>
        <div><dt>Life expectancy</dt><dd>${formatYears(c.life)}</dd></div>
        <div><dt>Land area</dt><dd>${formatArea(c.area)}</dd></div>
        <div><dt>Density</dt><dd>${formatDensity(density(c))}</dd></div>
      </dl>
    </article>` : `<article class="compare-card compare-empty"><h3>Empty slot</h3><p>Pick a country above to fill this slot.</p></article>`)).join('');
  return `
  <section class="page-head">
    <h1>Compare countries</h1>
    <p class="lede">Pick up to three countries and put their headline numbers side by side. Bars in the chart are scaled within each indicator, so a small country can still outrank a giant one on GDP per person or life expectancy.</p>
  </section>
  <form class="compare-pickers" id="compare-form">${pickers}
    <button type="submit">Compare</button>
    <a class="clear-link" href="#/compare?countries=USA,CHN,IND">Reset to USA · China · India</a>
  </form>
  <div class="compare-cards">${cards}</div>
  ${series.length >= 2 ? `<section class="panel"><h2>Side by side</h2>${groupedBars(indicators, series, { ariaLabel: 'Comparison of selected countries across six indicators' })}</section>` : '<p class="empty">Pick at least two countries to draw the comparison chart.</p>'}
  <p class="table-note">Currently comparing: ${pickedCodes || 'none'}. All figures are World Bank WDI ${DATA_YEAR}; GDP per person and density are computed.</p>
  ${sourceLine()}`;
}

// ---- Country detail ---------------------------------------------------------

export function countryView(code) {
  const c = byCode(code);
  if (!c) {
    return `<section class="page-head"><h1>Country not found</h1><p class="lede">We profile ${COUNTRIES.length} countries. <a href="#/rankings">Browse the rankings</a> or <a href="#/">go home</a>.</p></section>`;
  }
  const rankPop = sortedBy('pop').findIndex((x) => x.code === c.code) + 1;
  const rankGdp = sortedBy('gdp').findIndex((x) => x.code === c.code) + 1;
  const rankRich = sortedBy('gdpPerCapita').findIndex((x) => x.code === c.code) + 1;
  const neighbours = COUNTRIES.filter((x) => x.region === c.region && x.code !== c.code).slice(0, 6);
  return `
  <section class="page-head">
    <p class="eyebrow">${c.region} · ${c.code}</p>
    <h1>${c.name}</h1>
    <p class="lede">Headline national statistics for ${c.name}, ${DATA_YEAR}, from the World Bank's World Development Indicators.</p>
  </section>
  <section class="world-strip">
    ${statCard('Population', formatPeople(c.pop), `#${rankPop} largest of ${COUNTRIES.length} profiled · ${formatShare(c.pop, WORLD.population)} of the world`)}
    ${statCard('GDP', formatMoney(c.gdp), `#${rankGdp} largest economy · ${formatShare(c.gdp, WORLD.gdpUsd)} of world GDP`)}
    ${statCard('GDP per person', formatMoneyPerPerson(gdpPerCapita(c)), `#${rankRich} of ${COUNTRIES.length} profiled · world average ${formatMoneyPerPerson(worldGdpPerCapita())}`)}
    ${statCard('Life expectancy', formatYears(c.life), `at birth · world average ${formatYears(WORLD.lifeExpectancy)}`)}
  </section>
  <div class="two-col">
    <section class="panel">
      <h2>${c.name} against the world</h2>
      <p class="panel-sub">Each bar puts the country next to the world average for the same measure.</p>
      <h3 class="chart-title">Population share</h3>
      ${versusWorld('Population', c.pop, WORLD.population / COUNTRIES.length, formatPeople(c.pop), `avg. country ${formatPeople(WORLD.population / COUNTRIES.length)}`)}
      <h3 class="chart-title">GDP per person</h3>
      ${versusWorld('GDP per person', gdpPerCapita(c), worldGdpPerCapita(), formatMoneyPerPerson(gdpPerCapita(c)), formatMoneyPerPerson(worldGdpPerCapita()))}
      <h3 class="chart-title">Life expectancy</h3>
      ${versusWorld('Life expectancy', c.life, WORLD.lifeExpectancy, formatYears(c.life), formatYears(WORLD.lifeExpectancy))}
      <h3 class="chart-title">Population density</h3>
      ${versusWorld('Population density', density(c), worldDensity(), formatDensity(density(c)), formatDensity(worldDensity()))}
    </section>
    <section class="panel">
      <h2>The numbers in full</h2>
      <dl class="fact-list">
        <div><dt>Population (${DATA_YEAR})</dt><dd>${formatPeople(c.pop)} <span class="fact-sub">(${c.pop.toLocaleString('en-US')} people)</span></dd></div>
        <div><dt>GDP, current US$ (${DATA_YEAR})</dt><dd>${formatMoney(c.gdp)} <span class="fact-sub">($${Math.round(c.gdp / 1e9).toLocaleString('en-US')} bn)</span></dd></div>
        <div><dt>GDP per person (${DATA_YEAR})</dt><dd>${formatMoneyPerPerson(gdpPerCapita(c))} <span class="fact-sub">computed: GDP ÷ population</span></dd></div>
        <div><dt>Life expectancy at birth (${DATA_YEAR})</dt><dd>${formatYears(c.life)} <span class="fact-sub">rounded to whole years</span></dd></div>
        <div><dt>Land area</dt><dd>${formatArea(c.area)} <span class="fact-sub">(${Math.round(c.area).toLocaleString('en-US')} km²)</span></dd></div>
        <div><dt>Population density</dt><dd>${formatDensity(density(c))} <span class="fact-sub">computed: population ÷ land area</span></dd></div>
        <div><dt>Region</dt><dd>${c.region}</dd></div>
        <div><dt>World Bank country code</dt><dd>${c.code}</dd></div>
      </dl>
      <p class="panel-link"><a href="#/compare?countries=${c.code}">Compare ${c.name} with other countries →</a></p>
      <h2 class="sub-head">Also in ${c.region}</h2>
      <ul class="neighbour-list">
        ${neighbours.map((n) => `<li>${countryLink(n)} <span>· ${formatPeople(n.pop)}</span></li>`).join('')}
      </ul>
      <p class="panel-link"><a href="#/rankings?region=${encodeURIComponent(c.region)}">All of ${c.region} ranked →</a></p>
    </section>
  </div>
  ${sourceLine()}`;
}

// ---- Sources / methodology ---------------------------------------------------

export function sourcesView() {
  return `
  <section class="page-head">
    <h1>Sources &amp; method</h1>
    <p class="lede">StatAtlas shows only figures it can point to. Every number on this site comes from one public dataset, and every derived figure is computed in the open from those numbers.</p>
  </section>
  <section class="panel">
    <h2>The dataset</h2>
    <p>All headline figures are from the <strong>World Bank's World Development Indicators (WDI)</strong>, reference year <strong>${DATA_YEAR}</strong>, as published in the December 2024 release. The World Bank compiles WDI from national statistical offices and international agencies; figures are revised as countries restate their data, so a later WDI release may differ slightly.</p>
    <table class="rankings source-table">
      <thead><tr><th>Indicator</th><th>WDI code</th><th>What it measures</th></tr></thead>
      <tbody>
        <tr><td>Population, total</td><td>SP.POP.TOTL</td><td>All residents, mid-year estimate, regardless of citizenship</td></tr>
        <tr><td>GDP (current US$)</td><td>NY.GDP.MKTP.CD</td><td>Total market value of goods and services produced, converted at market exchange rates</td></tr>
        <tr><td>Life expectancy at birth</td><td>SP.DYN.LE00.IN</td><td>Years a newborn would live at current mortality rates</td></tr>
        <tr><td>Land area (sq. km)</td><td>AG.SRF.TOTL.K2</td><td>Total land area including inland water bodies</td></tr>
      </tbody>
    </table>
  </section>
  <section class="panel">
    <h2>What we compute</h2>
    <ul class="method-list">
      <li><strong>GDP per person</strong> = GDP ÷ population, using the two WDI series above.</li>
      <li><strong>Population density</strong> = population ÷ land area.</li>
      <li><strong>World averages</strong> use the WDI world aggregates: world population 8,091,734,930 and world GDP $106,171,668 million in ${DATA_YEAR}.</li>
      <li><strong>Life expectancy</strong> is rounded to whole years; populations and GDP are rounded for display but ranked on full values.</li>
    </ul>
  </section>
  <section class="panel">
    <h2>What this site does not do</h2>
    <ul class="method-list">
      <li>It does not fetch live data: everything is baked into the site's own files, so it works with no network connection and never goes stale silently — the year is printed next to every figure.</li>
      <li>It does not estimate, project or forecast. Where the World Bank has no ${DATA_YEAR} value for a country, that country is not profiled.</li>
      <li>It is not affiliated with the World Bank or any national statistics office. Figures are reproduced with attribution; the design, text and comparisons are original to StatAtlas.</li>
    </ul>
    <p class="panel-link"><a href="#/">Back to the front page →</a></p>
  </section>`;
}
