# Adhan

Static tablet kiosk web app for Islamic prayer times.

## Features

- Uses browser geolocation to calculate local prayer times on-device.
- Shows a large clock, next prayer countdown, and daily schedule.
- Plays a default remote adhan at Fajr, Dhuhr, Asr, Maghrib, and Isha when audio is enabled.
- Displays the Gregorian date and Islamic date.
- Falls back to browser speech synthesis if no recorded adhan file is present.
- Stores the calculation method and audio permission preference in local storage.
- Looks up the closest masjid to your location and its iqama times using the Claude API (with web search), refreshed daily.
- Rotates a "Dua of the Day" from a built-in collection of 100 short azkar/duas (Arabic with diacritics + English translation).

## Local run

Open `index.html` directly, or run:

```sh
docker build -t adhan .
docker run --rm -p 8080:80 adhan
```

Geolocation requires HTTPS in most browsers unless served from `localhost`.

## Adhan audio

Tap ⚙ to choose from 17 Sunni adhan recordings (from [praytimes.org](https://praytimes.org/docs/adhan)) and to toggle which of the five daily prayers play an adhan. Browser autoplay policies require tapping the audio button once after the kiosk page loads.

## Dua of the day

`azkar.js` holds 100 short azkar/duas drawn from the Qur'an and authentic hadith collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, Ibn Majah — the same corpus compiled in *Hisn al-Muslim*), each with Arabic (with diacritics), an English translation, and a source reference. The app picks one deterministically by day-of-year, so it stays the same all day and rotates at local midnight. Edit `azkar.js` to add, remove, or correct entries — worth a scholar's review before relying on it for public display.

## Nearby masjid lookup

Tap the ⚙ button to enter a Claude API key (stored only in `localStorage`, never sent anywhere but `api.anthropic.com`). Once set and geolocation succeeds, the app asks Claude (with web search) to find the closest masjid and its iqama times, caching the result and refreshing once every 24 hours.
