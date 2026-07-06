# Rastreabilidade: história → spec → código

A cadeia é rastreável de ponta a ponta por uma sequência de identificadores:

```text
História (ServiceNow STRYxxxxxxx)
   └─ N3 Feature (SIGLA-SFS-NN)   ← seção "Origem" do N3 guarda a chave da história
        └─ Código (commit/PR)     ← referencia ambos os IDs
```

## Os três elos

### História → N3

A chave do ServiceNow é registrada na seção `## Origem` de cada feature (com elo
recíproco em `_backlog/`). Cada **critério de aceite** é analisado e vira uma
**regra de negócio** (se for invariante), um **`## Cenário`** (Gherkin, se for
comportamento observável) ou **ambos** — rastreabilidade **semântica**, não apenas por ID.

### N3 → História (o caminho inverso)

A relação é **M:N** e fica registrada nos **três lugares**, que devem concordar:

1. **`## Origem`** do N3 — feature → histórias que a originaram/alteraram;
2. **`## Rastreabilidade — Features (N3) que realizam esta história`** em
   `_backlog/[chave].md` — história → features (é por aqui que se responde
   *"quais features esta história impactou?"*);
3. a linha do par na tabela consolidada do `modules/INDEX.md`.

Os elos são fechados **nos três lugares na mesma passada**: ao preencher a
`## Origem` no `PROMPT_3A` (feature nova) ou `PROMPT_4A` (alteração), o lado da
história e o `INDEX.md` são atualizados junto. Para verificar a consistência e
detectar **elos unilaterais** (registrados só de um lado), rode a auditoria
**AT** (`PROMPT_AUDIT_TRACE_LINKS`).

### N3 → código

A seção `## Implementação` do N3 guarda **repositório + caminho**, e a tabela de
rastreabilidade do `modules/INDEX.md` consolida o panorama.

### No git

Commits e PR seguem a convenção:

```text
tipo([SIGLA]-[SFS]-[NN]): [resumo] (ServiceNow [STRYxxxxxxx])
```

## A tabela consolidada

O `modules/INDEX.md` mantém a visão geral:

| História (ServiceNow) | Feature | Domínio | Status | PF | CFP | Repositórios |
|---|---|---|---|---|---|---|
| `STRYxxxxxxx` | `SIGLA-SFS-NN` | Domínio | 📋 Especificado | — | — | — |

## Legenda de status

| Ícone | Status | Descrição |
|---|---|---|
| 📋 | Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 | Em desenvolvimento | Implementação em andamento |
| ✅ | Implementado | Em produção, rastreabilidade preenchida |
| ⚠️ | Revisão necessária | Spec desatualizada em relação ao código |
| ❌ | Deprecado | Feature removida do sistema |

> **PF/CFP** são preenchidos após o `PROMPT_3B`; os critérios estão em
> `global/SIZING.md`. Os totais vigentes excluem features ❌ Deprecadas.
