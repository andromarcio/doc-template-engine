# Índice geral de módulos
> Visão consolidada de todos os domínios do sistema.
> Mantido via PROMPT 1A/1B — atualizar após cada N1 aprovado.

---

## Domínios

| Domínio | Pasta | Responsabilidade | Feature Sets |
|---|---|---|---|
| [Nome do Domínio](./[dominio]/README.md) | `modules/[dominio]/` | [responsabilidade em uma frase] | [N] |

---

## Rastreabilidade: spec → código

| Feature | Domínio | Status | PF | CFP | Repositórios |
|---|---|---|---|---|---|
| [[SIGLA]-[SFS]-[NN]: Nome da Feature](./[dominio]/[feature-set]/[feature].md) | [Domínio] | 📋 Especificado | — | — | — |

<!--
  PF e CFP: preencher após PROMPT_3B. Ver critérios em global/SIZING.md.
  Totais vigentes excluem features ❌ Deprecadas.
-->

**Total vigente: — PF · — CFP** *(dimensionamento pendente — preencher via PROMPT_3B; critérios em `global/SIZING.md`)*

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

| Ícone | Status | Descrição |
|---|---|---|
| 📋 | Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 | Em desenvolvimento | Implementação em andamento |
| ✅ | Implementado | Em produção, rastreabilidade preenchida |
| ⚠️ | Revisão necessária | Spec desatualizada em relação ao código |
| ❌ | Deprecado | Feature removida do sistema |
