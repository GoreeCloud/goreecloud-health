# GoreeCloud Health — Feature Roadmap

**Lifecycle:** Active planned work. Planned items remain implementation obligations until verified or explicitly dispositioned in authoritative GoreeCloud records.

## Foundation — repository and product shell

Status: **In progress**

- Establish governed repository structure and mandatory documentation.
- Establish responsive web foundation.
- Establish native Android Compose foundation.
- Establish exact current Stable GLAZE UI V1.3 consumer-adoption path and repository-local acceptance evidence.
- Establish official GoreeCloud Health branding/icon through the canonical branding-assets repository.
- Add reproducible Android Gradle wrapper/build validation.
- Add web and Android automated accessibility/regression checks.

## Phase 1 — trusted local health data

Status: **In progress**

- **Implemented:** canonical `goreecloud.health.record.v1` envelope, source/provenance schema, conservative reconciliation baseline, and synthetic validation foundation.
- **Implemented source contracts:** `activity.steps`, `activity.distance`, `sleep.session`, `heart.rate`, `body.weight`, and `hydration.water`, including canonical source-level units where applicable.
- Expand type-specific normalized contracts for workouts/exercise sessions, active time/energy, sleep stages, additional vitals, additional body measurements, broader nutrition, and supported wellbeing records.
- Govern domain-specific reconciliation and aggregation rules on top of the conservative baseline that forbids silent cross-source deduplication by matching value/time alone.
- Implement Privacy Shield health-data purpose, consent, minimization, retention, export, deletion, revocation, and derived-use boundaries.
- Integrate Android Health Connect with least-privilege, user-visible permissions only after the Privacy Shield boundary is accepted.
- Read supported activity, exercise, sleep, heart, and body measurements locally.
- Add local encrypted persistence appropriate to the accepted platform security/privacy model.
- Implement data-source management and permission revocation flows.
- Add manual entry only for supported user-authored records.

## Phase 2 — daily experience and wellness domains

Status: **Planned**

- Today summary and customizable health cards.
- Activity, workouts, sleep, heart, body, nutrition, hydration, and mindfulness areas.
- Goals and streaks with transparent calculation rules.
- Trends across day/week/month/year windows.
- Accessible data visualizations and non-visual equivalents.
- Search/filter across supported health records.
- Reminders and notifications with explicit user control.

## Phase 3 — account and synchronization

Status: **Planned**

- GoreeCloud Identity authentication, authorization, device, and session integration.
- Health API with explicit scopes, purpose limitation, and source provenance.
- End-to-end synchronization model with conflict resolution and offline support.
- Privacy Shield runtime authorization for each server-side data use.
- Wardveil security controls and evidence without overstating protection.
- Everkeep backup, restore, export, portability, and recovery verification.
- Minimized GoreeCloud Mesh coordination where justified.
- GoreeCloud Manager health/service status appropriate to its authority.

## Phase 4 — insights and ecosystem expansion

Status: **Planned**

- Personal summaries and explainable wellness insights.
- User-controlled coaching/planning features with clear medical-safety boundaries.
- Wearable/device integrations where authoritative APIs and permissions allow.
- Import/export formats and migration tooling.
- Optional sharing workflows with granular scopes, expiration, revocation, and auditability.
- Additional GoreeCloud form factors after Android/web acceptance.

## Release gates

No production/Stable claim until the supported platform set has verified current implementation, Privacy Shield, Wardveil Security, Everkeep, current Stable GLAZE UI consumer acceptance, accessibility, recovery, security/privacy, and exact-revision release evidence as applicable.
