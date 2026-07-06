---
id: CRM-CTT-01
feature_set: CRM-CTT
dominio: CRM
entidade: Contato
prioridade: P1
mvp: true
data_model_ref: data-models/contatos.md#contato
endpoints:
  - POST /api/v1/contatos
error_codes:
  - VALIDATION_ERROR
  - CONTATO_EMAIL_DUPLICADO
  - AUTH_FORBIDDEN
depende_de: []
servicenow: STRY0010001
status: especificado
---

# Cadastrar Contato
> **Nível 3** - Feature Set: Contatos — Domínio: CRM - `CRM-CTT-01`
> **Prioridade**: P1 · **MVP**: sim

## Descrição
Cria um novo contato na organização do usuário, garantindo e-mail único entre contatos ativos.

---

## Origem

| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| `STRY0010001` | Criação | Operador cadastra contato; sistema impede e-mail duplicado |

---

## Superfície

**Tela própria** — rota `/contatos/novo`

---

## Regras de negócio

1. O e-mail é único entre contatos ativos da mesma organização.
2. Nome completo e e-mail são obrigatórios.
3. Apenas perfis Administrador e Agente podem cadastrar.

---

## Cenários

```gherkin
Feature: Cadastrar Contato

  Background:
    Given que o usuário está autenticado na organização "Acme"
    And tem perfil "Agente"

  # ── Caminho feliz ──────────────────────────────────────────────
  Scenario: Cadastro com dados válidos
    Given que não existe contato ativo com e-mail "ana@acme.com"
    When o usuário preenche "Nome completo" com "Ana Lima" e "E-mail" com "ana@acme.com"
    And clica em "Salvar"
    Then o contato é criado
    And o sistema exibe: "Registro salvo com sucesso."

  # ── Erros de validação ─────────────────────────────────────────
  Scenario: Nome completo ausente
    When o usuário deixa "Nome completo" vazio e clica em "Salvar"
    Then o sistema exibe abaixo do campo: "Campo obrigatório."

  Scenario: E-mail com formato inválido
    When o usuário preenche "E-mail" com "ana@@acme"
    Then o sistema exibe abaixo do campo: "Formato inválido."

  # ── Conflitos com dados existentes ─────────────────────────────
  Scenario: E-mail já cadastrado
    Given que já existe contato ativo com e-mail "ana@acme.com"
    When o usuário tenta salvar outro contato com "ana@acme.com"
    Then o sistema exibe: "Já existe um contato com este e-mail."

  # ── Restrições de acesso ───────────────────────────────────────
  Scenario: Perfil sem permissão
    Given que o usuário tem perfil "Visualizador"
    When o usuário tenta cadastrar um contato
    Then o sistema exibe: "Você não tem permissão para esta ação."

  # ── Estados especiais ──────────────────────────────────────────
  Scenario: Reuso de e-mail de contato excluído
    Given que existe contato com e-mail "ana@acme.com" marcado como excluído
    When o usuário cadastra um contato com "ana@acme.com"
    Then o contato é criado normalmente
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome completo | texto | sim | → ver FIELD-DICTIONARY: nome de pessoa |
| E-mail | texto | sim | → ver FIELD-DICTIONARY: email; único entre ativos da organização |
| Telefone | texto | não | formato nacional |
| Empresa | texto | não | até 120 caracteres |
| Tipo | lista (Cliente, Fornecedor, Parceiro) | sim | default: Cliente |
| Observações | texto | não | livre |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Organização | organização do usuário autenticado | no salvamento |
| Data de criação | data/hora atual | no salvamento |

---

## Comportamento de tela

### Onde fica
Formulário em página própria (`/contatos/novo`).

### Estados da tela
| Estado | Comportamento |
|---|---|
| Loading | botão "Salvar" desabilitado com spinner |
| Erro de validação | mensagem abaixo de cada campo |
| Erro de servidor | toast genérico |
| Sucesso | toast "Registro salvo com sucesso." + redireciona para `/contatos` |

---

## Critérios de sucesso

| # | Critério mensurável | Origem |
|---|---|---|
| SC-01 | 95% dos cadastros válidos concluídos sem erro de servidor | cenário Caminho feliz |
| SC-02 | Nenhum e-mail duplicado entre contatos ativos | regra 1 |

---

## Métricas de tamanho

| Função de Transação | Tipo | ALR | DER | Complexidade | PF | Data |
|---|---|---|---|---|---|---|
| Cadastrar Contato | EE | 1 | 6 | Baixa | 3 | 2026-06-19 |

**Total: 3 PF**

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Entidade Contato

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────
  Scenario: Conflito de e-mail retorna 409
    When POST /api/v1/contatos com e-mail já existente entre ativos
    Then a resposta é HTTP 409 com code "CONTATO_EMAIL_DUPLICADO"
```

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `VALIDATION_ERROR` | 422 | (por campo, ver Cenários) |
| `CONTATO_EMAIL_DUPLICADO` | 409 | "Já existe um contato com este e-mail." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |

## API

### POST /api/v1/contatos
**Acesso**: autenticado — roles `admin`, `agente`

**Body**:
```typescript
{
  fullName: string        // Label PO: Nome completo — obrigatório
  email: string           // Label PO: E-mail — obrigatório
  phone?: string          // Label PO: Telefone
  company?: string        // Label PO: Empresa
  type: 'cliente' | 'fornecedor' | 'parceiro'  // default 'cliente'
  notes?: string          // Label PO: Observações
}
```

**Resposta de sucesso** — HTTP 201:
```json
{ "data": { "id": "uuid" }, "meta": null }
```

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 422 | `VALIDATION_ERROR` | campos inválidos |
| 409 | `CONTATO_EMAIL_DUPLICADO` | e-mail já ativo na organização |
| 403 | `AUTH_FORBIDDEN` | perfil sem permissão |

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `contato.criado` | após criação | `{ organizationId, contatoId }` | (nenhum no piloto) |

## AuditLog
→ ver NFR: AUD-01

```typescript
logAction({ organizationId, userId, action: 'contato.criado', targetEntity: 'Contato', targetId: contato.id, metadata: { email } })
```

## Arquivos a criar ou alterar

```
prisma/schema.prisma                 ← entidade Contato + enum contato_tipo
lib/validations/contato.ts           ← schema Zod de criação
lib/repositories/contato.repo.ts     ← acesso a dados
lib/services/contato.service.ts      ← regra de e-mail único
app/api/v1/contatos/route.ts         ← handler POST
app/(auth)/contatos/novo/page.tsx    ← formulário
```

## Dependências
- **Zod** — validação de entrada.

</div>

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| endpoint POST | crm-app | app/api/v1/contatos | `main` |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| 2026-06-19 | Claude | Feature criada | N3 completo (3A+3B) |
