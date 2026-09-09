# GoreeCloud Health — Security

## Current boundary

The foundation does not intentionally collect, persist, synchronize, or transmit real health records. No health-data API, account sign-in, Health Connect permission flow, or production backend exists in this repository yet.

## Security requirements for future health-data work

Before real health data is accepted, implementation must address at least:

- GoreeCloud Identity authentication/authorization and device/session boundaries where accounts are used.
- Privacy Shield purpose, consent, minimization, lifecycle, export, and deletion authorization.
- Wardveil Security integration appropriate to the exact data flows without unsupported protection claims.
- Encryption and key-management architecture approved for the relevant platform and storage boundary.
- Least-privilege Android permissions and Health Connect access.
- Provenance and integrity for imported/synchronized health records.
- Secure local persistence, transport, API authorization, replay/idempotency, logging minimization, and secret handling.
- Everkeep-aligned backup/restore/recovery requirements for any durable server-side health state.
- Security and privacy testing for failure, revocation, offline, migration, export, deletion, and recovery paths.

## Reporting

Do not place credentials, private keys, tokens, health records, or other sensitive personal information in GitHub issues, pull requests, repository files, screenshots, or logs.

## Claims

No `Protected by Wardveil`, production Privacy Shield acceptance, encryption certification, medical compliance, or other security/privacy certification is claimed by the foundation.
