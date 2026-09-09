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

## Implemented Development source contracts

- Versioned `goreecloud.health.record.v1` normalization envelope for stable record identity, time context, source attribution, provenance, lifecycle state, and a domain payload binding point.
- Closed `health-source.v1` source identity/source-kind contract.
- Type-specific schemas for `activity.steps`, `activity.distance`, `sleep.session`, `heart.rate`, `body.weight`, and `hydration.water`.
- Canonical source-level units where applicable: distance in meters (`m`), heart rate in beats per minute (`bpm`), body weight in kilograms (`kg`), and water volume in milliliters (`mL`).
- Synthetic-only fixtures for all six currently supported source-contract types; none are user health data.
- Fail-closed contract validation covering unknown fields, source/provenance boundaries, record identifiers, interval ordering/session duration, type-specific units, and bounded measurement values.
- Conservative reconciliation baseline that does not infer duplicates across different sources merely from matching values and times.

These contracts are source-level foundations only. They do **not** authorize or implement real health-data ingestion, persistence, synchronization, aggregation, diagnosis, or medical interpretation.

## Not implemented yet

- Android Health Connect read/write integration.
- Step/distance/sleep/heart/body/hydration ingestion from real user sources.
- Type-specific normalized contracts for workouts/exercise sessions, active time/energy, sleep stages, additional vitals, additional body measurements, broader nutrition, and wellbeing records.
- Approved cross-source aggregation/conflict-resolution rules beyond the conservative no-silent-deduplication baseline.
- Manual health entry.
- Health goals and trend calculations.
- Real charts from user health data.
- GoreeCloud Identity sign-in.
- Cloud health API or synchronization.
- Multi-device merge/reconciliation.
- Privacy Shield runtime authorization.
- Wardveil runtime security integration.
- Everkeep backup/restore/recovery acceptance.
- GoreeCloud Mesh or Manager runtime integration.
- Accepted GLAZE UI V1.3 consumer evidence.
- Official GoreeCloud Health icon/visual asset.
- Production deployment or Android release artifact.
