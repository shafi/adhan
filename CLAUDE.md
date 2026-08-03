# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free tablet-kiosk web app for Islamic prayer times. No build step, no bundler, no package.json — plain HTML/CSS/JS served as-is.

## Commands

```sh
# Run locally — either open index.html directly, or serve it (recommended, since
# geolocation requires HTTPS or localhost):
python3 -m http.server 8080

# Build/run via the production container:
docker build -t adhan .
docker run --rm -p 8080:80 adhan

# Verify a script's syntax (no test suite exists):
node --check app.js
node --check azkar.js

# Preview the rendered Kubernetes manifests:
kubectl kustomize .
```

There is no linter, formatter, or test runner configured. Use `node --check <file>` as a minimal syntax gate before committing.

## Architecture

**Four static files make up the entire app**, loaded directly by `index.html` with plain `<script>` tags (`azkar.js` before `app.js`) — no modules, no imports:

- `index.html` — structure only; all interactive elements are found by `document.getElementById` in `app.js`.
- `app.js` — all application logic in one file: prayer-time astronomical calculation, clock/countdown rendering, the settings panel, adhan audio playback, the masjid lookup, and dua-of-the-day rendering.
- `azkar.js` — a static `AZKAR` array (100 azkar/duas: Arabic with diacritics, English, source reference). Loaded as a global before `app.js`.
- `styles.css` — all styling, including the Islamic-geometric decorative theme.

**Prayer time calculation is done entirely on-device** (`calculatePrayerTimes` and its helpers in `app.js`) from raw lat/lon + a calculation-method angle table (`METHODS`) — no external prayer-times API is called. Only reverse-geocoding (place name display, via Nominatim) and the masjid lookup call external services.

**State persistence is `localStorage`-only** — there is no backend and no database. Keys in use: `adhanAudioEnabled`, `prayerMethod`, `adhanReciter`, `fajrAdhanReciter`, `prayerAudioEnabled`, `playedAdhans`, `claudeApiKey`, `masjidInfo`.

**The settings panel (`#settingsOverlay`) is a plain hidden `<div>`, not a native `<dialog>`.** It was deliberately built this way after `<dialog>`/`showModal()` proved unreliable on the target kiosk browsers (see `closeSettings()` in `app.js`). Don't reintroduce `<dialog>` for modal UI in this app.

**Nearby-masjid lookup** (`fetchMasjidInfo` in `app.js`) calls the Anthropic Messages API directly from the browser (`anthropic-dangerous-direct-browser-access` header) using the web search tool and a JSON-schema structured output, with the user-supplied API key read from `localStorage`. Results are cached in `localStorage` and refreshed once per 24h (`MASJID_REFRESH_MS`).

**Dua of the day** picks `AZKAR[dayOfYearLocal(now) % AZKAR.length]` — deterministic per calendar day, no random selection, re-checked every 10 minutes so it rolls over at local midnight without a page reload.

## Deployment

This repo's own `k8s/` + `kustomization.yaml` define the live deployment (not a separate `homelab/`-style split for this app). Key detail: `k8s/deployment.yaml` runs plain `image: nginx:alpine` and serves the app via a **ConfigMap volume mount** (`configMapGenerator` in `kustomization.yaml`) that overlays `/usr/share/nginx/html` — it does **not** use the Docker image built by `.github/workflows/docker.yml`. **Any new static file added to the app must also be added to `configMapGenerator.files` in `kustomization.yaml`**, or it will be present in the git repo and the Docker image but silently absent from the actual k8s deployment (this has happened before — `azkar.js` was initially omitted).

The site (`adhan.shafi.org`) is fronted by Cloudflare. `app.js`/`styles.css`/etc. get `Cache-Control: public, expires 1h` from nginx (see `nginx.conf`), and Cloudflare's edge cache sits in front of that — a browser hard-refresh does **not** bypass the Cloudflare edge cache. If deployed changes aren't showing up, check `cf-cache-status`/`age` response headers before assuming a code bug; purging requires the Cloudflare API/dashboard, not just a browser-side refresh.
