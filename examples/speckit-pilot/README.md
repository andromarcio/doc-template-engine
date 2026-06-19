# Piloto — Ponte N3 → spec-kit (CRUD Contatos)

Exemplo sintético, ponta a ponta, que valida a integração descrita em
`.claude/skills/analista-requisitos/references/speckit-export.md` e
`engine/prompts/PROMPT_SPECKIT_EXPORT.md`.

Mostra, lado a lado, a **especificação de entrada** (N3 + globais, no padrão do engine)
e o **workspace spec-kit emitido** pelo exporter — pronto para os comandos *vanilla*
`/speckit.tasks` → `/speckit.implement` gerarem **código + testes**.

## Layout

```
examples/speckit-pilot/
├── docs/                      ← ENTRADA (artefatos do engine)
│   ├── global/
│   │   ├── MASTER.md          (com bloco "Technical Context")
│   │   ├── NFR.md  ERROR-DICTIONARY.md
│   │   └── data-models/contatos.md
│   └── modules/crm/g-contatos/
│       ├── README.md          (N2 — com coluna Prioridade)
│       ├── f-cadastrar-contato.md   (N3 P1 — front-matter + critérios de sucesso)
│       ├── f-pesquisar-contato.md   (N3 P2)
│       └── f-excluir-contato.md     (N3 P3)
│
└── target/                    ← SAÍDA (emitida por PROMPT_SPECKIT_EXPORT; consumida vanilla)
    ├── .specify/
    │   ├── memory/constitution.md   (princípios = convenções do MASTER/NFR/API/DS)
    │   └── feature.json
    └── specs/001-contatos/
        ├── spec.md            (3 user stories = 3 N3, por prioridade)
        ├── plan.md            (Technical Context copiado do MASTER)
        ├── data-model.md      (resolvido de data-models/contatos.md)
        ├── contracts/         (1 arquivo por endpoint)
        └── quickstart.md
```

## Fidelidade (como conferir)

| No engine (`docs/`) | No spec-kit (`target/`) |
|---|---|
| 3 N3 (CRM-CTT-01/02/03), por `prioridade` | `spec.md` → User Story 1/2/3 (P1/P2/P3) |
| Gherkin "Caminho feliz" + "Erros de validação" | Acceptance Scenarios |
| Gherkin "Conflitos" + "Estados especiais" | Edge Cases |
| `## Regras de negócio` | FR-001…FR-008 |
| `## Critérios de sucesso` + NFR | SC-001…SC-005 |
| `MASTER.md` › Technical Context | `plan.md` › Technical Context |
| `data-models/contatos.md` | `data-model.md` (3 camadas resolvidas) |
| `## API` dos N3 + API-PATTERNS + ERROR-DICTIONARY | `contracts/*.md` |
| MASTER (proibições/decisões) + NFR + DESIGN-SYSTEM | `constitution.md` (8 princípios-gate) |

Nenhum ponteiro `→ ver global/…` sobra no `target/` — tudo foi resolvido/inlined.

## Próximos passos (spec-kit vanilla)

No projeto-alvo (aqui, `target/` faria parte de um projeto inicializado com
`specify init`), rode os comandos **sem modificar o spec-kit**:

1. `/speckit.tasks` — gera `tasks.md` organizado pelas 3 user stories (P1 → P3).
2. *(opcional)* `/speckit.analyze` — consistência cruzada spec/plan/tasks.
3. `/speckit.implement` — gera **código + testes** seguindo a constituição.

## Escopo

Para em **código + testes** (saída do `/speckit.implement`). CI, container e deploy
ficam fora — evolução futura.
