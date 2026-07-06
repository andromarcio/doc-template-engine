# Esteira de checkpoints (gates)

No desenvolvimento real existem **validações humanas** entre as etapas: aprovar
requisitos, validar o modelo físico de dados, validar os casos de teste, revisar
o código. A esteira de checkpoints torna isso um **fluxo automatizado** em que a
**próxima etapa só ocorre após a aprovação da anterior** — e responde de forma
objetiva à pergunta *"os requisitos já estão prontos para serem implementados?"*.

## Os quatro checkpoints

Cada checkpoint (gate) é uma **aprovação humana** sobre um artefato que o método
já produz:

| Checkpoint | Valida | Prompt | Quem aprova |
|---|---|---|---|
| **CP1** | Requisitos (N3/N2/N1 negociais) | `3A` / `1A` / `2A` | PO / Negócio |
| **CP2** | Modelo físico de dados (`DATA-MODEL.md`) | `3B` / `1B` / `R2` | DBA / Arquiteto |
| **CP3** | Casos de teste | `5B` (QA) | QA |
| **CP4** | Código gerado | guiado por `5A` (SDD) | Tech Lead |

## A máquina de estados

```text
🆕 → [CP1 requisitos · PO] → 📝 → [CP2 modelo-dados · DBA] → 🧱
   → [CP3 testes · QA] → 📋 PRONTO P/ DEV → [CP4 código · Tech Lead] → ✅
```

| Ícone | Estado | Significado |
|---|---|---|
| ✏️ | rascunho | nenhum gate aprovado |
| 📝 | requisitos-aprovados | CP1 ok |
| 🧱 | modelo-validado | CP2 ok |
| 📋 | especificado | CP3 ok — **pronto para desenvolvimento** |
| 🔄 | em-desenvolvimento | implementação em andamento (manual) |
| ✅ | implementado | CP4 ok |

## Fonte de verdade: o front-matter do N3

Cada feature (N3) carrega a sua esteira no front-matter. É o que a CI lê para
**bloquear** ou **liberar** a etapa seguinte:

```yaml
---
id: "USR-PRM-01"
servicenow: "STRY0012345"
estado: modelo-validado        # DERIVADO dos gates (verificado, não editado à mão)
gates:
  requisitos:   { aprovado: true,  por: "ana.po",  em: 2026-06-20, pr: 41 }
  modelo-dados: { aprovado: true,  por: "bru.dba", em: 2026-06-23, pr: 42 }
  testes:       { aprovado: false, por: "", em: "", pr: "" }
  codigo:       { aprovado: false, por: "", em: "", pr: "" }
---
```

O `modules/INDEX.md` é apenas um **espelho** regenerado a partir desses N3 — mesma
filosofia das seções *Pendências* e *Contagem-PF*.

## "Os requisitos estão prontos para implementar?"

Deixa de ser uma reunião e vira **uma consulta**:

> **Pronto para dev** ⇔ `estado == especificado` (ou seja, CP1 ∧ CP2 ∧ CP3 aprovados).

A granularidade é **por feature (N3)**; uma história do ServiceNow está pronta
quando **todas** as features que a realizam chegaram a `📋 especificado`. Onde isso
aparece na prática:

- como **status check** que **bloqueia o PR de código** no repositório de implementação;
- como a seção **Esteira de checkpoints** do `INDEX.md`;
- o `PROMPT_SDD` (5A) já **recusa** gerar o design se algum N3 não estiver `📋`.

## Quem garante o quê

| Mecanismo | Garante |
|---|---|
| `gate-check.yml` (status check obrigatório) | a **ordem** — não pular etapas, 1 gate por PR, `por`/`em` preenchidos |
| `CODEOWNERS` + branch protection | **quem** aprova cada checkpoint (PO/DBA/QA/Tech Lead) |
| `promote-estado.yml` | espelha a esteira no `INDEX.md` a cada merge na `main` |

São complementares: a CI cuida da **sequência**, o review do CODEOWNER cuida da
**autorização**.

## Comandos

```bash
python scripts/gates.py status                    # esteira (readiness) de todas as features
python scripts/gates.py promote --write           # regenera a seção no INDEX.md
python scripts/gates.py check --base origin/main  # valida transições (como no CI)
```

## Como adotar na sua instância

Os arquivos vivem como **templates** em `engine/templates/.github/` e
`engine/templates/scripts/gates.py`. Copie-os para a raiz do repositório de docs e
configure o branch protection — o passo a passo está em
`engine/templates/.github/README.md`.

> A **integração com o ServiceNow** (espelhar o estado do gate ↔ estado da demanda,
> num modelo híbrido em que parte das aprovações mora no ServiceNow e parte no PR
> do GitHub) é específica de cada organização e fica fora deste template público.
