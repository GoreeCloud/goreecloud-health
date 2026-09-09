# GoreeCloud Health — Architecture

## Foundation architecture

```text
GoreeCloud Health
├── apps/web      responsive web client; no backend connection
├── apps/android  native Android Compose client; no health permissions
└── contracts     source-level normalization contracts; synthetic validation only
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

## Record contract v1

The first repository-controlled normalization contract is implemented under `contracts/`:

- `health-source.schema.json` defines exact bounded source identity/source kind.
- `health-record-envelope.schema.json` defines `goreecloud.health.record.v1` record identity, time context, source, provenance, lifecycle, and payload binding.
- `activity-steps.schema.json` is the first type-specific payload contract.
- `examples/activity-steps.synthetic.json` is synthetic validation data only.

The common envelope deliberately does not make arbitrary domain payloads supported. Each health record family must receive a type-specific contract and validation before its data can be treated as normalized GoreeCloud Health input.

The current reconciliation baseline preserves source-native identity where available and forbids silent cross-source deduplication based only on matching time/value. Domain-specific aggregation and conflict resolution remain separate work.

No contract file is a permission grant. Real ingestion, persistence, synchronization, or derived use remains blocked on applicable Privacy Shield and platform authorization plus the other required GoreeCloud integration/acceptance gates.
