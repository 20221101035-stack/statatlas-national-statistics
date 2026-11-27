// format.js — display formatting for StatAtlas figures.
// All figures are 2023 World Bank WDI values (see data.js); these
// helpers only decide how a number reads on screen.

export function formatPeople(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} bn`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} m`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} k`;
  return String(Math.round(n));
}

export function formatMoney(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)} tn`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(0)} bn`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)} m`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function formatMoneyPerPerson(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function formatArea(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} m km²`;
  return `${Math.round(n).toLocaleString('en-US')} km²`;
}

export function formatDensity(n) {
  if (n >= 100) return `${Math.round(n)} /km²`;
  if (n >= 10) return `${n.toFixed(1)} /km²`;
  return `${n.toFixed(2)} /km²`;
}

export function formatYears(n) {
  return `${n} years`;
}

export function formatShare(part, whole) {
  return `${((part / whole) * 100).toFixed(1)}%`;
}
