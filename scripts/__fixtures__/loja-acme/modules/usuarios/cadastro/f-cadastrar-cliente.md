---
id: USR-CAD-01
estado: implementado
gates:
  requisitos:  { aprovado: true, por: "PO Ana", em: "2026-06-18", pr: "#11" }
  modelo-dados: { aprovado: true, por: "DBA Zé", em: "2026-06-22", pr: "#13" }
  testes:      { aprovado: true, por: "QA Lia", em: "2026-06-26", pr: "#15" }
  codigo:      { aprovado: true, por: "TL Bia", em: "2026-06-30", pr: "#17" }
---
# Cadastrar Cliente
> **Nível 3** - Feature Set: Cadastro — Domínio: Usuários - `USR-CAD-01`

## Descrição
Cliente cria a própria conta com e-mail e dados básicos.

## Origem
| História (ServiceNow) | Tipo | Critérios cobertos |
|---|---|---|
| [`STRY0013002`](../../_backlog/stry0013002.md) | Criação | criar conta |

## Implementação
| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| endpoint cadastro | loja-api | src/cliente | `main` |
| formulário cadastro | loja-web | src/signup | `main` |


## Métricas de tamanho
**Total: 7 PF**
