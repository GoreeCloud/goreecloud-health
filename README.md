# GoreeCloud Health

GoreeCloud Health is the GoreeCloud personal health and wellness application. The product is being designed as an original GoreeCloud experience informed by the strengths of Samsung Health, Google Fit, Fitbit, and Apple Health without copying their proprietary interfaces or assets.

## Current status

**Lifecycle:** Development — Foundation

The current foundation introduces a responsive web application shell and an Android Jetpack Compose application shell. Both deliberately show empty/unconnected health state. The repository also contains a Development-only canonical health-record/source/provenance contract validated with synthetic data. This repository does **not** currently collect real health data, request Android Health Connect permissions, persist or synchronize health data, provide medical diagnosis, or claim accepted Privacy Shield, Wardveil Security, Everkeep, GoreeCloud Identity, Mesh, Manager, or Glaze UI consumer conformance.

## Initial platforms

- Web
- Android

## Current foundation capabilities

- Responsive Today dashboard shell with health-domain cards.
- Accessible empty-state and connection-status presentation.
- Web navigation for Today, Trends, Data, and Settings foundation surfaces.
- Android Compose Today screen with explicit unconnected-data state.
- Repository-level product, security, roadmap, branding, and platform-contract documentation.
- Versioned source-level `goreecloud.health.record.v1` envelope, source contract, first `activity.steps` payload contract, synthetic fixture, and fail-closed validation.

## Repository layout

- `apps/web/` — dependency-free responsive web foundation.
- `apps/android/` — native Android Jetpack Compose foundation.
- `contracts/` — Development health-record/source/type contracts and synthetic fixtures; no real user data.
- `docs/` — architecture, privacy, design-system adoption, and health-record contract records.
- `scripts/` — repository validation.

## Run the web foundation

```bash
python3 -m http.server 4173 -d apps/web
```

Then open `http://localhost:4173`.

## Validate the record contract

```bash
node scripts/validate-health-record-contract.mjs
```

This uses only repository-owned synthetic fixture data. Passing it does not establish Health Connect, privacy/security, recovery, runtime-provider, production, or Stable acceptance.

## Android development

The Android source targets Android 16 / API 36 and uses Kotlin with Jetpack Compose. A Gradle wrapper is not yet committed, so Android build reproducibility remains an open foundation task. See `apps/android/README.md` before attempting a build.

## Platform-system status

| System | Current repository status |
| --- | --- |
| Glaze UI 1.3.0 | Adoption required; no conformance claim yet |
| Privacy Shield | Planned; no health-data processing authority implemented |
| Wardveil Security | Planned; no protection claim |
| Everkeep | Planned; no recovery-readiness claim |
| GoreeCloud Identity | Planned |
| GoreeCloud Mesh | Planned |
| GoreeCloud Manager | Planned |

## Documentation

- [Specifications](SPECIFICATIONS.md)
- [Current features](FEATURES.md)
- [Feature roadmap](FEATURE-ROADMAP.md)
- [Benefits](BENEFITS.md)
- [Competitive objectives](COMPETITIVE-OBJECTIVES.md)
- [Branding](BRANDING.md)
- [User manual](USER-MANUAL.md)
- [Security](SECURITY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Health record contract](docs/HEALTH-RECORD-CONTRACT.md)
- [Privacy boundary](docs/PRIVACY.md)
- [Glaze UI adoption](docs/GLAZE-UI-ADOPTION.md)

## Release boundary

This foundation is not production-ready or Stable. Real health-data ingestion, storage, synchronization, permissions, account integration, privacy authorization, recovery, security, accessibility acceptance, and current Stable Glaze UI consumer acceptance require separate implementation and evidence before release claims are permitted.
