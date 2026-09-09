# GoreeCloud Health Record Contract v1

## Status

**Development source contract.** This contract defines the bounded normalization envelope plus seven synthetic-only type contracts. It does not enable Health Connect, accept real health data, create persistence, authorize synchronization, or establish Privacy Shield, Wardveil Security, Everkeep, Identity, Mesh, Manager, GLAZE UI, Release Candidate, Stable, or production acceptance.

## Purpose

The contract gives GoreeCloud Health a stable, testable representation for record identity, observation time, source attribution, provenance, lifecycle state, units where applicable, and domain payload binding before any real health-data ingestion is introduced.

## Current type contracts

- `activity.steps` — count.
- `activity.distance` — meters (`m`).
- `exercise.session` — positive-duration interval; no exercise classification/detail payload is accepted yet.
- `sleep.session` — positive-duration interval; no stage payload is accepted yet.
- `heart.rate` — beats per minute (`bpm`).
- `body.weight` — kilograms (`kg`).
- `hydration.water` — milliliters (`mL`).

Every corresponding repository example is explicitly synthetic. Exercise classification/details beyond the bounded session contract, active time/energy, sleep-stage, additional vital/body, broader nutrition, and wellbeing contracts remain open.

## Trust boundary

Schema availability is not data-processing authorization. Before GoreeCloud Health can read or persist real user health information, applicable Privacy Shield purpose/consent/minimization/retention/export/deletion/revocation/derived-use rules and platform permission requirements must be implemented and accepted. Health Connect remains unintegrated.

## Required invariants

1. **Stable record identity.** `record_id` is an exact bounded opaque identifier; callers do not trim or normalize alternate spellings into the same record identity.
2. **Explicit record type.** Domain payloads bind to a namespaced `record_type`. The common envelope alone does not make an arbitrary payload accepted.
3. **Time context is preserved.** Records retain offset-aware time plus time-zone and UTC-offset context; session types can impose stricter positive-duration requirements.
4. **Source attribution is preserved.** Every record names a source and source kind; source-native record identity is retained when available.
5. **Provenance is explicit.** Ingest method, observation time, and transformation state are recorded.
6. **Lifecycle is explicit.** Active, superseded, and deleted states are represented rather than silently erasing provenance.
7. **Units are type-governed.** Measurement types use a single canonical source-level unit in their normalized payload while source-unit transformation/provenance obligations remain explicit.
8. **Missing data stays missing.** No source contract authorizes synthetic estimates to be presented as measured values.
9. **Unknown fields fail closed** in governed envelope, source, and type payload boundaries.

## Deterministic reconciliation baseline

- Trustworthy `(source_id, source_record_id)` identifies exact re-observation of the same source-native record.
- Records from different sources are not treated as duplicates merely because time and value match.
- A record without `source_record_id` is not silently deduplicated by heuristic value/time equality.
- Replacements/corrections use explicit lifecycle/supersession semantics.
- Cross-source aggregation and domain-specific conflict resolution remain separate work and must be approved before multi-source totals or derived values are calculated.

## Current validation

`scripts/validate-health-record-contract.mjs` uses only repository-owned synthetic data. It validates nine schema/contract files, seven synthetic fixtures, shared record/source/provenance rules, type/unit boundaries, positive exercise/sleep session durations, bounded measurements, and fail-closed negative cases including rejection of ungoverned exercise payload fields.

This is source-level evidence only. It is not representative-device, runtime health-provider, privacy, security, recovery, production, or medical acceptance.
