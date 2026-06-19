# NFR — Piloto Contatos
> Requisitos não-funcionais herdados por todas as features. N3 apenas referencia.

### DES-01 — Desempenho de leitura
**Requisito**: Consultas de listagem respondem rápido sob carga normal.
**Critério de aceitação**: p95 < 300ms para `GET /api/v1/contatos` com até 10k registros.
**Verificação**: teste de carga em staging.

### SEG-01 — Autenticação e isolamento
**Requisito**: Todo acesso exige SSO; dados isolados por organização.
**Critério de aceitação**: requisição sem token → 401; registro de outra organização → 404.
**Verificação**: testes de integração de acesso.

### AUD-01 — Auditoria de ações críticas
**Requisito**: Ações de escrita ficam registradas em log de auditoria.
**Critério de aceitação**: criar e excluir contato geram entrada com `userId`, `action`, `targetId`.
**Verificação**: inspeção do log após a ação.
