# PROMPT DATA-MODEL — Modelo de Entidades (negocial)
## ⚠️ Este prompt foi aposentado

> Ele foi escrito para a variante **negocial-apenas** do engine
> (`doc-template-engine-caixa`, que não tem as passadas técnicas B) e vazou
> para cá sem nunca ter sido integrado ao menu ou à skill. A variante mantém
> a **cópia própria** dele — é lá que ele vive.
>
> **Neste engine**, o modelo de dados é mantido pelo fluxo padrão:
> - **PROMPT_1B** (opção 1B) — N1 técnico + data-model do domínio;
> - **PROMPT_3B** (opção 3B) — mantém entidades/campos por feature;
> - **PROMPT_DATA_MODEL_FROM_SQL** — engenharia reversa a partir do SQL.
>
> O template do artefato negocial
> (`engine/templates/global/data-models/_template-dominio-negocio.md`) e a sua
> validação no `validate-doc.mjs` **continuam disponíveis** para instâncias
> só-negociais.
