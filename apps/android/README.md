# GoreeCloud Health Android Foundation

Native Android foundation using Kotlin and Jetpack Compose.

## Current boundary

- No Health Connect dependency or permissions are enabled yet.
- No health data is collected, stored, synchronized, or transmitted.
- Current GLAZE UI V1.3 native consumer acceptance is pending.
- No production APK/AAB claim is made.

## Development prerequisites

- Android Studio / Android SDK 36
- JDK 17
- A compatible Gradle installation (a repository Gradle wrapper remains a roadmap item)

From `apps/android` with a compatible Gradle installation:

```bash
gradle :app:assembleDebug
```

The dependency/toolchain versions in this first foundation require an actual CI/local build before they may be treated as accepted build evidence.
