---
id: VND-CHK-01
estado: em-desenvolvimento
gates:
  requisitos:  { aprovado: true, por: "PO Ana", em: "2026-06-18", pr: "#11" }
  modelo-dados: { aprovado: true, por: "DBA Zé", em: "2026-06-22", pr: "#13" }
  testes:      { aprovado: true, por: "QA Lia", em: "2026-06-26", pr: "#15" }
  codigo:      { aprovado: false, por: "", em: "", pr: "" }
---
# Calcular Frete
> **Nível 3** - Feature Set: Checkout — Domínio: Vendas - `VND-CHK-01`

## Descrição
Sistema calcula o frete pelo CEP de destino.

## Origem
| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| [`STRY0012345`](../../_backlog/stry0012345.md) | Criação | calcular frete pelo CEP |

## Implementação
| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| endpoint frete | loja-api | src/frete | `main` |


## Métricas de tamanho
**Total: 6 PF**
