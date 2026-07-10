# Versionamento e carimbo de artefatos

Este documento define **como o docqui-engine é versionado** e **como cada
artefato gerado pelos prompts registra, de forma invisível ao leitor, a versão do
framework que o produziu**.

> Esta é uma regra do **engine** (somente-leitura nas instâncias). Vale para todos
> os fluxos de geração — skill no Claude Code, copy-paste e CLI.

---

## 1. Versão do framework

- A versão vigente vive em [`../VERSION`](../VERSION) (uma linha, SemVer, ex.: `1.0.0`).
- Toda evolução do engine registra uma entrada em [`../CHANGELOG.md`](../CHANGELOG.md)
  e faz o *bump* de `VERSION` conforme o impacto (MAJOR/MINOR/PATCH — ver o changelog).
- `VERSION` é a **fonte única da verdade**. Nenhum prompt ou template embute o número
  literal — todos leem `VERSION` no momento da geração.

---

## 2. Carimbo no artefato (invisível ao leitor)

Todo artefato gerado **ou atualizado** por um prompt carrega, na **primeira linha**,
um comentário HTML:

```
<!-- docqui: 1.0.0 | prompt: PROMPT_3A | atualizado: 2026-06-23 -->
```

### Por que comentário HTML

- **Invisível no documento renderizado** — não aparece em export PDF/HTML nem no
  preview do GitHub/visualizadores de Markdown. O leitor de negócio (PO) nunca o vê.
- **Legível só no source** `.md`, pelo time técnico, para auditoria.
- Coerente com a "convenção de visibilidade" já usada nos templates (blocos
  `<!-- … -->` e `.dev-only`).

### Campos do carimbo

| Campo | Conteúdo | Exemplo |
|---|---|---|
| versão | conteúdo de `VERSION` no momento da geração | `1.0.0` |
| `prompt` | ID do prompt que gerou/atualizou o artefato | `PROMPT_3A` |
| `atualizado` | data da geração/atualização (`YYYY-MM-DD`) | `2026-06-23` |

---

## 3. Regra de geração (para o agente)

Ao chegar no estado terminal de geração de artefato (`[GERACAO_ARTEFATO]`,
`[ARQUIVO_FINAL]`, `[GERACAO_ARTEFATO_BASE]` etc.), **antes de escrever o conteúdo**:

1. Leia a versão vigente em `VERSION` (na raiz do engine).
2. Garanta que a **primeira linha** do artefato seja o carimbo, preenchido com a
   versão lida, o ID do prompt corrente e a data de hoje.
3. Em **atualização** de artefato existente (PROMPT_4A/4B e demais updates):
   **reescreva** o carimbo existente com a versão e a data correntes — nunca
   acumule carimbos nem mantenha um número antigo.

> Atalho determinístico (copy-paste/CLI): `scripts/stamp.sh <arquivo> <PROMPT_ID>`
> insere ou atualiza o carimbo lendo `VERSION` e a data atual.

---

## 4. Escopo

Recebem carimbo **todos** os artefatos produzidos por um `PROMPT_*`: specs N0/N1/N2/N3,
dicionários (FIELD/RULES/ERROR/MESSAGE), data-models, contagem de PF, NFR, SDD,
backlog e protótipos. Arquivos de configuração da instância (ex.: `MASTER.md`
preenchido) seguem a mesma regra quando gerados por prompt.

---

## 5. Governança multi-repositório (canônico × instâncias)

O `docqui-engine` é a **fonte única da verdade** de prompts, templates, skills e
scripts. As instâncias (`simpf-doc`, `desenvolve-ai`, `sifof-doc`, …) **consomem** o
engine; o `docqui-caixa` é a **variante negocial reduzida** (só a parte de
negócio — sem os prompts/artefatos técnicos).

- **Evolução nasce no canônico** e é replicada às demais, respeitando o escopo de cada
  uma (o `-caixa` recebe só o que é negocial).
- **Autoridade do canônico:** havendo divergência (*drift*) de um arquivo do engine entre
  repositórios, o canônico prevalece.
- **Reconciliar ao tocar:** **não** faça *overwrite* em massa dos consumidores. Ao editar
  um arquivo do engine num consumidor, primeiro **sincronize-o do canônico** e só então
  aplique a mudança. Isso preserva conteúdo local intencional (ex.: a redução do `-caixa`;
  prompts próprios da esteira SIESA no `desenvolve-ai`).
