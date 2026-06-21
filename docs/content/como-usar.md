# Como usar

Os prompts e templates são **conteúdo reutilizável**, consumidos por:

- **instâncias de documentação** — cada projeto fornece seu próprio conteúdo
  (dicionários de campos/mensagens/regras/erros, modelo de dados) e usa estes
  prompts/templates como motor;
- **ferramentas** que leem e executam os prompts (ex.: `doc-template-studio`).

> O engine fornece **os prompts e os esqueletos**; o conteúdo específico de cada
> sistema vive na instância, não aqui.

## Contexto persistente do projeto

Para que o agente **sempre** carregue o contexto do sistema sem que você o recole a
cada sessão, a instância mantém um `CLAUDE.md` na sua raiz (template em
`engine/templates/global/CLAUDE.md`). O Claude Code lê esse arquivo automaticamente
no início de toda sessão; ele é um **índice enxuto** que importa o contexto mínimo
— `global/MASTER.md`, `global/N0_PRODUCT_VISION.md` e `modules/INDEX.md`. Os
arquivos pesados (dicionários, data-models, N1–N3) continuam lidos **sob demanda**
pela skill `analista-requisitos`, que carrega esse índice na abertura da sessão.

## Skills recomendadas

O método foi desenhado para uso com as skills:

- **`analista-requisitos`** — especificação N0–N3.
- **`apf-cpm`** — Análise de Pontos de Função (IFPUG CPM 4.3.1).

## Um fluxo típico

```text
1. TR   — triagem da necessidade (criar? alterar?)
2. HU   — registrar a história (se vier do ServiceNow)
3. 3A   — especificar a feature (negócio)  →  validar
4. 3B   — complementar (técnico) + dimensionar (PF/CFP)
5. git  — implementar referenciando os IDs
```

> 💡 Para conduzir as sessões de negócio (N0 → N1 → N2 → N3), o
> [**Guia de entrevista com o PO**](#/entrevista-po) reúne, num só lugar, todas as
> perguntas que o analista faz — com o roteiro pronto para levar à reunião.

## Esta documentação

Este site é um **template de GitHub Pages** que acompanha o engine. Para
publicá-lo e personalizá-lo, veja
[`docs/README.md`](#/file/docs/README.md):
todo o conteúdo vive em `docs/content/*.md` e a navegação é definida em
`docs/config.js`.
