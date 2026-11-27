# statatlas-national-statistics

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/20221101035-stack/statatlas-national-statistics/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/20221101035-stack/statatlas-national-statistics/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**StatAtlas — National Statistics Explorer**: an original, fully offline statistics site for 32 countries. Every figure is a real 2023 number from the World Bank's World Development Indicators (population, GDP, life expectancy, land area), with GDP per person and population density computed from those series in the open. No estimates, no invented numbers, no network requests.

## What it does

- **Home** — the world at a glance (8.09 bn people, $106.2 tn GDP), top-10 bar charts for population and GDP, the richest countries per person, region browsing, and live country search.
- **Rankings** — all 32 countries in one sortable table across six indicators, with region filtering and name search.
- **Compare** — pick up to three countries for side-by-side stat cards and a grouped bar chart scaled per indicator.
- **Country pages** — each country's full numbers, its ranks, and "against the world" bars that put it next to the global average.
- **Sources & method** — the exact WDI indicator codes behind every figure, what is computed, and what the site deliberately does not do.

Charts are hand-drawn SVG (no chart library), styling is a single stylesheet with system fonts, and the whole site is static files under `app/` — it runs from its own files in desktop Chrome and on a phone with zero network requests.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

`main.ts` (Node 22, standard library only) hands the site in: it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

World Bank, World Development Indicators, 2023 (December 2024 release): population SP.POP.TOTL, GDP NY.GDP.MKTP.CD, life expectancy SP.DYN.LE00.IN, land area AG.SRF.TOTL.K2. See the in-site **Sources & method** page for the full methodology. StatAtlas is not affiliated with the World Bank.

---

<sub>Entered on [make.fun](https://make.fun/?ref=5pkj596k&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
