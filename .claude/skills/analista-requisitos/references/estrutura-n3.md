# Estrutura do N3 — Template de Referência

Este arquivo define a estrutura completa de um artefato N3 (Feature),
incluindo seções negociais e técnicas.

---

## Front-matter (metadados machine-readable)

Todo N3 abre com um bloco YAML que **espelha**, de forma parseável, informações que
já estão no corpo. Serve à exportação determinística para o spec-kit
(`PROMPT_SPECKIT_EXPORT`) — o corpo continua sendo a fonte de verdade legível.

```yaml
---
id: [SIGLA]-[SFS]-[NN]
feature_set: [SIGLA]-[SFS]
dominio: [SIGLA]
entidade: [Entidade principal]
prioridade: [P1 | P2 | P3]          # P1 = MVP; ordena as user stories no spec.md
mvp: [true | false]
data_model_ref: data-models/[dominio].md#[entidade]
endpoints: []                       # preenchido no 3B (espelha ## API)
error_codes: []                     # preenchido no 3B (espelha ## Mapeamento de erros)
depende_de: []                      # IDs de N3 pré-requisito (ordena fases no spec-kit)
servicenow: [STRYxxxxxxx]
status: rascunho                    # rascunho | especificado | em-desenvolvimento | implementado | deprecado
---
```

- `prioridade` é coletada no **3A**; `endpoints`/`error_codes`/`data_model_ref` são
  completados no **3B**. O `PASSO 0` do exporter valida a sincronia front-matter ↔ corpo.
- `status: especificado` (3B aprovado) é pré-requisito para exportar.

---

## Seções negociais (sempre visíveis)

```markdown
# [Nome da Feature]
> **Nível 3** - Feature Set: [Nome do Feature Set] — Domínio: [Nome do Domínio] - `[ID do N2]`
> **Prioridade**: [P1 | P2 | P3] · **MVP**: [sim | não]

## Descrição
[uma frase em linguagem de negócio]

---

## Superfície

**[Tela própria | Ação em tela]** — [rota ou feature/tela de origem]

---

## Regras de negócio

1. [Regra específica desta feature]
2. [Regra canônica] → ver RULES-DICTIONARY: [nome] (parâmetro: [valor])
3. [Regra de domínio] → ver N1 [Domínio]: Regras transversais do domínio: [N]

---

## Cenários

# ← FIELD-DICTIONARY: [nome do campo] (importar cenários de validação)
# ← RULES-DICTIONARY: [nome da regra] (importar cenários)

# ── Caminho feliz ──────────────────────────────────────────────

Scenario: [descrição]
  Given [estado inicial]
  When [ação]
  Then [resultado]

# ── Erros de validação ─────────────────────────────────────────

Scenario: [descrição]
  ...

# ── Conflitos com dados existentes ─────────────────────────────

Scenario: [descrição]
  ...

# ── Restrições de acesso ───────────────────────────────────────

Scenario: [descrição]
  ...

# ── Estados especiais ──────────────────────────────────────────

Scenario: [descrição]
  ...

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| [nome em português] | [tipo] | sim/não/automático | [regra em linguagem natural] |
| [campo canônico] | [tipo] | [obrig.] | → ver FIELD-DICTIONARY: [nome] |

---

## Campos automáticos

| Label PO | Valor | Quando |
|---|---|---|
| [campo] | [valor automático] | [quando é preenchido] |

---

## Comportamento de tela

[onde aparece, comportamento durante processamento, retorno visual
de sucesso e erros — seguir padrão do Design System]

---

## Critérios de sucesso

| # | Critério mensurável | Origem |
|---|---|---|
| SC-01 | [resultado observável e medível, agnóstico de tecnologia] | [cenário / → ver NFR: [ID] / negócio] |
```

> **Mapeamento de cenários → spec.md** (na exportação): "Caminho feliz" + "Erros de
> validação" viram *Acceptance Scenarios*; "Conflitos com dados existentes" + "Estados
> especiais" viram *Edge Cases*; "Restrições de acesso" viram cenários + princípio de
> autorização na *constitution*. Os "Critérios de sucesso" viram *Success Criteria (SC-###)*.

## Seções técnicas (dentro de `dev-only`)

```markdown
<div class="dev-only">

## Mapeamento de campos
→ ver data-models/[dominio].md: [Entidade]

## Cenários técnicos

# ── Comportamento técnico ──────────────────────────────────────

Scenario: [descrição técnica — cookies, headers, HTTP status, jobs]
  Given [contexto técnico]
  When [chamada técnica]
  Then [resultado técnico com status codes]

## Mapeamento de erros
→ ver ERROR-DICTIONARY: [CODIGO]

## API

### [VERBO] /[rota]

**Body:**
```json
{ "campo": "valor" }
```

**Response 201:**
```json
{ "id": "uuid", "campo": "valor" }
```

**Erros:**
| Código | HTTP | Condição |
|---|---|---|
| [CODIGO] | [status] | [quando ocorre] |

## Eventos publicados

| Evento | Payload | Quando |
|---|---|---|
| [nome.do.evento] | `{ campo }` | [condição] |

## Eventos consumidos

| Evento | Origem | Ação |
|---|---|---|
| [nome.do.evento] | [serviço] | [o que faz] |

## AuditLog

| Ação | Dados registrados |
|---|---|
| [ACAO] | [campos salvos no log] |

## Arquivos a criar ou alterar

| Arquivo | Ação | Descrição |
|---|---|---|
| [caminho] | criar/alterar | [o que fazer] |

## Dependências

| Dependência | Tipo | Motivo |
|---|---|---|
| [serviço/lib] | [runtime/dev] | [por quê] |

</div>
```

## Seção de rastreabilidade (sempre visível, preenchida após implementação)

```markdown
---

## Rastreabilidade

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| [componente] | [repo] | [path] | [branch] |

**Status:** `[ ] Especificado · [ ] Em desenvolvimento · [ ] Implementado · [ ] Deprecado`

---

## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| [data] | [autor] | Feature criada | N3 gerado |
```

---

## Convenção de visibilidade

Seções negociais ficam **fora** da tag `dev-only`. Seções técnicas ficam **dentro**.

```html
<!-- Negocial — visível para todos -->
## Seção de negócio

<div class="dev-only">
<!-- Técnico — apenas para devs -->
## Seção técnica
</div>
```
