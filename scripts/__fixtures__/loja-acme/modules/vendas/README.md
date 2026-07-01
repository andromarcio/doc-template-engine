# Domínio: Vendas
> **Nível 1** - Visão estratégica do domínio - `VND`

## Descrição
Carrinho e checkout — a jornada de compra.

### O que este domínio NÃO faz
| Descrição | Pertence a |
|---|---|
| Cadastro de produtos | Catálogo |

## Feature Sets
| Feature Set | Arquivo de Especificação (N2) | Descrição | Features |
|---|---|---|---|
| **Carrinho** <small>VND-CAR</small> | [carrinho/README.md](./carrinho/README.md) | itens antes do checkout | 2 |
| **Checkout** <small>VND-CHK</small> | [checkout/README.md](./checkout/README.md) | frete, cupom e pedido | 3 |

## Regras transversais de negócio
1. Toda operação exige cliente autenticado.

## Integrações com outros domínios
### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| — | — | — |
