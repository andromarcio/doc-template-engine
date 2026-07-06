# ERROR-DICTIONARY — Piloto Contatos
> Fonte única de códigos de erro. Todo erro usado num N3 existe aqui.

| Código | HTTP | Situação |
|---|---|---|
| `AUTH_UNAUTHENTICATED` | 401 | Token ausente ou inválido |
| `AUTH_FORBIDDEN` | 403 | Autenticado, mas sem permissão para a ação |
| `VALIDATION_ERROR` | 422 | Um ou mais campos do body/query inválidos |
| `CONTATO_NOT_FOUND` | 404 | Contato não existe (ou não pertence à organização) |
| `CONTATO_EMAIL_DUPLICADO` | 409 | Já existe contato ativo com o mesmo e-mail na organização |
| `CONTATO_VINCULADO` | 409 | Contato está vinculado a outros registros e não pode ser excluído |
