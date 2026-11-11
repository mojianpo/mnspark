# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Midnight Spark (`mnspark`) — an 18+ couples' card-draw game: draw a card, perform the intimate challenge, escalate intensity. Built with uni-app (Vue 3, Options API) + Vite, targeting H5, WeChat mini-program (`mp-weixin`), and native App. Mobile-first, dark theme (`#0a0a0a`), fully offline — the in-app privacy policy promises no data collection, analytics, or network calls; keep it that way. The age gate (18+) is the mandatory entry page and the app carries consent/safety framing (safe words, "stop anytime") — keep both intact.

## Commands

```bash
npm run dev:h5            # H5 dev server
npm run build:h5          # H5 production build
npm run dev:mp-weixin     # WeChat dev build   → dist/dev/mp-weixin
npm run build:mp-weixin   # WeChat prod build  → dist/build/mp-weixin
npm run dev:app           # App dev build
npm run build:app         # App production build
```

For WeChat: open the compiled `dist/dev/mp-weixin` (or `dist/build/mp-weixin`) folder in WeChat DevTools. The root `project.config.json` is the DevTools project config (holds the appid; `mp-weixin.appid` in `src/manifest.json` is left empty).

No test or lint tooling is configured.

## Architecture

Standard uni-app layout: `src/pages.json` (routes + per-page style), `src/manifest.json` (platform config), `src/main.js` (createSSRApp), `src/App.vue` (global styles/lifecycle).

**Page flow:** `age-gate` (first page; persists `ageConfirmed`) → `splash` (auto-forwards to the game after 2.5s) → `index` (the game). `privacy` / `terms` open from the game's settings panel.

**Game** (`src/pages/index/index.vue`): tap-to-flip card draws a random unused command (`usedIndices` resets when the pool is exhausted), optional countdown from `command.duration`, vibration + pulse/flash effects. Platform-specific APIs (e.g. `uni.vibrateShort`) are wrapped in uni-app conditional compilation comments (`// #ifdef APP-PLUS || MP-WEIXIN`) — use that pattern for any platform-specific code.

**Data modules** (under `src/pages/index/`, imported by the game page):
- `commands.js` — the deck: `{ zh, en, vi }` × `{ gentle, passionate, wild, extreme }`. Each entry: `{ cmd, level: 1-5, duration? (seconds), pose }`.
- `i18n.js` — all UI strings for zh/en/vi, plus `levelColors` (levels 1–5).
- `poseSVGs.js` — inline SVG illustrations keyed by `pose`; `getPoseSVG()` builds the data URL at call time (no `uni.*` calls at module load).

**Conventions:**
- Options API; each page computes `t()` as `i18n[currentLang]` and reads `uni.getStorageSync('lang')` in `onLoad`.
- Persistence keys (`uni.getStorageSync`/`setStorageSync`): `lang`, `gameMode`, `ageConfirmed` (string `'true'`).
- `navigationStyle: custom` everywhere — pages render their own headers. Flow transitions use `uni.reLaunch`; sub-pages (privacy/terms) use `uni.navigateTo`.
- Styles are scoped per page with `rpx` units.

**Adding content:**
- New command: add the entry to *all three* language blocks of `commands.js`; its `pose` must exist in `poseSVGs.js` (add the SVG there for a new pose).
- New UI text: add the key to zh, en, and vi in `i18n.js`.

## Notes

- README.md is partially stale: its "Tech Stack" / "Usage" sections still describe the original single-file HTML/JS app. The repo is now a uni-app/Vue 3 project; the root `index.html` is the Vite entry, not the game itself.
