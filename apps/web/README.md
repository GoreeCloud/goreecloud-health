# GoreeCloud Health Web Foundation

This responsive development shell intentionally contains no health-data backend, account authentication, persistence, analytics, or health-data telemetry.

The web foundation now consumes the canonical **GLAZE UI V1.3 / 1.3.0** Stable stylesheet from the repository-pinned `vendor/glaze-ui` submodule. The submodule is pinned to exact Glaze source revision `8354308445da9ac35ced2b37a7f503a08a0aaf72`; this is an implementation anchor, not consumer acceptance evidence.

Clone with submodules (or initialize them after cloning), then serve from the repository root so the pinned Glaze asset path is available:

```bash
git submodule update --init --recursive
python3 -m http.server 4173
```

Open `http://localhost:4173/apps/web/`.

Current GLAZE UI consumer status remains **adoption-required / unaccepted**. Rendered, interaction, accessibility, responsive, performance, rollback, Android/native, and product acceptance evidence still must be completed before any V1.3 conformance claim. See `../../docs/GLAZE-UI-ADOPTION.md`.