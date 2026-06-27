# Changelog

Todas as mudanças relevantes do **doc-template-engine** são registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/):

- **MAJOR** — mudança incompatível na estrutura dos artefatos ou no contrato dos prompts
  (ex.: renomear níveis, mudar formato de IDs, remover um dicionário).
- **MINOR** — nova capacidade compatível (novo prompt, novo template, novo campo opcional).
- **PATCH** — correção/refinamento sem mudar o contrato (texto de prompt, bug, doc).

A versão vigente fica em [`VERSION`](VERSION) e é carimbada (de forma invisível ao
leitor do documento) em todo artefato gerado pelos prompts — ver
[`engine/VERSIONING.md`](engine/VERSIONING.md).

## [Unreleased]

## [1.2.0] - 2026-06-27

### Added
- `engine/templates/global/AUTHZ.md` — modelo de autorização transversal: controle
  de acesso por **funcionalidade**, com a Feature (N3) como átomo de permissão
  (ID estável `[SIGLA]-[SFS]-[NN]`). Cobre Catálogo de Funcionalidades (espelho do
  N3/INDEX, populado por DML idempotente MERGE por ID), matriz perfil↔funcionalidade,
  enforcement no front (diretiva) e no back (anotação), kill switch global, ciclo de
  vida e decisões de arquitetura. Nega por padrão; Administrador recebe tudo.
- `NFR.md` (template): **SEG-01 — Autorização por funcionalidade**, herdada por toda Feature.

### Changed
- `MASTER.md` (template): decisão transversal 7 (autorização) e nova linha na tabela
  de arquivos globais de referência apontando `global/AUTHZ.md`.
- `docs/content/templates.md`, `README.md` e `docs/content/estrutura.md`: catálogo de
  templates `global/` passa a listar `AUTHZ.md`.

## [1.1.0] - 2026-06-23

### Added
- `scripts/validate-doc.mjs` — validador determinístico de conformidade estrutural
  de N1/N2/N3, com detecção automática de nível pelo subtítulo `**Nível X**`. Gate
  independente do modelo/harness que gerou o artefato. Regras calibradas contra os
  artefatos reais:
  - **N2** (integralmente negocial, prompt único 2A): lista FECHADA de 7 seções +
    ordem, título/subtítulo, links N3, Mermaid `flowchart TD` acíclico (sem caminho
    de volta) e matriz de permissões.
  - **N1 / N3** (compostos por múltiplos prompts): seções OBRIGATÓRIAS presentes +
    proibições — no N3, reprova vazamento de camada técnica (Label Dev / campo banco)
    na tabela `## Campos`. O caractere separador do subtítulo (- vs —) não é enforçado.

### Changed
- `PROMPT_2A_N2_negocio.md`: bloco "Contrato estrutural (vinculante)" colado ao
  template (lista fechada de 7 seções, MUST/MUST NOT, destino para info de
  categoria/tipo) e item de checklist apontando o gate `validate-doc.mjs`. Reforça
  a conformidade para modelos menores que ignoravam as regras em prosa.
- `PROMPT_1A_N1_negocio.md` e `PROMPT_3A_N3_negocio.md`: item de checklist apontando
  o gate `validate-doc.mjs` com as seções obrigatórias de cada nível.

## [1.0.0] - 2026-06-23

### Added
- Versionamento do framework via `VERSION` (SemVer) + este `CHANGELOG.md`.
- Carimbo de versão invisível (`<!-- doc-template-engine: … -->`) inserido/atualizado
  em todo artefato gerado ou atualizado pelos prompts. Especificação em
  `engine/VERSIONING.md`; helper `scripts/stamp.sh`.
- `scripts/install-skill.sh` — instala as skills do engine numa instância de docs
  (ou em `~/.claude/skills/`).

### Changed
- `CLAUDE.md` template da instância: instrução explícita para acionar a skill
  `analista-requisitos` em sessões de especificação e para carimbar artefatos.
