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

## [1.2.0] - 2026-06-30

### Added
- `engine/prompts/PROMPT_N0_VISAO.md` — prompt que conduz o levantamento da **Visão
  de Produto (N0)**, fechando a lacuna do nível mais alto (antes só havia o template
  e o N0 consumido pelos demais prompts, sem roteiro para criá-lo). Máquina de estados
  (`[INICIALIZACAO] → [COLETA_PROPOSITO] → [COLETA_PERSONAS] → [COLETA_OBJETIVOS] →
  [COLETA_ESCOPO] → [COLETA_DOMINIOS] → [COLETA_PRINCIPIOS] → [GERACAO_ARTEFATO]`), uma
  pergunta por estado, carimbo de versão, checklist e gate determinístico. Gera
  `global/N0_PRODUCT_VISION.md` e encaminha para o PROMPT_1A (que já confronta os
  domínios contra esta visão e reaproveita as siglas propostas).
- `scripts/validate-doc.mjs`: validação de **N0** (detecção pelo subtítulo `**Nível 0**`),
  exigindo título `# Visão de Produto: [Nome]`, SIGLA do produto no subtítulo, as seções
  obrigatórias da visão e as subseções `### Está dentro` / `### Está fora (não-objetivos)`.

### Changed
- `engine/templates/global/N0_PRODUCT_VISION.md`: título e subtítulo alinhados ao padrão
  dos demais níveis (`# Visão de Produto: [Nome]` + `> **Nível 0** - Visão de Produto -
  \`[SIGLA]\``), para que template, prompt e validador concordem.
- `PROMPT_MENU.md` (opção **N0** na Fase 0 + insumos + mapeamento de execução),
  `SKILL.md` (sequência e tabela de roteamento) e os docs (`n0.md`, `prompts.md`)
  passam a registrar e rotear o novo prompt.

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
