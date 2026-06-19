# Negócio (A) e Técnico (B)

Os níveis **N1 e N3** são produzidos em **duas passadas**. Separar negócio de
técnica mantém cada artefato legível para o seu público e evita que decisões de
implementação contaminem a descrição do problema. O **N2 (Feature Set) é
integralmente negocial** — não tem passada técnica.

## A — Negócio

Escrita pelo **PO** (com ou sem dev), em **linguagem de negócio**, sem mencionar
tabelas, endpoints ou tecnologias. **Validada antes de avançar** para a passada
técnica.

## B — Técnico

O **dev complementa** o artefato negocial **já aprovado** com entidades, campos,
integrações e demais detalhes técnicos — **sem alterar o conteúdo de negócio**.

## A regra de ouro

```text
A (negócio)  →  validar  →  B (técnico)
```

Nunca pule a validação do negócio: a passada técnica **acrescenta**, não reescreve.

## Onde vive cada detalhe

| Conteúdo | Lugar canônico |
|---|---|
| Campos detalhados | `global/DATA-MODEL.md` |
| Requisitos não-funcionais | `global/NFR.md` |
| Regras de negócio reutilizáveis | `global/RULES-DICTIONARY.md` |
| Mensagens e erros | `global/MESSAGE-DICTIONARY.md`, `global/ERROR-DICTIONARY.md` |

> Esses detalhes **nunca** são duplicados dentro dos artefatos de spec — os
> artefatos os **referenciam**.

## Os prompts por passada

| Nível | Negócio (A) | Técnico (B) |
|---|---|---|
| N1 | `PROMPT_1A_N1_negocio` | `PROMPT_1B_N1_tecnico` |
| N3 | `PROMPT_3A_N3_negocio` | `PROMPT_3B_N3_tecnico` |

> O **N2 (Feature Set)** tem passada única — `PROMPT_2A_N2_negocio` (negocial). O
> detalhe técnico vive nos N3 (`PROMPT_3B`).

Veja o [Fluxo de trabalho](#/fluxo-de-trabalho) completo.
