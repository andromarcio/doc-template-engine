# doc-template-engine

Motor de **prompts** e **templates** do framework `doc-template` — um método para
especificar software em quatro níveis, da visão de produto até a feature, gerando
documentação estruturada e rastreável.

## Os quatro níveis

O método organiza a especificação em uma hierarquia de **quatro níveis de
detalhe** (N0 → N3). Cada nível responde a uma pergunta diferente, é mantido por
um público diferente e produz um artefato próprio. Quanto mais alto o número,
mais fino o detalhe: o N0 enxerga o produto inteiro; o N3 descreve uma única
funcionalidade campo a campo.

| Nível | Nome | Pergunta que responde | Escopo | Artefato |
|-------|------|-----------------------|--------|----------|
| **N0** | Visão de Produto | *Por que este software existe?* | objetivo, público-alvo, proposta de valor | `global/N0_PRODUCT_VISION.md` |
| **N1** | Domínio | *Quais são as grandes áreas do sistema?* | grandes áreas funcionais e seus limites | `modules/[dominio]/README.md` |
| **N2** | Feature Set | *O que o usuário faz em cada área?* | conjuntos de funcionalidades, fluxos, telas e permissões | `modules/[dominio]/[feature-set]/README.md` |
| **N3** | Feature | *Como funciona, em detalhe, cada funcionalidade?* | campos, regras de negócio, cenários | `modules/[dominio]/[feature-set]/[feature].md` |

### N0 — Visão de Produto

O nível **estratégico**. Define por que o produto existe: objetivo, público-alvo
e proposta de valor. É o documento de referência mais alto — os demais níveis são
confrontados contra ele para garantir que não extrapolam o escopo nem contradizem
os objetivos do produto. Não detalha funcionalidades; dá a direção que orienta
todo o resto.

### N1 — Domínio

As **grandes áreas funcionais** do sistema (ex.: Vendas, Suporte, Usuários). Cada
domínio recebe uma **sigla de 3 letras** como ID (ex.: `USR`) e descreve, em
linguagem de negócio, o que faz, **o que explicitamente não faz** (e a quem isso
pertence), seus Feature Sets, regras transversais e dependências com outros
domínios. É a planta do sistema: mostra como ele se divide e como as partes se
relacionam, sem entrar em telas ou campos.

### N2 — Feature Set

Um **conjunto de funcionalidades** relacionadas dentro de um domínio (ex.: dentro
de Vendas → Carrinho, Checkout). Herda a sigla do domínio e ganha a sua própria,
formando o ID `[SIGLA]-[SFS]` (ex.: `USR-PRM`). Detalha a jornada principal do
usuário (como um diagrama de fluxo), as features que o compõem, as telas
envolvidas e — exclusivamente neste nível — as **permissões por perfil**. É a
ponte entre a visão de domínio (N1) e a especificação fina de cada feature (N3).

### N3 — Feature

A **especificação detalhada** de uma única funcionalidade (ex.: Calcular Frete,
Cadastrar Cliente). Recebe um ID dentro do Feature Set (ex.: `USR-PRM-01` ou
`F01`) e descreve campo a campo o que o usuário preenche e vê, as regras de
negócio que valem só para ela, os cenários de uso (em Gherkin) e o comportamento
de tela. É o nível que a equipe de desenvolvimento consome diretamente para
implementar.

### Negócio (A) e Técnico (B)

Os níveis **N1 e N3** são produzidos em **duas passadas**:

- **A — Negócio**: escrita pelo PO (com ou sem dev), em linguagem de negócio, sem
  mencionar tabelas, endpoints ou tecnologias. Validada antes de avançar.
- **B — Técnico**: o dev complementa o artefato negocial já aprovado com
  entidades, campos, integrações e demais detalhes técnicos — sem alterar o
  conteúdo de negócio.

O **N2 (Feature Set) é integralmente negocial** — não tem passada técnica: o
detalhe técnico do que o Feature Set agrupa vive nos N3 (via `PROMPT_3B`).

Campos detalhados vivem sempre no `global/DATA-MODEL.md` e requisitos
não-funcionais no `global/NFR.md`, nunca dentro dos artefatos de spec.

### Fluxo de trabalho

O caminho natural é **top-down** (N0 → N1 → N2 → N3): cada nível parte do nível
acima. Mas o método também suporta **bottom-up** — especificar uma feature (N3)
primeiro e, a partir de várias delas, derivar o N2 e depois o N1 (ver
`PROMPT_N3_TO_N2` e `PROMPT_N3_TO_N1`). Em ambos os sentidos há **propagação**:
ao gerar ou alterar um nível, o engine confronta e atualiza o nível imediatamente
anterior para manter tudo consistente.

### Triagem: descobrir o que já existe

Uma necessidade pode chegar de inúmeras formas — uma ideia, uma reunião, um bug, uma
mudança regulatória, uma história do ServiceNow — e tanto **de cima para baixo** quanto
**de baixo para cima**. Antes de especificar, é preciso saber se ela **já está
documentada**: a necessidade se resolve **alterando** algo que existe, ou é caso de
**criar** algo novo?

O prompt **`PROMPT_TRIAGEM`** (opção **TR** no menu) é a porta de entrada leve para isso.
Recebe a necessidade em texto livre, **lê o que já está documentado** (`modules/INDEX.md`
e a árvore `modules/` — direto do repositório no Claude Code, ou colado no fluxo
copy-paste/CLI) e devolve um **relatório de triagem**: o que existe sobre o assunto e a
**rota recomendada** para cada parte da necessidade — **criar** (`3A`/`2A`/`1A`),
**alterar** (`4A`/`4B`), tratar em **lote** (`IV` → `EX`) ou **registrar a história antes**
(`HU`). A triagem não cria nem altera nada — apenas mostra e encaminha; para um delta que
afeta muitos artefatos de uma vez, ela própria direciona ao `PROMPT_INVESTIGADOR`.

### Ponto de entrada: história de usuário

Quando a necessidade já chega como uma **história de usuário / item de backlog** do
**ServiceNow** (ou após a triagem indicar esse caminho), o intake é o prompt
**`PROMPT_BACKLOG`** (opção **HU** no menu): captura a história, mapeia quais features
(N3) ela gera ou altera e cria o artefato em `modules/_backlog/[chave].md`. A partir
daí, roda-se o `PROMPT_3A` para cada feature.

Enquanto não há integração, os dados da história (número, descrição e critérios
de aceite) são **informados manualmente**; havendo um MCP do ServiceNow, basta
passar o número e o engine lê a história diretamente.

### Rastreabilidade: história → spec → código

A cadeia é rastreável de ponta a ponta por uma sequência de identificadores:

```
História (ServiceNow STRYxxxxxxx)
   └─ N3 Feature (SIGLA-SFS-NN)   ← seção "Origem" do N3 guarda a chave da história
        └─ Código (commit/PR)     ← referencia ambos os IDs
```

- **História → N3**: a chave do ServiceNow é registrada na seção `## Origem` de
  cada feature (elo recíproco em `_backlog/`). Cada **critério de aceite** é
  analisado e vira uma **regra de negócio** (se for invariante), um **`## Cenário`**
  (Gherkin, se for comportamento observável) ou **ambos** — rastreabilidade
  semântica, não apenas por ID.
- **N3 → História (caminho inverso)**: para saber *quais features uma história
  impactou*, o elo M:N é registrado nos três lugares — `## Origem` do N3, a tabela
  `## Rastreabilidade` da história em `_backlog/` e o `INDEX.md`. O `PROMPT_3A`/`4A`
  fecham os três na mesma passada; a auditoria **AT** (`PROMPT_AUDIT_TRACE_LINKS`)
  detecta elos unilaterais.
- **N3 → código**: seção `## Implementação` do N3 (repositório + caminho) e a
  tabela de rastreabilidade do `modules/INDEX.md`.
- **No git**: commits e PR seguem a convenção
  `tipo([SIGLA]-[SFS]-[NN]): [resumo] (ServiceNow [STRYxxxxxxx])`.

## Estrutura

```
engine/
├── prompts/      # prompts que conduzem a especificação (N0→N3), contagem APF,
│                 # NFR, protótipos, engenharia reversa, QA, conversão, etc.
└── templates/    # esqueletos de documentação
    ├── global/   # N0, MASTER, DATA-MODEL, NFR, dicionários (FIELD/RULES/
    │             # MESSAGE/ERROR), SIZING, CONTAGEM-PF, API-PATTERNS, DESIGN-SYSTEM
    ├── modules/  # domínio → feature-set → feature (+ _backlog: histórias de usuário)
    ├── prototypes/
    └── repos/
docs/             # site de documentação (template para GitHub Pages)
```

## Site de documentação (GitHub Pages)

A pasta [`docs/`](docs/) traz um **template de site estático** (HTML/CSS/JS, sem
build) com a estética do editor Dokumin: barra lateral em árvore, busca, tema
claro/escuro e conteúdo em Markdown. Ele apresenta este engine e serve de ponto
de partida reutilizável para a documentação de qualquer projeto.

- **Conteúdo**: `docs/content/*.md` · **Navegação**: `docs/config.js`
- **Pré-visualizar**: `python3 -m http.server -d docs 8080` → `http://localhost:8080`
- **Publicar**: o workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml)
  publica `docs/` automaticamente ao fazer merge na `main` (basta definir
  *Settings → Pages → Source: GitHub Actions*).

Mais detalhes em [`docs/README.md`](docs/README.md).

## Como usar

Os prompts e templates são **conteúdo reutilizável**, consumidos por:

- **instâncias de documentação** — cada projeto fornece seu próprio conteúdo
  (dicionários de campos/mensagens/regras/erros, modelo de dados) e usa estes
  prompts/templates como motor;
- **ferramentas** que leem e executam os prompts (ex.: `doc-template-studio`).

> O engine fornece **os prompts e os esqueletos**; o conteúdo específico de cada
> sistema vive na instância, não aqui.

O método foi desenhado para uso com as skills `analista-requisitos` (especificação
N0–N3) e `apf-cpm` (Análise de Pontos de Função, IFPUG CPM 4.3.1).

### Contexto persistente do projeto

Para que o agente **sempre** tenha o contexto do sistema sendo especificado — sem
recolá-lo a cada sessão — a instância mantém na sua raiz um `CLAUDE.md` (template em
[`engine/templates/global/CLAUDE.md`](engine/templates/global/CLAUDE.md)). O Claude
Code o lê automaticamente no início de toda sessão; ele é um **índice enxuto** que
importa o contexto mínimo (`global/MASTER.md`, `global/N0_PRODUCT_VISION.md`,
`modules/INDEX.md`). Os demais arquivos (dicionários, data-models, N1–N3) seguem
lidos **sob demanda** pela skill `analista-requisitos`, que carrega esse índice na
abertura da sessão.

## Contribuindo

Contribuições são bem-vindas via Pull Request. Diretrizes:

- mantenha cada **prompt auto-contido** (sem depender de arquivos fora do `engine/`);
- nos **templates**, use placeholders `[entre colchetes]` para o que a instância preenche;
- um arquivo, um propósito — siga a convenção de nomes existente.

## Licença

[MIT](LICENSE).
