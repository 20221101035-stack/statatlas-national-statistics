// charts.js — hand-drawn SVG bar charts for StatAtlas.
// No chart library: each chart is a small SVG string built from the
// values it is given, so the site stays dependency-free and offline.

const PALETTE = ['#0f4c81', '#0e7c7b', '#e8a33d', '#7a5ea3', '#c65d3b', '#4d7ea8'];

function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// A horizontal bar chart. rows: [{label, value, display, href?}].
// Bars scale to the largest value; labels sit left, values right.
export function horizontalBars(rows, options = {}) {
  const width = options.width ?? 760;
  const labelWidth = options.labelWidth ?? 150;
  const rowHeight = options.rowHeight ?? 34;
  const barHeight = 16;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const height = rows.length * rowHeight + 8;
  const valueWidth = options.valueWidth ?? 110;
  const barMax = width - labelWidth - valueWidth - 16;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeText(options.ariaLabel ?? 'Bar chart')}">`;
  rows.forEach((row, i) => {
    const y = 8 + i * rowHeight;
    const barW = Math.max(2, (row.value / max) * barMax);
    const color = PALETTE[i % PALETTE.length];
    const label = row.href
      ? `<a href="${row.href}"><text x="0" y="${y + 13}" class="chart-label chart-link">${escapeText(row.label)}</text></a>`
      : `<text x="0" y="${y + 13}" class="chart-label">${escapeText(row.label)}</text>`;
    out += `${label}<rect x="${labelWidth}" y="${y + 2}" width="${barW.toFixed(1)}" height="${barHeight}" rx="3" fill="${color}"/>`
      + `<text x="${labelWidth + barW + 8}" y="${y + 15}" class="chart-value">${escapeText(row.display)}</text>`;
  });
  out += '</svg>';
  return out;
}

// A grouped comparison chart: one row per indicator, one bar per
// country, scaled within each indicator so unlike units can share
// a chart. series: [{label, color}], rows: [{label, values: [..], displays: [..]}].
export function groupedBars(rows, series, options = {}) {
  const width = options.width ?? 760;
  const labelWidth = options.labelWidth ?? 170;
  const rowHeight = 46;
  const barHeight = 12;
  const height = rows.length * rowHeight + 30;
  const valueWidth = 90;
  const barMax = width - labelWidth - valueWidth - 16;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeText(options.ariaLabel ?? 'Comparison chart')}">`;
  // Legend
  series.forEach((s, i) => {
    const x = labelWidth + i * 170;
    out += `<rect x="${x}" y="2" width="12" height="12" rx="3" fill="${s.color}"/><text x="${x + 17}" y="13" class="chart-label">${escapeText(s.label)}</text>`;
  });
  rows.forEach((row, i) => {
    const y = 30 + i * rowHeight;
    const max = Math.max(...row.values, 1);
    out += `<text x="0" y="${y + 14}" class="chart-label">${escapeText(row.label)}</text>`;
    row.values.forEach((v, j) => {
      const barY = y + j * (barHeight + 3);
      const barW = Math.max(2, (v / max) * barMax);
      out += `<rect x="${labelWidth}" y="${barY}" width="${barW.toFixed(1)}" height="${barHeight}" rx="3" fill="${series[j].color}"/>`
        + `<text x="${labelWidth + barW + 8}" y="${barY + 11}" class="chart-value">${escapeText(row.displays[j])}</text>`;
    });
  });
  out += '</svg>';
  return out;
}

// A "versus the world" bar: the country's value against the world
// average, both on one scale, so a visitor sees the gap at a glance.
export function versusWorld(label, countryValue, worldValue, countryDisplay, worldDisplay) {
  const width = 560;
  const labelWidth = 140;
  const rowHeight = 34;
  const barHeight = 15;
  const max = Math.max(countryValue, worldValue, 1);
  const barMax = width - labelWidth - 120;
  const height = 2 * rowHeight + 8;
  const countryW = Math.max(2, (countryValue / max) * barMax);
  const worldW = Math.max(2, (worldValue / max) * barMax);
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeText(label)} versus the world average">`
    + `<text x="0" y="21" class="chart-label">This country</text>`
    + `<rect x="${labelWidth}" y="8" width="${countryW.toFixed(1)}" height="${barHeight}" rx="3" fill="#0f4c81"/>`
    + `<text x="${labelWidth + countryW + 8}" y="21" class="chart-value">${escapeText(countryDisplay)}</text>`
    + `<text x="0" y="55" class="chart-label">World average</text>`
    + `<rect x="${labelWidth}" y="42" width="${worldW.toFixed(1)}" height="${barHeight}" rx="3" fill="#9db4c6"/>`
    + `<text x="${labelWidth + worldW + 8}" y="55" class="chart-value">${escapeText(worldDisplay)}</text>`
    + '</svg>';
}
