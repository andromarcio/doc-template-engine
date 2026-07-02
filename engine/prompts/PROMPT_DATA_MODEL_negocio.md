# PROMPT DATA-MODEL — Modelo de Entidades (negocial)
## Modelo conceitual de entidades · Parte negocial

> **Modelo de estrutura**: `engine/templates/global/data-models/_template-dominio-negocio.md` *(referência humana — o prompt já embute o esqueleto)*
> **Quem participa**: PO + analista de requisitos
> **Insumo necessário**: N1 do domínio + os N3 (negociais) já especificados do domínio
> **Entrega**: `global/DATA-MODEL.md` (índice de entidades) + `global/data-models/[dominio].md` (fragmento de entidades do domínio) — **só a parte das entidades, sem camada física de banco**
>
> **Próximo passo**: as entidades servem de referência de negócio para os campos (Label PO) dos N3.

---

## INSTRUÇÕES PARA O CLAUDE

> **Protocolo obrigatório desta sessão (F1 preflight · F2 autovalidação):**
> 1. **Antes de gerar** — rode `node scripts/preflight-spec.mjs [dominio]` (ou, sem disco, leia o N0 + `modules/INDEX.md` + o N1/N2/N3 pertinentes) e apresente um bloco **"Contexto verificado"**: entidades/atributos já existentes, o que já é canônico a **referenciar** (não reescrever). Não duplique entidade/atributo existente.
> 2. **Depois de gravar** — rode `node scripts/validate-doc.mjs <arquivo>`; se reprovar, **apresente os desvios, corrija e repita até `✓`**. Nunca conclua com o validador reprovando.
> *(No Claude Code os hooks em `.claude/settings.json` já enforçam isso automaticamente.)*

Você vai consolidar o **modelo de entidades** de um domínio, em **linguagem de negócio pura**. Este é o data-model do `doc-template-engine-caixa`: contém **apenas a parte das entidades** — cada entidade, seus **atributos em Label PO**, e os **relacionamentos** entre elas.

**NUNCA** inclua a camada física de banco: **Label Dev** (camelCase técnico), **campo banco** (nome físico), **tipo SQL**, FK, índice, enum físico, classe de coluna, nem contagem **ALI/AIE**. Tudo isso pertence ao data-model técnico, **fora do escopo** desta instância. Se aparecer no insumo, **descarte** — não transcreva.

Regras da sessão:
- Trabalhe **uma entidade de cada vez** e aguarde confirmação antes de seguir.
- **Derive** as entidades e atributos do **N1** (entidades do domínio) e dos **N3** (campos em Label PO). Não invente atributos que não aparecem nas specs — lacuna = ⚠️ + pergunta.
- **Tipo** sempre em linguagem de negócio: `texto`, `número`, `data`, `valor` (monetário), `booleano`, `seleção → [Entidade]`. Nunca tipo SQL.
- Atributo **canônico** (CPF, CNPJ, e-mail…) → `→ ver FIELD-DICTIONARY: [nome]`, sem reescrever a validação.
- Campos técnicos automáticos (identificador interno, datas de inclusão/alteração/exclusão) **não** entram — são infraestrutura, não negócio.
- Sinalize suposições com ⚠️.

**Controle de fluxo — Máquina de Estados.** Toda resposta inicia com `[Estado: NOME]`:

```
[VERIFICACAO_CONTEXTO] → [COLETA_ENTIDADES] → [RELACIONAMENTOS] → [GERACAO]
```

---

## CONTEXTO DO PROJETO

=== N1 DO DOMÍNIO ===
[cole aqui o README.md do domínio — dele saem as entidades do domínio]

=== N3(s) DO DOMÍNIO (negociais) ===
[cole aqui os f-*.md do domínio — deles saem os atributos (tabela de Campos em Label PO)]

=== FIELD-DICTIONARY.md ===
[cole aqui o dicionário de campos canônicos — para referenciar em vez de reescrever]

=== DATA-MODEL.md (se já existir) ===
[cole o índice atual, para acrescentar o domínio sem recriar o que já existe]

---

## PASSO 0 — Preflight obrigatório de contexto

> **Não gere nada antes de concluir este passo.**

Levante o **estado atual** (`node scripts/preflight-spec.mjs [dominio]` ou leitura manual) e apresente o bloco **Contexto verificado**: quais entidades já existem no `global/data-models/[dominio].md`, quais atributos já são canônicos, o que este domínio já cobre. Não recrie o que existe.

---

## PASSO 1 — Entidades e atributos

**[Estado: COLETA_ENTIDADES]**

Identifique as **entidades** do domínio a partir do N1 e dos substantivos-chave dos N3. Para cada entidade, monte a tabela de atributos a partir dos **campos (Label PO)** dos N3 que a manipulam:

| Atributo (Label PO) | Tipo | Obrigatório | Notas |
|---|---|---|---|

Confirme entidade + atributos com o usuário antes de seguir para a próxima. Um atributo que apareça em vários N3 é **um só** na entidade (não duplique).

---

## PASSO 2 — Relacionamentos

**[Estado: RELACIONAMENTOS]**

Com as entidades confirmadas, descreva os **relacionamentos em linguagem de negócio** (cardinalidade + frase): `**[Entidade A]** [1 — N] **[Entidade B]** — [o que a relação significa]`. Não use FK nem nome de banco.

---

## PASSO 3 — Geração do artefato

**[Estado: GERACAO]**

Antes de escrever, leia a versão em `VERSION` e componha o carimbo na **primeira linha**. Gere/atualize **dois** arquivos:

### 3.1 — Fragmento do domínio: `global/data-models/[dominio].md`

```
<!-- doc-template-engine: <versão> | prompt: PROMPT_DATA_MODEL_negocio | atualizado: <YYYY-MM-DD> -->
# Data Model: [Nome do Domínio]
> **Modelo de entidades (negocial)** — só a parte das entidades, sem camada física
> (sem Label Dev, campo banco, tipo SQL, FK, índice ou contagem ALI/AIE).

---

## [Entidade]
> [uma frase de negócio: o que a entidade representa]

| Atributo (Label PO) | Tipo | Obrigatório | Notas |
|---|---|---|---|
| [nome de negócio] | [texto / número / data / valor / booleano / seleção → Entidade] | sim / não / automático | [nota; canônico → ver FIELD-DICTIONARY: [nome]] |

---

## Relacionamentos

- **[Entidade A]** [1 — N] **[Entidade B]** — [descrição de negócio]
```

### 3.2 — Índice: `global/DATA-MODEL.md`

```
<!-- doc-template-engine: <versão> | prompt: PROMPT_DATA_MODEL_negocio | atualizado: <YYYY-MM-DD> -->
# DATA-MODEL.md
> **Modelo de entidades (negocial)** — índice das entidades do sistema, sem camada
> física de banco. Os modelos detalhados estão em `global/data-models/` por domínio.

---

## Modelos por domínio

| Domínio | Arquivo | Entidades |
|---|---|---|
| [Nome do Domínio] | [data-models/[dominio].md](./data-models/[dominio].md) | [Entidade A, Entidade B] |

---

## Relacionamentos entre domínios

- **[Entidade de um domínio]** referencia **[Entidade de outro]** — [descrição de negócio]
```

> Ao **acrescentar** um domínio a um índice existente, some a linha nova em "Modelos por domínio" — não recrie as demais.

---

## Autovalidação (obrigatório — F2)

Após gravar, rode em cada arquivo:
```
node scripts/validate-doc.mjs global/data-models/[dominio].md global/DATA-MODEL.md
```
O validador reconhece o **modelo negocial** (pelo marcador `> **Modelo de entidades (negocial)**`) e **reprova** se vazar camada física (`Label Dev`, `Campo banco`, `Tipo SQL`). Se reprovar, apresente os desvios, corrija e rode de novo até sair `✓`.

---

## Checklist de conformidade

- [ ] Carimbo de versão na **primeira linha** (`prompt: PROMPT_DATA_MODEL_negocio`)
- [ ] Fragmento e índice com o marcador `> **Modelo de entidades (negocial)**`
- [ ] Cada entidade é uma seção `## [Entidade]` com tabela `Atributo (Label PO) | Tipo | Obrigatório | Notas`
- [ ] **Nenhuma** coluna/menção física: Label Dev, campo banco, tipo SQL, FK, índice, ALI/AIE
- [ ] Tipos em linguagem de negócio (texto/número/data/valor/booleano/seleção)
- [ ] Atributos canônicos como `→ ver FIELD-DICTIONARY: [nome]`
- [ ] `## Relacionamentos` em linguagem de negócio (cardinalidade + frase)
- [ ] Índice `global/DATA-MODEL.md` com `## Modelos por domínio` apontando para o fragmento
- [ ] Validador retorna `✓` nos dois arquivos
