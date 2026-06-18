# PROMPT 2A — N2 Negócio
## Feature Sets · Parte negocial

> **Modelo de estrutura**: `engine/templates/modules/_template-dominio/_template-feature-set/README.md` *(referência humana — o prompt já embute o esqueleto)*
> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 completo do domínio escolhido
> **Entrega**: rascunho do README.md de cada Feature Set com fluxo
> principal, telas e permissões — sem campos técnicos ou endpoints
>
> **Pré-requisito**: PROMPT_1B concluído para o domínio escolhido
> **Próximo passo**: após aprovação, usar PROMPT_2B com cada README.md gerado

---

## INSTRUÇÕES PARA O CLAUDE

Você vai detalhar os Feature Sets de um domínio do ponto de vista de negócio.
Foque em fluxos, jornadas e regras — sem mencionar endpoints, FKs ou libs.

Regras da sessão:
- Trabalhe um Feature Set de cada vez, na ordem que eu indicar.
- Ao completar as perguntas de um Feature Set, gere o artefato parcial
  e aguarde aprovação antes de iniciar o próximo.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== N1 DO DOMÍNIO ESCOLHIDO ===
[cole aqui o README.md completo do domínio]

---

## PASSO 1 — Confirmação dos Feature Sets

Leia o N1, identifique a sigla do domínio (ID do N1) e liste os Feature Sets.
Atribua a cada Feature Set uma **sigla** de exatamente 3 letras maiúsculas derivada do seu nome,
formando o ID `[SIGLA]-[SFS]` (ex.: Usuários → `[SIGLA]-USR`). A sigla deve ser única
dentro do domínio; respeite IDs já existentes se o N1 já tiver Feature Sets. Pergunte:

> "Identifiquei os seguintes Feature Sets no domínio **[nome]** (`[SIGLA]`):
>
> | Feature Set | ID |
> |---|---|
> | [Nome] | [SIGLA]-[SFS] |
> | [Nome] | [SIGLA]-[SFS] |
>
> Qual deles deseja detalhar primeiro?"

Aguarde minha escolha antes de prosseguir.

---

## PASSO 2 — Detalhamento negocial de cada Feature Set

Para cada Feature Set que eu indicar, faça as perguntas abaixo
em sequência, uma de cada vez, aguardando minha resposta:

**Pergunta 1 — Features**
> "Quais são as funcionalidades individuais deste grupo?
> Para cada uma: nome e uma linha do que o usuário consegue fazer."

**Pergunta 2 — Jornada principal**
> "Descreva a jornada principal do usuário dentro deste grupo,
> do início ao fim, em linguagem natural.
> O que ele faz primeiro? O que acontece depois? Como termina?"

**Pergunta 3 — Dependências entre funcionalidades**
> "Alguma funcionalidade depende de outra para existir ou funcionar?
> Existe alguma ordem obrigatória ou exclusão mútua entre elas?"

**Pergunta 4 — Telas**
> "Quais telas o usuário vai ver neste grupo de funcionalidades?
> Para cada tela: nome, o que ela mostra e quais funcionalidades ela atende."

**Pergunta 5 — Permissões (fonte única do projeto)**
> "Quem pode usar este grupo de funcionalidades?
> Liste os **perfis** de usuário envolvidos e, para **cada feature/ação** do
> Feature Set (pesquisar, cadastrar, editar, excluir, importar, visualizar…),
> diga **quais perfis podem executá-la**.
> Descreva em linguagem de negócio — sem mencionar nomes técnicos de roles.
> Esta é a **única** definição de permissões do projeto: perfis e permissões
> vivem **só no N2** — os N3 das features não tratam de permissões."

Com as respostas, gere o artefato parcial:

📄 `modules/[dominio]/[feature-set]/README.md` — seções negociais

**Gere exatamente esta estrutura — sem adicionar seções, subtítulos ou elementos não listados abaixo:**

```
# Feature Set: [Nome do Feature Set]
> **Nível 2** - Domínio: [Nome do Domínio] - `[SIGLA]-[SFS]`

## Descrição
[2-3 frases sobre o que faz]

**Não faz**: [o que está fora do escopo]

---

## Features

| Feature | Arquivo de Especificação (N3) | Descrição |
|---|---|---|
| **[ID]**: [Nome] | [[arquivo].md](./ [arquivo].md) | [descrição em uma linha] |

---

## Fluxo Principal

[diagrama Mermaid — ver regra abaixo]

[descrição textual numerada da jornada]

---

## Dependências entre features

[lista descrevendo pré-requisitos e relações entre features]

---

## Telas

| Tela | Rota sugerida | Features atendidas | Descrição |
|---|---|---|---|
| [nome] | `/[rota]` | **[ID]**: [Feature] | [descrição] |

---

## Permissões por perfil

[lista por perfil: o que cada um pode fazer]

---

## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| [data atual] | [Claude / autor] | N2 criado | Gerado pelo PROMPT 2A |
```

> **Regra do Fluxo principal** — O fluxo principal **sempre** deve ser gerado
> como um diagrama **Mermaid** (bloco ` ```mermaid `), usando `flowchart TD`.
> Não use ASCII art, lista numerada ou texto corrido para o fluxo.
> O diagrama é a **única** representação do fluxo: **não** o acompanhe de uma
> lista numerada, passo a passo ou descrição textual reexplicando os nós — a
> seção termina no próprio bloco Mermaid.
> Converta a jornada descrita na Pergunta 2 em nós e setas:
> - Ponto de entrada e resultado final como nós de terminal: `(["texto"])`
> - Etapas/features como nós de processo: `["texto"]`
> - Decisões como losangos: `{"texto?"}` com setas rotuladas (`-->|Sim|`, `-->|Não|`)
> - Use rótulos em linguagem de negócio (sem endpoints, FKs ou nomes técnicos).
> - **Envolva o texto dos NÓS em aspas duplas** (`["texto"]`, `(["texto"])`,
>   `{"texto?"}`) — sem aspas, caracteres como `'`, `?`, `,` e `()` quebram o
>   parser ("Syntax error in text").
> - **Rótulos de seta (`-->|texto|`) ficam SEM aspas** e sem `/`, `(` ou `)`
>   (use "e"/"ou" no lugar da barra). Não use parênteses dentro de um nó já
>   delimitado por `()`.
>
> Exemplo:
> ```mermaid
> flowchart TD
>     A(["Usuário abre o chamado"]) --> B["Registrar incidente"]
>     B --> C{"Tem anexo?"}
>     C -->|Sim| D["Anexar arquivo"]
>     C -->|Não| E["Classificar prioridade"]
>     D --> E
>     E --> F(["Chamado aberto"])
> ```

Após apresentar, pergunte:
> "O N2 de [Feature Set] está correto?
> Ajusta algo ou avanço para o próximo Feature Set?"

Repita o Passo 2 para cada Feature Set que eu indicar.

---

## PASSO 3 — Atualização do N1 (nível imediatamente anterior)

Sempre que um Feature Set (N2) for gerado ou alterado, verifique se o N1 do
domínio (`modules/[dominio]/README.md`) e o `modules/INDEX.md` ainda refletem
a realidade e atualize-os quando necessário:

- **Feature Sets do domínio**: o Feature Set deve constar na lista de
  Agrupamentos funcionais / Feature Sets do N1, com o ID atribuído
  (`[SIGLA]-[SFS]`).
- **Regras transversais**: se o N2 revelou uma regra que vale para o domínio
  inteiro, proponha incluí-la nas Regras transversais do N1.
- **Dependências entre domínios**: reflita no N1 e no INDEX qualquer
  dependência nova entre domínios surgida aqui.
- **Divergências**: sinalize com ⚠️ qualquer contradição entre o N2 e o N1.

Apresente as alterações propostas e peça aprovação antes de gravar:
> "Para manter o N1 consistente, proponho atualizar `[dominio]/README.md`
> (e o `modules/INDEX.md`): [lista]. Posso aplicar?"

---

## PASSO 4 — Confirmação de cobertura

Após todos os Feature Sets do domínio aprovados, confirme:
> "Todos os Feature Sets do domínio [nome] foram detalhados.
> Para especificar as features individualmente, use o PROMPT_3A."
