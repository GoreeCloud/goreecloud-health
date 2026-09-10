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
- Current type contracts are `activity-steps.schema.json`, `activity-distance.schema.json`, `activity-active-energy.schema.json`, `exercise-session.schema.json`, `sleep-session.schema.json`, `heart-rate.schema.json`, `body-weight.schema.json`, and `hydration-water.schema.json`.
- `activity-active-energy.schema.json` adds a positive-duration interval measurement for active energy excluding basal energy, normalized to `kcal` and bounded at source-contract level; it neither calculates energy nor maps any runtime provider.
- `health-reconciliation-policy.v1.json` defines the fail-closed `goreecloud.health.reconciliation-policy.v1` baseline for exactly those eight current record types.
- All corresponding files under `contracts/examples/` are repository-owned synthetic validation data only.

The common envelope deliberately does not make arbitrary domain payloads supported. Each health record family must receive a type-specific contract and validation before its data can be treated as normalized GoreeCloud Health input. The current `exercise.session` and `sleep.session` contracts deliberately accept empty payloads only and require positive-duration intervals; exercise classification/details and sleep-stage semantics remain ungoverned rather than inferred. Active time also remains a separate, unimplemented semantic contract rather than being inferred from active-energy intervals.

## Reconciliation boundary

The machine-readable reconciliation policy recognizes exact same-source re-observation only when trustworthy `source_id` plus `source_record_id` are available. It forbids heuristic deduplication when source-native identity is absent, forbids treating cross-source time/value equality as identity, keeps cross-source aggregation and conflict resolution unauthorized, and requires explicit lifecycle supersession for replacement/correction.

This boundary prevents future clients from silently manufacturing multi-source totals or choosing a winning source before domain-specific rules are governed. Valid active-energy records from different sources are therefore not automatically summed or selected. Positive aggregation, source-priority, conflict-resolution, or derived-value semantics remain separate work.

No health contract, reconciliation policy, or Privacy Shield source manifest is a permission grant. Real ingestion, persistence, synchronization, aggregation, or derived use remains blocked on applicable Privacy Shield operation-level authorization and runtime acceptance plus the other required GoreeCloud integration/acceptance gates.
