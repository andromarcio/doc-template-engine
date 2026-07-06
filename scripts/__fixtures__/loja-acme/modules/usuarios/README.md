# Domínio: Usuários
> **Nível 1** - Visão estratégica do domínio - `USR`

## Descrição
Identidade, cadastro de clientes e perfis de acesso.

### O que este domínio NÃO faz
| Descrição | Pertence a |
|---|---|
| Carrinho | Vendas |

## Feature Sets
| Feature Set | Arquivo de Especificação (N2) | Descrição | Features |
|---|---|---|---|
| **Cadastro** <small>USR-CAD</small> | [cadastro/README.md](./cadastro/README.md) | conta do cliente | 1 |
| **Permissões** <small>USR-PRM</small> | [permissoes/README.md](./permissoes/README.md) | perfis de acesso | 1 |

## Regras transversais de negócio
1. E-mail é único por cliente.

## Integrações com outros domínios
### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| **Vendas** | dados do cliente | Serviço |
