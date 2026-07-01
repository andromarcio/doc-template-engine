# Fixture — Loja Acme (instância de exemplo)

**Dados fictícios**, só para testar o `scripts/generate-trace-index.mjs` ponta a
ponta. Não é uma instância real do doc-template — é um mini-conjunto de artefatos
no formato dos templates (N0, N1, N3, backlog) que exercita todos os elos:
hierarquia, `origina` (incl. M:N história↔feature), `implementa` e `integra`.

Gerar a partir dele:

```bash
node scripts/generate-trace-index.mjs \
  --root scripts/__fixtures__/loja-acme \
  --out-features build/features.json \
  --out-data build/data.js \
  --repo https://github.com/acme/loja-doc
```
