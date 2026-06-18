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
| **N0** | Visão de Produto | *Por que este software existe?* | objetivo, público-alvo, proposta de valor | `N0_PRODUCT_VISION.md` |
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

Os níveis N1, N2 e N3 são produzidos em **duas passadas**:

- **A — Negócio**: escrita pelo PO (com ou sem dev), em linguagem de negócio, sem
  mencionar tabelas, endpoints ou tecnologias. Validada antes de avançar.
- **B — Técnico**: o dev complementa o artefato negocial já aprovado com
  entidades, campos, integrações e demais detalhes técnicos — sem alterar o
  conteúdo de negócio.

Campos detalhados vivem sempre no `global/DATA-MODEL.md` e requisitos
não-funcionais no `global/NFR.md`, nunca dentro dos artefatos de spec.

### Fluxo de trabalho

O caminho natural é **top-down** (N0 → N1 → N2 → N3): cada nível parte do nível
acima. Mas o método também suporta **bottom-up** — especificar uma feature (N3)
primeiro e, a partir de várias delas, derivar o N2 e depois o N1 (ver
`PROMPT_N3_TO_N2` e `PROMPT_N3_TO_N1`). Em ambos os sentidos há **propagação**:
ao gerar ou alterar um nível, o engine confronta e atualiza o nível imediatamente
anterior para manter tudo consistente.

## Estrutura

```
engine/
├── prompts/      # prompts que conduzem a especificação (N0→N3), contagem APF,
│                 # NFR, protótipos, engenharia reversa, QA, conversão, etc.
└── templates/    # esqueletos de documentação
    ├── global/   # dicionários, MASTER, DATA-MODEL, SIZING, CONTAGEM-PF, DESIGN-SYSTEM
    ├── modules/  # domínio → feature-set → feature
    ├── prototypes/
    └── repos/
```

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

## Contribuindo

Contribuições são bem-vindas via Pull Request. Diretrizes:

- mantenha cada **prompt auto-contido** (sem depender de arquivos fora do `engine/`);
- nos **templates**, use placeholders `[entre colchetes]` para o que a instância preenche;
- um arquivo, um propósito — siga a convenção de nomes existente.

## Licença

[MIT](LICENSE).
