# CLAUDE.md
> **Índice de contexto da instância.** Copie este arquivo para a **raiz do
> repositório de documentação** do seu projeto (a instância — não para dentro de
> `engine/`). O Claude Code o lê automaticamente no início de **toda** sessão, de
> modo que o agente sempre carrega o contexto do projeto sem precisar colá-lo.
>
> Mantenha-o **enxuto**: ele é um índice, não uma cópia. Os arquivos pesados
> (dicionários, data-models, árvore de `modules/`) são lidos **sob demanda** pela
> skill `analista-requisitos` — não os importe todos aqui para não inflar o contexto.

---

## Identificação do projeto

- **Nome**: [SIGLA/Nome do sistema]
- **Descrição**: [descrição em uma frase]
- **Repositório de docs**: [nome-docs] (este repositório — a instância)

Este repositório é uma **instância do framework `doc-template`**: contém a
documentação específica deste sistema (N0–N3, dicionários, data-models) e consome
os prompts/templates do `doc-template-engine` mais a skill `analista-requisitos`.

---

## Contexto sempre carregado

Os arquivos abaixo entram no contexto automaticamente a cada sessão (sintaxe de
import do Claude Code). Ajuste a lista ao que existir na instância:

@global/MASTER.md
@global/N0_PRODUCT_VISION.md
@modules/INDEX.md

> Os demais arquivos de contexto — `global/DATA-MODEL.md`, `global/data-models/`,
> os dicionários (`FIELD`/`RULES`/`MESSAGE`/`ERROR`), `global/NFR.md` e os N1/N2/N3
> em `modules/` — **não** são importados aqui: a skill os lê do disco sob demanda,
> conforme a etapa da sessão.

---

## Regras da instância

- A documentação gerada vai sempre para `modules/`, `global/`, `prototypes/`,
  `repos/` — **nunca** para dentro de `engine/` (somente-leitura).
- Para especificar requisitos, use a skill `analista-requisitos` (N0–N3) e siga o
  roteiro do prompt correspondente em `engine/prompts/`.
- [Demais convenções específicas deste projeto que valham para toda sessão.]
