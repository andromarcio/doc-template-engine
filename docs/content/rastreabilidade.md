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
recíproco em `_backlog/`). Os **critérios de aceite** da história viram os
**`## Cenários`** (Gherkin) do N3 — rastreabilidade **semântica**, não apenas por ID.

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
