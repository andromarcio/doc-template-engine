---
id: CRM-CTT-03
feature_set: CRM-CTT
dominio: CRM
entidade: Contato
prioridade: P3
mvp: false
data_model_ref: data-models/contatos.md#contato
endpoints:
  - DELETE /api/v1/contatos/{id}
error_codes:
  - CONTATO_NOT_FOUND
  - CONTATO_VINCULADO
  - AUTH_FORBIDDEN
depende_de:
  - CRM-CTT-01
servicenow: STRY0010003
status: especificado
---

# Excluir Contato
> **Nível 3** - Feature Set: Contatos — Domínio: CRM - `CRM-CTT-03`
> **Prioridade**: P3 · **MVP**: não

## Descrição
Exclui logicamente um contato, desde que não esteja vinculado a outros registros.

---

## Origem

| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| `STRY0010003` | Criação | Administrador remove contato; sistema impede remoção de vinculado |

---

## Superfície

**Ação em tela** — origem: Lista de Contatos (`/contatos`), ícone na linha + modal de confirmação

---

## Regras de negócio

1. A exclusão é lógica (marca como excluído, mantém o registro).
2. Contato vinculado a um negócio não pode ser excluído.
3. Apenas o perfil Administrador pode excluir.

---

## Cenários

```gherkin
Feature: Excluir Contato

  Background:
    Given que o usuário está autenticado na organização "Acme"
    And tem perfil "Administrador"

  # ── Caminho feliz ──────────────────────────────────────────────
  Scenario: Exclusão confirmada
    Given que existe o contato "Ana Lima" sem vínculos
    When o usuário confirma a exclusão
    Then o contato é marcado como excluído
    And o sistema exibe: "Registro excluído com sucesso."

  # ── Erros de validação ─────────────────────────────────────────
  Scenario: Confirmação cancelada
    When o usuário abre o modal e clica em "Cancelar"
    Then nada é excluído

  # ── Conflitos com dados existentes ─────────────────────────────
  Scenario: Contato vinculado
    Given que "Ana Lima" está vinculada a um negócio
    When o usuário tenta excluir
    Then o sistema exibe: "Este contato está vinculado e não pode ser excluído."

  # ── Restrições de acesso ───────────────────────────────────────
  Scenario: Perfil sem permissão
    Given que o usuário tem perfil "Agente"
    When tenta excluir um contato
    Then o sistema exibe: "Você não tem permissão para esta ação."

  # ── Estados especiais ──────────────────────────────────────────
  Scenario: Contato já excluído
    Given que "Ana Lima" já está excluída
    When o usuário tenta excluí-la novamente
    Then o sistema responde que o contato não existe
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Contato | identificação (somente leitura) | sim | registro selecionado na lista |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Data de exclusão | data/hora atual | na confirmação |

---

## Comportamento de tela

### Onde fica
Ícone de exclusão na linha da Lista de Contatos + modal de confirmação.

### Estados da tela
| Estado | Comportamento |
|---|---|
| Loading | botão "Excluir" do modal com spinner |
| Erro de servidor | toast genérico |
| Sucesso | toast "Registro excluído com sucesso." + remove a linha |

---

## Critérios de sucesso

| # | Critério mensurável | Origem |
|---|---|---|
| SC-01 | 100% das exclusões de contatos vinculados são bloqueadas | regra 2 |

---

## Métricas de tamanho

| Função de Transação | Tipo | ALR | DER | Complexidade | PF | Data |
|---|---|---|---|---|---|---|
| Excluir Contato | EE | 2 | 2 | Baixa | 3 | 2026-06-19 |

**Total: 3 PF**

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Entidade Contato

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────
  Scenario: Vínculo retorna 409
    When DELETE /api/v1/contatos/{id} de contato vinculado
    Then a resposta é HTTP 409 com code "CONTATO_VINCULADO"
```

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `CONTATO_NOT_FOUND` | 404 | "Contato não encontrado." |
| `CONTATO_VINCULADO` | 409 | "Este contato está vinculado e não pode ser excluído." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |

## API

### DELETE /api/v1/contatos/{id}
**Acesso**: autenticado — role `admin`

**Resposta de sucesso** — HTTP 204 (sem corpo)

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 404 | `CONTATO_NOT_FOUND` | contato inexistente ou de outra organização |
| 409 | `CONTATO_VINCULADO` | possui vínculo com negócio |
| 403 | `AUTH_FORBIDDEN` | perfil sem permissão |

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `contato.excluido` | após exclusão lógica | `{ organizationId, contatoId }` | (nenhum no piloto) |

## AuditLog
→ ver NFR: AUD-01

```typescript
logAction({ organizationId, userId, action: 'contato.excluido', targetEntity: 'Contato', targetId: contato.id, metadata: {} })
```

## Arquivos a criar ou alterar

```
lib/repositories/contato.repo.ts     ← softDelete + checagem de vínculo
lib/services/contato.service.ts      ← regra de vínculo
app/api/v1/contatos/[id]/route.ts    ← handler DELETE
components/contatos/DeleteModal.tsx   ← modal de confirmação
```

## Dependências
- nenhuma além das já listadas.

</div>

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| endpoint DELETE | crm-app | app/api/v1/contatos/[id] | `main` |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| 2026-06-19 | Claude | Feature criada | N3 completo (3A+3B) |
