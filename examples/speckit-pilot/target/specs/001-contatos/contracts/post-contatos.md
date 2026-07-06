# POST /api/v1/contatos
> Origem: CRM-CTT-01 (## API) + API-PATTERNS + ERROR-DICTIONARY (resolvidos).

**Acesso**: autenticado — roles `admin`, `agente`.

**Request body**:
```typescript
{
  fullName: string                              // obrigatório
  email: string                                 // obrigatório; único entre ativos da org
  phone?: string
  company?: string
  type: 'cliente' | 'fornecedor' | 'parceiro'   // default 'cliente'
  notes?: string
}
```

**Response 201**:
```json
{ "data": { "id": "uuid" }, "meta": null }
```

**Errors**:
| HTTP | code | Situação |
|---|---|---|
| 422 | `VALIDATION_ERROR` | campos inválidos (detalhes por campo) |
| 409 | `CONTATO_EMAIL_DUPLICADO` | e-mail já ativo na organização |
| 403 | `AUTH_FORBIDDEN` | perfil sem permissão |
| 401 | `AUTH_UNAUTHENTICATED` | token ausente/inválido |

**Notas**: grava `organizationId` da sessão; emite `contato.criado`; registra AuditLog (AUD-01).
