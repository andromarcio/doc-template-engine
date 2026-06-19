---
id: CRM-CTT-02
feature_set: CRM-CTT
dominio: CRM
entidade: Contato
prioridade: P2
mvp: false
data_model_ref: data-models/contatos.md#contato
endpoints:
  - GET /api/v1/contatos
error_codes:
  - AUTH_UNAUTHENTICATED
depende_de:
  - CRM-CTT-01
servicenow: STRY0010002
status: especificado
---

# Pesquisar Contato
> **Nível 3** - Feature Set: Contatos — Domínio: CRM - `CRM-CTT-02`
> **Prioridade**: P2 · **MVP**: não

## Descrição
Lista os contatos ativos da organização, com filtro por nome/e-mail/tipo e paginação.

---

## Origem

| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| `STRY0010002` | Criação | Operador localiza contatos por nome, e-mail ou tipo |

---

## Superfície

**Tela própria** — rota `/contatos`

---

## Regras de negócio

1. Lista apenas contatos ativos (não excluídos) da organização do usuário.
2. A busca por texto casa parcialmente nome ou e-mail.

---

## Cenários

```gherkin
Feature: Pesquisar Contato

  Background:
    Given que o usuário está autenticado na organização "Acme"

  # ── Caminho feliz ──────────────────────────────────────────────
  Scenario: Listagem inicial
    Given que existem 12 contatos ativos
    When o usuário abre a tela de Contatos
    Then o sistema exibe a primeira página com até 10 contatos
    And exibe o total de registros

  Scenario: Filtro por texto
    Given que existe contato "Ana Lima"
    When o usuário busca por "ana"
    Then a lista mostra "Ana Lima"

  # ── Erros de validação ─────────────────────────────────────────
  Scenario: Cursor inválido
    When o usuário envia um cursor de paginação malformado
    Then o sistema ignora o cursor e retorna a primeira página

  # ── Conflitos com dados existentes ─────────────────────────────
  Scenario: Busca sem resultados
    When o usuário busca por "inexistente"
    Then o sistema exibe o estado vazio "Nenhum contato encontrado."

  # ── Restrições de acesso ───────────────────────────────────────
  Scenario: Não autenticado
    Given que o usuário não está autenticado
    When tenta acessar a lista
    Then o sistema responde com acesso negado

  # ── Estados especiais ──────────────────────────────────────────
  Scenario: Contatos de outra organização não aparecem
    Given que existem contatos da organização "Globex"
    When o usuário da "Acme" lista contatos
    Then nenhum contato da "Globex" aparece
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Busca | texto | não | casa nome ou e-mail parcialmente |
| Tipo (filtro) | lista (Cliente, Fornecedor, Parceiro) | não | filtro por seleção |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Organização | organização do usuário | sempre (filtro implícito) |

---

## Comportamento de tela

### Onde fica
Tabela em página própria (`/contatos`) com campo de busca e filtro de tipo.

### Estados da tela
| Estado | Comportamento |
|---|---|
| Loading | skeleton de 5 linhas |
| Empty state | "Nenhum contato encontrado." |
| Erro de servidor | toast genérico com retry |
| Sucesso | tabela populada + paginação |

---

## Critérios de sucesso

| # | Critério mensurável | Origem |
|---|---|---|
| SC-01 | Listagem responde em p95 < 300ms com 10k registros | → ver NFR: DES-01 |
| SC-02 | 0% de vazamento de contatos entre organizações | cenário Estados especiais |

---

## Métricas de tamanho

| Função de Transação | Tipo | ALR | DER | Complexidade | PF | Data |
|---|---|---|---|---|---|---|
| Pesquisar Contato | CE | 1 | 8 | Baixa | 3 | 2026-06-19 |

**Total: 3 PF**

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Entidade Contato

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────
  Scenario: Paginação por cursor
    When GET /api/v1/contatos?cursor=<opaco>
    Then a resposta traz meta.nextCursor quando há mais páginas
```

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `AUTH_UNAUTHENTICATED` | 401 | (redireciona ao login) |

## API

### GET /api/v1/contatos
**Acesso**: autenticado — qualquer perfil

**Query params**:
```typescript
{
  search?: string        // casa fullName ou email
  type?: 'cliente' | 'fornecedor' | 'parceiro'
  cursor?: string        // paginação opaca
}
```

**Resposta de sucesso** — HTTP 200:
```json
{ "data": [{ "id": "uuid", "fullName": "Ana Lima", "email": "ana@acme.com", "type": "cliente" }],
  "meta": { "total": 12, "nextCursor": "...", "prevCursor": null } }
```

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 401 | `AUTH_UNAUTHENTICATED` | token ausente/inválido |

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| (nenhum) | — | — | — |

## AuditLog
Não se aplica (leitura).

## Arquivos a criar ou alterar

```
lib/repositories/contato.repo.ts     ← query paginada com filtros
app/api/v1/contatos/route.ts         ← handler GET (lista)
app/(auth)/contatos/page.tsx         ← tabela + busca
```

## Dependências
- nenhuma além das já listadas no Cadastrar.

</div>

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| endpoint GET | crm-app | app/api/v1/contatos | `main` |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| 2026-06-19 | Claude | Feature criada | N3 completo (3A+3B) |
