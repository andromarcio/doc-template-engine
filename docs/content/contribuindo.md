# Contribuindo

Contribuições são bem-vindas via **Pull Request**.

## Diretrizes

- Mantenha cada **prompt auto-contido** — sem depender de arquivos fora do
  `engine/`.
- Nos **templates**, use placeholders `[entre colchetes]` para o que a instância
  preenche.
- **Um arquivo, um propósito** — siga a convenção de nomes existente.

## Convenção de commits

Quando a mudança estiver ligada a uma feature, referencie os IDs:

```text
tipo([SIGLA]-[SFS]-[NN]): [resumo] (ServiceNow [STRYxxxxxxx])
```

## Documentação (este site)

- **Conteúdo**: edite os arquivos em `docs/content/*.md`.
- **Navegação**: adicione ou reordene itens em `docs/config.js`.
- **Tema**: ajuste tokens e estilos em `docs/assets/css/styles.css`.

Ao abrir um PR para a `main`, o workflow
[`.github/workflows/pages.yml`](#/file/.github/workflows/pages.yml)
publica o site automaticamente no GitHub Pages.

## Licença

[MIT](#/file/LICENSE).
