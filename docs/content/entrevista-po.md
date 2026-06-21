# Guia de entrevista com o PO — especificação negocial

Este é o **roteiro de perguntas** que o analista de requisitos usa para conduzir o PO
e especificar **todos os artefatos de negócio** do framework — dos globais (N0) até a
feature (N3). É a parte **negocial**: nada de tabela de banco, endpoint, FK ou
tecnologia.

> 💡 **As perguntas aqui não são inventadas.** Elas são exatamente as que já estão
> embutidas nos prompts `1A`, `2A` e `3A` (e nos atalhos `CRUD`/`Wizard`). Este guia
> reúne todas num só lugar e explica **o que cada resposta vira** — pensado para quem
> está começando a usar o framework.

**Quem é quem:**

| Papel | Responsabilidade na entrevista |
|---|---|
| **PO** (Product Owner) | A voz do negócio — responde às perguntas em linguagem natural |
| **Analista de requisitos** | Conduz a sessão, faz as perguntas, aplica os dicionários e escreve o artefato |

---

## Antes de começar: 6 regras de ouro

1. **Linguagem de negócio pura.** Nada de "endpoint", "FK", "enum", "tabela". Se
   precisar do termo técnico, traduza (ver *Negócio e Técnico*).
2. **Uma pergunta de cada vez.** Aguarde a resposta antes da próxima. Em `3A` as
   perguntas vêm em **blocos temáticos** — um bloco por vez.
3. **Um artefato por vez.** Gere, peça aprovação, só então avance para o próximo.
4. **Lacuna nunca vira chute.** O que faltar, marque com **⚠️** e pergunte. Não
   invente regra de negócio.
5. **Canônicos são automáticos — não pergunte o óbvio.** Se um campo é canônico
   (CPF, e-mail, CEP…), o `FIELD-DICTIONARY` já traz as validações: pergunte só
   *obrigatoriedade* e *unicidade*. Se uma regra é canônica (maioridade, vigência…),
   o `RULES-DICTIONARY` já traz o comportamento: pergunte só os *parâmetros*
   (ex.: idade mínima). Veja *[O que NÃO perguntar](#o-que-nao-perguntar)*.
6. **Saiba distinguir três coisas que parecem regra mas não são:**
   - a **reação** do sistema ("não salva", "exibe mensagem", "bloqueia") → vai para
     os **Cenários**, não para as regras;
   - o **texto** da mensagem → vai para o `MESSAGE-DICTIONARY`;
   - *quão bem* o sistema se comporta (desempenho, segurança, auditoria,
     disponibilidade) → é **NFR**, não regra de negócio.
   - Uma **regra de negócio** é uma **invariante**: *o quê* o sistema sempre garante,
     atômica (uma restrição por item) e verificável.

---

## Por onde entrar: top-down ou bottom-up

Você não precisa preencher tudo na ordem N0→N1→N2→N3. Há dois caminhos:

| Caminho | Quando usar | Sequência |
|---|---|---|
| **Top-down** | Produto/área novo, visão primeiro | N0 → `1A` (N1) → `2A` (N2) → `3A` (N3) |
| **Bottom-up** | Você já tem uma feature concreta em mente | `3A` direto (modo B) → depois sintetiza `B2` (N2) e `B1` (N1) |

E há dois pontos de entrada que **antecedem** a especificação:

- **`TR` — Triagem**: chegou uma necessidade e você não sabe se já existe algo? A
  triagem descobre o que está documentado e indica a rota (criar/alterar).
- **`HU` — História de usuário**: a demanda veio do ServiceNow? Registre a história
  primeiro; ela vira a `## Origem` da feature.

> 💡 **Atalhos.** Para um **cadastro completo** (as 5 operações) use `CRUD`; para um
> **processo guiado multi-etapas** use `Wizard`. Ambos geram N2 + N3 numa sessão só —
> ver *[Atalhos](#atalhos-crud-e-wizard)*.

---

## Mapa: cada resposta vira um artefato

| Nível | Prompt | Pergunta-chave | A resposta vira |
|---|---|---|---|
| **N0** | (manual / liderança) | "Que problema o produto resolve e para quem?" | `global/N0_PRODUCT_VISION.md` |
| **N1** | `1A` | "Quais são as grandes áreas de negócio?" | `modules/[dom]/README.md` |
| **N2** | `2A` | "Quais funcionalidades há neste grupo e quem pode usá-las?" | `modules/[dom]/[fs]/README.md` |
| **N3** | `3A` | "O que esta funcionalidade faz, campo a campo?" | `modules/[dom]/[fs]/f-*.md` |

---

## Nível 0 — Visão de Produto (global)

> **Quem mantém:** PO / liderança de produto. **Quando:** uma vez no início; revisado
> só quando a *estratégia* muda — não a cada feature. O N0 dá a direção; os N1–N3 são
> conferidos contra ele para não extrapolar o escopo.

**Perguntas:**

1. **Propósito** — Em um parágrafo: que problema este produto resolve e por que ele
   deve existir? (foque na dor real, não na solução técnica)
2. **Proposta de valor** — Em uma a três frases: o que o usuário ganha que justifica
   adotar este produto em vez de uma alternativa ou do status quo?
3. **Personas** — Quem são os usuários? Para cada um: papel/contexto, principal dor
   hoje e o que espera do produto.
4. **Objetivos do produto** — O *quê* o produto busca alcançar (em negócio, sem
   solução técnica)?
5. **Métricas de sucesso (KPIs)** — Como saberemos que está dando certo? O que cada
   indicador mede e qual a meta?
6. **Escopo** — O que está **dentro**? E o que o produto deliberadamente **não faz**
   (não-objetivos, para conter o escopo)?
7. **Domínios previstos** — Quais as grandes áreas que comporão o sistema? (visão
   preliminar — cada uma vira um N1)
8. **Tom de voz e princípios de experiência** — Como o produto "fala"? Que princípios
   guiam a experiência (ex.: "menos cliques", "nunca perder dados")?
9. **Restrições e premissas** — Há restrição de negócio, regulatória ou de mercado?
   Alguma premissa que, se mudar, altera a visão?

---

## Globais de contexto — MASTER e dicionários

O `MASTER.md` é majoritariamente **técnico** (stack, convenções de código) e se
preenche com o dev. Do ponto de vista **negocial**, o PO só precisa cravar:

1. **Identidade do sistema** — Sigla (5 letras), nome por extenso e descrição em uma
   frase.
2. **Decisões transversais com impacto de negócio** — a principal é: a exclusão é
   **física** (some) ou **lógica** (o registro é desativado, mas o histórico é
   preservado)? Isso muda o comportamento que o usuário percebe.

> **E os dicionários (FIELD / RULES / MESSAGE / ERROR)?** Eles são globais, mas **não
> têm entrevista própria**: vão se preenchendo sozinhos conforme um campo ou uma regra
> **se repete** entre features. Quando o analista reconhece um canônico durante o `3A`,
> ele já referencia o dicionário em vez de perguntar tudo de novo.

---

## Nível 1 — Domínio (prompt `1A`)

> **Insumo:** visão geral do sistema. **Entrega:** o `README.md` de cada domínio, com
> descrição, limites, Feature Sets e regras transversais.

**Mapeamento geral (uma vez):**

> "Quais são as **grandes áreas de negócio** do sistema? Liste cada uma com nome e uma
> frase do que ela cuida."

*(O analista propõe uma sigla de 3 letras por domínio — ex.: `CRM` — e confirma.)*

**Depois, para cada domínio (uma pergunta de cada vez):**

1. **Propósito e limites** — Em uma ou duas frases: o que a área **faz**? E o que ela
   explicitamente **não faz** — onde termina sua responsabilidade?
2. **Agrupamentos funcionais** — Quais são os grupos de funcionalidade dentro desta
   área? Para cada um: nome e uma linha. (pense no que o usuário faz, não em como o
   sistema funciona — cada grupo vira um Feature Set)
3. **Regras que valem para tudo nesta área** — Existe alguma regra de negócio que se
   aplica a *tudo* dentro desta área? (ex.: "qualquer ação exige aprovação de gerente")
4. **Relação com outras áreas** — Esta área depende de informações de outras? Outras
   dependem desta? (em linguagem de negócio)

> ⚠️ **Atenção ao roteamento na pergunta 3:** se a resposta descreve uma *qualidade*
> (tempo de resposta, segurança, auditoria), isso é **NFR**, não regra transversal —
> registre no `NFR.md`.

---

## Nível 2 — Feature Set (prompt `2A`)

> **Insumo:** o N1 do domínio. **Entrega:** o `README.md` do Feature Set, com fluxo,
> telas e **permissões**.

Para cada Feature Set (uma pergunta de cada vez):

1. **Features** — Quais são as funcionalidades individuais deste grupo? Para cada uma:
   nome e uma linha do que o usuário consegue fazer.
2. **Jornada principal** — Descreva a jornada do usuário do início ao fim, em
   linguagem natural. O que ele faz primeiro? O que acontece depois? Como termina?
3. **Dependências entre funcionalidades** — Alguma funcionalidade depende de outra
   para existir/funcionar? Há ordem obrigatória ou exclusão mútua?
4. **Telas** — Quais telas o usuário vai ver? Para cada uma: nome, o que mostra e quais
   funcionalidades atende.
5. **Permissões** — Quem pode usar este grupo? Liste os **perfis** e, para **cada
   ação** (pesquisar, cadastrar, editar, excluir, importar, visualizar…), quais perfis
   podem executá-la.

> 🔑 **Permissões vivem SÓ no N2.** Esta é a **única** definição de permissões do
> projeto. Os N3 das features **não** tratam de quem pode fazer o quê — eles herdam do
> Feature Set. Por isso a pergunta 5 é feita aqui, e não no `3A`.

---

## Nível 3 — Feature (prompt `3A`)

> **Insumo:** N1 + N2 (ambos opcionais no bottom-up). **Entrega:** o `.md` da feature,
> com objetivo, campos (Label PO), regras e cenários Gherkin. As perguntas vêm em
> **cinco blocos** — um bloco por vez.

### Bloco A — Visão geral
1. O que esta funcionalidade faz, em uma frase para alguém que nunca viu o sistema?
2. Quem a aciona: usuário interno, externo ou o próprio sistema?

### Bloco B — Campos em linguagem de negócio
3. Quais informações o usuário **preenche ou visualiza**? Para cada uma: nome em
   português, tipo (texto, número, data, lista de opções, sim/não, arquivo), se é
   obrigatória e qualquer regra de preenchimento que o usuário precise saber.
4. Existe alguma informação que o **sistema preenche automaticamente**? Qual e quando?

> Se um campo é escolhido a partir de **outro cadastro** (ex.: selecionar um Cliente já
> cadastrado), ele é um **campo de seleção** — o analista pergunta só se carrega a
> lista toda ou busca conforme digita, e se algum registro fica de fora (ex.: só ativos).

### Bloco C — Regras de negócio
5. Descreva o que acontece **passo a passo quando tudo dá certo** (caminho feliz).
6. Existe alguma **condição que impede ou altera** o comportamento?
7. Quando a funcionalidade conclui, o sistema faz algo **automaticamente**? (e-mail,
   tarefa, notificação)
8. Esta ação precisa ficar registrada no **histórico de auditoria**? (sim/não)

> A pergunta 8 vira o NFR de auditoria (**AUD-01**), não uma regra de negócio. As
> regras coletadas são quebradas em **itens atômicos** (uma invariante cada).

### Bloco D — Cenários alternativos
9. Quais **erros** o usuário pode cometer? Para cada um: o que aconteceu e qual
   mensagem deve aparecer?
10. Pode ocorrer **conflito com dados já existentes**? O que acontece?
11. O que acontece se um usuário **sem permissão** tentar usar a funcionalidade?
12. Existe alguma **situação especial** que muda o comportamento? (cadastro arquivado,
    período de carência, conta suspensa)

### Bloco E — Interface
13. **Onde** esta funcionalidade aparece na tela? (formulário, modal, botão em lista,
    página própria)
14. O que o usuário vê **durante o processamento**? E em caso de **erro**? E quando
    **não há dados**?
15. Qual o **retorno visual** após a ação? (toast, redirect, relatório)

> A pergunta 13 classifica a feature em **Tela própria** (tem rota/formulário próprio)
> ou **Ação em tela** (disparada de dentro de outra tela).

---

## Atalhos: CRUD e Wizard

Quando o padrão é conhecido, não precisa rodar `2A` + cinco vezes o `3A`.

### `CRUD` — cadastro completo (N2 + 5 operações)
Você descreve a entidade **uma vez**; Cadastro é a fonte e Pesquisa/Edição/Exclusão/
Visualização são **derivadas** dele. Perguntas centrais:

1. Qual o **nome da entidade** (ex.: Cliente, Fundo Gerido)?
2. O que este cadastro permite fazer — e o que **não** faz?
3. Qual campo **identifica unicamente** cada registro?
4. Liste os **campos**: nome, tipo, obrigatório, qual é único.
5. Algum campo é preenchido **automaticamente**?
6. A **exclusão** é física ou lógica?
7. O registro pode ter **vínculos**? O que acontece ao excluir um com vínculos?
8. **Permissões** por operação (perfis × pesquisar/cadastrar/editar/excluir/visualizar).
9. A **pesquisa** tem ordenação padrão, carga inicial ou limite de resultados?
10. Precisa de **auditoria**? (sim/não)

### `Wizard` — processo guiado multi-etapas
Gera a feature principal multi-etapas **mais** as auxiliares (retomar rascunho,
acompanhar status, cancelar). Você descreve **o processo e a lista ordenada de etapas**
— o que se coleta/decide em cada uma, se dá para salvar e retomar, como acompanhar e o
que acontece ao cancelar. O roteiro detalhado está no `PROMPT_WIZARD`.

---

## O que NÃO perguntar

Perguntar isto é desperdício (ou erro de altitude):

| Não pergunte | Porquê |
|---|---|
| Como validar CPF, e-mail, CEP, senha… | Campo **canônico** → o `FIELD-DICTIONARY` já define. Pergunte só obrigatoriedade/unicidade |
| Como se comporta maioridade, vigência, cooldown… | Regra **canônica** → o `RULES-DICTIONARY` já define. Pergunte só os parâmetros |
| Permissões no `3A` | Permissões vivem **só no N2** |
| "Qual o tempo de resposta? É seguro? Fica auditado?" | Isso é **NFR** (quão bem), não regra de negócio (o quê) |
| Endpoint, tabela, FK, lib, nome de coluna | Técnico → fica para o `3B`/`1B`, fora do negocial |

---

## Checklist consolidado — a lista de perguntas

Para imprimir e levar para a reunião. Pule o que os dicionários já respondem.

**N0 — Visão de Produto**
- [ ] Que problema resolve e por quê?
- [ ] Proposta de valor (vs. alternativa/status quo)?
- [ ] Personas: papel, dor, expectativa?
- [ ] Objetivos do produto?
- [ ] KPIs e metas?
- [ ] Escopo: dentro × fora (não-objetivos)?
- [ ] Grandes áreas (domínios) previstas?
- [ ] Tom de voz e princípios de experiência?
- [ ] Restrições/premissas (negócio, regulatório)?

**Global — MASTER**
- [ ] Sigla, nome e descrição do sistema?
- [ ] Exclusão física ou lógica (preserva histórico)?

**N1 — Domínio (por área)**
- [ ] O que a área faz / não faz (limites)?
- [ ] Quais grupos de funcionalidade (Feature Sets)?
- [ ] Regras que valem para a área inteira?
- [ ] Dependências com outras áreas?

**N2 — Feature Set (por grupo)**
- [ ] Quais features individuais?
- [ ] Jornada principal (início → fim)?
- [ ] Dependências/ordem entre features?
- [ ] Telas (nome, conteúdo, features atendidas)?
- [ ] Perfis × permissão por ação?

**N3 — Feature (por funcionalidade)**
- [ ] O que faz (uma frase)? Quem aciona?
- [ ] Campos: nome, tipo, obrigatório, regra?
- [ ] Campos automáticos (qual e quando)?
- [ ] Caminho feliz passo a passo?
- [ ] Condições que impedem/alteram o comportamento?
- [ ] Ações automáticas ao concluir (e-mail, notificação)?
- [ ] Precisa de auditoria?
- [ ] Erros possíveis + mensagem?
- [ ] Conflitos com dados existentes?
- [ ] Acesso negado: o que acontece?
- [ ] Situações especiais (arquivado, suspenso)?
- [ ] Onde aparece na tela?
- [ ] Estados: processando, erro, vazio?
- [ ] Retorno visual após a ação?

---

## Depois do negócio

Com os artefatos negociais aprovados, o ciclo continua na parte **técnica** e de
dimensionamento — fora do escopo deste guia:

- **`3B`** — complementa cada N3 com API, eventos, AuditLog e atualiza o `DATA-MODEL`.
- **`1B`** — complementa o N1 com entidades e integrações técnicas.
- **`CT`** — conta os Pontos de Função (APF).
- **`PD`** — gera o painel do que ainda **falta especificar** no `INDEX.md`.

> 💡 Veja o fluxo completo em *Como o método flui* e a lista de prompts em *Prompts*.
