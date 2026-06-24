# Protótipo — Rastreabilidade visual (estilo Confluence)

Protótipo navegável que demonstra os **dois recursos "Confluence"** que o
Markdown cru não entrega, em cima dos artefatos que o `doc-template` já gera:

1. **Grafo de rastreabilidade interativo** — a cadeia
   `N0 → N1 → N2 → N3`, mais `história → feature → código` e as
   integrações `domínio ↔ domínio`, desenhada e navegável.
2. **Backlinks bidirecionais** — clicar num artefato mostra *para onde ele
   aponta* **e** *quem aponta para ele* (o que o `.md` aberto sozinho não revela).

> ⚠️ É um **protótipo de apresentação**. Não toca no `engine/` nem no `docs/`.
> Os dados são de um sistema fictício ("Loja Acme"), só para o grafo ter o que mostrar.

## Como ver

Sirva a pasta por HTTP (o `fetch`/módulos não funcionam via `file://`):

```bash
python3 -m http.server -d prototype/traceability 8090
# abra http://localhost:8090
```

## O que dá para fazer

- **Clicar** num nó → realça vizinhos (1 salto) e abre o painel de relações + backlinks.
- **Duplo-clique numa história** (ou botão *⛓ Modo rastro*) → realça a **cadeia
  completa** história → spec → código.
- **Filtrar camadas** na lateral (esconder histórias, código, etc.).
- **Buscar** por ID, nome ou texto (tecla `/`).
- **Arrastar** nós, **roda** para zoom, arrastar o fundo para mover, *⤢ Ajustar* para reenquadrar.
- **Tema** claro/escuro (compartilha a preferência com o site `docs/`).
- Cada nó linka de volta para o `.md`/repositório de origem ("Abrir .md ↗").

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | casca da página (topbar, lateral, canvas, painel) |
| `styles.css` | tema, reusando os tokens de design do `docs/` |
| `graph.js` | simulação de força em SVG + interações + painel de backlinks |
| `data.js` | **índice de rastreabilidade** — hoje escrito à mão; no produto, **gerado** |

## Como isto viraria real (sem dados fictícios)

O único arquivo a substituir é o **`data.js`**. Num produto, um passo de build
(rodando no workflow do GitHub Pages, ao lado do `validate-doc.mjs`) varreria os
artefatos da instância e **emitiria `data.js`** a partir do que já existe:

| Origem no `.md` | Vira no grafo |
|---|---|
| Cabeçalho do N3 (`[SIGLA]-[SFS]-[NN]`) + status | nó `feature` |
| Seção `## Origem` do N3 | aresta `história → feature` (`origina`) |
| Seção `## Implementação` do N3 | aresta `feature → repositório` (`implementa`) |
| `Feature Sets` do N1 / árvore `modules/` | hierarquia `contém` |
| `Integrações` do N1 | aresta `domínio ↔ domínio` (`integra`) |
| `modules/INDEX.md` | status consolidado, PF/CFP |

Ou seja: **nada de banco novo nem de reescrever specs** — a informação já está nos
artefatos; o build só a projeta num formato que o grafo consome. É exatamente a
mesma matéria-prima da auditoria `PROMPT_AUDIT_TRACE_LINKS`, só que visual.

O harness `check.mjs` (no scratchpad da sessão) valida a integridade do índice
(arestas órfãs, ids únicos, toda história rastreável até N3) — a semente de um
gate de build.
