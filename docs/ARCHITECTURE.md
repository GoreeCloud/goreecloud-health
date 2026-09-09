# GoreeCloud Health — Architecture

## Foundation architecture

```text
GoreeCloud Health
├── apps/web      responsive web client; no backend connection
└── apps/android  native Android Compose client; no health permissions
```

The foundation intentionally avoids introducing a backend before GoreeCloud Identity, Privacy Shield, Wardveil Security, Everkeep, health-record provenance, and lifecycle requirements are defined.

## Planned trust boundaries

```text
Android sensors / Health Connect
            │
            ▼
Android Health client ── local-first normalized records
            │
            │ optional governed sync
            ▼
GoreeCloud Identity + Privacy Shield authorization
            │
            ▼
Health API / durable health store
            │
      ┌─────┴─────┐
      ▼           ▼
 Wardveil      Everkeep
 security      continuity
```

Mesh may coordinate minimized state/evidence but does not become health-data authority. Manager may consume bounded operational status but does not become health-record authority.

## Record model direction

Every future normalized record should include a stable record identifier, health-domain type, value/payload, unit where applicable, start/end or observation time, time zone/offset context, source identifier, source record identifier where available, provenance/import metadata, creation/update information, and deletion/supersession state as appropriate.

Exact schemas remain a Phase 1 deliverable and must be validated before persistence or sync.
