# Como usar

Os prompts e templates são **conteúdo reutilizável**, consumidos por:

- **instâncias de documentação** — cada projeto fornece seu próprio conteúdo
  (dicionários de campos/mensagens/regras/erros, modelo de dados) e usa estes
  prompts/templates como motor;
- **ferramentas** que leem e executam os prompts (ex.: `doc-template-studio`).

> O engine fornece **os prompts e os esqueletos**; o conteúdo específico de cada
> sistema vive na instância, não aqui.

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

## Esta documentação

Este site é um **template de GitHub Pages** que acompanha o engine. Para
publicá-lo e personalizá-lo, veja
[`docs/README.md`](#/file/docs/README.md):
todo o conteúdo vive em `docs/content/*.md` e a navegação é definida em
`docs/config.js`.
