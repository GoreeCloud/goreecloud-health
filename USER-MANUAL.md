# GoreeCloud Health — User Manual

## Current development foundation

GoreeCloud Health is not yet a released health-data application. The current web and Android builds are foundation interfaces that deliberately contain no real health readings.

## Web

Run the local web foundation:

```bash
python3 -m http.server 4173 -d apps/web
```

Open `http://localhost:4173`.

The Today page shows each health domain as **Not connected**. The Trends and Data areas explain that no health records are available. Selecting **Connect a data source** opens an informational dialog; it does not connect an account or request health-data access in the foundation.

## Android

The Android foundation displays the same truthful unconnected state. It does not request Health Connect permissions. See `apps/android/README.md` for development prerequisites.

## Privacy and safety

Do not use the current development build as a medical record, diagnostic service, emergency service, or production health-data store. Real health data should not be entered into this foundation build because persistence, privacy authorization, security, synchronization, recovery, and deletion flows are not implemented or accepted yet.
