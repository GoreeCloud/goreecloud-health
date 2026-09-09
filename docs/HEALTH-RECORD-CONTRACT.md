# GoreeCloud Health Record Contract v1

## Status

**Development source contract.** This contract defines a bounded normalization envelope and the first type-specific synthetic activity-steps record. It does not enable Health Connect, accept real health data, create persistence, authorize synchronization, or establish Privacy Shield, Wardveil Security, Everkeep, Identity, Mesh, Manager, or Stable release acceptance.

## Purpose

The contract gives GoreeCloud Health a stable, testable representation for record identity, observation time, source attribution, provenance, lifecycle state, and domain payload binding before any real health-data ingestion is introduced.

The repository-controlled schemas are:

- `contracts/health-source.schema.json` — source identity and source-kind contract.
- `contracts/health-record-envelope.schema.json` — common record envelope.
- `contracts/activity-steps.schema.json` — first type-specific payload contract.
- `contracts/examples/activity-steps.synthetic.json` — synthetic validation fixture only.

## Trust boundary

Schema availability is not data-processing authorization. Before GoreeCloud Health can read or persist real user health information, applicable Privacy Shield purpose/consent/minimization/retention/export/deletion rules and platform permission requirements must be implemented and accepted. Health Connect remains unintegrated in this tranche.

## Required invariants

1. **Stable record identity.** `record_id` is an exact bounded opaque identifier; callers do not trim or normalize alternate spellings into the same record identity.
2. **Explicit record type.** Domain payloads bind to a namespaced `record_type`. The common envelope alone does not make an arbitrary payload accepted.
3. **Time context is preserved.** Records retain an offset-aware observation/interval time plus time-zone and UTC-offset context.
4. **Source attribution is preserved.** Every record names a source and source kind. A source-native record identifier is retained when available.
5. **Provenance is explicit.** Ingest method, observation time, and transformation state are recorded. Transformations must remain distinguishable from source-observed values.
6. **Lifecycle is explicit.** Active, superseded, and deleted states are represented instead of silently erasing provenance.
7. **Missing data stays missing.** The contract does not authorize synthetic estimates to be presented as measured values.
8. **Unknown fields fail closed** in the governed envelope, source, and first steps payload contract.

## Deterministic reconciliation baseline

The initial reconciliation policy is intentionally conservative:

- When a trustworthy `source_record_id` exists, the tuple `(source_id, source_record_id)` is the source-native identity used to detect exact re-observation of the same source record.
- Records from different sources are **not** treated as duplicates merely because time and value happen to match.
- A record without `source_record_id` is not silently deduplicated from another source by heuristic value/time equality.
- Replacements and corrections use explicit lifecycle/supersession semantics; provenance is not rewritten to hide the prior source record.
- Cross-source aggregation and domain-specific conflict resolution remain separate, type-specific work and must be approved before totals are calculated from multiple sources.

## Current validation

`scripts/validate-health-record-contract.mjs` performs deterministic repository validation using only synthetic data. It checks schema structure, contract identifiers, closed object boundaries, the synthetic steps fixture, interval ordering, identifier policy, source/provenance binding, and negative cases for unknown fields, missing provenance, negative step counts, and reversed intervals.

This validation is source-level evidence only. It is not representative-device, runtime health-provider, privacy, security, recovery, production, or medical acceptance.
