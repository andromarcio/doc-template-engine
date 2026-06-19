<!-- GERADO por PROMPT_SPECKIT_EXPORT resolvendo docs/global/data-models/contatos.md. -->
# Data Model: Contatos

## Entity: Contato (`contatos`)

| Label PO | Field (dev) | DB column | Type | Constraints |
|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | NOT NULL |
| E-mail | email | email | varchar(255) | NOT NULL; unique per org (active) |
| Telefone | phone | phone | varchar(20) | NULL |
| Empresa | company | company | varchar(120) | NULL |
| Tipo | type | type | enum contato_tipo | NOT NULL; default 'cliente' |
| Observações | notes | notes | text | NULL |

### Global fields (every table)
`id` uuid PK · `organizationId`/`organization_id` uuid FK ·
`createdAt`/`created_at` timestamptz · `updatedAt`/`updated_at` timestamptz ·
`deletedAt`/`deleted_at` timestamptz (soft delete; null = active).

### Enum
`contato_tipo = { 'cliente', 'fornecedor', 'parceiro' }` (PO: Cliente / Fornecedor / Parceiro).

### Indexes & uniqueness
- `UNIQUE (organization_id, email) WHERE deleted_at IS NULL`
- `INDEX (organization_id, full_name)`

### Relationships
- `Contato` may be referenced by `Negocio` (out of scope) via `contato_id`. Deletion
  checks this link → error `CONTATO_VINCULADO`.

### Validation (from FIELD-DICTIONARY, resolved)
- **fullName**: 2+ palavras, apenas letras, title case.
- **email**: formato RFC 5322; único entre ativos da organização.
- **phone**: formato nacional (opcional).
