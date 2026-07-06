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

## [1.5.0] - 2026-07-06

Consolidação pós-merge: correções de consistência entre as peças e entrega de
faltantes que as referências do engine já assumiam como existentes.

### Added
- `engine/templates/prototypes/_biblioteca-ds/` — a biblioteca de componentes
  (`.dsc-*`, CAIXA DS) que o `DESIGN-SYSTEM.md`, os prompts de protótipo
  (6A–6D) e a skill `/prototype` referenciavam como "pronta", mas que **nunca
  foi versionada** (nenhum commit da história a adicionou — todo protótipo
  gerado nascia com o link de CSS quebrado). Entregue como implementação de
  referência materializada da spec já documentada (tokens, breakpoints e grid
  do `DESIGN-SYSTEM.md` + classes canônicas dos esqueletos dos prompts):
  `ds.css`, `tokens.css`, `README.md` (contrato + catálogo de classes),
  `index.html` (catálogo navegável) e `shell-responsive.html` (demo do
  drawer/grid). Tema escuro via `app-dark`. Validada visualmente em headless
  Chromium (claro/escuro, drawer, breakpoints) — confira os tokens com o
  Figma da sua instância.

### Changed
- `PROMPT_MENU.md` — a Fase 6 ganha as opções **6C** (protótipo de fluxo
  componente) e **6D** (protótipos de estado componente), expondo os prompts
  `PROMPT_PROTOTYPE_FLOW_COMPONENT.md` e `PROMPT_PROTOTYPE_SCREEN_COMPONENT.md`,
  que existiam no inventário mas não eram alcançáveis pelo menu — o texto ainda
  afirmava "não há prompt separado para isso". Insumos e mapeamento
  opção→arquivo incluídos; a dica de protótipos do `SYSTEM_PROMPT` e o
  roteamento do `SKILL.md` acompanham. A classe `dsc-component-only` segue
  documentada para esconder o shell de um protótipo FULL já gerado.

- Esteira de checkpoints — o espelho do `INDEX.md` agora **viaja no próprio PR
  do gate**: o `gate-check.yml` ganhou o passo "Espelho do INDEX em dia", que
  reprova o PR se o `modules/INDEX.md` não refletir o front-matter dos N3
  (`gates.py promote --write`), e o `promote-estado.yml` **deixou de fazer
  `git push` direto na `main`** — com *Require a pull request before merging*
  (a proteção que o próprio kit recomenda), aquele push era rejeitado e o
  espelho nunca atualizava. O workflow virou uma verificação de *drift*
  pós-merge, somente-leitura (`contents: read`). PR template, README do kit,
  README raiz e a página *Esteira de checkpoints* acompanham o novo fluxo.

### Fixed
- `SYSTEM_PROMPT_analista_requisitos.md` — o intake de história citava `PROMPT_HU`,
  nome que não existe; corrigido para `PROMPT_BACKLOG` (o prompt real da opção HU),
  nas duas ocorrências (máquina de estados e diagrama do fluxo).
- Roteamento da transcrição de reunião — o `SKILL.md` ainda roteava "N3 negocial a
  partir de transcrição" para o descontinuado `PROMPT_3A_N3_negocio_transcricao.md`
  (tombstone); a linha morta saiu e a rota única aponta para o substituto
  `PROMPT_TRANSCRICAO_REUNIAO.md`. As páginas do site (`prompts.md`, `n3.md`)
  deixaram de listar o prompt descontinuado como ativo.
- Site (`docs/content/entrevista-po.md`) — duas âncoras intra-página usavam hash
  simples (`#secao`), que o roteador interpreta como página e derrubava o conteúdo
  ("Página não encontrada"); corrigidas para o formato do app (`#/pagina#secao`).
- Esqueletos dos `PROMPT_PROTOTYPE_{FLOW,SCREEN}_FULL` — removido um bloco
  morto de design system anterior (classes `layout-*`/`p-*` do PrimeNG, com
  IDs `screen-*` duplicados), deixado por resolução de merge "aceitar ambos";
  o `</div>` de fechamento do `.dsc-app`, engolido na mesma resolução, voltou;
  e o drawer ganhou o `.dsc-sidebar-backdrop` — igualando o esqueleto canônico
  da skill `/prototype`.
- `PROMPT_PROTOTYPE_{FLOW,SCREEN}_COMPONENT` (opções 6C/6D) — migrados de uma
  geração ainda anterior: linkavam `_biblioteca/sakai.css` (sakai-ng) e
  geravam markup inteiro em classes `p-*`/`layout-*`, que não existem na
  biblioteca do engine. Esqueletos e regras reescritos para
  `_biblioteca-ds/ds.css` e classes `.dsc-*` (`dsc-component-only`,
  `dsc-screen`, `dsc-proto-badge`, `dsc-toast`, `dsc-modal`…), alinhados aos
  FULL. Resquícios de `p-select`/`.prototype-badge` nos textos de regra dos
  FULL e da skill `/prototype` também corrigidos.
- `DESIGN-SYSTEM.md` — o exemplo de tela de pesquisa apontava para
  `prototypes/exemplo-clientes/…`, que nunca existiu; agora aponta para o
  catálogo da `_biblioteca-ds`.
- `gate-check.yml` (kit `.github` das instâncias) — o job ganhou
  `name: Esteira de gates — check`: o branch protection casa pelo nome do
  *check run* (= nome do job), e sem o `name:` o check publicado chamava-se
  apenas `check` — a string que o README/CODEOWNERS mandam selecionar em
  *Require status checks to pass* não existia.
- `build-trace-data.mjs` — alinhado ao comportamento do `generate-trace-index.mjs`
  nos dois pontos em que os geradores do grafo divergiam: **(1)** feature set sem
  README de N2 (fluxo bottom-up legítimo: N3 antes de N2) agora vira nó — pela
  tabela `## Feature Sets` do N1 ou, em último caso, sintetizado do ID da feature —
  em vez de deixar as features soltas no mapa; **(2)** a linha-placeholder `| — |`
  da tabela `## Implementação` não vira mais um nó de repositório "—" (filtro em
  `lib/trace-index.mjs`). Na fixture `loja-acme`, os dois geradores passam a
  produzir o mesmo grafo (21 nós, 26 arestas).

## [1.4.0] - 2026-07-06

**Esteira de checkpoints (gates)**: o ciclo de vida de cada N3 (requisitos →
modelo de dados → testes → código) vira uma máquina de estados validada por
script — a próxima etapa só ocorre após a aprovação humana da anterior, e o
estado vive no próprio `.md` (portátil com `git clone`).

### Added
- `engine/templates/scripts/gates.py` — máquina de estados da esteira: `check`
  (valida transições no PR: não pular etapas, 1 gate por PR, `por`/`em`
  preenchidos, `estado` consistente com os gates), `status` (readiness de todas
  as features) e `promote --write` (regenera a seção espelho do `INDEX.md`).
- `engine/templates/.github/` — kit de governança para as instâncias:
  `CODEOWNERS` (aprovador por papel: PO/DBA/QA/Tech Lead), template de PR de
  aprovação de gate, `workflows/gate-check.yml` (check obrigatório no PR) e
  `workflows/promote-estado.yml` (espelha o estado no INDEX a cada merge).
- Front-matter do `_template-feature.md` — bloco `estado` + `gates`
  (CP1 requisitos, CP2 modelo-dados, CP3 testes, CP4 codigo) ao lado dos
  metadados spec-kit; `estado` é derivado dos gates, não editado à mão.
- `docs/content/esteira-checkpoints.md` — página do site documentando a esteira.

### Changed
- O campo `status` do front-matter foi **absorvido pelo `estado`** da esteira
  (vocabulário: rascunho, requisitos-aprovados, modelo-validado, especificado,
  em-desenvolvimento, implementado, revisao-necessaria, deprecado). A linha
  manual `**Status**: [ ] Especificado…` do corpo do N3 saiu — o INDEX.md e a
  legenda usam os estados da esteira.
- `PROMPT_3A` gera o N3 já com `estado: rascunho` + bloco `gates`; `PROMPT_3B`
  não altera mais o ciclo de vida (só os campos-espelho); `PROMPT_SPECKIT_EXPORT`
  exige `estado: especificado` (CP1+CP2+CP3 aprovados) como pré-requisito.

### Fixed
- `gates.py::parse_front_matter` tolera o carimbo de versão
  (`<!-- doc-template-engine: … -->`) que `scripts/stamp.sh` grava na primeira
  linha de todo artefato — sem isso, nenhum N3 carimbado seria enxergado pela
  esteira (check/promote pulariam todos, silenciosamente).

## [1.3.1] - 2026-07-04

### Fixed
- `scripts/hooks/spec-guard.mjs` — a resolução de conflito do merge da 1.3.0
  ("aceitar ambos") concatenou as duas versões do bloco `PostToolUse` e deixou o
  arquivo com **erro de sintaxe**; como o guard é fail-open, todos os gates ficaram
  **silenciosamente desativados**. Reescrito unificando os três gates no acumulador
  `problems[]` (F2 estrutura + semântico de N3 + F3 rastreabilidade), com os desvios
  devolvidos juntos numa única resposta ao modelo. A seção 1.3.0 do CHANGELOG foi
  reorganizada pelo mesmo motivo (o bloco de FEATURE-DEFINITION, vindo de
  `[Unreleased]` da main, entrou como segundo `### Added` no meio da versão).

## [1.3.0] - 2026-07-04

Integridade de rastreabilidade por **enforcement determinístico** (não só disciplina
auditável): a consistência dos elos é provada por script no hook, sob demanda e no CI;
todo estado novo fica **nos próprios `.md`** (portátil com `git clone`).

### Added
- `scripts/audit-trace-links.mjs` — gate determinístico da consistência dos elos
  história↔feature nos **três lugares** (`## Origem` do N3 + `## Rastreabilidade` da
  história + tabela do `INDEX.md`). Acusa elo unilateral 🔴, par fora do INDEX 🟠,
  linha do INDEX sem respaldo, status divergente 🟡 (tolera o ⚠️ gravado pelo
  `suspect-links --mark`) e referência quebrada ⚠️; histórias sem feature e features
  sem `## Origem` são informativos ⚫. `--file` restringe aos pares que tocam um
  artefato (modo hook). É a metade ESTRUTURAL do `PROMPT_AUDIT_TRACE_LINKS`, que
  passa a focar a parte semântica (nota adicionada ao prompt).
- `scripts/suspect-links.mjs` — **suspect links** em texto plano: `--stamp` grava,
  na seção do elo, carimbos invisíveis `<!-- trace-verified: ALVO @ fingerprint -->`
  com o fingerprint (sha256 truncado) do conteúdo do artefato do outro lado,
  ignorando os próprios carimbos (carimbar A↔B não invalida B↔A). Se o alvo mudar
  depois, o relatório acusa o elo como suspeito (exit 1) e `--mark` persiste
  ⚠️ Revisão necessária na linha do `INDEX.md`. Elo sem carimbo é informativo
  (instâncias legadas não reprovam). Independe do git (usa-o só para enriquecer a
  mensagem com o último commit do alvo).
- `scripts/build-trace-data.mjs` — o "passo de build" prometido pelo mapa de
  rastreabilidade: gera o `data.js` (nós N0/domínio/feature set/feature/história/
  repositório; arestas `contem`/`origina`/`implementa`/`integra`; status e PF do
  `INDEX.md`) varrendo os artefatos reais da instância. O protótipo em
  `docs/rastreabilidade/` deixa de ser só simulação.
- `scripts/check-approval-trailers.mjs` + convenção **`Approved-by:`** — a trilha de
  aprovação registrada no próprio git (trailer no rodapé do merge/squash commit),
  portátil entre forges. Exige o trailer nos commits que entram na main tocando
  `modules/`/`global/` (merge commits por padrão; `--all` para fluxo squash;
  `--range A..B` para o intervalo de um push).
- `scripts/lib/trace-index.mjs` — modelo compartilhado das três fontes do elo,
  consumido pelos três scripts acima.
- `engine/templates/ci/spec-guard.yml` — workflow de CI para as instâncias
  (copiar para `.github/workflows/`): jobs `estrutura` (validate-doc),
  `rastreabilidade` (audit + suspect) e `aprovacao` (trailers no push à main).
  Com branch protection, elo unilateral não entra na main.
- `engine/FEATURE-DEFINITION.md` — **definição canônica e testável do que é uma
  feature (N3)**: uma ação de negócio com começo, meio, fim e resultado observável,
  nomeada por um verbo no infinitivo + uma entidade. Materializa a definição em
  **critérios objetivos FD-1…FD-7**, um **vocabulário de verbos canônicos** e uma
  tabela de **termos bloqueados na posição do verbo** (agrupadores como "cadastro"/
  "gestão", nominalizações como "aprovação", artefatos como "tela"/"relatório" e NFRs
  como "desempenho"), cada um com o encaminhamento correto (N2, PROMPT_CRUD, data-model,
  NFR.md etc.). As duas tabelas são **máquina-legíveis**: são a fonte única consumida
  pelo validador — estender o vocabulário é editar a tabela, não código.
- `scripts/validate-feature-semantics.mjs` — **gate semântico determinístico de N3**
  (sem LLM; independe do modelo que produziu o artefato). Verifica se o que foi
  nomeado como feature **é mesmo uma feature**: verbo no infinitivo catalogado (verbo
  legítimo não catalogado → aviso, não erro), título contando a mesma ação do arquivo,
  atomicidade (um verbo só — "gerar **e** enviar boleto" reprova), termo bloqueado na
  posição do verbo (reprova com o encaminhamento da tabela), todo cenário Gherkin com
  `Então/Then` (resultado observável) e regras de negócio sem cauda de reação
  ("não salva", "exibe mensagem", "conforme o Design System" → a reação é cenário).
  Complementa o `validate-doc.mjs`: lá estrutura, aqui semântica.
- **FD-8 — Descrição como contrato de entrega**: `engine/FEATURE-DEFINITION.md` ganha
  a seção "Descrição — o contrato de entrega" (a descrição do N3 declara **o que a
  feature entrega** — única, tangível e negocial, com fórmula sugerida e exemplos
  ❌/✅) e a tabela máquina-legível `## Termos proibidos na Descrição` (termos **vagos**
  que escondem a entrega — "etc.", "de forma eficiente", "melhorar a experiência" — e
  termos **técnicos** que violam o Modo PO — endpoint, API, SQL, JSON…). O
  `validate-feature-semantics.mjs` passa a validar o conteúdo da Descrição:
  placeholder de template e descrição curta demais reprovam; termo vago/técnico
  reprova com a orientação da tabela; descrição **idêntica** à de outro N3 da
  instância reprova (entrega não é única) e quase idêntica (Jaccard ≥ 0.8) gera
  aviso; descrição sem nenhuma ação do vocabulário e descrição com mais de ~2 frases
  geram aviso. Template do N3 e `PROMPT_3A` (esqueleto da Descrição + checklist)
  atualizados com a orientação. O julgamento de **valor** ("faz sentido
  negocialmente") permanece explícito como não-automatizável (PROMPT_REVIEW/humano).

### Changed
- `scripts/hooks/spec-guard.mjs` — o `PostToolUse` passa a rodar **três gates** e a
  devolver os desvios **combinados** ao modelo (exit 2): **F2** estrutura
  (validate-doc, artefatos de nível) + gate **semântico** de N3
  (validate-feature-semantics, FD-1…FD-8) + **F3** rastreabilidade
  (audit-trace-links escopado no artefato, ao gravar N3, história de `_backlog/`
  ou `INDEX.md`, lembrando a regra de fechar o elo nos três lugares na mesma
  passada). `PROMPT_3A`, o skill `analista-requisitos` (protocolo F2 e seção de
  granularidade) e `docs/content/n3.md` passam a referenciar a definição canônica.
- Templates `_template-feature.md` (## Origem), `_backlog/_template-historia.md`
  (## Rastreabilidade) e `modules/INDEX.md` — comentários documentando os carimbos
  `trace-verified` e os gates que cobrem cada seção.
- `docs/content/rastreabilidade.md` — seções novas "Aprovações no git (trailer
  `Approved-by`)" e "Gates determinísticos de integridade";
  `docs/content/mapa-rastreabilidade.md` e `docs/rastreabilidade/README.md` apontam
  o gerador real do `data.js`.

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
- **Feature (N3) gravada na pasta errada — contradição de convenção.** Os prompts
  divergiam sobre a pasta do Feature Set: `PROMPT_3A` (regra) e `3B` diziam
  `modules/[dominio]/g-[feature-set]/…`, enquanto `2A`/`CRUD`/`WIZARD` (que criam a
  pasta) usavam `modules/[dominio]/[feature-set]/…` — pastas diferentes. Modelos
  menores (ex.: Haiku) seguiam o sinal contraditório e gravavam o N3 no lugar errado.
  Correção: `[feature-set]` passa a ter **um único significado** (o nome exato da pasta
  do Feature Set, com ou sem prefixo — a mesma do `README.md` do N2); a forma
  `g-[feature-set]` foi removida de `3A`/`3B`. Cada gerador de N3 (`3A`, `3B`, `CRUD`,
  `WIZARD`) ganhou um bloco **DESTINO** explícito: o N3 vai na **mesma pasta** do N2,
  localizada pelo INDEX/N2 — nunca na raiz, `global/`, `engine/`, outro domínio ou
  outro Feature Set; em dúvida, perguntar antes de gravar. Convenção confirmada:
  **pasta do Feature Set sem prefixo** (`modules/[dominio]/[feature-set]/`); os exemplos
  e protótipos que ainda usavam `g-` (`g-fundos-geridos`) foram alinhados, e as notas de
  rota de `CRUD`/`WIZARD` deixaram de citar o antigo prefixo.
- **Código da feature ausente/errado no subtítulo do N3.** O `PROMPT_3A` gerava o
  subtítulo com o placeholder ambíguo `` `[ID do N2]` `` (e um comentário "ex.: F01"),
  levando o modelo — sobretudo o Haiku — a escrever o ID do Feature Set (`CAD-CLI`) ou
  a omitir o código, em vez do **código da feature** `SIGLA-SFS-NN` (`CAD-CLI-01`).
  Corrigido para `` `[SIGLA]-[SFS]-[NN]` `` com comentário explícito (é o código da
  feature, com o `-NN`, copiado da tabela de Features do N2; nunca só o ID do Feature
  Set), alinhando `PROMPT_3A`, a tabela de confirmação, o checklist e a referência
  `estrutura-n3.md` ao que CONVERSION/REVERSE/o template e o `validate-doc.mjs` já
  exigiam (o gate reprova subtítulo N3 sem `SIGLA-SFS-NN`).
- `scripts/validate-doc.mjs`: **guarda de localização** determinística — o tipo detectado
  precisa bater com a pasta (N3 → `modules/<dom>/<fs>/f-*.md`; N1/N2 → `README.md`;
  N0/DATA-MODEL → `global/`). Pega o arquivo gerado no diretório errado. Agnóstico ao
  prefixo da pasta do Feature Set (`g-` ou não); isenta `engine/` e caminhos fora da
  instância.

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
