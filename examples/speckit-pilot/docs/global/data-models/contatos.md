# data-model — Domínio CRM · Contatos
> Fonte de verdade de Label Dev e campo banco. N3 referencia, nunca duplica.

## Entidade: Contato (`contatos`)

| Label PO | Label Dev | Campo banco | Tipo SQL | Constraints |
|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | NOT NULL |
| E-mail | email | email | varchar(255) | NOT NULL; único por organização (ativos) |
| Telefone | phone | phone | varchar(20) | NULL |
| Empresa | company | company | varchar(120) | NULL |
| Tipo | type | type | contato_tipo (enum) | NOT NULL; default 'cliente' |
| Observações | notes | notes | text | NULL |

### Campos globais (implícitos — ver MASTER.md)
`id` (uuid, PK) · `organizationId`/`organization_id` (uuid, FK) ·
`createdAt`/`created_at` · `updatedAt`/`updated_at` · `deletedAt`/`deleted_at` (soft delete).

### Enum

```
contato_tipo = { 'cliente', 'fornecedor', 'parceiro' }
```
Label PO: Cliente / Fornecedor / Parceiro.

### Índices e unicidade

- `UNIQUE (organization_id, email) WHERE deleted_at IS NULL` — e-mail único por organização entre ativos.
- `INDEX (organization_id, full_name)` — suporte à pesquisa por nome.

### Relacionamentos

- `Contato` pode ser referenciado por `Negocio` (fora do escopo deste piloto) via `contato_id`.
  Exclusão verifica esse vínculo (→ erro `CONTATO_VINCULADO`).

### APF — Funções de Dados

| Arquivo lógico | Tipo | RLR | DER | Complexidade | PF |
|---|---|---|---|---|---|
| Contato | ALI | 1 | 6 | Baixa | 7 |
