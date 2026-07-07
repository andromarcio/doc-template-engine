---
id: VND-CAR-01
estado: implementado
gates:
  requisitos:  { aprovado: true, por: "PO Ana", em: "2026-06-18", pr: "#11" }
  modelo-dados: { aprovado: true, por: "DBA Zé", em: "2026-06-22", pr: "#13" }
  testes:      { aprovado: true, por: "QA Lia", em: "2026-06-26", pr: "#15" }
  codigo:      { aprovado: true, por: "TL Bia", em: "2026-06-30", pr: "#17" }
---
# Adicionar ao Carrinho
> **Nível 3** - Feature Set: Carrinho — Domínio: Vendas - `VND-CAR-01`

## Descrição
Cliente adiciona um produto ao carrinho.

## Origem
| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| [`STRY0012501`](../../_backlog/stry0012501.md) | Alteração | recalcular total do carrinho |
| [`STRY0013700`](../../_backlog/stry0013700.md) | Criação | adicionar item |

## Implementação
| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| componente carrinho | loja-web | src/cart | `main` |


## Métricas de tamanho
**Total: 5 PF**
