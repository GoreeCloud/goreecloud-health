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
- `exercise-session.schema.json` preserves an optional namespaced source classification (`system`, `code`, optional `label`) while keeping an empty session payload valid. The code is deliberately opaque: the core contract does not declare provider-specific codes equivalent or map them into a GoreeCloud category.
- `sleep-session.schema.json` preserves a stage-less positive-duration session while optionally accepting nested source stage intervals. Stages share parent source/provenance and remain bounded/contained; gaps are allowed.
- `health-reconciliation-policy.v1.json` defines the fail-closed baseline for exactly the ten current record types. Exercise classifications and sleep stages remain nested session details rather than separate record types.
- All corresponding files under `contracts/examples/` are repository-owned synthetic validation data only; exercise and sleep each retain an absence-of-detail fixture plus a source-detail fixture.

The common envelope deliberately does not make arbitrary domain payloads supported. Each health record family must receive a type-specific contract and validation before its data can be treated as normalized GoreeCloud Health input. An exercise source-classification code can be retained without being interpreted as a GoreeCloud cross-provider activity type. Sleep stages are optional source detail rather than inferred classifications. Activity/energy/time/intensity source contracts likewise do not authorize derived totals or provider ingestion.

## Android activity, exercise, and sleep interoperability boundary

Current Health Connect exercise sessions require an exercise type and expose a large provider-specific taxonomy. GoreeCloud Health does not import that taxonomy as canonical GoreeCloud semantics; an adapter may instead preserve an exact provider code in the namespaced `source_classification` carrier. Current Health Connect sleep sessions can carry optional nested stage intervals. These interoperability references do not create a provider adapter, feature check, runtime permission request, aggregate query, or ingestion path.

A future Android adapter must preserve source-native record identity and provenance, retain provider-specific classification semantics, request only the exact governed permissions, and remain blocked until the applicable Privacy Shield operation-level authorization and runtime acceptance are established. A separate mapping layer must be governed before provider exercise codes can be treated as equivalent GoreeCloud categories.

## Reconciliation boundary

The machine-readable reconciliation policy recognizes exact same-source re-observation only when trustworthy `source_id` plus `source_record_id` are available. It forbids heuristic deduplication when source-native identity is absent, forbids treating cross-source time/value/classification equality as identity, keeps cross-source aggregation and conflict resolution unauthorized, and requires explicit lifecycle supersession for replacement/correction.

Matching exercise labels or codes across different classification systems do not imply equivalence. Nested exercise classification and sleep-stage details inherit the parent session source/provenance; this contract does not create independent detail-level cross-source identity or reconciliation. Positive aggregation, source-priority, cross-provider classification mapping, conflict-resolution, sleep scoring, or derived-value semantics remain separate work.

No health contract, reconciliation policy, or Privacy Shield source manifest is a permission grant. Real ingestion, persistence, synchronization, aggregation, mapping, or derived use remains blocked on applicable Privacy Shield operation-level authorization and runtime acceptance plus the other required GoreeCloud integration/acceptance gates.
