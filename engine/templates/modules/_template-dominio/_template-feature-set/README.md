# Feature Set: [Nome do Feature Set]
> **Nível 2** - Domínio: [Nome do Domínio] - `[SIGLA]-[SFS]`

## Descrição
[Descrição em 2-3 frases do que este Feature Set faz.]

**Não faz**: [o que está explicitamente fora do escopo.]

---

## Features

<!--
  A coluna Prioridade ordena as user stories na exportação ao spec-kit
  (1 N3 = 1 user story; este Feature Set = 1 "feature" do spec-kit). P1 = incremento
  mínimo (MVP); P2/P3 = incrementos seguintes. Mantenha coerência com o campo
  `prioridade` do front-matter de cada N3.
-->

| Feature | Arquivo | Prioridade | Descrição |
|---|---|---|---|
| [Nome da Feature] | [[feature].md](./[feature].md) | [P1 / P2 / P3] | [descrição em uma linha] |

---

## Fluxo principal

```mermaid
flowchart TD
    A([Ponto de entrada do usuário]) --> B[Feature 1]
    B --> C{Decisão?}
    C -->|Sim| D[Resultado]
    C -->|Não| E[Feature 2]
    E --> F([Resultado final])
    D --> F
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| [Feature A] depende de [Feature B] | [por quê e como] |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| [Nome da tela] | `/[rota]` | [Feature 1], [Feature 2] |

---

## Permissões por perfil

| Perfil | [Feature 1] | [Feature 2] |
|---|---|---|
| [perfil admin] | [o que pode] | [o que pode] |
| [perfil agente] | [o que pode] | [o que pode] |
| [perfil viewer] | [o que pode] | [o que pode] |

---

## Histórias de usuário relacionadas

<!--
  Consolida as histórias (ServiceNow) que motivaram as features deste Feature
  Set. Visão de cobertura: de uma história, quais features a realizam.
  Detalhe por feature fica na seção "Origem" de cada N3.
-->

| História (ServiceNow) | Features (N3) que a realizam |
|---|---|
| [`STRYxxxxxxx`](../../_backlog/[chave].md) | [Feature 1], [Feature 2] |

---

---

*Domínio: [Nome do Domínio] · Última revisão: —*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
