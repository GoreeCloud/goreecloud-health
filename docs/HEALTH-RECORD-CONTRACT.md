# GoreeCloud Health Record Contract v1

## Status

**Development source contract.** This contract defines the bounded normalization envelope plus ten synthetic-only type contracts and a fail-closed machine-readable reconciliation policy. It does not enable Health Connect, accept real health data, create persistence, authorize synchronization, or establish Privacy Shield, Wardveil Security, Everkeep, Identity, Mesh, Manager, GLAZE UI, Release Candidate, Stable, or production acceptance.

## Purpose

The contract gives GoreeCloud Health a stable, testable representation for record identity, observation time, source attribution, provenance, lifecycle state, units where applicable, domain payload binding, and conservative reconciliation before any real health-data ingestion is introduced.

## Current type contracts

- `activity.steps` — count.
- `activity.distance` — meters (`m`).
- `activity.active-energy` — active energy excluding basal energy, represented over a positive-duration interval in kilocalories (`kcal`), bounded to `0..1000000`.
- `activity.active-time` — source-provided active duration in seconds (`s`) within a positive observation interval; the active duration may be zero but cannot exceed the enclosing interval, and no activity-detection or derivation algorithm is implied.
- `activity.intensity` — positive-duration interval classified exactly as `moderate` or `vigorous`; this is a source-record boundary rather than a duration-total or weighted intensity-minute aggregate.
- `exercise.session` — positive-duration interval; an empty payload remains valid, or the session may preserve an optional namespaced source classification containing required `system` + opaque `code` and optional bounded `label`. This does not define a GoreeCloud cross-provider exercise taxonomy or claim code equivalence across systems.
- `sleep.session` — positive-duration interval; stage-less sessions remain valid, while optional nested source stages may use `unknown`, `awake`, `sleeping`, `out-of-bed`, `awake-in-bed`, `light`, `deep`, or `rem`. Stage entries inherit session source/provenance and must be offset-aware, time-ordered and non-overlapping, positive-duration, and inside the parent session. Gaps are valid and are not filled synthetically.
- `heart.rate` — beats per minute (`bpm`).
- `body.weight` — kilograms (`kg`).
- `hydration.water` — milliliters (`mL`).

Every corresponding repository example is explicitly synthetic. Exercise keeps both unclassified and source-classified examples; sleep keeps both stage-less and staged examples. The optional exercise source classification is preservation, not canonicalization: it retains source semantics while deferring GoreeCloud-level provider mapping. The activity and sleep source contracts likewise do not calculate, estimate, ingest, aggregate, score, or otherwise process a user's health data.

## Trust boundary

Schema and reconciliation-policy availability is not data-processing authorization. Before GoreeCloud Health can read or persist real user health information, applicable Privacy Shield purpose/consent/minimization/retention/export/deletion/revocation/derived-use rules and platform permission requirements must be implemented and accepted. Health Connect remains unintegrated.

## Required invariants

1. **Stable record identity.** `record_id` is an exact bounded opaque identifier; callers do not trim or normalize alternate spellings into the same record identity.
2. **Explicit record type.** Domain payloads bind to a namespaced `record_type`. The common envelope alone does not make an arbitrary payload accepted.
3. **Time context is preserved.** Records retain offset-aware time plus time-zone and UTC-offset context; session and interval measurement/classification types can impose stricter positive-duration requirements.
4. **Source attribution is preserved.** Every record names a source and source kind; source-native record identity is retained when available.
5. **Provenance is explicit.** Ingest method, observation time, and transformation state are recorded.
6. **Lifecycle is explicit.** Active, superseded, and deleted states are represented rather than silently erasing provenance.
7. **Units are type-governed.** Measurement types use a single canonical source-level unit in their normalized payload while source-unit transformation/provenance obligations remain explicit.
8. **Missing data stays missing.** No source contract authorizes synthetic estimates to be presented as measured values; missing exercise classification or sleep-stage detail remains absent.
9. **Unknown fields fail closed** in governed envelope, source, type-payload, nested detail, and reconciliation-policy boundaries.
10. **Exercise source classification is explicit and non-equivalent by default.** A classification system must be namespaced, its code is opaque/bounded, and matching codes or labels from different systems do not imply a shared GoreeCloud meaning.
11. **Bounded duration consistency.** `activity.active-time` requires a positive enclosing observation interval and rejects a source-provided active duration longer than that interval.
12. **Nested sleep-stage consistency.** Optional sleep stages are bounded to the parent session, have positive offset-aware intervals, are time-ordered and non-overlapping, and use only the governed stage vocabulary.

## Deterministic reconciliation policy

`contracts/health-reconciliation-policy.v1.json` makes the current conservative baseline machine-readable and fail-closed for exactly the ten current source-contract types.

- Trustworthy `(source_id, source_record_id)` identifies exact re-observation of the same source-native record.
- A record without `source_record_id` is not silently deduplicated by heuristic value/time equality.
- Records from different sources are not treated as duplicates merely because time, values, exercise codes/labels, or sleep-stage sequences match.
- Cross-source aggregation remains explicitly unauthorized.
- Cross-source conflict resolution remains explicitly unauthorized.
- Replacements/corrections use explicit lifecycle/supersession semantics only.
- Exercise source classification and sleep stages are nested details of their session records and do not become separately reconciled record families.

This policy deliberately does not invent domain-specific aggregation, semantic equivalence, or conflict semantics. A future rule that combines, maps, prefers, suppresses, aggregates, scores, or derives values across records or sources requires a separately governed policy change, type-specific semantics, and validation before use.

## Current validation

`scripts/validate-health-record-contract.mjs` uses only repository-owned synthetic data and source declarations. It validates twelve schema/contract files, twelve synthetic fixtures, the reconciliation policy, shared record/source/provenance rules, type/unit/classification boundaries, session/detail interval invariants, bounded measurements, and fail-closed negative cases. Exercise classification negative tests reject an unnamespaced system, empty/control-character code, oversized label, and unknown normalized-type field while the empty exercise payload remains valid. Sleep-stage negative tests reject unsupported stage values, zero-duration stages, stages outside the parent session, overlaps, missing UTC offsets, and unknown fields. Reconciliation-policy negative tests reject enabling cross-source aggregation and reject silently expanding the policy with a separate ungoverned `sleep.stage` record type.

This is source-level evidence only. It is not representative-device, runtime health-provider, privacy, security, recovery, production, or medical acceptance.
