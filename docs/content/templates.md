# Templates

Os templates ficam em
[`engine/templates/`](https://github.com/andromarcio/doc-template-engine/tree/main/engine/templates)
e usam placeholders `[entre colchetes]` para o conteúdo que cada instância fornece.

## `global/` — artefatos do sistema inteiro

| Template | Conteúdo |
|---|---|
| [`N0_PRODUCT_VISION.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/N0_PRODUCT_VISION.md) | Visão de Produto (N0) |
| [`MASTER.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/MASTER.md) | Documento mestre / índice geral |
| [`DATA-MODEL.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/DATA-MODEL.md) | Modelo de dados — **fonte única dos campos** |
| [`NFR.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/NFR.md) | Requisitos não-funcionais |
| [`API-PATTERNS.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/API-PATTERNS.md) | Padrões de API |
| [`DESIGN-SYSTEM.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/DESIGN-SYSTEM.md) | Design system |
| [`SIZING.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/SIZING.md) | Critérios de dimensionamento (PF/CFP) |
| [`CONTAGEM-PF.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/CONTAGEM-PF.md) | Contagem de Pontos de Função |
| [`pending_changes_template.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/pending_changes_template.md) | Mudanças pendentes (fluxo IV → EX) |

### Dicionários canônicos

| Dicionário | Conteúdo |
|---|---|
| [`FIELD-DICTIONARY.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/FIELD-DICTIONARY.md) | Campos canônicos |
| [`RULES-DICTIONARY.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/RULES-DICTIONARY.md) | Regras de negócio canônicas |
| [`MESSAGE-DICTIONARY.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/MESSAGE-DICTIONARY.md) | Mensagens ao usuário |
| [`ERROR-DICTIONARY.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/global/ERROR-DICTIONARY.md) | Erros |

## `modules/` — domínio → feature-set → feature

| Template | Nível |
|---|---|
| [`INDEX.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/modules/INDEX.md) | Índice geral + rastreabilidade |
| [`_template-dominio/README.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/modules/_template-dominio/README.md) | N1 — Domínio |
| [`_template-feature-set/README.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/modules/_template-dominio/_template-feature-set/README.md) | N2 — Feature Set |
| [`_template-feature.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/modules/_template-dominio/_template-feature-set/_template-feature.md) | N3 — Feature |
| [`_backlog/_template-historia.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/modules/_backlog/_template-historia.md) | História de usuário |

## `prototypes/` e `repos/`

| Template | Conteúdo |
|---|---|
| [`prototypes/_template/…`](https://github.com/andromarcio/doc-template-engine/tree/main/engine/templates/prototypes) | Esqueletos de protótipo (tela/fluxo) |
| [`repos/_template-repo.md`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/templates/repos/_template-repo.md) | Mapeamento spec ↔ repositório |

> **Regra de ouro:** campos no `DATA-MODEL`, requisitos não-funcionais no `NFR`,
> regras no `RULES-DICTIONARY`. Os artefatos de spec **referenciam** esses
> dicionários em vez de duplicar o conteúdo.
