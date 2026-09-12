# GoreeCloud Health — Architecture

## Foundation architecture

```text
GoreeCloud Health
├── apps/web      responsive web client; no backend connection
├── apps/android  native Android Compose client; no health permissions
├── contracts     source-level normalization + reconciliation policy; synthetic validation only
└── privacy       fail-closed Privacy Shield application declaration; no data authority
```

The foundation intentionally avoids introducing a backend before GoreeCloud Identity, Privacy Shield operation-level authorization/runtime acceptance, Wardveil Security, Everkeep, health-record provenance, reconciliation, and lifecycle requirements are defined and accepted.

The current Privacy Shield application manifest is deliberately source-only and empty of purposes/resources. It establishes no health-data processing path and does not make Privacy Shield a runtime authority for Health Connect, local storage, synchronization, sharing, export, retention, deletion, or derived use.

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

Operating-system permission authority remains with Android/Health Connect. GoreeCloud Health remains authoritative for its own application data handling. Privacy Shield supplies the shared privacy contract and acceptance boundary without inventing runtime behavior. Mesh may coordinate minimized state/evidence but does not become health-data authority. Manager may consume bounded operational status but does not become health-record authority.

## Record contract v1

The repository-controlled normalization contract is implemented under `contracts/`:

- `health-source.schema.json` defines exact bounded source identity/source kind.
- `health-record-envelope.schema.json` defines `goreecloud.health.record.v1` record identity, time context, source, provenance, lifecycle, and payload binding.
- Current type contracts are `activity-steps.schema.json`, `activity-distance.schema.json`, `activity-active-energy.schema.json`, `activity-intensity.schema.json`, `exercise-session.schema.json`, `sleep-session.schema.json`, `heart-rate.schema.json`, `body-weight.schema.json`, and `hydration-water.schema.json`.
- `activity-active-energy.schema.json` adds a positive-duration interval measurement for active energy excluding basal energy, normalized to `kcal` and bounded at source-contract level; it neither calculates energy nor maps any runtime provider.
- `activity-intensity.schema.json` adds a positive-duration interval classified exactly as `moderate` or `vigorous`. It is intentionally a source-record boundary rather than a precomputed duration-total or intensity-minute aggregate.
- `health-reconciliation-policy.v1.json` defines the fail-closed `goreecloud.health.reconciliation-policy.v1` baseline for exactly those nine current record types.
- All corresponding files under `contracts/examples/` are repository-owned synthetic validation data only.

The common envelope deliberately does not make arbitrary domain payloads supported. Each health record family must receive a type-specific contract and validation before its data can be treated as normalized GoreeCloud Health input. The current `exercise.session` and `sleep.session` contracts deliberately accept empty payloads only and require positive-duration intervals; exercise classification/details and sleep-stage semantics remain ungoverned rather than inferred. Activity-intensity intervals do not authorize active-time totals, weighted intensity-minute calculations, or other aggregate semantics.

## Android activity-intensity interoperability boundary

Health Connect currently exposes a feature-gated activity-intensity record with positive start/end interval semantics and moderate/vigorous classification, plus separate aggregate duration and intensity-minute metrics. GoreeCloud Health mirrors only the bounded source-record semantics in `activity.intensity`. The repository does not yet contain a Health Connect adapter, feature check, runtime permission request, provider mapping, aggregate query, or record ingestion path.

A future Android adapter must preserve source-native record identity and provenance, verify platform feature availability, request only the exact governed permissions, and remain blocked until the applicable Privacy Shield operation-level authorization and runtime acceptance are established.

## Reconciliation boundary

The machine-readable reconciliation policy recognizes exact same-source re-observation only when trustworthy `source_id` plus `source_record_id` are available. It forbids heuristic deduplication when source-native identity is absent, forbids treating cross-source time/value equality as identity, keeps cross-source aggregation and conflict resolution unauthorized, and requires explicit lifecycle supersession for replacement/correction.

This boundary prevents future clients from silently manufacturing multi-source totals or choosing a winning source before domain-specific rules are governed. Valid active-energy and activity-intensity records from different sources are therefore not automatically summed, merged, selected, or converted into user-facing totals. Positive aggregation, source-priority, conflict-resolution, or derived-value semantics remain separate work.

No health contract, reconciliation policy, or Privacy Shield source manifest is a permission grant. Real ingestion, persistence, synchronization, aggregation, or derived use remains blocked on applicable Privacy Shield operation-level authorization and runtime acceptance plus the other required GoreeCloud integration/acceptance gates.
