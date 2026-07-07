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

### Aprovações no git (trailer `Approved-by`)

A aprovação de uma mudança de especificação fica registrada **no próprio git**, não
só no banco do GitHub — assim a trilha de auditoria migra junto com o repositório
(`git clone` leva tudo). Todo commit que **entra no branch principal** tocando
`modules/` ou `global/` carrega, no rodapé da mensagem, quem aprovou:

```text
docs(USR-CAD-02): editar cliente (ServiceNow STRY0012345)

Approved-by: Ana Prod Owner <ana@acme.com>
```

- **Merge via PR** — edite a mensagem do merge/squash commit na hora do merge;
- **mais de um aprovador** — um trailer por linha;
- a verificação é `node scripts/check-approval-trailers.mjs` (no CI, roda no push
  para a main sobre o intervalo enviado; em fluxo squash-merge, use `--all`).

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

## Gates determinísticos de integridade

A consistência dos elos deixou de ser só disciplina auditável: é **provada por
scripts** — no hook de gravação, sob demanda e no CI. A lógica mora nos scripts
(portáteis para qualquer forge); o estado que eles produzem fica **nos próprios
`.md`**, então a rastreabilidade migra inteira com um `git clone`.

### `audit-trace-links.mjs` — elos fechados nos três lugares

```bash
node scripts/audit-trace-links.mjs            # instância inteira (exit 1 se inconsistente)
node scripts/audit-trace-links.mjs --file <artefato.md>   # só os pares que tocam o artefato
```

Prova que cada par história↔feature está nos **três lugares** e acusa: elo
unilateral 🔴, par fora do INDEX 🟠, linha do INDEX sem respaldo, status
divergente 🟡 e referência quebrada ⚠️. Histórias ainda sem feature e features
sem `## Origem` (bottom-up/legado) são informativos ⚫ — não reprovam. O hook
`spec-guard` roda este gate a cada gravação de N3, história ou INDEX; é a
**prevenção** que o `PROMPT_AUDIT_TRACE_LINKS` (parte semântica) complementa.

### `suspect-links.mjs` — o outro lado mudou?

```bash
node scripts/suspect-links.mjs                # relatório (exit 1 se houver suspeito)
node scripts/suspect-links.mjs --stamp        # (re)carimba os elos verificados
node scripts/suspect-links.mjs --mark         # sinaliza ⚠️ no INDEX.md os pares suspeitos
```

Ao fechar/rever um elo, `--stamp` grava na seção do elo um carimbo invisível —
`<!-- trace-verified: STRY0012345 @ fingerprint -->` — com o **fingerprint do
conteúdo do artefato do outro lado** (ignorando os próprios carimbos). Se a
história mudar depois, todo N3 que a referencia fica **suspeito** até alguém
reverificar e re-carimbar (o `PROMPT_4A/4B` re-carimba ao atualizar). `--mark`
persiste o ⚠️ Revisão necessária no `INDEX.md`. É o "suspect link" das
ferramentas de gestão de requisitos, em texto plano.

### `build-trace-data.mjs` — o mapa visual sai dos artefatos

```bash
node scripts/build-trace-data.mjs -o docs/rastreabilidade/data.js
```

Gera o índice do [mapa de rastreabilidade](#/mapa-rastreabilidade) a partir dos
`.md` reais — nós (N0/domínios/feature sets/features/histórias/repositórios) e
arestas (`contem`, `origina`, `implementa`, `integra`), com status e PF vindos
do `INDEX.md`.

### No CI

O template `engine/templates/ci/spec-guard.yml` (copie para
`.github/workflows/` na instância) roda estrutura (`validate-doc`),
rastreabilidade (`audit-trace-links` + `suspect-links`) e aprovação
(`check-approval-trailers`) — com *branch protection* exigindo esses checks,
elo unilateral não entra na main.
