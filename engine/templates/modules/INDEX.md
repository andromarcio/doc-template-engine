# Índice geral de módulos
> Visão consolidada de todos os domínios do sistema.
> Mantido via PROMPT 1A/1B — atualizar após cada N1 aprovado.

---

## Domínios

| Domínio | Pasta | Responsabilidade | Feature Sets |
|---|---|---|---|
| [Nome do Domínio](./[dominio]/README.md) | `modules/[dominio]/` | [responsabilidade em uma frase] | [N] |

---

## Rastreabilidade: história → spec → código

| História (ServiceNow) | Feature | Domínio | Status | PF | CFP | Repositórios |
|---|---|---|---|---|---|---|
| [`STRYxxxxxxx`](./_backlog/[chave].md) | [[SIGLA]-[SFS]-[NN]: Nome da Feature](./[dominio]/[feature-set]/[feature].md) | [Domínio] | 📋 Especificado | — | — | — |

<!--
  História: chave do ServiceNow que originou a feature (seção "Origem" do N3).
  Uma feature pode ter mais de uma história; uma história, mais de uma feature.
  PF e CFP: preencher após PROMPT_3B. Ver critérios em global/SIZING.md.
  Totais vigentes excluem features ❌ Deprecadas.
-->

**Total vigente: — PF · — CFP** *(dimensionamento pendente — preencher via PROMPT_3B; critérios em `global/SIZING.md`)*

---

<!-- GATES:INICIO -->
## Esteira de checkpoints (gates)

> ⚙️ **Seção gerada por `scripts/gates.py` — não editar à mão.**
> Espelha o estado de cada feature na esteira (CP1 requisitos → CP2 modelo de dados →
> CP3 testes → CP4 código). Regenerada a cada merge na `main` pelo workflow
> `promote-estado.yml`, ou sob demanda com `python scripts/gates.py promote --write`.

_(será preenchida na primeira execução de `scripts/gates.py promote`)_
<!-- GATES:FIM -->

---

<!-- PENDENCIAS:INICIO -->
## Pendências de especificação

> ⚙️ **Seção gerada pelo PROMPT_PENDENCIAS (PD) — não editar à mão.**
> Varre as fontes (`_backlog/`, READMEs de N2, N3 com ⚠️) e espelha aqui o que está
> **pendente de especificar**. Edições manuais entre os marcadores são sobrescritas na
> próxima execução. Reflete o estado em **[AAAA-MM-DD]** — rode o **PD** para atualizar.

### Existência (falta N3)

> Algo é conhecido como necessário mas ainda **não tem N3**. Resolva pela rota indicada.

| Item | Nível | Origem | Rota |
|---|---|---|---|
| [Cancelar pedido] | N3 | [`STRYxxxxxxx`](./_backlog/[chave].md) · N2 [Feature Set] | 3A |

### Conteúdo (⚠️ em aberto)

> O artefato **existe**, mas tem lacunas/suposições aguardando esclarecimento.

| Feature | Lacuna | Arquivo |
|---|---|---|
| [Nome da feature] | [pergunta em aberto, ex.: idade mínima exigida?] | [arquivo.md](./[dominio]/[feature-set]/[feature].md) |
<!-- PENDENCIAS:FIM -->

---

## Entidades consolidadas

| Entidade | Domínio | N1 de origem |
|---|---|---|
| [Nome da Entidade] | [Domínio] | [[dominio]/README.md](./[dominio]/README.md) |

---

## Eventos do sistema

| Evento | Publicado por | Consumido por | Payload principal |
|---|---|---|---|
| `[entidade.acao]` | [Domínio] | [Domínio] | `{ [campos] }` |

---

## Mapa de integrações entre domínios

| Domínio origem | Depende de | Tipo | Descrição |
|---|---|---|---|
| [Domínio] | [Domínio] | Leitura / Escrita / Evento | [o que consome e como] |

---

## Legenda de status

Estados da **esteira de checkpoints**, derivados dos `gates` no front-matter de cada N3.
A próxima etapa só ocorre após a aprovação da anterior — ordem: requisitos → modelo-dados → testes → código.

| Ícone | Estado | Checkpoint | Descrição |
|---|---|---|---|
| ✏️ | rascunho | — | N3 em elaboração, nenhum gate aprovado |
| 📝 | requisitos-aprovados | CP1 (PO) | Requisitos validados — aguardando modelo de dados |
| 🧱 | modelo-validado | CP2 (DBA) | Modelo físico de dados validado — aguardando testes |
| 📋 | especificado | CP3 (QA) | **Pronto para desenvolvimento** (CP1+CP2+CP3 aprovados) |
| 🔄 | em-desenvolvimento | — | Implementação em andamento (estado manual) |
| ✅ | implementado | CP4 (code review) | Em produção, rastreabilidade preenchida |
| ⚠️ | revisao-necessaria | — | Spec desatualizada em relação ao código |
| ❌ | deprecado | — | Feature removida do sistema |
