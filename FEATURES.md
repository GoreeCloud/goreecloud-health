# GoreeCloud Health — Current Features

This document records **current repository functionality**, not the desired end state.

## Implemented in the foundation

- Responsive web application shell.
- Today overview with explicit unconnected state for Activity, Sleep, Heart, Body, Nutrition & Hydration, and Mindfulness domains.
- Web foundation navigation for Today, Trends, Data, and Settings.
- Accessible connection-information dialog that states connections are not enabled yet.
- Light/dark system appearance support plus reduced-motion and reduced-transparency fallbacks in the web shell.
- Native Android Jetpack Compose application shell.
- Android Today screen with explicit statement that Health Connect permissions are not requested by this foundation.
- Repository validation script for mandatory foundation records and key truth-boundary text.
- Privacy Shield Application Privacy Manifest v1 source declaration with empty `purposes` and `resources`, plus fail-closed validation that forbids source-level expansion without an explicit governed change.

## Implemented Development source contracts

- Versioned `goreecloud.health.record.v1` normalization envelope for stable record identity, time context, source attribution, provenance, lifecycle state, and a domain payload binding point.
- Closed `health-source.v1` source identity/source-kind contract.
- Type-specific schemas for `activity.steps`, `activity.distance`, `activity.active-energy`, `activity.active-time`, `activity.intensity`, `exercise.session`, `sleep.session`, `heart.rate`, `body.weight`, and `hydration.water`.
- `activity.active-energy` represents active energy excluding basal energy across a positive-duration interval, using canonical source-level unit `kcal` and a bounded value of `0..1000000`; the current implementation is contract/fixture validation only.
- `activity.active-time` represents a source-provided non-negative active duration in seconds within a required positive observation interval. Validation rejects an active duration longer than the observation interval. The contract does not define activity-detection semantics and does not derive active time from steps, energy, intensity, exercise, or other records.
- `activity.intensity` represents a positive-duration interval with exact `moderate` or `vigorous` source classification. It is compatible with the bounded semantics of Health Connect's feature-gated activity-intensity record, but no provider mapping, Health Connect feature check, permission request, aggregation, or intensity-minute calculation is implemented.
- `exercise.session` is currently a positive-duration session boundary with an intentionally empty payload; exercise classification/detail semantics are not inferred yet.
- `sleep.session` supports a positive-duration stage-less session and optional nested source-supported stages. Stage types are bounded to `unknown`, `awake`, `sleeping`, `out-of-bed`, `awake-in-bed`, `light`, `deep`, and `rem`; entries must be offset-aware, time-ordered, non-overlapping, and inside the parent session. Gaps are allowed so missing stage data stays missing.
- Canonical source-level units where applicable: distance in meters (`m`), active energy in kilocalories (`kcal`), active time in seconds (`s`), heart rate in beats per minute (`bpm`), body weight in kilograms (`kg`), and water volume in milliliters (`mL`).
- Synthetic-only fixtures for all ten currently supported source-contract types, including both stage-less and staged sleep examples; none are user health data.
- Fail-closed contract validation covering unknown fields, source/provenance boundaries, record identifiers, interval ordering/session duration, type-specific units, bounded measurement values, active-time interval/value consistency, activity-intensity classification/duration, and sleep-stage containment/order/overlap/type/timestamp boundaries.
- Machine-readable `goreecloud.health.reconciliation-policy.v1` in `contracts/health-reconciliation-policy.v1.json` covering exactly the ten current record types. Sleep stages remain nested session data rather than a separate record type.
- Reconciliation policy recognizes trustworthy same-source `(source_id, source_record_id)` re-observation, requires explicit lifecycle supersession for replacement, and keeps heuristic deduplication without source-native identity, cross-source value/time deduplication, cross-source aggregation, and cross-source conflict resolution explicitly unauthorized.
- Fail-closed reconciliation-policy validation rejects cross-source aggregation enablement and ungoverned record-type expansion.

The health-record contracts, reconciliation policy, and Privacy Shield source manifest are foundation boundaries only. They do **not** authorize or implement real health-data ingestion, persistence, synchronization, aggregation, diagnosis, medical interpretation, Privacy Shield runtime authorization, or production acceptance.

## Not implemented yet

- Android Health Connect read/write integration.
- Step/distance/active-energy/active-time/activity-intensity/exercise/sleep/heart/body/hydration ingestion from real user sources.
- User-facing active-time totals across records/sources, moderate/vigorous duration totals, weighted intensity-minute aggregation, or sleep-stage duration/quality analytics.
- Exercise classification/detail payloads beyond the bounded `exercise.session` interval contract.
- Type-specific normalized contracts for additional vitals, additional body measurements, broader nutrition, and wellbeing records.
- Positive domain-specific cross-source aggregation/conflict-resolution rules beyond the fail-closed reconciliation policy.
- Governed non-empty Privacy Shield health-data purposes/resources and operation-level authorization.
- Privacy Shield adapter capabilities or runtime acceptance.
- Manual health entry.
- Health goals and trend calculations.
- Real charts from user health data.
- GoreeCloud Identity sign-in.
- Cloud health API or synchronization.
- Multi-device merge/reconciliation.
- Wardveil runtime security integration.
- Everkeep backup/restore/recovery acceptance.
- GoreeCloud Mesh or Manager runtime integration.
- Accepted GLAZE UI V1.3 consumer evidence.
- Official GoreeCloud Health icon/visual asset.
- Production deployment or Android release artifact.
