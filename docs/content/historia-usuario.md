# Ponto de entrada: história de usuário

Quando a necessidade já chega como uma **história de usuário / item de backlog** do
**ServiceNow** (ou após a triagem indicar esse caminho), o intake é o prompt
**`PROMPT_BACKLOG`** (opção **HU** no menu).

## O que o `PROMPT_BACKLOG` faz

1. **Captura a história** — número, descrição e critérios de aceite.
2. **Mapeia** quais features (N3) ela gera ou altera.
3. **Cria o artefato** em `modules/_backlog/[chave].md`.

A partir daí, roda-se o `PROMPT_3A` para cada feature.

## Dados da história

Enquanto não há integração, os dados da história são **informados manualmente**:

- número (ex.: `STRYxxxxxxx`)
- descrição
- critérios de aceite

> Havendo um **MCP do ServiceNow**, basta passar o número e o engine **lê a
> história diretamente**.

## Por que isso importa

Cada **critério de aceite** é analisado e vira uma **regra de negócio** (se
expressa uma invariante), um **cenário (Gherkin)** (se descreve um comportamento
observável) ou **ambos** — ou seja, a história não é só um link: ela é a origem
semântica das **regras** e dos **testes**. Veja como isso fecha a
[Rastreabilidade](#/rastreabilidade).
