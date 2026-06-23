# Esteira de checkpoints (gates) — arquivos de adoção

Estes arquivos são **templates** (parte do `engine/`). Eles **não** rodam aqui no
`doc-template-engine` — destinam-se à **instância** de documentação (o repositório
onde vivem os N3 reais). Copie-os para a **raiz** do repositório de docs:

| Template (aqui no engine)                          | Destino (raiz da instância)      |
|----------------------------------------------------|----------------------------------|
| `engine/templates/.github/CODEOWNERS`              | `.github/CODEOWNERS`             |
| `engine/templates/.github/workflows/gate-check.yml`| `.github/workflows/gate-check.yml` |
| `engine/templates/.github/workflows/promote-estado.yml` | `.github/workflows/promote-estado.yml` |
| `engine/templates/.github/pull_request_template.md`| `.github/pull_request_template.md` |
| `engine/templates/scripts/gates.py`                | `scripts/gates.py`               |

## O modelo em uma frase

Cada **N3** carrega no front-matter a sua **esteira de gates**. Um gate é um
**checkpoint humano**; a próxima etapa só ocorre após a aprovação da anterior.

```
🆕 → [CP1 requisitos · PO] → 📝 → [CP2 modelo-dados · DBA] → 🧱
   → [CP3 testes · QA] → 📋 PRONTO P/ DEV → [CP4 código · Tech Lead] → ✅
```

- **Fonte de verdade:** o bloco `gates` no front-matter do N3.
- **`estado`** é **derivado** dos gates (verificado pela CI, não mantido à mão).
- **`modules/INDEX.md`** é só um **espelho** regenerado por `scripts/gates.py`.
- **"Pronto para implementar?"** = `estado == especificado` (CP1+CP2+CP3 aprovados).

## Quem garante o quê

| Mecanismo | Garante |
|---|---|
| `gate-check.yml` (status check obrigatório) | a **ordem**: não pular etapas, 1 gate por PR, `por`/`em` preenchidos |
| `CODEOWNERS` + branch protection | **quem** aprova cada checkpoint (PO/DBA/QA/Tech Lead) |
| `promote-estado.yml` | espelha a esteira no `INDEX.md` a cada merge na `main` |

## Configuração única (na instância)

1. Copie os arquivos da tabela acima para a raiz.
2. Edite o `CODEOWNERS` trocando `@org/*` pelos times reais.
3. Em **Settings → Branches → branch protection** da `main`:
   - *Require a pull request before merging*
   - *Require review from Code Owners*
   - *Require status checks to pass* → selecione **Esteira de gates — check**
4. O **CP4 (código)** vive no(s) repositório(s) de implementação: replique lá um
   `CODEOWNERS` apontando o review para o Tech Lead. O elo com o N3 é a chave do
   ServiceNow + o ID da feature nos commits/PR (ver `## Implementação` do N3).

## Como passar um gate (fluxo do dia a dia)

1. Faça o trabalho do checkpoint (ex.: o DBA finaliza o `DATA-MODEL.md`).
2. No mesmo PR, no front-matter do N3, marque **só** aquele gate:
   ```yaml
   modelo-dados: { aprovado: true, por: "bru.dba", em: 2026-06-23, pr: 0 }
   ```
   e ajuste `estado` para o derivado (ex.: `modelo-validado`).
3. Abra o PR. O **gate-check** valida a ordem; o **CODEOWNER** aprova; faça o merge.
4. O **promote** regenera a esteira no `INDEX.md`.

## Comandos locais

```bash
python scripts/gates.py status                 # esteira (readiness) de todas as features
python scripts/gates.py promote --write        # regenera a seção no INDEX.md
python scripts/gates.py check --base origin/main  # valida transições (como no CI)
```

> Requer Python 3.8+ e PyYAML (`pip install pyyaml`). Item 5 (integração com o
> ServiceNow — espelhar gate ↔ estado da demanda) fica a cargo da instância,
> conforme a infraestrutura disponível.
