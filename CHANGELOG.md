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
