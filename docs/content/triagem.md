# Triagem: descobrir o que já existe

Uma necessidade pode chegar de inúmeras formas — uma ideia, uma reunião, um bug,
uma mudança regulatória, uma história do ServiceNow — e tanto **de cima para
baixo** quanto **de baixo para cima**. Antes de especificar, é preciso saber se
ela **já está documentada**: a necessidade se resolve **alterando** algo que
existe, ou é caso de **criar** algo novo?

## `PROMPT_TRIAGEM` (opção **TR**)

É a **porta de entrada leve** para isso. Ele:

1. Recebe a necessidade em **texto livre**.
2. **Lê o que já está documentado** — `modules/INDEX.md` e a árvore `modules/`
   (direto do repositório no Claude Code, ou colado no fluxo copy-paste/CLI).
3. Devolve um **relatório de triagem**: o que existe sobre o assunto e a **rota
   recomendada** para cada parte da necessidade.

## Rotas recomendadas

| Rota | Quando | Encaminha para |
|---|---|---|
| **Criar** | não existe nada sobre o assunto | `3A` / `2A` / `1A` |
| **Alterar** | já existe e precisa mudar | `4A` / `4B` |
| **Lote** | o delta afeta muitos artefatos | `IV` → `EX` |
| **Registrar a história antes** | falta o intake | `HU` (`PROMPT_BACKLOG`) |

## O que a triagem NÃO faz

A triagem **não cria nem altera nada** — apenas **mostra e encaminha**. Para um
delta que afeta muitos artefatos de uma vez, ela própria direciona ao
`PROMPT_INVESTIGADOR`.

> Há um exemplo de saída em
> [`engine/prompts/examples/PROMPT_TRIAGEM_exemplo.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/examples/PROMPT_TRIAGEM_exemplo.md).

Próximo: [História de usuário](#/historia-usuario).
