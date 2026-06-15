# Adhan

Static tablet kiosk web app for Islamic prayer times.

## Features

- Uses browser geolocation to calculate local prayer times on-device.
- Shows a large clock, next prayer countdown, and daily schedule.
- Plays a default remote adhan at Fajr, Dhuhr, Asr, Maghrib, and Isha when audio is enabled.
- Displays the Gregorian date and Islamic date.
- Falls back to browser speech synthesis if no recorded adhan file is present.
- Stores the calculation method and audio permission preference in local storage.

## Local run

Open `index.html` directly, or run:

```sh
docker build -t adhan .
docker run --rm -p 8080:80 adhan
```

Geolocation requires HTTPS in most browsers unless served from `localhost`.

## Adhan audio

The default audio source is `https://www.islamcan.com/audio/adhan/azan1.mp3`. Browser autoplay policies require tapping the audio button once after the kiosk page loads.

If you want to use a locally hosted recording instead, update the `adhanAudio` element in `index.html`.
