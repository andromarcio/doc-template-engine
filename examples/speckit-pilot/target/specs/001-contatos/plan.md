<!-- GERADO por PROMPT_SPECKIT_EXPORT. Technical Context copiado do MASTER.md. -->
# Implementation Plan: Contatos

**Branch**: `001-contatos` | **Date**: 2026-06-19 | **Spec**: ./spec.md

**Input**: Feature specification from `./spec.md`

## Summary

Feature Set Contatos (CRM-CTT): cadastrar, pesquisar e excluir contatos com e-mail
único por organização, paginação por cursor e exclusão lógica. Stack Next.js 14 +
Prisma + PostgreSQL; validação com Zod; isolamento multitenant por `organizationId`.

## Technical Context

**Language/Version**: TypeScript 5.x (Node 20)

**Primary Dependencies**: Next.js 14, Prisma 5, Zod

**Storage**: PostgreSQL 16

**Testing**: Vitest (unit/integration) + Playwright (e2e)

**Target Platform**: Linux server (container)

**Project Type**: web (frontend + backend no mesmo app Next.js)

**Performance Goals**: p95 < 300ms nas leituras (NFR DES-01)

**Constraints**: SSO corporativo (NFR SEG-01); multitenant por `organizationId`

**Scale/Scope**: ~50 usuários internos; 1 Feature Set, 3 features

## Constitution Check

*GATE: deve passar antes do design e ser reverificado depois.*

- [x] I. Envelope de resposta padronizado
- [x] II. Nunca expor PK interna (uuid de negócio)
- [x] III. Exclusão lógica (soft delete)
- [x] IV. Isolamento por organização em toda query
- [x] V. Validação no backend (Zod)
- [x] VI. Códigos de erro só do ERROR-DICTIONARY
- [x] VII. Auditoria de criar/excluir (AUD-01)
- [x] VIII. Estados obrigatórios de tela

## Project Structure

### Documentation (this feature)

```text
specs/001-contatos/
├── plan.md
├── spec.md
├── data-model.md
├── contracts/
│   ├── post-contatos.md
│   ├── get-contatos.md
│   └── delete-contato.md
├── quickstart.md
└── tasks.md   # gerado pelo /speckit.tasks (NÃO criado aqui)
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma            # Contato + enum contato_tipo
└── migrations/

src/
├── lib/
│   ├── validations/contato.ts        # schemas Zod
│   ├── repositories/contato.repo.ts  # acesso a dados (isolamento + soft delete)
│   └── services/contato.service.ts   # regras (e-mail único, vínculo)
├── app/api/v1/contatos/route.ts      # POST (criar), GET (listar)
├── app/api/v1/contatos/[id]/route.ts # DELETE
└── app/(auth)/contatos/
    ├── page.tsx                      # lista + busca
    └── novo/page.tsx                 # formulário

tests/
├── integration/contatos.api.test.ts
└── e2e/contatos.spec.ts
```

**Structure Decision**: app único Next.js (web) com camadas validations → repositories
→ services → route handlers; UI no App Router.

## Complexity Tracking

*Sem violações da constituição a justificar.*
