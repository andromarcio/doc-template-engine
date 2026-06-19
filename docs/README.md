# Template de documentação para GitHub Pages

Site estático (HTML/CSS/JS, sem build) com a estética do editor **Dokumin**:
barra lateral com navegação em árvore, busca, tema claro/escuro, sumário
"nesta página" e conteúdo escrito em **Markdown**.

> Feito para o repositório `doc-template-engine`, mas é **reutilizável**: troque o
> conteúdo de `content/` e a navegação em `config.js` e ele serve qualquer projeto.

## Estrutura

```text
docs/
├── index.html            # casca da página (sidebar + topbar + conteúdo)
├── config.js             # ÚNICO arquivo de configuração: nome, repo e navegação
├── .nojekyll             # desliga o Jekyll no GitHub Pages
├── content/              # as páginas, em Markdown (uma por arquivo)
│   ├── introducao.md
│   └── ...
└── assets/
    ├── css/styles.css    # tema (tokens claro/escuro)
    ├── js/app.js         # navegação, rotas (#/pagina), render de Markdown, tema
    └── img/              # logo e favicon
```

## Pré-visualizar localmente

O site carrega o Markdown via `fetch`, então **não** funciona abrindo o arquivo
direto (`file://`). Sirva a pasta por HTTP:

```bash
python3 -m http.server -d docs 8080
# abra http://localhost:8080
```

(qualquer servidor estático serve — `npx serve docs`, etc.)

## Publicar no GitHub Pages

1. Em **Settings → Pages → Build and deployment → Source**, selecione
   **GitHub Actions**.
2. Faça merge na branch `main`. O workflow
   [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) publica a pasta
   `docs/` automaticamente.
3. A URL aparece ao final do job (algo como
   `https://<usuário>.github.io/doc-template-engine/`).

> Alternativa sem Actions: **Settings → Pages → Source: Deploy from a branch**,
> branch `main`, pasta `/docs`.

## Personalizar

| Quero mudar… | Edite |
|---|---|
| Nome, repositório, itens do menu | `config.js` |
| Texto das páginas | `content/*.md` (e referencie em `config.js`) |
| Cores, fontes, espaçamentos | `assets/css/styles.css` (variáveis no `:root`) |
| Logo / favicon | `assets/img/logo.svg`, `assets/img/favicon.svg` |

### Adicionar uma página

1. Crie `content/minha-pagina.md`.
2. Aponte para ela em `config.js`:

```js
{ title: "Minha página", page: "minha-pagina", icon: "file" }
```

Links internos entre páginas usam o formato de rota `#/minha-pagina`.

## Recursos

- Rotas por hash (`#/pagina`) — sem necessidade de `404.html`.
- Markdown (GFM) via [marked](https://marked.js.org/) e realce de sintaxe via
  [highlight.js], ambos por CDN.
- Tema claro/escuro/sistema persistido em `localStorage`.
- Sumário "nesta página" com *scroll-spy*, botão de copiar nos blocos de código,
  busca que filtra o menu (atalho <kbd>/</kbd>) e navegação anterior/próximo.
- Responsivo: a barra lateral vira gaveta no mobile.

[highlight.js]: https://highlightjs.org/
