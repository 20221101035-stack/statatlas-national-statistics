// main.js — the router and wiring for StatAtlas.
// Hash routes: #/ (home), #/rankings, #/compare, #/country/CODE,
// #/sources. Every page is rendered from app/data.js; nothing is
// fetched from the network, so the site works fully offline.

import { COUNTRIES, byCode } from './data.js';
import { compareView, countryView, homeView, rankingsView, sourcesView } from './views.js';

const view = document.getElementById('view');

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart ?? '');
  return { path: pathPart, params };
}

function setActiveNav(path) {
  document.querySelectorAll('.site-nav a').forEach((a) => {
    const target = a.getAttribute('href');
    const isHome = target === '#/' && (path === '/' || path === '');
    const isSection = target !== '#/' && path.startsWith(target.slice(1));
    a.classList.toggle('active', isHome || isSection);
  });
}

function render() {
  const { path, params } = parseHash();
  let html;
  if (path === '/' || path === '') {
    html = homeView();
  } else if (path === '/rankings') {
    html = rankingsView(params);
  } else if (path === '/compare') {
    html = compareView(params);
  } else if (path.startsWith('/country/')) {
    html = countryView(path.slice('/country/'.length).toUpperCase());
  } else if (path === '/sources') {
    html = sourcesView();
  } else {
    html = `<section class="page-head"><h1>Page not found</h1><p class="lede">That page does not exist here. <a href="#/">Back to the front page</a>.</p></section>`;
  }
  view.innerHTML = html;
  setActiveNav(path);
  wirePage(path, params);
  window.scrollTo(0, 0);
}

// Page-specific wiring, run after each render.
function wirePage(path, params) {
  // Home search: live results under the search box.
  const homeForm = document.getElementById('home-search');
  if (homeForm) {
    const input = document.getElementById('home-q');
    const results = document.getElementById('home-results');
    const showResults = () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        results.innerHTML = '';
        return;
      }
      const hits = COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
      results.innerHTML = hits.length
        ? `<ul>${hits.map((c) => `<li><a href="#/country/${c.code}">${c.name}</a> <span>${c.region}</span></li>`).join('')}</ul>`
        : '<p class="no-hits">No country matches that search.</p>';
    };
    input.addEventListener('input', showResults);
    homeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const q = input.value.trim().toLowerCase();
      const hit = COUNTRIES.find((c) => c.name.toLowerCase().includes(q));
      if (hit) window.location.hash = `#/country/${hit.code}`;
      else window.location.hash = `#/rankings?q=${encodeURIComponent(input.value.trim())}`;
    });
  }

  // Rankings filters: rebuild the hash so the table re-renders.
  const filters = document.getElementById('rankings-filters');
  if (filters) {
    filters.addEventListener('submit', (event) => {
      event.preventDefault();
      const region = document.getElementById('filter-region').value;
      const q = document.getElementById('filter-q').value.trim();
      const sort = params.get('sort') ?? 'pop';
      const next = new URLSearchParams({ sort });
      if (region) next.set('region', region);
      if (q) next.set('q', q);
      window.location.hash = `#/rankings?${next.toString()}`;
    });
  }

  // Compare pickers: rebuild the hash from the three selects.
  const compareForm = document.getElementById('compare-form');
  if (compareForm) {
    compareForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const codes = [...document.querySelectorAll('.compare-pick')]
        .map((select) => select.value)
        .filter(Boolean)
        .filter((code, i, all) => all.indexOf(code) === i);
      window.location.hash = `#/compare?countries=${codes.join(',') || 'USA,CHN,IND'}`;
    });
  }
}

window.addEventListener('hashchange', render);

// A tiny public handle for the screenshot harness: lets a test open
// the page and know the view has finished rendering.
window.StatAtlas = { render, byCode };
render();
