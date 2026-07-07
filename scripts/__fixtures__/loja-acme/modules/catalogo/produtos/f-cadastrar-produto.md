---
id: CAT-PRD-01
estado: implementado
gates:
  requisitos:  { aprovado: true, por: "PO Ana", em: "2026-06-18", pr: "#11" }
  modelo-dados: { aprovado: true, por: "DBA Zé", em: "2026-06-22", pr: "#13" }
  testes:      { aprovado: true, por: "QA Lia", em: "2026-06-26", pr: "#15" }
  codigo:      { aprovado: true, por: "TL Bia", em: "2026-06-30", pr: "#17" }
---
# Cadastrar Produto
> **Nível 3** - Feature Set: Produtos — Domínio: Catálogo - `CAT-PRD-01`

## Descrição
Operador cadastra um produto no catálogo.

## Origem
| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| [`STRY0013455`](../../_backlog/stry0013455.md) | Criação | cadastrar produto |

## Implementação
| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| endpoint produto | loja-api | src/produto | `main` |


## Métricas de tamanho
**Total: 6 PF**
