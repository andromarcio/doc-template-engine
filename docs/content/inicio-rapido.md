# Início rápido

Este repositório é o **motor** (prompts + templates). Você o usa a partir de uma
**instância de documentação** — o repositório do seu projeto, onde vive o conteúdo
específico do sistema.

## 1. Tenha o engine à mão

Clone ou referencie este repositório:

```bash
git clone https://github.com/andromarcio/doc-template-engine.git
```

Os artefatos que importam estão em `engine/`:

```text
engine/
├── prompts/      # prompts que conduzem a especificação (N0 → N3) e mais
└── templates/    # esqueletos de documentação (global, modules, prototypes, repos)
```

## 2. Escolha o ponto de entrada

| Situação | Por onde começar |
|---|---|
| Não sei se já existe algo sobre o assunto | **Triagem** (`PROMPT_TRIAGEM`) |
| A necessidade já é uma história do ServiceNow | **`PROMPT_BACKLOG`** (intake) |
| Vou descrever o produto do zero | **N0** → `PROMPT_1A` → `PROMPT_2A` → `PROMPT_3A` |
| Já tenho features escritas e quero subir | `PROMPT_N3_TO_N2` → `PROMPT_N3_TO_N1` |

## 3. Rode em duas passadas

Para cada nível, primeiro a versão de **negócio (A)**, validada; depois a **técnica (B)**:

```text
N1:  PROMPT_1A  →  (validar)  →  PROMPT_1B
N2:  PROMPT_2A  →  (validar)  →  PROMPT_2B
N3:  PROMPT_3A  →  (validar)  →  PROMPT_3B
```

## 4. Use com as skills

O método foi desenhado para uso com as skills:

- **`analista-requisitos`** — especificação N0–N3.
- **`apf-cpm`** — Análise de Pontos de Função (IFPUG CPM 4.3.1).

> Dica: o `PROMPT_MENU` lista todas as opções disponíveis (TR, HU, 1A/1B, 2A/2B,
> 3A/3B, 4A/4B, IV → EX, etc.) e funciona como índice operacional do engine.

Continue por [Os quatro níveis](#/quatro-niveis).
