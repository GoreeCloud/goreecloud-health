# GoreeCloud Health Record Contract v1

## Status

**Development source contract.** This contract defines the bounded normalization envelope plus eight synthetic-only type contracts and a fail-closed machine-readable reconciliation policy. It does not enable Health Connect, accept real health data, create persistence, authorize synchronization, or establish Privacy Shield, Wardveil Security, Everkeep, Identity, Mesh, Manager, GLAZE UI, Release Candidate, Stable, or production acceptance.

## Purpose

The contract gives GoreeCloud Health a stable, testable representation for record identity, observation time, source attribution, provenance, lifecycle state, units where applicable, domain payload binding, and conservative reconciliation before any real health-data ingestion is introduced.

## Current type contracts

- `activity.steps` — count.
- `activity.distance` — meters (`m`).
- `activity.active-energy` — active energy excluding basal energy, represented over a positive-duration interval in kilocalories (`kcal`), bounded to `0..1000000`.
- `exercise.session` — positive-duration interval; no exercise classification/detail payload is accepted yet.
- `sleep.session` — positive-duration interval; no stage payload is accepted yet.
- `heart.rate` — beats per minute (`bpm`).
- `body.weight` — kilograms (`kg`).
- `hydration.water` — milliliters (`mL`).

Every corresponding repository example is explicitly synthetic. The active-energy contract does not calculate, estimate, ingest, or aggregate a user's energy; it only defines accepted normalized source-level shape and bounds. Active time, exercise classification/details beyond the bounded session contract, sleep-stage, additional vital/body, broader nutrition, and wellbeing contracts remain open.

## Trust boundary

Schema and reconciliation-policy availability is not data-processing authorization. Before GoreeCloud Health can read or persist real user health information, applicable Privacy Shield purpose/consent/minimization/retention/export/deletion/revocation/derived-use rules and platform permission requirements must be implemented and accepted. Health Connect remains unintegrated.

## Required invariants

1. **Stable record identity.** `record_id` is an exact bounded opaque identifier; callers do not trim or normalize alternate spellings into the same record identity.
2. **Explicit record type.** Domain payloads bind to a namespaced `record_type`. The common envelope alone does not make an arbitrary payload accepted.
3. **Time context is preserved.** Records retain offset-aware time plus time-zone and UTC-offset context; session and interval measurement types can impose stricter positive-duration requirements.
4. **Source attribution is preserved.** Every record names a source and source kind; source-native record identity is retained when available.
5. **Provenance is explicit.** Ingest method, observation time, and transformation state are recorded.
6. **Lifecycle is explicit.** Active, superseded, and deleted states are represented rather than silently erasing provenance.
7. **Units are type-governed.** Measurement types use a single canonical source-level unit in their normalized payload while source-unit transformation/provenance obligations remain explicit.
8. **Missing data stays missing.** No source contract authorizes synthetic estimates to be presented as measured values.
9. **Unknown fields fail closed** in governed envelope, source, type-payload, and reconciliation-policy boundaries.

## Deterministic reconciliation policy

`contracts/health-reconciliation-policy.v1.json` makes the current conservative baseline machine-readable and fail-closed for exactly the eight current source-contract types.

- Trustworthy `(source_id, source_record_id)` identifies exact re-observation of the same source-native record.
- A record without `source_record_id` is not silently deduplicated by heuristic value/time equality.
- Records from different sources are not treated as duplicates merely because time and value match.
- Cross-source aggregation remains explicitly unauthorized.
- Cross-source conflict resolution remains explicitly unauthorized.
- Replacements/corrections use explicit lifecycle/supersession semantics only.

This policy deliberately does not invent domain-specific aggregation or conflict semantics. In particular, multiple active-energy records are not summed across sources merely because each source contract is valid. A future rule that combines, prefers, suppresses, or derives values across sources requires a separately governed policy change, type-specific semantics, and validation before use.

## Current validation

`scripts/validate-health-record-contract.mjs` uses only repository-owned synthetic data and source declarations. It validates ten schema/contract files, eight synthetic fixtures, the reconciliation policy, shared record/source/provenance rules, type/unit boundaries, positive active-energy/exercise/sleep intervals, bounded measurements, and fail-closed negative cases. Active-energy negative tests reject a non-`kcal` unit, zero-duration interval, and value above the current bound. Reconciliation-policy negative tests reject enabling cross-source aggregation and reject silently expanding the policy to an ungoverned record type.

This is source-level evidence only. It is not representative-device, runtime health-provider, privacy, security, recovery, production, or medical acceptance.
