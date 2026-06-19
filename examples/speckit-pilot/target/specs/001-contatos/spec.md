<!--
  GERADO por PROMPT_SPECKIT_EXPORT a partir do Feature Set CRM-CTT (Contatos).
  1 N3 = 1 User Story. Seção negocial dos N3 → este spec.md (agnóstico de tecnologia).
-->
# Feature Specification: Contatos

**Feature Branch**: `001-contatos`

**Created**: 2026-06-19

**Status**: Draft

**Input**: Feature Set CRM-CTT (N3: CRM-CTT-01, CRM-CTT-02, CRM-CTT-03)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar Contato (Priority: P1)

Cria um novo contato na organização do usuário, garantindo e-mail único entre contatos ativos. (CRM-CTT-01)

**Why this priority**: É o incremento mínimo (MVP) — sem cadastro não há dado para consultar ou excluir. Origem: STRY0010001.

**Independent Test**: Cadastrar um contato válido e confirmar que ele passa a existir, e que um segundo contato com o mesmo e-mail é rejeitado.

**Acceptance Scenarios**:

1. **Given** que não existe contato ativo com e-mail "ana@acme.com", **When** o usuário salva "Ana Lima" / "ana@acme.com", **Then** o contato é criado e exibe "Registro salvo com sucesso."
2. **Given** o campo "Nome completo" vazio, **When** o usuário salva, **Then** exibe "Campo obrigatório."
3. **Given** e-mail "ana@@acme", **When** o usuário salva, **Then** exibe "Formato inválido."
4. **Given** que já existe contato ativo com "ana@acme.com", **When** o usuário tenta salvar outro, **Then** exibe "Já existe um contato com este e-mail."

---

### User Story 2 - Pesquisar Contato (Priority: P2)

Lista os contatos ativos da organização, com filtro por nome/e-mail/tipo e paginação. (CRM-CTT-02)

**Why this priority**: Depende de existir cadastro (US1). Entrega valor de consulta. Origem: STRY0010002.

**Independent Test**: Com contatos existentes, abrir a lista, filtrar por "ana" e confirmar que o resultado contém "Ana Lima" e exclui contatos de outra organização.

**Acceptance Scenarios**:

1. **Given** 12 contatos ativos, **When** o usuário abre a tela, **Then** vê a 1ª página (até 10) e o total.
2. **Given** o contato "Ana Lima", **When** busca por "ana", **Then** a lista mostra "Ana Lima".
3. **Given** busca por "inexistente", **When** executa, **Then** vê "Nenhum contato encontrado."

---

### User Story 3 - Excluir Contato (Priority: P3)

Exclui logicamente um contato, desde que não esteja vinculado a outros registros. (CRM-CTT-03)

**Why this priority**: Refinamento posterior; exige cadastro e listagem. Origem: STRY0010003.

**Independent Test**: Excluir um contato sem vínculos (sucesso) e tentar excluir um contato vinculado (bloqueado).

**Acceptance Scenarios**:

1. **Given** o contato "Ana Lima" sem vínculos, **When** o Administrador confirma a exclusão, **Then** o contato é marcado como excluído e exibe "Registro excluído com sucesso."
2. **Given** "Ana Lima" vinculada a um negócio, **When** tenta excluir, **Then** exibe "Este contato está vinculado e não pode ser excluído."

### Edge Cases

- E-mail de um contato **excluído** pode ser reutilizado num novo cadastro (US1, Estados especiais).
- Cursor de paginação malformado é ignorado e retorna a primeira página (US2).
- Contatos de outra organização nunca aparecem na lista (US2, isolamento).
- Excluir um contato já excluído responde que o contato não existe (US3).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enforce a unique e-mail among **active** contacts within the same organization.
- **FR-002**: System MUST require "Nome completo" and "E-mail" to create a contact.
- **FR-003**: Only profiles **Administrador** and **Agente** MUST be able to create contacts.
- **FR-004**: System MUST list only active contacts of the user's organization.
- **FR-005**: Search MUST partially match name or e-mail.
- **FR-006**: Deletion MUST be logical (soft delete).
- **FR-007**: System MUST block deletion of a contact linked to a business.
- **FR-008**: Only the **Administrador** profile MUST be able to delete contacts.

### Key Entities *(include if feature involves data)*

- **Contato**: a person/company contact of an organization. Attributes (business view): Nome completo, E-mail, Telefone, Empresa, Tipo (Cliente/Fornecedor/Parceiro), Observações. Belongs to one organization; may be referenced by a business.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of valid creations complete without server error.
- **SC-002**: Zero duplicate e-mails among active contacts.
- **SC-003**: Contact listing responds within p95 < 300ms at 10k records (NFR DES-01).
- **SC-004**: 0% cross-organization data leakage in listings.
- **SC-005**: 100% of deletions of linked contacts are blocked.

## Assumptions

- Organização e datas de criação/exclusão são preenchidas pelo sistema (não pelo usuário).
- Autenticação por SSO corporativo já existe e injeta `organizationId`/`role` na sessão.
- Exclusão é lógica em todo o sistema (decisão transversal).
