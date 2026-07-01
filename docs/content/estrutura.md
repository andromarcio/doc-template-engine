# Estrutura do repositório

```text
engine/
├── prompts/      # prompts que conduzem a especificação (N0→N3), contagem APF,
│                 # NFR, protótipos, engenharia reversa, QA, conversão, etc.
└── templates/    # esqueletos de documentação
    ├── global/   # N0, MASTER, DATA-MODEL, NFR, dicionários (FIELD/RULES/
    │             # MESSAGE/ERROR), SIZING, CONTAGEM-PF, API-PATTERNS, AUTHZ, DESIGN-SYSTEM
    ├── modules/  # domínio → feature-set → feature (+ _backlog: histórias de usuário)
    ├── prototypes/
    └── repos/
```

## `engine/prompts/`

Os **prompts** conduzem a geração e a manutenção da documentação. São
**auto-contidos**: não dependem de arquivos fora do `engine/`. Veja a lista
completa em [Prompts](#/prompts).

## `engine/templates/`

Os **templates** são os esqueletos preenchidos por cada instância. Usam
placeholders `[entre colchetes]` para o conteúdo que o projeto fornece.

### `global/`

Artefatos que valem para o sistema inteiro — visão de produto, modelo de dados,
requisitos não-funcionais e os **dicionários canônicos** (campos, regras,
mensagens e erros). Detalhes em [Templates](#/templates).

### `modules/`

A árvore de especificação propriamente dita: **domínio → feature-set → feature**.
O `INDEX.md` consolida todos os domínios e a tabela de rastreabilidade. A pasta
`_backlog/` guarda as histórias de usuário que originam as features.

```text
modules/
├── INDEX.md
├── _backlog/
│   └── _template-historia.md
└── _template-dominio/
    ├── README.md                         # N1 — Domínio
    └── _template-feature-set/
        ├── README.md                     # N2 — Feature Set
        └── _template-feature.md          # N3 — Feature
```

### `prototypes/` e `repos/`

`prototypes/` guarda esqueletos para protótipos de tela e fluxo; `repos/`
documenta o mapeamento entre specs e os repositórios de código.

## Convenções

- **Um arquivo, um propósito** — siga a convenção de nomes existente.
- **Placeholders** `[entre colchetes]` marcam o que a instância preenche.
- **Campos** vivem sempre em `global/DATA-MODEL.md`; **requisitos não-funcionais**
  em `global/NFR.md` — nunca dentro dos artefatos de spec.
