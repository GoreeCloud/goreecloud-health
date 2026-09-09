# GoreeCloud Health — GLAZE UI Adoption

## Required target

Current authoritative shared target: **GLAZE UI V1.3 — Adaptive Resonance (`1.3.0`)**, Official Stable and consumer-eligible.

Canonical consumer entrypoints include `css/glaze-v1.3.0.css`, `js/glaze-v1.3.0.mjs`, the V1.3 contract, and the migration guidance in `GoreeCloud/goreecloud-glaze-ui`.

## Foundation state

Status: **adoption required / unaccepted**.

The foundation web styling uses the V1.3 direction as design guidance: solid reading/decision surfaces, restrained translucent navigation/control surfaces, explicit focus, responsive composition, system light/dark appearance, reduced motion, reduced transparency, and non-color state text. It does not vendor/import the full canonical Stable asset stack yet and therefore does not claim V1.3 conformance.

The Android app is a native Compose shell and likewise has not completed a repository-local V1.3 native/platform acceptance path.

## Required acceptance work

- Consume the canonical current Stable assets/adapter path appropriate to each platform.
- Preserve application-specific Health composition without creating a competing local design language.
- Validate mobile/tablet/desktop web geometry and navigation.
- Validate Android phone/large-screen behavior on supported physical/emulated targets.
- Validate keyboard, pointer, touch, screen-reader semantics, 200% text/reflow, reduced motion, reduced transparency, increased contrast/forced colors where supported, and non-color state communication.
- Validate performance and graceful degradation for material effects.
- Record exact source revision and repository-local acceptance evidence before marking the consumer accepted.
