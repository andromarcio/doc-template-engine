# MASTER.md — Piloto Contatos
> Contexto global do projeto-exemplo usado para validar a ponte N3 → spec-kit.

---

## Identificação do sistema

- **Nome**: CRM Contatos (piloto)
- **Descrição**: Cadastro e consulta de contatos de uma organização.
- **Versão atual**: 0.1.0
- **Repositório de docs**: este diretório (`examples/speckit-pilot/docs`)

---

## Stack técnica

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Design System próprio (`.dsc-*`)
- **Backend**: Next.js Route Handlers (API), TypeScript
- **Banco de dados**: PostgreSQL 16 (via Prisma)
- **Autenticação**: SSO corporativo (token de sessão)
- **Fila / Jobs**: não se aplica neste piloto
- **Storage**: não se aplica
- **E-mail**: não se aplica
- **Integrações externas**: nenhuma

---

## Technical Context (normalizado para exportação ao spec-kit)

| Campo (spec-kit) | Valor |
|---|---|
| Language/Version | TypeScript 5.x (Node 20) |
| Primary Dependencies | Next.js 14, Prisma 5, Zod |
| Storage | PostgreSQL 16 |
| Testing | Vitest (unit/integration) + Playwright (e2e) |
| Target Platform | Linux server (container) |
| Project Type | web (frontend + backend no mesmo app Next.js) |
| Performance Goals | `→ ver NFR: DES-01` (p95 < 300ms nas leituras) |
| Constraints | `→ ver NFR: SEG-01` (SSO), multitenant por `organizationId` |
| Scale/Scope | ~50 usuários internos; 1 Feature Set, 3 features |

---

## Identificadores únicos (IDs)

| Nível | Formato | Exemplo |
|---|---|---|
| Domínio (N1) | `[SIGLA]` | `CRM` |
| Feature Set (N2) | `[SIGLA]-[SFS]` | `CRM-CTT` |
| Feature (N3) | `[SIGLA]-[SFS]-[NN]` | `CRM-CTT-01` |

---

## Nomenclatura de campos — três camadas

| Camada | Convenção | Exemplo | Fonte de verdade |
|---|---|---|---|
| Label PO | Português, title case | `Nome completo` | N3 |
| Label Dev | camelCase, inglês | `fullName` | `data-models/contatos.md` |
| Campo banco | snake_case | `full_name` | `data-models/contatos.md` |

---

## Campos globais obrigatórios em toda tabela

| Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|
| id | id | uuid | PK; gerada automaticamente |
| organizationId | organization_id | uuid | FK; isolamento multitenant |
| createdAt | created_at | timestamptz | Gerado automaticamente |
| updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| deletedAt | deleted_at | timestamptz | Soft delete; null = ativo |

---

## Decisões transversais

1. **Exclusão**: lógica (soft delete via `deletedAt`).
2. **IDs em URLs**: o `id` (uuid) é a chave usada nas rotas `/:id`; PK interna nunca exposta além do uuid.
3. **Paginação**: cursor-based (`cursor`, `nextCursor`, `total`).
4. **Validação**: no frontend e no backend (Zod) — nunca só no client.
5. **Auditoria**: ações de escrita (criar, excluir) registradas em log de auditoria (AUD-01).
6. **Eventos internos**: chamadas diretas neste piloto (sem mensageria).

---

## Padrão de resposta de API

```typescript
// Sucesso com dado único
{ "data": { ...objeto }, "meta": null }
// Sucesso com lista
{ "data": [...], "meta": { "total": 0, "nextCursor": null, "prevCursor": null } }
// Erro
{ "data": null, "error": { "code": "CONTATO_ERRO", "message": "...", "details": [] } }
```

---

## O que NUNCA fazer

- Expor identificador interno (PK) além do uuid de negócio.
- Retornar senhas ou tokens em respostas.
- Lançar exceções cruas — sempre o envelope de erro padronizado.
- Duplicar Label Dev ou campo banco nos N3 — vivem só em `data-models/`.
- Query sem filtro `organization_id` + `deleted_at IS NULL`.
