"""Random YouTube adhan service for the Adhan kiosk.

Keeps a small pool of audio-only downloads of popular adhan videos (found via
yt-dlp search), one pool for Fajr and one for the other four prayers, and
serves them under /yt/ on the same host as the web app:

  GET /yt/pick?kind=adhan|fajr   -> {"id", "title", "channel", "views", "url"}
  GET /yt/audio/<kind>/<file>    -> the audio file
  GET /yt/status                 -> both pools, for debugging
  GET /yt/healthz                -> "ok"

The pools are re-rolled every REFRESH_HOURS. Each refresh first upgrades
yt-dlp in place, because YouTube changes regularly break older releases.
Standard library only; yt-dlp runs as a subprocess of this interpreter.

Local dev: STATIC_DIR=. python3 yt/server.py also serves the web app on
http://localhost:8080/ so /yt/ is same-origin, as it is in production.
"""

import json
import mimetypes
import os
import random
import re
import subprocess
import sys
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", "8080"))
DATA_DIR = Path(os.environ.get("DATA_DIR", "/data"))
STATIC_DIR = os.environ.get("STATIC_DIR")
POOL_SIZE = int(os.environ.get("POOL_SIZE", "8"))
MIN_VIEWS = int(os.environ.get("MIN_VIEWS", "250000"))
REFRESH_HOURS = float(os.environ.get("REFRESH_HOURS", "24"))
SEARCH_RESULTS = 30

# The Fajr adhan adds "as-salatu khayrun min an-nawm", so the two pools are
# kept apart: Fajr videos must say so in the title, the rest must not.
QUERIES = {
    "adhan": [
        "beautiful adhan",
        "beautiful azan",
        "adhan makkah masjid al haram",
        "adhan madinah masjid an nabawi",
        "best azan in the world",
        "adhan al aqsa",
    ],
    "fajr": [
        "fajr adhan",
        "fajr azan makkah",
        "fajr adhan madinah",
        "beautiful fajr azan",
    ],
}
FAJR_WORDS = re.compile(r"\b(fajr|fajar|fajer|الفجر|فجر)\b")
EXCLUDED_WORDS = re.compile(
    r"\b(hours?|live|compilation|ringtone|shia|nasheed|quran|recitation"
    r"|tilawa[th]?|iqamah?|kids|cartoon|reaction|مباشر|إقامة|اقامة|ساعة|ساعات)\b"
)
MIN_SECONDS, MAX_SECONDS = 60, 600
AUDIO_TYPES = {".m4a": "audio/mp4", ".webm": "audio/webm", ".opus": "audio/ogg", ".mp3": "audio/mpeg"}

pools = {kind: {} for kind in QUERIES}  # kind -> {video id: metadata}
pools_lock = threading.Lock()


def log(message):
    print(time.strftime("%Y-%m-%d %H:%M:%S"), message, flush=True)


def yt_dlp(*args):
    # Put the interpreter's bin dir (venv) on PATH so yt-dlp finds deno there.
    env = dict(os.environ, PATH=f"{Path(sys.executable).parent}{os.pathsep}{os.environ.get('PATH', '')}")
    return subprocess.run(
        [sys.executable, "-m", "yt_dlp", "--no-warnings", *args],
        capture_output=True, text=True, timeout=600, env=env, check=True,
    ).stdout


def upgrade_yt_dlp():
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q", "-U", "yt-dlp[default]", "deno"],
            capture_output=True, timeout=600, check=True,
        )
    except (subprocess.SubprocessError, OSError) as error:
        log(f"yt-dlp upgrade failed, keeping current version: {error}")


def is_candidate(kind, entry):
    title = (entry.get("title") or "").lower()
    duration = entry.get("duration") or 0
    views = entry.get("view_count") or 0
    if not (MIN_SECONDS <= duration <= MAX_SECONDS) or views < MIN_VIEWS:
        return False
    if EXCLUDED_WORDS.search(title):
        return False
    mentions_fajr = bool(FAJR_WORDS.search(title))
    return mentions_fajr if kind == "fajr" else not mentions_fajr


def search(kind):
    candidates = {}
    for query in QUERIES[kind]:
        try:
            result = json.loads(yt_dlp("--flat-playlist", "-J", f"ytsearch{SEARCH_RESULTS}:{query}"))
        except (subprocess.SubprocessError, ValueError) as error:
            log(f"search failed for {query!r}: {error}")
            continue
        for entry in result.get("entries") or []:
            if entry.get("id") and is_candidate(kind, entry):
                candidates[entry["id"]] = entry
    return list(candidates.values())


def download(kind, entry):
    folder = DATA_DIR / kind
    folder.mkdir(parents=True, exist_ok=True)
    path = yt_dlp(
        "-f", "bestaudio[ext=m4a]/bestaudio",
        "--no-playlist", "--no-progress", "--max-filesize", "25M",
        "-o", str(folder / "%(id)s.%(ext)s"),
        "--print", "after_move:filepath",
        f"https://www.youtube.com/watch?v={entry['id']}",
    ).strip().splitlines()[-1]
    return Path(path).name


def refresh(kind):
    candidates = search(kind)
    if not candidates:
        log(f"{kind}: no candidates found, keeping the current pool")
        return

    with pools_lock:
        current = dict(pools[kind])
    chosen = random.sample(candidates, min(POOL_SIZE, len(candidates)))
    fresh = {}
    for entry in chosen:
        if entry["id"] in current:
            fresh[entry["id"]] = current[entry["id"]]
            continue
        try:
            filename = download(kind, entry)
        except (subprocess.SubprocessError, IndexError) as error:
            log(f"{kind}: download failed for {entry['id']}: {error}")
            continue
        fresh[entry["id"]] = {
            "id": entry["id"],
            "title": entry.get("title"),
            "channel": entry.get("channel") or entry.get("uploader"),
            "views": entry.get("view_count"),
            "file": filename,
        }
    if not fresh:
        log(f"{kind}: every download failed, keeping the current pool")
        return

    with pools_lock:
        pools[kind] = fresh
    (DATA_DIR / f"{kind}.json").write_text(json.dumps(fresh, indent=1))
    keep = {item["file"] for item in fresh.values()}
    for path in (DATA_DIR / kind).iterdir():
        if path.name not in keep:
            path.unlink(missing_ok=True)
    log(f"{kind}: pool now has {len(fresh)} recordings")


def load_saved_pools():
    for kind in pools:
        saved = DATA_DIR / f"{kind}.json"
        if not saved.exists():
            continue
        entries = json.loads(saved.read_text())
        pools[kind] = {key: item for key, item in entries.items() if (DATA_DIR / kind / item["file"]).exists()}


def refresh_loop():
    while True:
        upgrade_yt_dlp()
        for kind in pools:
            try:
                refresh(kind)
            except Exception as error:  # Never let one bad refresh kill the loop.
                log(f"{kind}: refresh failed: {error}")
        time.sleep(REFRESH_HOURS * 3600)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR or str(DATA_DIR), **kwargs)

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/yt/healthz":
            return self.send_body(200, b"ok\n", "text/plain")
        if url.path == "/yt/status":
            with pools_lock:
                return self.send_json(200, {kind: list(pool.values()) for kind, pool in pools.items()})
        if url.path == "/yt/pick":
            kind = parse_qs(url.query).get("kind", ["adhan"])[0]
            with pools_lock:
                pool = list(pools.get(kind, {}).values())
            if not pool:
                return self.send_json(503, {"error": f"no {kind} recordings available yet"})
            pick = random.choice(pool)
            return self.send_json(200, {**pick, "url": f"/yt/audio/{kind}/{pick['file']}"})
        if url.path.startswith("/yt/audio/"):
            return self.send_audio(url.path.removeprefix("/yt/audio/"))
        if STATIC_DIR and not url.path.startswith("/yt/"):
            return super().do_GET()
        return self.send_json(404, {"error": "not found"})

    def send_audio(self, rest):
        kind, _, filename = rest.partition("/")
        with pools_lock:
            known = any(item["file"] == filename for item in pools.get(kind, {}).values())
        path = DATA_DIR / kind / filename
        if not known or not path.is_file():
            return self.send_json(404, {"error": "not found"})
        body = path.read_bytes()
        content_type = AUDIO_TYPES.get(path.suffix) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        # Files are named by video id and never change, so they cache well.
        self.send_body(200, body, content_type, "public, max-age=86400")

    def send_json(self, status, payload):
        self.send_body(status, json.dumps(payload).encode(), "application/json")

    def send_body(self, status, body, content_type, cache="no-store"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        if not self.path.startswith("/yt/healthz"):
            super().log_message(format, *args)


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    load_saved_pools()
    threading.Thread(target=refresh_loop, daemon=True).start()
    log(f"listening on :{PORT}")
    ThreadingHTTPServer(("", PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
