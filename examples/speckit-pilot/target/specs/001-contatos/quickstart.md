<!-- GERADO por PROMPT_SPECKIT_EXPORT a partir dos cenários de Caminho feliz dos N3. -->
# Quickstart: validar Contatos

Pré-requisito: app rodando, autenticado como **Administrador** da organização "Acme".

## US1 — Cadastrar Contato (P1)
1. Acesse `/contatos/novo`.
2. Preencha Nome completo "Ana Lima" e E-mail "ana@acme.com"; salve.
3. Esperado: toast "Registro salvo com sucesso." e redirecionamento para `/contatos`.
4. Repita com o mesmo e-mail → esperado: "Já existe um contato com este e-mail."

## US2 — Pesquisar Contato (P2)
1. Em `/contatos`, confirme a lista paginada (até 10) e o total.
2. Busque por "ana" → "Ana Lima" aparece.
3. Busque por "inexistente" → estado vazio "Nenhum contato encontrado."

## US3 — Excluir Contato (P3)
1. Na linha de "Ana Lima", clique no ícone de excluir e confirme.
2. Esperado: toast "Registro excluído com sucesso." e a linha some.
3. Para um contato vinculado a um negócio → "Este contato está vinculado e não pode ser excluído."
