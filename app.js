const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const ADHAN_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const METHODS = {
  MWL: { fajr: 18, isha: 17 },
  ISNA: { fajr: 15, isha: 15 },
  Egypt: { fajr: 19.5, isha: 17.5 },
  Makkah: { fajr: 18.5, ishaInterval: 90 },
  Karachi: { fajr: 18, isha: 18 },
};

const state = {
  coords: null,
  times: null,
  audioEnabled: localStorage.getItem("adhanAudioEnabled") === "true",
  method: localStorage.getItem("prayerMethod") || "MWL",
  playedKeys: new Set(JSON.parse(localStorage.getItem("playedAdhans") || "[]")),
};

const elements = {
  audio: document.getElementById("adhanAudio"),
  audioButton: document.getElementById("audioButton"),
  clock: document.getElementById("clock"),
  countdown: document.getElementById("countdown"),
  date: document.getElementById("date"),
  locationName: document.getElementById("locationName"),
  methodSelect: document.getElementById("methodSelect"),
  nextPrayer: document.getElementById("nextPrayer"),
  prayerList: document.getElementById("prayerList"),
  status: document.getElementById("status"),
};

elements.methodSelect.value = state.method;
updateAudioButton();
startClock();
requestWakeLock();
locate();

elements.audioButton.addEventListener("click", async () => {
  state.audioEnabled = true;
  localStorage.setItem("adhanAudioEnabled", "true");
  updateAudioButton();
  await testAudio();
});

elements.methodSelect.addEventListener("change", () => {
  state.method = elements.methodSelect.value;
  localStorage.setItem("prayerMethod", state.method);
  recalculate();
});

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

  if (!state.times) return;
  const next = getNextPrayer(now, state.times);
  elements.nextPrayer.textContent = next.name;
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
    name.textContent = prayer;

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

async function playAdhan(name) {
  setStatus(`Playing adhan for ${name}.`);
  try {
    elements.audio.currentTime = 0;
    await elements.audio.play();
  } catch {
    speakAdhan();
  }
}

async function testAudio() {
  try {
    elements.audio.volume = 0.01;
    await elements.audio.play();
    elements.audio.pause();
    elements.audio.currentTime = 0;
    elements.audio.volume = 1;
    setStatus("Adhan audio is enabled. Add /adhan.mp3 to customize the recording.");
  } catch {
    speak("Adhan audio is enabled.");
    setStatus("Adhan audio is enabled. Browser speech will be used until /adhan.mp3 is available.");
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
  const angle = -radToDeg(Math.atan(1 / (factor + Math.tan(Math.abs(lat - declination)))));
  return hourAngleMinutes(latitude, declination, 90 - angle);
}

function minutesToDate(base, minutes) {
  return new Date(base.getTime() + Math.round(minutes) * 60000);
}

function formatTime(date) {
  return new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(date);
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
