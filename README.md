# doc-template-engine

Motor de **prompts** e **templates** do framework `doc-template` — um método para
especificar software em quatro níveis, da visão de produto até a feature, gerando
documentação estruturada e rastreável.

## Os quatro níveis

| Nível | Nome | Escopo |
|-------|------|--------|
| **N0** | Visão de Produto | objetivo, público, proposta de valor |
| **N1** | Domínio | grandes áreas funcionais do sistema |
| **N2** | Feature Set | conjuntos de funcionalidades dentro de um domínio |
| **N3** | Feature | especificação detalhada: campos, regras, cenários |

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
