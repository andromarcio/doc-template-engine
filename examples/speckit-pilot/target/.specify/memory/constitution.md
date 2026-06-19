<!--
  GERADO por PROMPT_SPECKIT_EXPORT a partir de:
  docs/global/MASTER.md, API-PATTERNS, NFR.md, DESIGN-SYSTEM.
  Cada princípio é um gate não-negociável para /plan e /implement.
-->
# CRM Contatos Constitution

## Core Principles

### I. Standard API response envelope (NON-NEGOTIABLE)
Every endpoint MUST return the standard envelope: `{ "data": ..., "meta": ... }` on
success and `{ "data": null, "error": { "code", "message", "details" } }` on error.
Errors MUST never surface as raw exceptions.
*Origem: MASTER.md (Padrão de resposta de API).*

### II. Never expose internal PK
URLs and responses MUST use the business uuid (`id`), never an internal sequential PK.
*Origem: MASTER.md (O que NUNCA fazer).*

### III. Logical deletion (soft delete)
Records are deleted by setting `deletedAt`; queries MUST filter `deleted_at IS NULL`.
Physical deletion is prohibited.
*Origem: MASTER.md (Decisões transversais).*

### IV. Organization isolation (multitenant)
Every query MUST filter by `organization_id` from the authenticated session. A record
from another organization MUST return 404.
*Origem: MASTER.md / NFR SEG-01.*

### V. Backend validation
All input MUST be validated on the backend (Zod), never trusting the client only.
*Origem: MASTER.md (Decisões transversais).*

### VI. Error codes from the dictionary
Only error codes defined in ERROR-DICTIONARY may be used: `VALIDATION_ERROR`,
`AUTH_UNAUTHENTICATED`, `AUTH_FORBIDDEN`, `CONTATO_NOT_FOUND`,
`CONTATO_EMAIL_DUPLICADO`, `CONTATO_VINCULADO`.
*Origem: ERROR-DICTIONARY.md.*

### VII. Audit of critical actions
Write actions (create, delete) MUST emit an audit log entry with `userId`, `action`,
`targetId`.
*Origem: NFR AUD-01.*

### VIII. Mandatory screen states
Every screen MUST implement loading, empty, error and success states.
*Origem: DESIGN-SYSTEM.md.*

## Additional Constraints

- **Stack**: TypeScript 5.x, Next.js 14, Prisma 5, PostgreSQL 16, Zod (see plan.md Technical Context).
- **Performance**: list endpoints p95 < 300ms (NFR DES-01).
- **Auth**: corporate SSO session token (NFR SEG-01).

## Governance

This constitution supersedes ad-hoc decisions. Any deviation MUST be justified in the
plan's Complexity Tracking. The source of truth for these principles is the engine's
`global/` artifacts; regenerate this file via `PROMPT_SPECKIT_EXPORT` when they change.

**Version**: 1.0.0 | **Ratified**: 2026-06-19 | **Last Amended**: 2026-06-19
