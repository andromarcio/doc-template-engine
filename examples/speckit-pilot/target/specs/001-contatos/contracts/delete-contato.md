# DELETE /api/v1/contatos/{id}
> Origem: CRM-CTT-03 (## API) + API-PATTERNS + ERROR-DICTIONARY.

**Acesso**: autenticado — role `admin`.

**Path param**: `id` (uuid de negócio).

**Response 204**: sem corpo (exclusão lógica aplicada — `deletedAt` preenchido).

**Errors**:
| HTTP | code | Situação |
|---|---|---|
| 404 | `CONTATO_NOT_FOUND` | inexistente ou de outra organização (ou já excluído) |
| 409 | `CONTATO_VINCULADO` | vinculado a um negócio |
| 403 | `AUTH_FORBIDDEN` | perfil sem permissão |
| 401 | `AUTH_UNAUTHENTICATED` | token ausente/inválido |

**Notas**: verifica vínculo antes de excluir; emite `contato.excluido`; registra AuditLog (AUD-01).
