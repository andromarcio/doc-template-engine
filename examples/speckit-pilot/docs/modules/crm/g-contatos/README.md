# Feature Set: Contatos
> **Nível 2** - Domínio: CRM - `CRM-CTT`

## Descrição
Cadastro, consulta e exclusão de contatos de uma organização.

**Não faz**: gestão de negócios/oportunidades vinculados ao contato (outro Feature Set).

---

## Features

| Feature | Arquivo | Prioridade | Descrição |
|---|---|---|---|
| Cadastrar Contato | [f-cadastrar-contato.md](./f-cadastrar-contato.md) | P1 | Cria um contato com e-mail único na organização |
| Pesquisar Contato | [f-pesquisar-contato.md](./f-pesquisar-contato.md) | P2 | Lista/filtra contatos com paginação |
| Excluir Contato | [f-excluir-contato.md](./f-excluir-contato.md) | P3 | Exclusão lógica, bloqueada se houver vínculos |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Lista de Contatos | `/contatos` | Pesquisar Contato, Excluir Contato |
| Novo Contato | `/contatos/novo` | Cadastrar Contato |

---

## Permissões por perfil

| Perfil | Cadastrar | Pesquisar | Excluir |
|---|---|---|---|
| Administrador | sim | sim | sim |
| Agente | sim | sim | não |
| Visualizador | não | sim | não |

---

*Domínio: CRM · Última revisão: —*
