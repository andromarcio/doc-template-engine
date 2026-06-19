# doc-template-engine

Motor de **prompts** e **templates** do framework `doc-template` — um método para
especificar software em **quatro níveis**, da visão de produto até a feature,
gerando documentação **estruturada e rastreável**.

> O engine fornece **os prompts e os esqueletos**; o conteúdo específico de cada
> sistema vive na instância de documentação, não aqui.

## O que é

`doc-template` organiza a especificação de um software numa hierarquia de quatro
níveis de detalhe (**N0 → N3**). Cada nível responde a uma pergunta diferente, é
mantido por um público diferente e produz um artefato próprio. Quanto mais alto o
número, mais fino o detalhe: o **N0** enxerga o produto inteiro; o **N3** descreve
uma única funcionalidade campo a campo.

| Nível | Nome | Pergunta que responde | Artefato |
|-------|------|-----------------------|----------|
| **N0** | Visão de Produto | *Por que este software existe?* | `global/N0_PRODUCT_VISION.md` |
| **N1** | Domínio | *Quais são as grandes áreas do sistema?* | `modules/[dominio]/README.md` |
| **N2** | Feature Set | *O que o usuário faz em cada área?* | `modules/[dominio]/[feature-set]/README.md` |
| **N3** | Feature | *Como funciona, em detalhe, cada funcionalidade?* | `modules/[dominio]/[feature-set]/[feature].md` |

## Para quem é

- **Product Owners** que precisam descrever o negócio sem mergulhar em tabelas e endpoints.
- **Desenvolvedores** que complementam a spec de negócio com detalhe técnico.
- **Times de QA e estimativa** que consomem cenários (Gherkin) e dimensionamento (APF).

## Princípios

- **Top-down ou bottom-up** — comece pela visão (N0) ou derive os níveis altos a
  partir de features já escritas (N3 → N2 → N1).
- **Duas passadas** — cada nível tem uma versão de **negócio (A)** e uma **técnica (B)**.
- **Rastreabilidade de ponta a ponta** — da história de usuário até o commit.
- **Fonte única de verdade** — campos no `DATA-MODEL`, requisitos não-funcionais no
  `NFR`, regras no `RULES-DICTIONARY`; nunca duplicados dentro das specs.

## Próximos passos

Comece pelo [Início rápido](#/inicio-rapido), entenda
[Os quatro níveis](#/quatro-niveis) e explore a
[Estrutura do repositório](#/estrutura).
