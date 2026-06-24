# Mapa de rastreabilidade

> **Protótipo** — visão tipo Confluence da rastreabilidade do sistema, **gerada a
> partir dos próprios artefatos `.md`**. Hoje roda sobre um sistema-exemplo
> ("Loja Acme") com dados fictícios.

O método já registra a cadeia **história → spec → código** por convenção (seções
`## Origem` e `## Implementação` dos N3, tabela do `modules/INDEX.md`). O que o
Markdown não dá é a **visão navegável** disso. Este mapa fecha essa lacuna:

- **Grafo interativo** da cadeia `N0 → N1 → N2 → N3`, mais `história → feature → código`
  e as integrações `domínio ↔ domínio`;
- **Backlinks bidirecionais** — ao abrir um artefato, você vê *para onde ele aponta*
  **e** *quem aponta para ele* (o que o `.md` sozinho não mostra);
- **Modo rastro** — duplo-clique numa história acende toda a cadeia até o código;
- filtro por camadas, busca, zoom/pan e tema claro/escuro.

<p>
  <a class="btn btn--primary" href="rastreabilidade/index.html" target="_blank" rel="noopener"
     style="display:inline-flex;gap:8px;padding:10px 18px;border-radius:10px;background:var(--primary);color:#fff;font-weight:600">
     Abrir o mapa de rastreabilidade ↗
  </a>
</p>

> Abre em tela cheia (nova aba) — o mapa usa o espaço todo, com a lateral de
> filtros e o painel de relações. Para voltar, use **← Docs** no canto superior.

## Como isto se torna real

O mapa consome um único arquivo, `rastreabilidade/data.js` — um **índice de
rastreabilidade**. No protótipo ele é escrito à mão; no produto, seria
**gerado** por um passo de build (no mesmo workflow do GitHub Pages) que varre os
artefatos da instância:

| Origem no `.md` | Vira no grafo |
|---|---|
| Cabeçalho do N3 (`[SIGLA]-[SFS]-[NN]`) + status | nó **feature** |
| Seção `## Origem` do N3 | aresta **história → feature** |
| Seção `## Implementação` do N3 | aresta **feature → repositório** |
| `Feature Sets` do N1 / árvore `modules/` | hierarquia **contém** |
| `Integrações` do N1 | aresta **domínio ↔ domínio** |
| `modules/INDEX.md` | status consolidado, PF/CFP |

Nenhum banco novo, nenhuma spec reescrita: é a mesma matéria-prima da auditoria
`PROMPT_AUDIT_TRACE_LINKS`, só que projetada visualmente.
