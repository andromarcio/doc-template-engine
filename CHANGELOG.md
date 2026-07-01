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
- `scripts/validate-doc.mjs`: validação do **DATA-MODEL** (antes só N0–N3). Detecta pelo
  título `# DATA-MODEL.md` (índice — checa as seções-âncora) ou `# Data Model:` (fragmento
  de domínio — exige anotação ALI/AIE por entidade, o cabeçalho canônico `Label PO | Label
  Dev | Campo banco | Tipo SQL | Obrigatório | Notas` e que os campos globais implícitos
  não sejam repetidos; a seção `## Arquivos Lógicos deste domínio`). Tags de saída `[DM]` /
  `[DM-idx]`. Caixa (snake_case/camelCase) fica para a revisão semântica do `PROMPT_REVIEW`.
- `engine/templates/modules/_base-conhecimento/_template-base-conhecimento.md` — template
  da **base de conhecimento** (insumo gerado pelo PROMPT_0). Antes a estrutura só existia
  embutida no `PROMPT_0_EXTRACTION.md`; agora há um arquivo de referência (espelho do
  esqueleto, com comentários explicativos), análogo ao `_backlog/_template-historia.md`.
  O `PROMPT_0` passou a apontar para ele (linha *Modelo de estrutura* + ponteiro no PASSO 5).
- `engine/prompts/PROMPT_REVIEW.md` (opção **RV**) — revisor de conformidade de **um**
  artefato (N0–N3 ou data-model). Fecha a lacuna entre o gate determinístico
  (`validate-doc.mjs`, só estrutura), os self-checklists embutidos nos geradores (rodam
  na geração, não sob demanda) e as auditorias transversais. Detecta o nível, roda o gate
  e faz a **revisão semântica** (altitude negocial × técnica, regra = invariante e não
  reação, fonte única de banco, referências canônicas, mensagens literais, NFR, ⚠️
  pendentes, consistência entre níveis), devolvendo achados priorizados (🔴/🟡/🔵) com
  correção sugerida e rota — **sem editar** o artefato. Registrado em `PROMPT_MENU`,
  `SKILL.md` e `docs/prompts.md`.
- `engine/templates/global/AUTHZ.md` — modelo de autorização transversal: controle
  de acesso por **funcionalidade**, com a Feature (N3) como átomo de permissão
  (ID estável `[SIGLA]-[SFS]-[NN]`). Cobre Catálogo de Funcionalidades (espelho do
  N3/INDEX, populado por DML idempotente MERGE por ID), matriz perfil↔funcionalidade,
  enforcement no front (diretiva) e no back (anotação), kill switch global, ciclo de
  vida e decisões de arquitetura. Nega por padrão; Administrador recebe tudo.
- `NFR.md` (template): **SEG-01 — Autorização por funcionalidade**, herdada por toda Feature.

### Changed
- `engine/templates/global/N0_PRODUCT_VISION.md`: título e subtítulo alinhados ao padrão
  dos demais níveis (`# Visão de Produto: [Nome]` + `> **Nível 0** - Visão de Produto -
  \`[SIGLA]\``), para que template, prompt e validador concordem.
- `PROMPT_MENU.md` (opção **N0** na Fase 0 + insumos + mapeamento de execução),
  `SKILL.md` (sequência e tabela de roteamento) e os docs (`n0.md`, `prompts.md`)
  passam a registrar e rotear o novo prompt.
- **Fonte única de definição de banco — endurecimento.** Regra ampliada e tornada
  explícita em `SKILL.md`, `SYSTEM_PROMPT_analista_requisitos.md` e no cabeçalho do
  template `DATA-MODEL.md`: **toda** definição física (entidade, Label Dev, campo banco,
  tipo SQL, FK, índice, restrição de unicidade, enum) vive **só** no DATA-MODEL; todo
  outro artefato **referencia** (`→ ver DATA-MODEL.md`), nunca redefine. Reforço pontual
  em `PROMPT_1B`, `PROMPT_3B` (relacionamentos de seleção/combobox vão ao DATA-MODEL, não
  ao N3), `PROMPT_4B`, `PROMPT_CONVERSION` e `PROMPT_REVERSE_ENGINEERING` (coluna *Tipo*
  do N3 é negocial, não tipo SQL).
- `PROMPT_SDD.md`: seção **3 (Modelo de dados)** reescrita — antes redefinia o schema
  físico (ERD com PK/FK/tipos, tabela de colunas com constraints/índices, `CREATE
  INDEX/TYPE`, lista de migrations), criando uma segunda fonte de verdade. Agora
  **referencia** o DATA-MODEL e guarda só conteúdo de design: entidades no escopo,
  relacionamentos em nível de arquitetura e **estratégia/ordem** de migração (sem DDL).
- `MASTER.md` (template): decisão transversal 7 (autorização) e nova linha na tabela
  de arquivos globais de referência apontando `global/AUTHZ.md`.
- `docs/content/templates.md`, `README.md` e `docs/content/estrutura.md`: catálogo de
  templates `global/` passa a listar `AUTHZ.md`.
- **Abertura de sessão — inventário obrigatório.** Na abertura de **qualquer** sessão de
  especificação (independente do ponto de partida — N0, N1, N2, N3, CRUD, Wizard,
  triagem, transcrição, bottom-up, conversão), o agente passa a **sempre apresentar os
  domínios e Feature Sets já existentes** (do `modules/INDEX.md`), para situar a nova
  spec e evitar duplicação. Explicitado em `SKILL.md` e `SYSTEM_PROMPT` (passo de
  abertura + regra de condução) e no template `CLAUDE.md` de instância.

### Fixed
- Referências ao arquivo de versão corrigidas de `engine/VERSION` para `VERSION` (o
  arquivo vive na **raiz** do engine, como o README e o `stamp.sh` já assumiam) em
  `SKILL.md`, `SYSTEM_PROMPT_analista_requisitos.md`, `engine/VERSIONING.md` e o template
  `CLAUDE.md` — o agente seguia um caminho inexistente ao carimbar artefatos.

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
