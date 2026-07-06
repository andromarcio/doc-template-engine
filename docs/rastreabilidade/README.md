# Protótipo — Rastreabilidade visual (estilo Confluence)

Protótipo navegável que demonstra os **dois recursos "Confluence"** que o
Markdown cru não entrega, em cima dos artefatos que o `doc-template` já gera:

1. **Grafo de rastreabilidade interativo** — a cadeia
   `N0 → N1 → N2 → N3`, mais `história → feature → código` e as
   integrações `domínio ↔ domínio`, desenhada e navegável.
2. **Backlinks bidirecionais** — clicar num artefato mostra *para onde ele
   aponta* **e** *quem aponta para ele* (o que o `.md` aberto sozinho não revela).
3. **Nível de código expandível (Fase A)** — os nós de repositório se expandem
   em **classes**, e as classes em **métodos**, com o grafo de chamadas
   `método → método` (elo `chama`, com seta) e a âncora fina
   `feature → classe/método` (elo `implementa`, vindo de
   `@RequiresFeature`/`*appFeature`). Tudo **sob demanda**: recolhido por
   padrão, o grafo continua legível e a simulação nunca vê milhares de nós.

> ⚠️ É um **protótipo de apresentação**, publicado junto do site `docs/`.
> Os dados são de um sistema fictício ("Loja Acme"), só para o grafo ter o que mostrar.

## Como ver

- **No site publicado (GitHub Pages):** menu *Fluxo de trabalho → Mapa de
  rastreabilidade*, ou direto em `…/rastreabilidade/`.
- **Local, abrindo o arquivo:** dá um duplo-clique em
  `docs/rastreabilidade/index.html` — funciona via `file://`, pois tudo é
  carregado por `<script>`/`<link>` (sem `fetch`).
- **Local, via servidor:**

```bash
python3 -m http.server -d docs 8090
# abra http://localhost:8090/rastreabilidade/
```

## O que dá para fazer

- **Clicar** num nó → realça vizinhos (1 salto) e abre o painel de relações + backlinks.
- **Duplo-clique numa história** (ou botão *⛓ Modo rastro*) → realça a **cadeia
  completa** história → spec → código.
- **Duplo-clique num repositório ou classe** (ou botão *⊞ Expandir* no painel)
  → abre o nível de código: classes, métodos e as chamadas entre eles.
  Buscar ou clicar numa relação de um nó recolhido expande o caminho sozinho.
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

### E o nível de código (classes/métodos)?

A Fase A demonstra a UX com dados fictícios. Para virar real (Fase B), cada
repositório de código rodaria no próprio CI um passo de **análise estática**
(JavaParser/Spoon para Java, ts-morph para TypeScript) que emitiria um
fragmento com:

| Origem no código | Vira no grafo |
|---|---|
| varredura de classes | nó `classe` + aresta `repo → classe` (`contem`) |
| métodos de cada classe | nó `metodo` + aresta `classe → método` (`declara`) |
| chamadas estáticas | aresta `método → método` (`chama`) |
| `@RequiresFeature("SIGLA-SFS-NN")` / `*appFeature="ID"` | aresta `feature → classe/método` (`implementa`) |

O build do site só mescla os fragmentos no `data.js`. Limites conhecidos (por
isso o grafo é ferramenta de **navegação**, não gate de auditoria): DI/reflexão
escondem chamadas dinâmicas, e a fronteira front→back (componente → endpoint
HTTP) fica para uma Fase C.

O harness `check.mjs` (no scratchpad da sessão) valida a integridade do índice
(arestas órfãs, ids únicos, toda história rastreável até N3) — a semente de um
gate de build.
