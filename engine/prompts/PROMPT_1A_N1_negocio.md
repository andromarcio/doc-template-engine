# PROMPT 1A — N1 Negócio
## Domínios do sistema · Parte negocial

> **Modelo de estrutura**: `engine/templates/modules/_template-dominio/README.md` *(referência humana — o prompt já embute o esqueleto)*
> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: visão geral do sistema em linguagem natural
> **Entrega**: rascunho do README.md de cada domínio com descrições,
> limites e Feature Sets — sem campos de banco ou detalhes técnicos
>
> **Próximo passo**: após aprovação, usar PROMPT_1B com cada README.md gerado

---

## INSTRUÇÕES PARA O CLAUDE

Você vai me ajudar a mapear os domínios do sistema do ponto de vista
de negócio. Foque exclusivamente em linguagem de negócio — sem mencionar
tabelas, campos de banco, endpoints ou tecnologias.

Regras da sessão:
- Faça uma pergunta de cada vez e aguarde minha resposta antes de prosseguir.
- Ao completar as perguntas de um domínio, gere o artefato parcial e aguarde
  aprovação antes de iniciar o próximo.
- Sinalize suposições com ⚠️.
- Ao final, gere o INDEX negocial com a visão consolidada do sistema.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

---

## PASSO 1 — Mapeamento geral

Faça esta pergunta única e aguarde:

> "Quais são as grandes áreas de negócio do sistema?
> Liste cada uma com nome e uma frase descrevendo o que ela cuida."

Com a resposta, monte a lista de domínios e, para cada um, proponha uma sigla
de exatamente 3 letras maiúsculas como ID do domínio. Confirme comigo:
> "Confirmo as áreas e IDs propostos abaixo. Ajusta algum ou posso detalhar a primeira?
>
> | Domínio | ID proposto |
> |---|---|
> | [Nome] | [SIGLA] |"

---

## PASSO 2 — Detalhamento negocial de cada domínio

Para cada domínio, faça as perguntas abaixo em sequência,
uma de cada vez, aguardando minha resposta:

**Pergunta 1 — Propósito e limites**
> "Em uma ou duas frases: o que a área [nome] faz?
> E o que ela explicitamente não faz — onde termina sua responsabilidade?"

**Pergunta 2 — Agrupamentos funcionais**
> "Quais são os grupos de funcionalidade dentro desta área?
> Para cada grupo: nome e uma linha do que engloba.
> Pense em termos do que o usuário faz, não de como o sistema funciona."

**Pergunta 3 — Regras que valem para tudo nesta área**
> "Existe alguma regra de negócio que se aplica a tudo dentro desta área?
> Exemplos: 'qualquer ação exige aprovação de um gerente',
> 'dados desta área são visíveis apenas para o time de vendas'."

> **Roteamento — regra de negócio × NFR**: registre em "Regras transversais de
> negócio" apenas **invariantes de negócio** (o *que* a área garante). Se a
> resposta trouxer uma **qualidade do sistema** — tempo de resposta, segurança,
> disponibilidade, auditoria, restrição técnica — ela **não** é regra transversal:
> pertence ao `global/NFR.md`. Se já houver NFR equivalente, não duplique; se for
> novo, sinalize:
> > "⚠️ Isto é um requisito não-funcional ([categoria]). Não entra no N1 —
> > proponho registrá-lo no NFR.md como [ID sugerido]. Confirma?"

**Pergunta 4 — Relação com outras áreas**
> "Esta área depende de informações de outras áreas para funcionar?
> Outras áreas dependem desta? Descreva em linguagem de negócio."

Com as respostas, gere o artefato parcial:

📄 `modules/[dominio]/README.md` — seções negociais

**Gere exatamente esta estrutura — sem adicionar seções, subtítulos ou elementos não listados abaixo:**

```
# Domínio: [Nome]
> **Nível 1** - Visão estratégica do domínio - `[SIGLA]`

## Descrição
[2-3 frases sobre o que faz]

### O que este domínio NÃO faz
- [o que está fora do escopo e a qual domínio pertence]

---

## Feature Sets

| Feature Set | Pasta | Descrição | Features |
|---|---|---|---|
| [Nome](./[pasta]/README.md) | `[dominio]/[pasta]/` | [descrição em uma linha] | [N] |

---

## Regras transversais de negócio

1. [Regra que se aplica a todas as features deste domínio]

---

## Dependências com outros domínios

[descrição negocial — sem FK, joins ou nomes técnicos]

---

## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| [data atual] | [Claude / autor] | N1 negocial criado | Gerado pelo PROMPT 1A |

---

*Última revisão: —*
*Links: [Feature Set 1](./[pasta]/README.md) · [INDEX geral](../INDEX.md)*
```

> **Tabela de Feature Sets** — cada linha entra com o **nome em link** para o
> futuro README do N2 (`./[pasta]/README.md`, criado no PROMPT_2A), a **Pasta**
> (slug do Feature Set) e a contagem de **Features** (`[N]` enquanto o N2 não
> existir; preenchida ao detalhar o Feature Set no N2). O rodapé `*Links:*` também
> aponta para os Feature Sets do domínio.

Seções deixadas em branco para o PROMPT 1B:
- Entidades e campos
- Integrações técnicas

Após apresentar, pergunte:
> "O N1 negocial de [domínio] está correto?
> Ajusta algo ou avanço para o próximo domínio?"

---

## PASSO 3 — INDEX negocial

Após todos os domínios aprovados, gere:

📄 `modules/INDEX.md` — versão negocial

Conteúdo:
- Tabela de domínios com nome, descrição e Feature Sets
- Mapa de dependências entre domínios em linguagem de negócio
- Lista de regras que cruzam mais de um domínio

Após apresentar o INDEX, prossiga para o Passo 4.

---

## PASSO 4 — Verificação contra o N0 (nível imediatamente anterior)

Sempre que um domínio (N1) for gerado ou alterado, confronte-o com o
`N0_PRODUCT_VISION.md`:

- Verifique se o domínio e seus Feature Sets são coerentes com a visão de
  produto (objetivos, escopo, público-alvo).
- Se o N0 mantém uma lista de domínios/áreas e o novo domínio não estiver
  refletido, proponha incluí-lo.
- Sinalize com ⚠️ qualquer divergência entre o que o N1 descreve e o que o
  N0 estabelece (escopo que extrapola a visão, contradição de objetivo).

O N0 é um documento de visão — não o reestruture; limite-se a alinhar e a
registrar divergências, pedindo aprovação antes de qualquer ajuste no N0.

Ao finalizar, informe:
> "Parte negocial do N1 concluída. Para complementar com os campos,
> entidades e integrações técnicas, use o PROMPT_1B passando
> cada README.md gerado aqui como contexto."

---

## Checklist de conformidade do N1

Antes de apresentar cada domínio, confira (todos os itens são obrigatórios):

- [ ] Título exatamente `# Domínio: [Nome]`
- [ ] Subtítulo em blockquote: `> **Nível 1** - Visão estratégica do domínio - [SIGLA]` (SIGLA de **3 letras maiúsculas** em crase, hífens `-`)
- [ ] Descrição (2-3 frases) seguida da subseção `### O que este domínio NÃO faz`
- [ ] **Feature Sets**: tabela (Feature Set | Pasta | Descrição | Features) com o **nome em link** para o README do N2 (`./[pasta]/README.md`) e rodapé `*Links:*` apontando para os Feature Sets
- [ ] **Regras transversais de negócio**: lista numerada de **invariantes** (o *quê* a área garante) — qualidade do sistema (desempenho/segurança/auditoria) **não** entra aqui, vai para `global/NFR.md`
- [ ] **Dependências com outros domínios** em linguagem de negócio (sem FK, joins ou nomes técnicos)
- [ ] **Changelog**
- [ ] **Nenhuma** seção técnica (entidades, campos, integrações técnicas ficam para o **PROMPT_1B**)
- [ ] Ao fechar todos os domínios: `modules/INDEX.md` negocial atualizado e cada N1 conferido contra o N0
