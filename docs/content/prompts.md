# Prompts

Os prompts ficam em
[`engine/prompts/`](https://github.com/andromarcio/doc-template-engine/tree/main/engine/prompts)
e são **auto-contidos** — não dependem de arquivos fora do `engine/`.

## Sistema e menu

| Prompt | Papel |
|---|---|
| [`SYSTEM_PROMPT_analista_requisitos`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/SYSTEM_PROMPT_analista_requisitos.md) | Prompt de sistema do analista de requisitos (fluxo IV → EX) |
| [`PROMPT_MENU`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_MENU.md) | Índice operacional — lista todas as opções |

## Especificação por nível (N1 → N3)

| Prompt | Nível | Passada |
|---|---|---|
| [`PROMPT_1A_N1_negocio`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_1A_N1_negocio.md) | N1 | Negócio |
| [`PROMPT_1B_N1_tecnico`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_1B_N1_tecnico.md) | N1 | Técnico |
| [`PROMPT_2A_N2_negocio`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_2A_N2_negocio.md) | N2 | Negócio |
| [`PROMPT_2B_N2_tecnico`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_2B_N2_tecnico.md) | N2 | Técnico |
| [`PROMPT_3A_N3_negocio`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_3A_N3_negocio.md) | N3 | Negócio |
| [`PROMPT_3A_N3_negocio_transcricao`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_3A_N3_negocio_transcricao.md) | N3 | Negócio (de transcrição) |
| [`PROMPT_3B_N3_tecnico`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_3B_N3_tecnico.md) | N3 | Técnico |

## Manutenção e derivação

| Prompt | Papel |
|---|---|
| [`PROMPT_4A_N3_UPDATE_negocio`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_4A_N3_UPDATE_negocio.md) | Alterar feature existente (negócio) |
| [`PROMPT_4B_N3_UPDATE_tecnico`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_4B_N3_UPDATE_tecnico.md) | Alterar feature existente (técnico) |
| [`PROMPT_N3_TO_N2`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_N3_TO_N2.md) | Derivar N2 a partir de features (bottom-up) |
| [`PROMPT_N3_TO_N1`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_N3_TO_N1.md) | Derivar N1 a partir de features (bottom-up) |

## Intake e descoberta

| Prompt | Opção | Papel |
|---|---|---|
| [`PROMPT_TRIAGEM`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_TRIAGEM.md) | TR | Triagem — o que existe e qual a rota |
| [`PROMPT_BACKLOG`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_BACKLOG.md) | HU | Intake de história de usuário |
| [`PROMPT_INVESTIGADOR`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_INVESTIGADOR.md) | IV | Levanta um delta que afeta vários artefatos |
| [`PROMPT_EXECUTOR`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_EXECUTOR.md) | EX | Aplica as mudanças levantadas |

## Dimensionamento, qualidade e extração

| Prompt | Papel |
|---|---|
| [`PROMPT_CONTAGEM`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_CONTAGEM.md) | Contagem de Pontos de Função (APF) |
| [`PROMPT_NFR`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_NFR.md) | Requisitos não-funcionais |
| [`PROMPT_QA`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_QA.md) | Geração/validação de QA |
| [`PROMPT_0_EXTRACTION`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_0_EXTRACTION.md) | Extração inicial de informação |
| [`PROMPT_TRANSCRICAO_REUNIAO`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_TRANSCRICAO_REUNIAO.md) | Estrutura uma transcrição de reunião |
| [`PROMPT_AUDIT_RULES_DEDUP`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_AUDIT_RULES_DEDUP.md) | Auditoria e deduplicação de regras |

## Engenharia reversa e dados

| Prompt | Papel |
|---|---|
| [`PROMPT_REVERSE_ENGINEERING`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_REVERSE_ENGINEERING.md) | Spec a partir de código existente |
| [`PROMPT_REPO_MAPPING`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_REPO_MAPPING.md) | Mapeia specs ↔ repositórios |
| [`PROMPT_DATA_MODEL_FROM_SQL`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_DATA_MODEL_FROM_SQL.md) | Modelo de dados a partir de SQL |
| [`PROMPT_CONVERSION`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_CONVERSION.md) | Conversão entre formatos |
| [`PROMPT_SDD`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_SDD.md) | Documento de desenho de solução |

## Protótipos

| Prompt | Papel |
|---|---|
| [`PROMPT_PROTOTYPE_SCREEN_COMPONENT`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_PROTOTYPE_SCREEN_COMPONENT.md) | Protótipo de componente de tela |
| [`PROMPT_PROTOTYPE_SCREEN_FULL`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_PROTOTYPE_SCREEN_FULL.md) | Protótipo de tela completa |
| [`PROMPT_PROTOTYPE_FLOW_COMPONENT`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_PROTOTYPE_FLOW_COMPONENT.md) | Protótipo de componente de fluxo |
| [`PROMPT_PROTOTYPE_FLOW_FULL`](https://github.com/andromarcio/doc-template-engine/blob/main/engine/prompts/PROMPT_PROTOTYPE_FLOW_FULL.md) | Protótipo de fluxo completo |
