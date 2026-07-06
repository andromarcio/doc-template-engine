# GET /api/v1/contatos
> Origem: CRM-CTT-02 (## API) + API-PATTERNS (paginação por cursor).

**Acesso**: autenticado — qualquer perfil.

**Query params**:
```typescript
{
  search?: string                               // casa fullName ou email (parcial)
  type?: 'cliente' | 'fornecedor' | 'parceiro'
  cursor?: string                               // paginação opaca; inválido → 1ª página
}
```

**Response 200**:
```json
{
  "data": [
    { "id": "uuid", "fullName": "Ana Lima", "email": "ana@acme.com", "type": "cliente" }
  ],
  "meta": { "total": 12, "nextCursor": "opaco", "prevCursor": null }
}
```

**Errors**:
| HTTP | code | Situação |
|---|---|---|
| 401 | `AUTH_UNAUTHENTICATED` | token ausente/inválido |

**Notas**: filtra sempre `organization_id` da sessão + `deleted_at IS NULL`. p95 < 300ms (DES-01).
