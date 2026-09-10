# GoreeCloud Health — Specifications

## Product role

GoreeCloud Health is a personal health and wellness application for the GoreeCloud ecosystem. Initial product targets are web and Android. The intended experience combines health data organization, activity and wellness tracking, trends, goals, and user-controlled data management in an original GoreeCloud interface.

## Lifecycle

**Development — Foundation / trusted-record and privacy-source-boundary work.** Current runtime implementation is still limited to web and Android presentation shells with no real health-data ingestion or cloud persistence. Bounded canonical health-record/source/provenance and core measurement/session contracts are implemented at source level and validated only with synthetic data. A fail-closed reconciliation policy and Privacy Shield application manifest are also implemented at source level; neither grants runtime health-data processing authority.

## Architectural baseline

The repository is a monorepo with platform-specific applications:

- `apps/web` — responsive web client.
- `apps/android` — native Kotlin/Jetpack Compose client.
- `contracts` — repository-controlled health normalization contracts, reconciliation policy, and synthetic fixtures; these do not create data-processing authority.
- `privacy` — repository-controlled Privacy Shield source declarations; current manifest grants no health-data processing authority.
- A shared backend/API is **not implemented** in the foundation. It will be introduced only when identity, privacy, security, data-lifecycle, and recovery requirements are defined and accepted.

The preferred long-term direction is local-first processing where practical, with server synchronization limited to declared, authorized purposes.

## Health record contract

The current Development contract uses schema version `goreecloud.health.record.v1` and separates common record-envelope semantics from type-specific payload semantics.

The common envelope requires exact stable record identity, namespaced record type, offset-aware time context, explicit source identity/source kind, provenance, lifecycle state, and a payload accepted by a type-specific contract.

Current type-specific source contracts are:

- `activity.steps` — bounded non-negative step count.
- `activity.distance` — bounded distance using canonical source-level unit `m`.
- `exercise.session` — positive-duration exercise interval with a deliberately empty payload until governed exercise classification/detail semantics are defined.
- `sleep.session` — positive-duration sleep interval with a deliberately empty payload until governed stage semantics are defined.
- `heart.rate` — bounded integer measurement using canonical source-level unit `bpm`.
- `body.weight` — positive bounded measurement using canonical source-level unit `kg`.
- `hydration.water` — positive bounded water volume using canonical source-level unit `mL`.

All current fixtures are repository-owned synthetic records. No Health Connect or real user record is read by this implementation. Exercise classification/details beyond the session boundary plus active-time/energy, sleep-stage, additional vital/body, broader nutrition, and wellbeing contracts remain planned rather than inferred from these types.

## Reconciliation policy

The Development source contract includes `contracts/health-reconciliation-policy.v1.json` with schema version `goreecloud.health.reconciliation-policy.v1`. It applies exactly to the seven current record types and turns the current conservative reconciliation baseline into an explicit machine-readable policy.

Trustworthy `(source_id, source_record_id)` identifies exact same-source re-observation when source-native identity exists. Without `source_record_id`, heuristic value/time deduplication is unauthorized. Across different sources, matching value/time does not authorize deduplication, aggregation, or conflict resolution. Replacement/correction is explicit-supersession-only.

This is a refusal boundary, not a complete multi-source aggregation system. Any future rule that combines, prefers, suppresses, ranks, merges, or derives values across sources requires separately governed type/domain semantics and validation before use.

## Privacy Shield source boundary

The repository contains `privacy/privacy-shield.application-manifest.json`, a source declaration shaped to Privacy Shield Application Privacy Manifest v1 (`https://goreecloud.dev/schemas/privacy-shield/application-manifest/v1`). It declares the exact application identity `goreecloud-health` and display name `GoreeCloud Health`.

The current manifest has empty `purposes` and empty `resources`. This is intentional and fail-closed: no source connection, health record, Health Connect permission, local processing path, persistence path, synchronization path, sharing path, derived-use path, retention rule, deletion rule, export path, external processor, or destination is authorized by the manifest.

No Privacy Shield adapter capability is declared by GoreeCloud Health at this stage. Capability claims require actual Health runtime behavior plus runtime-specific acceptance evidence. Any future non-empty manifest purpose/resource declaration is a separately governed application-data-processing change and must remain tied to the implemented operation, least-privilege platform permissions, lifecycle rules, validation, and applicable runtime acceptance.

## Planned health domains

The product roadmap covers activity/exercise, sleep, heart/vitals, body measurements, nutrition/hydration, goals/trends, mindfulness, and supported user-authored wellbeing records. A domain is not considered runtime-supported merely because a source schema exists.

## Data-source principles

1. Every measurement must preserve its source/provenance.
2. Missing data remains missing; the application must not synthesize health readings and present them as measured.
3. Duplicate records from multiple sources require deterministic governed reconciliation rather than silent double counting.
4. The current reconciliation policy does not authorize cross-source aggregation or conflict resolution.
5. Time zone, unit, precision, and source semantics must be retained or transformed explicitly.
6. Canonical contract units are normalization targets, not permission to discard original source-unit provenance or precision.
7. Android Health Connect is the first planned device health-data integration, gated by Privacy Shield authorization and explicit Android permission handling.
8. Web cloud access is not enabled until identity, authorization, privacy, security, recovery, and API contracts are implemented and verified.
9. Schema, reconciliation-policy, or manifest validity is not authorization to collect, retain, disclose, synchronize, aggregate, interpret, or otherwise process health information beyond the declared and accepted operation.

## Medical-safety boundary

GoreeCloud Health is initially a wellness and personal health-information product, not a diagnostic or emergency medical service. It must not fabricate diagnoses, replace professional care, or present unsupported clinical certainty. Any future clinical, regulated-device, health-record, or medical-provider capability requires its own legal, privacy, security, provenance, and product acceptance review.

## User experience

- Current Stable shared design target: GLAZE UI V1.3 / `1.3.0`.
- Foundation surfaces follow the material hierarchy and accessibility direction but do not yet claim repository-local V1.3 consumer acceptance.
- Mobile, tablet, and desktop compositions must be purpose-built rather than simple scale variants.
- Important meaning must not rely on color alone.
- Reduced motion, reduced transparency, increased contrast, keyboard/focus, and assistive-technology behavior are release requirements.

## GoreeCloud platform systems

All seven integral systems are applicable to the long-term product. Current status remains deliberately conservative: Manager planned; Privacy Shield has a fail-closed source manifest but remains blocked for operation-level health-data processing and runtime acceptance; Wardveil Security blocked with no protection claim; Everkeep blocked with no recovery-readiness claim; Glaze UI 1.3.0 adoption required and unaccepted; Mesh planned only for minimized coordination/evidence; Identity planned for account/session authority.

## Acceptance boundary

A source contract, reconciliation policy, or source manifest is not a runtime feature or runtime acceptance. Current implementation truth is recorded in `FEATURES.md`; planned work is recorded in `FEATURE-ROADMAP.md`. These source artifacts are not runtime provider, privacy authorization, security, persistence, synchronization, recovery, medical, production, or Stable acceptance.
