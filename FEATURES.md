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
- Type-specific schemas for `activity.steps`, `activity.distance`, `activity.active-energy`, `exercise.session`, `sleep.session`, `heart.rate`, `body.weight`, and `hydration.water`.
- `activity.active-energy` represents active energy excluding basal energy across a positive-duration interval, using canonical source-level unit `kcal` and a bounded value of `0..1000000`; the current implementation is contract/fixture validation only.
- `exercise.session` is currently a positive-duration session boundary with an intentionally empty payload; exercise classification/detail semantics are not inferred yet.
- Canonical source-level units where applicable: distance in meters (`m`), active energy in kilocalories (`kcal`), heart rate in beats per minute (`bpm`), body weight in kilograms (`kg`), and water volume in milliliters (`mL`).
- Synthetic-only fixtures for all eight currently supported source-contract types; none are user health data.
- Fail-closed contract validation covering unknown fields, source/provenance boundaries, record identifiers, interval ordering/session duration, type-specific units, and bounded measurement values, including active-energy interval/unit/value rejection cases.
- Machine-readable `goreecloud.health.reconciliation-policy.v1` in `contracts/health-reconciliation-policy.v1.json` covering exactly the eight current record types.
- Reconciliation policy recognizes trustworthy same-source `(source_id, source_record_id)` re-observation, requires explicit lifecycle supersession for replacement, and keeps heuristic deduplication without source-native identity, cross-source value/time deduplication, cross-source aggregation, and cross-source conflict resolution explicitly unauthorized.
- Fail-closed reconciliation-policy validation rejects cross-source aggregation enablement and ungoverned record-type expansion.

The health-record contracts, reconciliation policy, and Privacy Shield source manifest are foundation boundaries only. They do **not** authorize or implement real health-data ingestion, persistence, synchronization, aggregation, diagnosis, medical interpretation, Privacy Shield runtime authorization, or production acceptance.

## Not implemented yet

- Android Health Connect read/write integration.
- Step/distance/active-energy/exercise/sleep/heart/body/hydration ingestion from real user sources.
- Active-time normalized contract beyond the new active-energy boundary.
- Exercise classification/detail payloads beyond the bounded `exercise.session` interval contract.
- Type-specific normalized contracts for sleep stages, additional vitals, additional body measurements, broader nutrition, and wellbeing records.
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
