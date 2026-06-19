# Os quatro níveis

O método organiza a especificação numa hierarquia de **quatro níveis de detalhe**
(N0 → N3). Cada nível responde a uma pergunta diferente, é mantido por um público
diferente e produz um artefato próprio. Quanto mais alto o número, mais fino o
detalhe: o **N0** enxerga o produto inteiro; o **N3** descreve uma única
funcionalidade campo a campo.

| Nível | Nome | Pergunta | Escopo | Artefato |
|-------|------|----------|--------|----------|
| **[N0](#/n0)** | Visão de Produto | *Por que este software existe?* | objetivo, público-alvo, proposta de valor | `global/N0_PRODUCT_VISION.md` |
| **[N1](#/n1)** | Domínio | *Quais são as grandes áreas?* | grandes áreas funcionais e seus limites | `modules/[dominio]/README.md` |
| **[N2](#/n2)** | Feature Set | *O que o usuário faz em cada área?* | conjuntos de funcionalidades, fluxos, telas, permissões | `modules/[dominio]/[feature-set]/README.md` |
| **[N3](#/n3)** | Feature | *Como funciona cada funcionalidade?* | campos, regras de negócio, cenários | `modules/[dominio]/[feature-set]/[feature].md` |

## Como os níveis se encaixam

```text
N0  Visão de Produto        "por que existe"
 └─ N1  Domínio             "grandes áreas"           ex.: Vendas (VND)
     └─ N2  Feature Set     "o que o usuário faz"     ex.: Checkout (VND-CKT)
         └─ N3  Feature     "como funciona, campo a campo"  ex.: Calcular Frete (VND-CKT-01)
```

Cada nível **parte do nível acima** e é **confrontado contra ele**: o N0 dá a
direção; os demais não podem extrapolar o escopo nem contradizer os objetivos do
produto.

## Identificadores

Os IDs encadeiam os níveis e tornam tudo rastreável:

- **N1** recebe uma **sigla de 3 letras** (ex.: `USR`).
- **N2** herda a sigla do domínio e ganha a sua (ex.: `USR-PRM`).
- **N3** recebe um número dentro do Feature Set (ex.: `USR-PRM-01`).

## Negócio e Técnico

Os níveis **N1 e N3** são produzidos em **duas passadas** — primeiro **negócio
(A)**, depois **técnico (B)**; o **N2 é integralmente negocial** (passada única).
Veja [Negócio e Técnico](#/negocio-tecnico).

Explore cada nível: [N0](#/n0) · [N1](#/n1) · [N2](#/n2) · [N3](#/n3).
