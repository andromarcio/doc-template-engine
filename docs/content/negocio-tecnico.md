# Negócio (A) e Técnico (B)

Os níveis **N1, N2 e N3** são produzidos em **duas passadas**. Separar negócio de
técnica mantém cada artefato legível para o seu público e evita que decisões de
implementação contaminem a descrição do problema.

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
| N2 | `PROMPT_2A_N2_negocio` | `PROMPT_2B_N2_tecnico` |
| N3 | `PROMPT_3A_N3_negocio` | `PROMPT_3B_N3_tecnico` |

Veja o [Fluxo de trabalho](#/fluxo-de-trabalho) completo.
