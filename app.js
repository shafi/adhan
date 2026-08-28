const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const ADHAN_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_ARABIC = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};
const METHODS = {
  MWL: { fajr: 18, isha: 17 },
  ISNA: { fajr: 15, isha: 15 },
  Egypt: { fajr: 19.5, isha: 17.5 },
  Makkah: { fajr: 18.5, ishaInterval: 90 },
  Karachi: { fajr: 18, isha: 18 },
};

// Sunni adhan recordings from https://praytimes.org/docs/adhan
const ADHAN_OPTIONS = [
  { id: "Abdul-Basit", label: "Abdul Basit" },
  { id: "Abdul-Ghaffar", label: "Abdul Ghaffar" },
  { id: "Abdul-Hakam", label: "Abdul Hakam" },
  { id: "Adhan-Alaqsa", label: "Adhan Al-Aqsa" },
  { id: "Adhan-Egypt", label: "Adhan Egypt" },
  { id: "Adhan-Halab", label: "Adhan Halab" },
  { id: "Adhan-Madinah", label: "Adhan Madinah" },
  { id: "Adhan-Makkah", label: "Adhan Mecca" },
  { id: "Al-Hussaini", label: "Al-Hussaini" },
  { id: "Bakir-Bash", label: "Bakir Bash" },
  { id: "Hafez", label: "Hafez" },
  { id: "Hafiz-Murad", label: "Hafiz Murad" },
  { id: "Minshawi", label: "Minshawi" },
  { id: "Naghshbandi", label: "Naghshbandi" },
  { id: "Saber", label: "Saber" },
  { id: "Sharif-Doman", label: "Sharif Doman" },
  { id: "Yusuf-Islam", label: "Yusuf Islam" },
];
const DEFAULT_ADHAN_ID = "Adhan-Madinah";

// Fajr has its own, separate dropdown (currently a single option).
const FAJR_ADHAN_OPTIONS = [
  {
    id: "Mishary-Rashid-al-Afasy-Fajr",
    label: "Mishary Rashid al-Afasy (Fajr)",
    url: "https://archive.org/download/adhan.notifications/Mishary_Rashid_al_Afasy_Fajr_Adhan.mp3",
  },
];
const DEFAULT_FAJR_ADHAN_ID = FAJR_ADHAN_OPTIONS[0].id;

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-awwal",
  "Rabi' al-thani",
  "Jumada al-awwal",
  "Jumada al-thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

const state = {
  coords: null,
  times: null,
  audioEnabled: localStorage.getItem("adhanAudioEnabled") === "true",
  method: localStorage.getItem("prayerMethod") || "ISNA",
  adhanId: localStorage.getItem("adhanReciter") || DEFAULT_ADHAN_ID,
  fajrAdhanId: localStorage.getItem("fajrAdhanReciter") || DEFAULT_FAJR_ADHAN_ID,
  prayerAudio: loadPrayerAudioPrefs(),
  playedKeys: new Set(JSON.parse(localStorage.getItem("playedAdhans") || "[]")),
};

const elements = {
  audio: document.getElementById("adhanAudio"),
  audioButton: document.getElementById("audioButton"),
  settingsButton: document.getElementById("settingsButton"),
  settingsOverlay: document.getElementById("settingsOverlay"),
  settingsCloseButton: document.getElementById("settingsCloseButton"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  adhanReciterSelect: document.getElementById("adhanReciterSelect"),
  fajrAdhanSelect: document.getElementById("fajrAdhanSelect"),
  adhanPreviewPlay: document.getElementById("adhanPreviewPlay"),
  adhanPreviewStop: document.getElementById("adhanPreviewStop"),
  fajrPreviewPlay: document.getElementById("fajrPreviewPlay"),
  fajrPreviewStop: document.getElementById("fajrPreviewStop"),
  prayerToggleList: document.getElementById("prayerToggleList"),
  clock: document.getElementById("clock"),
  countdown: document.getElementById("countdown"),
  date: document.getElementById("date"),
  hijriDate: document.getElementById("hijriDate"),
  locationName: document.getElementById("locationName"),
  methodSelect: document.getElementById("methodSelect"),
  nextPrayer: document.getElementById("nextPrayer"),
  prayerList: document.getElementById("prayerList"),
  status: document.getElementById("status"),
  masjidCard: document.getElementById("masjidCard"),
  duaCard: document.getElementById("duaCard"),
};

elements.methodSelect.value = state.method;
updateAudioButton();
buildSettingsDialog();
startClock();
requestWakeLock();
locate();
renderMasjidCard();
renderDuaOfDay();

elements.audioButton.addEventListener("click", async () => {
  state.audioEnabled = true;
  localStorage.setItem("adhanAudioEnabled", "true");
  updateAudioButton();
  await testAudio();
});

elements.settingsButton.addEventListener("click", () => {
  elements.apiKeyInput.value = localStorage.getItem("claudeApiKey") || "";
  elements.settingsOverlay.hidden = false;
});

elements.settingsCloseButton.addEventListener("click", closeSettings);

elements.settingsOverlay.addEventListener("click", (event) => {
  if (event.target === elements.settingsOverlay) closeSettings();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.settingsOverlay.hidden) closeSettings();
});

function closeSettings() {
  if (elements.settingsOverlay.hidden) return;
  elements.settingsOverlay.hidden = true;

  const trimmed = elements.apiKeyInput.value.trim();
  const previous = localStorage.getItem("claudeApiKey") || "";
  if (trimmed) {
    localStorage.setItem("claudeApiKey", trimmed);
  } else {
    localStorage.removeItem("claudeApiKey");
  }
  if (trimmed !== previous) {
    localStorage.removeItem("masjidInfo");
    maybeLookupMasjid(true);
  }
  renderMasjidCard();
}

elements.adhanReciterSelect.addEventListener("change", () => {
  state.adhanId = elements.adhanReciterSelect.value;
  localStorage.setItem("adhanReciter", state.adhanId);
});

elements.fajrAdhanSelect.addEventListener("change", () => {
  state.fajrAdhanId = elements.fajrAdhanSelect.value;
  localStorage.setItem("fajrAdhanReciter", state.fajrAdhanId);
});

elements.methodSelect.addEventListener("change", () => {
  state.method = elements.methodSelect.value;
  localStorage.setItem("prayerMethod", state.method);
  recalculate();
});

bindAdhanPreview(elements.adhanPreviewPlay, elements.adhanPreviewStop, () => adhanUrlFor("Dhuhr"));
bindAdhanPreview(elements.fajrPreviewPlay, elements.fajrPreviewStop, () => adhanUrlFor("Fajr"));

function bindAdhanPreview(playButton, stopButton, getUrl) {
  const stop = () => {
    elements.audio.pause();
    elements.audio.currentTime = 0;
    stopButton.disabled = true;
  };

  playButton.addEventListener("click", async () => {
    stop();
    try {
      elements.audio.src = getUrl();
      elements.audio.currentTime = 0;
      elements.audio.volume = 1;
      stopButton.disabled = false;
      await elements.audio.play();
    } catch {
      stop();
    }
  });

  stopButton.addEventListener("click", stop);

  elements.audio.addEventListener("ended", () => {
    if (!stopButton.disabled) stop();
  });
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    requestWakeLock();
    recalculate();
  }
});

function locate() {
  if (!navigator.geolocation) {
    setStatus("This browser does not support geolocation.", true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      elements.locationName.textContent = `${state.coords.lat.toFixed(3)}, ${state.coords.lon.toFixed(3)}`;
      setStatus("Location locked. Prayer times are calculated on this tablet.");
      reverseGeocode();
      recalculate();
      maybeLookupMasjid();
    },
    (error) => {
      setStatus(`Location permission is required for automatic prayer times: ${error.message}`, true);
    },
    { enableHighAccuracy: true, maximumAge: 15 * 60 * 1000, timeout: 15000 },
  );
}

async function reverseGeocode() {
  if (!state.coords) return;
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", state.coords.lat);
    url.searchParams.set("lon", state.coords.lon);
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) return;
    const data = await response.json();
    const place = data.address?.city || data.address?.town || data.address?.village || data.address?.county;
    if (place) elements.locationName.textContent = place;
  } catch {
    // Coordinates are already shown; reverse geocoding is only a display enhancement.
  }
}

function recalculate() {
  if (!state.coords) return;
  state.times = calculatePrayerTimes(new Date(), state.coords.lat, state.coords.lon, state.method);
  renderPrayerList();
  updateRuntime();
}

function startClock() {
  updateRuntime();
  setInterval(updateRuntime, 1000);
  setInterval(recalculate, 10 * 60 * 1000);
  setInterval(renderDuaOfDay, 10 * 60 * 1000);
  setInterval(updateTimeOfDayTheme, 10 * 60 * 1000);
}

function updateTimeOfDayTheme() {
  const hour = new Date().getHours();
  document.documentElement.dataset.theme = hour >= 6 && hour < 19 ? "light" : "dark";
}

function updateRuntime() {
  const now = new Date();
  elements.clock.textContent = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);
  elements.date.textContent = new Intl.DateTimeFormat([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
  elements.hijriDate.textContent = formatHijriDate(now);

  if (!state.times) return;
  const next = getNextPrayer(now, state.times);
  elements.nextPrayer.innerHTML = `${next.name} <span class="next-prayer-ar" lang="ar" dir="rtl">${PRAYER_ARABIC[next.name]}</span>`;
  elements.countdown.textContent = formatDuration(next.date - now);
  highlightActivePrayer(now);
  maybePlayAdhan(now);
}

function renderPrayerList() {
  elements.prayerList.innerHTML = "";
  for (const prayer of PRAYERS) {
    const row = document.createElement("div");
    row.className = "prayer-row";
    row.dataset.prayer = prayer;

    const name = document.createElement("div");
    name.className = "prayer-name";
    name.innerHTML = `${prayer} <span class="prayer-name-ar" lang="ar" dir="rtl">${PRAYER_ARABIC[prayer]}</span>`;

    const time = document.createElement("div");
    time.className = "prayer-time";
    time.textContent = formatTime(state.times[prayer]);

    row.append(name, time);
    elements.prayerList.append(row);
  }
}

function highlightActivePrayer(now) {
  const rows = Array.from(document.querySelectorAll(".prayer-row"));
  rows.forEach((row) => row.classList.remove("active"));

  const past = PRAYERS.filter((name) => state.times[name] <= now);
  const active = past[past.length - 1] || "Isha";
  const row = rows.find((item) => item.dataset.prayer === active);
  row?.classList.add("active");
}

function getNextPrayer(now, times) {
  for (const name of PRAYERS) {
    if (times[name] > now) return { name, date: times[name] };
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextTimes = calculatePrayerTimes(tomorrow, state.coords.lat, state.coords.lon, state.method);
  return { name: "Fajr", date: nextTimes.Fajr };
}

function maybePlayAdhan(now) {
  if (!state.audioEnabled || !state.times) return;

  for (const name of ADHAN_PRAYERS) {
    if (!state.prayerAudio[name]) continue;
    const prayerTime = state.times[name];
    const delta = Math.abs(now - prayerTime);
    const key = `${dateKey(prayerTime)}-${name}`;
    if (delta < 1000 && !state.playedKeys.has(key)) {
      state.playedKeys.add(key);
      localStorage.setItem("playedAdhans", JSON.stringify([...state.playedKeys].slice(-40)));
      playAdhan(name);
    }
  }
}

function loadPrayerAudioPrefs() {
  const stored = JSON.parse(localStorage.getItem("prayerAudioEnabled") || "null") || {};
  const prefs = {};
  for (const name of ADHAN_PRAYERS) {
    prefs[name] = stored[name] !== undefined ? stored[name] : true;
  }
  return prefs;
}

function savePrayerAudioPrefs() {
  localStorage.setItem("prayerAudioEnabled", JSON.stringify(state.prayerAudio));
}

function buildSettingsDialog() {
  elements.adhanReciterSelect.innerHTML = "";
  for (const option of ADHAN_OPTIONS) {
    const el = document.createElement("option");
    el.value = option.id;
    el.textContent = option.label;
    elements.adhanReciterSelect.append(el);
  }
  elements.adhanReciterSelect.value = state.adhanId;

  elements.fajrAdhanSelect.innerHTML = "";
  for (const option of FAJR_ADHAN_OPTIONS) {
    const el = document.createElement("option");
    el.value = option.id;
    el.textContent = option.label;
    elements.fajrAdhanSelect.append(el);
  }
  elements.fajrAdhanSelect.value = state.fajrAdhanId;

  elements.prayerToggleList.innerHTML = "";
  for (const name of ADHAN_PRAYERS) {
    const row = document.createElement("label");
    row.className = "toggle-row";

    const label = document.createElement("span");
    label.innerHTML = `${name} <span class="prayer-name-ar" lang="ar" dir="rtl">${PRAYER_ARABIC[name]}</span>`;

    const switchWrap = document.createElement("span");
    switchWrap.className = "toggle-switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.prayerAudio[name];
    input.addEventListener("change", () => {
      state.prayerAudio[name] = input.checked;
      savePrayerAudioPrefs();
    });

    const track = document.createElement("span");
    track.className = "track";

    switchWrap.append(input, track);
    row.append(label, switchWrap);
    elements.prayerToggleList.append(row);
  }
}

async function playAdhan(name) {
  setStatus(`Playing adhan for ${name}.`);
  try {
    elements.audio.src = adhanUrlFor(name);
    elements.audio.currentTime = 0;
    await elements.audio.play();
  } catch {
    speakAdhan();
  }
}

function adhanUrlFor(name) {
  if (name === "Fajr") {
    const reciter = FAJR_ADHAN_OPTIONS.find((option) => option.id === state.fajrAdhanId) || FAJR_ADHAN_OPTIONS[0];
    return reciter.url;
  }
  const reciter = ADHAN_OPTIONS.find((option) => option.id === state.adhanId) || ADHAN_OPTIONS[0];
  return `https://praytimes.org/audio/sunni/${reciter.id}.mp3`;
}

async function testAudio() {
  try {
    elements.audio.src = adhanUrlFor("Dhuhr");
    elements.audio.volume = 0.01;
    await elements.audio.play();
    elements.audio.pause();
    elements.audio.currentTime = 0;
    elements.audio.volume = 1;
    setStatus("Adhan audio is enabled.");
  } catch {
    speak("Adhan audio is enabled.");
    setStatus("Adhan audio is enabled. Browser speech will be used if the remote audio is unavailable.");
  }
}

function speakAdhan() {
  const phrases = [
    "Allahu akbar. Allahu akbar.",
    "Ashhadu an la ilaha illallah.",
    "Ashhadu anna Muhammadan rasulullah.",
    "Hayya alas salah.",
    "Hayya alal falah.",
    "Allahu akbar. La ilaha illallah.",
  ];
  speak(phrases.join(" "));
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82;
  utterance.pitch = 0.9;
  window.speechSynthesis.speak(utterance);
}

function updateAudioButton() {
  elements.audioButton.classList.toggle("enabled", state.audioEnabled);
  elements.audioButton.title = state.audioEnabled ? "Adhan audio enabled" : "Enable adhan audio";
  elements.audioButton.setAttribute("aria-label", elements.audioButton.title);
}

function setStatus(message, error = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", error);
}

async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    await navigator.wakeLock.request("screen");
  } catch {
    // Kiosk browsers often manage screen wake separately.
  }
}

function calculatePrayerTimes(date, latitude, longitude, methodName) {
  const method = METHODS[methodName] || METHODS.MWL;
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  const dayOfYear = dayOfYearLocal(midnight);
  const decl = solarDeclination(dayOfYear);
  const eqTime = equationOfTime(dayOfYear);
  const timezoneHours = -midnight.getTimezoneOffset() / 60;
  const dhuhrMinutes = 720 - 4 * longitude - eqTime + timezoneHours * 60;

  const fajr = dhuhrMinutes - hourAngleMinutes(latitude, decl, 90 + method.fajr);
  const sunrise = dhuhrMinutes - hourAngleMinutes(latitude, decl, 90.833);
  const dhuhr = dhuhrMinutes + 2;
  const asr = dhuhrMinutes + asrMinutes(latitude, decl, 1);
  const maghrib = dhuhrMinutes + hourAngleMinutes(latitude, decl, 90.833);
  const isha = method.ishaInterval
    ? maghrib + method.ishaInterval
    : dhuhrMinutes + hourAngleMinutes(latitude, decl, 90 + method.isha);

  return {
    Fajr: minutesToDate(midnight, fajr),
    Sunrise: minutesToDate(midnight, sunrise),
    Dhuhr: minutesToDate(midnight, dhuhr),
    Asr: minutesToDate(midnight, asr),
    Maghrib: minutesToDate(midnight, maghrib),
    Isha: minutesToDate(midnight, isha),
  };
}

function dayOfYearLocal(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function solarDeclination(day) {
  const gamma = (2 * Math.PI / 365) * (day - 1);
  return (
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma)
  );
}

function equationOfTime(day) {
  const gamma = (2 * Math.PI / 365) * (day - 1);
  return 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );
}

function hourAngleMinutes(latitude, declination, zenith) {
  const lat = degToRad(latitude);
  const zen = degToRad(zenith);
  const cosH = (Math.cos(zen) - Math.sin(lat) * Math.sin(declination)) / (Math.cos(lat) * Math.cos(declination));
  const bounded = Math.min(1, Math.max(-1, cosH));
  return (radToDeg(Math.acos(bounded)) * 4);
}

function asrMinutes(latitude, declination, factor) {
  const lat = degToRad(latitude);
  const altitude = Math.atan(1 / (factor + Math.tan(Math.abs(lat - declination))));
  const cosH = (Math.sin(altitude) - Math.sin(lat) * Math.sin(declination)) / (Math.cos(lat) * Math.cos(declination));
  const bounded = Math.min(1, Math.max(-1, cosH));
  return radToDeg(Math.acos(bounded)) * 4;
}

function minutesToDate(base, minutes) {
  return new Date(base.getTime() + Math.round(minutes) * 60000);
}

function formatTime(date) {
  return new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatHijriDate(date) {
  // Some Android WebViews compute the correct islamic-umalqura month/day/year
  // numerically but mis-map the month *name* onto the Gregorian month table
  // (e.g. showing "March" for Rabi' al-awwal, since both are month index 2).
  // Requesting numeric fields and naming the month ourselves sidesteps that.
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  const monthName = HIJRI_MONTHS[Number(get("month")) - 1] ?? get("month");
  return `${get("weekday")}, ${monthName} ${get("day")}, ${get("year")} AH`;
}

function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function degToRad(value) {
  return value * Math.PI / 180;
}

function radToDeg(value) {
  return value * 180 / Math.PI;
}

function renderDuaOfDay() {
  if (typeof AZKAR === "undefined" || !AZKAR.length) return;
  const dayIndex = dayOfYearLocal(new Date()) % AZKAR.length;
  const dua = AZKAR[dayIndex];
  elements.duaCard.innerHTML = `
    <p class="dua-arabic" lang="ar">${escapeHtml(dua.arabic)}</p>
    <p class="dua-english">${escapeHtml(dua.english)}</p>
    <p class="dua-reference">${escapeHtml(dua.reference)}</p>
  `;
}

const MASJID_REFRESH_MS = 24 * 60 * 60 * 1000;

async function maybeLookupMasjid(force = false) {
  const apiKey = localStorage.getItem("claudeApiKey");
  if (!apiKey || !state.coords) return;

  const cached = JSON.parse(localStorage.getItem("masjidInfo") || "null");
  if (!force && cached && Date.now() - cached.fetchedAt < MASJID_REFRESH_MS) {
    renderMasjidCard();
    return;
  }

  renderMasjidLoading();
  try {
    const info = await fetchMasjidInfo(apiKey, state.coords.lat, state.coords.lon);
    localStorage.setItem("masjidInfo", JSON.stringify({ ...info, fetchedAt: Date.now() }));
  } catch (error) {
    renderMasjidError(error.message || "Lookup failed.");
    return;
  }
  renderMasjidCard();
}

async function fetchMasjidInfo(apiKey, lat, lon) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              found: { type: "boolean" },
              name: { type: "string" },
              address: { type: "string" },
              iqama: {
                type: "object",
                properties: {
                  fajr: { type: "string" },
                  dhuhr: { type: "string" },
                  asr: { type: "string" },
                  maghrib: { type: "string" },
                  isha: { type: "string" },
                  jumuah: { type: "string" },
                },
                required: ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"],
                additionalProperties: false,
              },
            },
            required: ["found", "name", "address", "iqama"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content:
            `Find the closest masjid (mosque) to latitude ${lat}, longitude ${lon}. ` +
            "Search the web for its official website or social media page and extract its current iqama (congregation prayer) times for Fajr, Dhuhr, Asr, Maghrib, Isha, and Jumuah. " +
            "Return the masjid's name and street address. " +
            "If you cannot confidently find a masjid or its iqama times, set found to false and use empty strings for any field you could not determine. " +
            "Do not fabricate times.",
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude API error (${response.status}): ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  if (data.stop_reason === "refusal") {
    throw new Error("Claude declined this request.");
  }
  const textBlock = (data.content || []).find((block) => block.type === "text");
  if (!textBlock) throw new Error("No response content.");
  const parsed = JSON.parse(textBlock.text);
  if (!parsed.found) throw new Error("Could not find a nearby masjid with iqama times.");
  return parsed;
}

function renderMasjidLoading() {
  elements.masjidCard.innerHTML = '<p class="masjid-empty">Looking up the nearest masjid...</p>';
}

function renderMasjidError(message) {
  elements.masjidCard.innerHTML = `<p class="masjid-empty">${escapeHtml(message)}</p>`;
}

function renderMasjidCard() {
  const apiKey = localStorage.getItem("claudeApiKey");
  if (!apiKey) {
    elements.masjidCard.innerHTML =
      '<p class="masjid-empty">Set a Claude API key (⚙) to look up the nearest masjid and iqama times.</p>';
    return;
  }

  const info = JSON.parse(localStorage.getItem("masjidInfo") || "null");
  if (!info) {
    elements.masjidCard.innerHTML = '<p class="masjid-empty">Waiting for location to look up the nearest masjid...</p>';
    return;
  }

  const iqamaOrder = [
    ["fajr", "Fajr"],
    ["dhuhr", "Dhuhr"],
    ["asr", "Asr"],
    ["maghrib", "Maghrib"],
    ["isha", "Isha"],
    ["jumuah", "Jumu'ah"],
  ];
  const items = iqamaOrder
    .filter(([key]) => info.iqama && info.iqama[key])
    .map(
      ([key, label]) =>
        `<div class="masjid-iqama-item"><span class="name">${label}</span><span class="time">${escapeHtml(info.iqama[key])}</span></div>`,
    )
    .join("");

  elements.masjidCard.innerHTML = `
    <h3 class="masjid-name">${escapeHtml(info.name || "Nearby masjid")}</h3>
    <p class="masjid-address">${escapeHtml(info.address || "")}</p>
    <div class="masjid-iqama">${items || '<p class="masjid-empty">No iqama times found.</p>'}</div>
    <p class="masjid-updated">Updated ${new Date(info.fetchedAt).toLocaleString()}</p>
  `;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
