# GoreeCloud Health — Specifications

## Product role

GoreeCloud Health is a personal health and wellness application for the GoreeCloud ecosystem. Initial product targets are web and Android. The intended experience combines health data organization, activity and wellness tracking, trends, goals, and user-controlled data management in an original GoreeCloud interface.

## Lifecycle

**Development — Foundation / trusted-record source work.** Current runtime implementation is still limited to web and Android presentation shells with no real health-data ingestion or cloud persistence. A bounded canonical health-record/source/provenance contract is now implemented at source level and validated only with synthetic data.

## Architectural baseline

The repository is a monorepo with platform-specific applications:

- `apps/web` — responsive web client.
- `apps/android` — native Kotlin/Jetpack Compose client.
- `contracts` — repository-controlled health normalization contracts and synthetic fixtures; these do not create data-processing authority.
- A shared backend/API is **not implemented** in the foundation. It will be introduced only when identity, privacy, security, data-lifecycle, and recovery requirements are defined and accepted.

The preferred long-term direction is local-first processing where practical, with server synchronization limited to declared, authorized purposes.

## Health record contract

The current Development contract uses schema version `goreecloud.health.record.v1` and separates common record-envelope semantics from type-specific payload semantics.

The common envelope requires:

- exact stable record identity;
- namespaced record type;
- offset-aware start/observation timing with time-zone and UTC-offset context;
- explicit source identity and source kind;
- provenance including ingest method, observation time, and transformation state;
- explicit active/superseded/deleted lifecycle state; and
- a payload that must be accepted by a type-specific contract before that record type is considered supported.

The first type-specific contract is `activity.steps`. It exists solely as a Development source contract and synthetic validation fixture. No Health Connect or real user record is read by this implementation.

Initial reconciliation is deliberately conservative: trustworthy `(source_id, source_record_id)` identifies an exact source-native record when available; records from different sources are not silently deduplicated because time/value match; and cross-source aggregation/conflict resolution requires separately governed domain-specific rules.

## Planned health domains

The product roadmap covers these health-domain families, each requiring source provenance and appropriate user controls before real data is accepted:

- Activity and exercise: steps, distance, active time, workouts, energy expenditure.
- Sleep: sessions, duration, schedule, stages where supported by the authoritative source.
- Heart and vitals: heart rate and other supported measurements without inventing unavailable readings.
- Body measurements: weight and supported body metrics.
- Nutrition and hydration.
- Goals, trends, summaries, and wellness insights.
- Mindfulness and user-entered wellbeing records where explicitly supported.

## Data-source principles

1. Every measurement must preserve its source/provenance.
2. Missing data remains missing; the application must not synthesize health readings and present them as measured.
3. Duplicate records from multiple sources require deterministic reconciliation rather than silent double counting.
4. Time zone, unit, precision, and source semantics must be retained or transformed explicitly.
5. Android Health Connect is the first planned device health-data integration, gated by Privacy Shield authorization and explicit Android permission handling.
6. Web cloud access is not enabled until identity, authorization, privacy, security, recovery, and API contracts are implemented and verified.
7. Schema validity is not authorization to collect, retain, disclose, synchronize, aggregate, or interpret health information.

## Medical-safety boundary

GoreeCloud Health is initially a wellness and personal health-information product, not a diagnostic or emergency medical service. It must not fabricate diagnoses, replace professional care, or present unsupported clinical certainty. Any future clinical, regulated-device, health-record, or medical-provider capability requires its own legal, privacy, security, provenance, and product acceptance review.

## User experience

- Current Stable shared design target: GLAZE UI V1.3 / `1.3.0`.
- Foundation surfaces follow the material hierarchy and accessibility direction but do not yet claim repository-local V1.3 consumer acceptance.
- Mobile, tablet, and desktop compositions must be purpose-built rather than simple scale variants.
- Important meaning must not rely on color alone.
- Reduced motion, reduced transparency, increased contrast, keyboard/focus, and assistive-technology behavior are release requirements.

## GoreeCloud platform systems

All seven integral systems are applicable to the long-term product. Current status is deliberately conservative:

- GoreeCloud Manager — planned operational/administrative integration.
- Privacy Shield — required before real health-data processing/synchronization; currently planned.
- Wardveil Security — required security integration; currently planned with no protection claim.
- Everkeep — required continuity, export, restore, and recovery assurance; currently planned.
- Glaze UI — current target 1.3.0; adoption required and unaccepted locally.
- GoreeCloud Mesh — planned minimized coordination/evidence transport only.
- GoreeCloud Identity — planned account, authentication, authorization, device, and session authority.

## Acceptance boundary

A feature is not considered implemented merely because it appears in this specification or roadmap. Current implementation truth is recorded in `FEATURES.md`; planned work is recorded in `FEATURE-ROADMAP.md`. The source-level health-record contract is not runtime provider, privacy, security, persistence, synchronization, recovery, production, or Stable acceptance.
