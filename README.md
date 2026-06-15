# Prayer Times

Static tablet kiosk web app for Islamic prayer times.

## Features

- Uses browser geolocation to calculate local prayer times on-device.
- Shows a large clock, next prayer countdown, and daily schedule.
- Plays `/adhan.mp3` at Fajr, Dhuhr, Asr, Maghrib, and Isha when audio is enabled.
- Falls back to browser speech synthesis if no recorded adhan file is present.
- Stores the calculation method and audio permission preference in local storage.

## Local run

Open `index.html` directly, or run:

```sh
docker build -t prayer-times .
docker run --rm -p 8080:80 prayer-times
```

Geolocation requires HTTPS in most browsers unless served from `localhost`.

## Adhan audio

Place a preferred recording at `adhan.mp3` before building the image. Browser autoplay policies require tapping the audio button once after the kiosk page loads.
