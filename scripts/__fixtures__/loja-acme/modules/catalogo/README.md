# Domínio: Catálogo
> **Nível 1** - Visão estratégica do domínio - `CAT`

## Descrição
Produtos, categorias e busca.

### O que este domínio NÃO faz
| Descrição | Pertence a |
|---|---|
| Preço promocional | Vendas |

## Feature Sets
| Feature Set | Arquivo de Especificação (N2) | Descrição | Features |
|---|---|---|---|
| **Produtos** <small>CAT-PRD</small> | [produtos/README.md](./produtos/README.md) | cadastro e busca | 2 |

## Regras transversais de negócio
1. Todo produto pertence a uma categoria.

## Integrações com outros domínios
### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| **Vendas** | preço e estoque do produto | Serviço |
