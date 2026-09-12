# GoreeCloud Health — GLAZE UI Adoption

## Required target

Current authoritative shared target: **GLAZE UI V1.3 — Adaptive Resonance (`1.3.0`)**, Official Stable and consumer-eligible.

Canonical consumer entrypoints include `css/glaze-v1.3.0.css`, `js/glaze-v1.3.0.mjs`, the V1.3 contract, and the migration guidance in `GoreeCloud/goreecloud-glaze-ui`.

## Current implementation state

Status: **adoption required / unaccepted**.

The repository now pins the canonical Glaze source as the first-party `vendor/glaze-ui` git submodule at exact source revision `8354308445da9ac35ced2b37a7f503a08a0aaf72`. The web foundation loads that revision's canonical Stable `css/glaze-v1.3.0.css` entrypoint before its Health-specific composition stylesheet.

Health's web composition now consumes inherited Glaze tokens and foundation component classes for buttons, capsules, raised surfaces, focus behavior, spacing, radii, light/dark appearance, and accessibility degradation instead of redefining a parallel local material/color token system. CI checks out the submodule recursively, verifies the exact Glaze revision, verifies `VERSION` is `1.3.0`, and verifies the Stable web entrypoint exists.

This establishes a reproducible implementation anchor only. It does **not** establish GLAZE UI V1.3 consumer acceptance, production eligibility, or release approval.

The Android app remains a native Compose shell and has not completed a repository-local V1.3 native/platform implementation or acceptance path.

## Required acceptance work

- Validate the actual rendered web surface against the pinned Stable entrypoint.
- Complete repository-local interaction validation for keyboard, pointer, touch, focus, navigation, dialogs, and recovery behavior.
- Complete accessibility validation for names/roles/state, screen-reader behavior, 200% text/reflow, Reduced Motion, Reduced Transparency, Increased Contrast/Forced Colors where supported, and non-color state communication.
- Validate mobile, tablet, and desktop web geometry and responsive navigation.
- Define and implement the approved Glaze V1.3 native adapter/composition path for Android without replacing platform-native accessibility and interaction behavior.
- Validate Android phone/large-screen behavior on supported physical/emulated targets.
- Validate performance and graceful degradation for material effects.
- Record exact consumer source revision, repository-local evidence categories, verified rollback, and explicit production approval before marking the consumer accepted.
- Update the shared Glaze consumer registry only after the governed downstream acceptance process is complete.

## Truth-domain boundary

GLAZE UI governs presentation and interaction. It does not authorize health-data collection, ingestion, synchronization, aggregation, retention, or disclosure. Privacy Shield remains the privacy authority, and GoreeCloud Health's own contracts remain the authority for health workflow and record state.