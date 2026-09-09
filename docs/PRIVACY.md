# GoreeCloud Health — Privacy Boundary

Health information is privacy-sensitive. The foundation therefore uses a **no real health-data** boundary: the interfaces display unconnected state and contain no health-data persistence, upload, telemetry, or account synchronization path.

## Privacy Shield source declaration

GoreeCloud Health now carries a repository-owned Privacy Shield Application Privacy Manifest v1 at `privacy/privacy-shield.application-manifest.json`, following `https://goreecloud.dev/schemas/privacy-shield/application-manifest/v1`.

The manifest is deliberately fail-closed: `purposes` and `resources` are both empty. It establishes application identity and a machine-validated source boundary only. It does **not** authorize real health-data processing, Health Connect access, persistence, synchronization, sharing, derived use, export, retention, deletion, recovery processing, or any Privacy Shield capability/production claim.

The repository does not declare a Privacy Shield adapter yet. Adapter capabilities must not be claimed before the authoritative Health runtime actually implements them and has the required runtime-specific acceptance evidence.

## Requirements before real data

Before real data is enabled, GoreeCloud Health must define and implement Privacy Shield authorization for each material operation, including source connection, ingestion, local processing where governed, synchronization, derived insights, sharing, export, retention, deletion, and recovery effects.

Principles:

- Prefer local-first and minimized processing where practical.
- Request only the health-data permissions required for enabled features.
- Keep purpose, scope, source, retention, destination, and revocation understandable.
- Do not collect raw health records merely to populate platform dashboards or observability systems.
- Keep logs and diagnostics free of health payloads by default.
- Treat revocation and deletion as real lifecycle operations, not presentation toggles.
- Preserve Privacy Shield as privacy authority; authentication alone does not authorize a health-data use.
- Keep operating-system permission authority with the operating system and application data-handling authority with GoreeCloud Health.

Any future non-empty purpose or resource declaration requires a separately governed change tied to the actual implemented operation, least-privilege permissions, data lifecycle, validation, and applicable Privacy Shield acceptance boundary.

No Privacy Shield runtime acceptance or health-data processing authority is claimed by this foundation.
