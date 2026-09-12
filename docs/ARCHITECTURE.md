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
- Current type contracts are `activity-steps.schema.json`, `activity-distance.schema.json`, `activity-active-energy.schema.json`, `activity-active-time.schema.json`, `activity-intensity.schema.json`, `exercise-session.schema.json`, `sleep-session.schema.json`, `heart-rate.schema.json`, `body-weight.schema.json`, and `hydration-water.schema.json`.
- `activity-active-energy.schema.json` adds a positive-duration interval measurement for active energy excluding basal energy, normalized to `kcal` and bounded at source-contract level; it neither calculates energy nor maps any runtime provider.
- `activity-active-time.schema.json` adds a source-provided active-duration measurement in seconds within a positive observation interval. Validation requires the active duration to fit inside the enclosing interval; no detection algorithm, derivation from other Health records, provider mapping, or cross-record aggregation is implied.
- `activity-intensity.schema.json` adds a positive-duration interval classified exactly as `moderate` or `vigorous`. It is intentionally a source-record boundary rather than a precomputed duration-total or intensity-minute aggregate.
- `sleep-session.schema.json` preserves a stage-less positive-duration session while optionally accepting nested source stage intervals. Stages use a closed eight-value vocabulary, share parent source/provenance, must be offset-aware, time-ordered, non-overlapping, and fully contained by the parent session; gaps are allowed.
- `health-reconciliation-policy.v1.json` defines the fail-closed `goreecloud.health.reconciliation-policy.v1` baseline for exactly those ten current record types. Nested sleep stages do not expand the policy into a separate `sleep.stage` record type.
- All corresponding files under `contracts/examples/` are repository-owned synthetic validation data only; sleep has both stage-less and staged examples.

The common envelope deliberately does not make arbitrary domain payloads supported. Each health record family must receive a type-specific contract and validation before its data can be treated as normalized GoreeCloud Health input. The current `exercise.session` contract deliberately accepts an empty payload only and requires a positive-duration interval; exercise classification/details remain ungoverned rather than inferred. Active-time values are accepted only as explicit source-provided durations; they are not inferred from intensity, steps, energy, exercise, or other records. Sleep stages are optional source detail rather than inferred classifications, and stage gaps are not filled. Activity-intensity intervals do not authorize active-time totals, weighted intensity-minute calculations, or other aggregate semantics.

## Android activity and sleep interoperability boundary

Health Connect currently exposes a feature-gated activity-intensity record with positive start/end interval semantics and moderate/vigorous classification, plus separate aggregate duration and intensity-minute metrics. Health Connect sleep sessions can carry optional nested stage intervals. GoreeCloud Health mirrors only those bounded source shapes where explicitly modeled; the provider-neutral `activity.active-time` contract does not claim a Health Connect source mapping. The repository does not yet contain a Health Connect adapter, feature check, runtime permission request, provider mapping, aggregate query, or record ingestion path.

A future Android adapter must preserve source-native record identity and provenance, verify platform feature availability where applicable, request only the exact governed permissions, and remain blocked until the applicable Privacy Shield operation-level authorization and runtime acceptance are established.

## Reconciliation boundary

The machine-readable reconciliation policy recognizes exact same-source re-observation only when trustworthy `source_id` plus `source_record_id` are available. It forbids heuristic deduplication when source-native identity is absent, forbids treating cross-source time/value equality as identity, keeps cross-source aggregation and conflict resolution unauthorized, and requires explicit lifecycle supersession for replacement/correction.

This boundary prevents future clients from silently manufacturing multi-source totals or choosing a winning source before domain-specific rules are governed. Valid active-energy, active-time, activity-intensity, and sleep-session records from different sources are therefore not automatically summed, merged, selected, or converted into user-facing totals. Nested sleep stages inherit the parent session's source/provenance; this contract does not create independent stage-level cross-source identity or reconciliation. Positive aggregation, source-priority, conflict-resolution, sleep scoring, or derived-value semantics remain separate work.

No health contract, reconciliation policy, or Privacy Shield source manifest is a permission grant. Real ingestion, persistence, synchronization, aggregation, or derived use remains blocked on applicable Privacy Shield operation-level authorization and runtime acceptance plus the other required GoreeCloud integration/acceptance gates.
