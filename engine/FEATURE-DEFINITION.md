# FEATURE-DEFINITION.md — o que é uma Feature (N3)

> **Fonte única da definição de feature** no doc-template-engine. O skill
> (`analista-requisitos`), os prompts (3A/CRUD/WIZARD/TRIAGEM) e o validador semântico
> determinístico (`scripts/validate-feature-semantics.mjs`) derivam **deste arquivo** —
> não redefina "feature" em outro lugar; referencie aqui.
>
> ⚠️ **Contrato máquina-legível**: as tabelas das seções
> `## Vocabulário de verbos canônicos`, `## Termos bloqueados na posição do verbo` e
> `## Termos proibidos na Descrição` são **lidas programaticamente** pelo validador.
> Não renomeie esses títulos de seção nem mude o formato das tabelas
> (primeira coluna = termo).

---

## Definição

Uma **feature (N3)** é a **unidade atômica de especificação**: uma **ação de negócio**
que um ator executa (ou dispara) no sistema, com **começo, meio, fim e resultado
observável**. A forma canônica do nome é **um verbo no infinitivo + uma entidade**:
*cadastrar cliente*, *calcular frete*, *aprovar solicitação*.

Decomposição da definição — cada parte é um teste:

- **Uma ação** — um único verbo. Se o nome precisa de "e"/"ou" para ligar dois verbos
  ("cadastrar **e** editar cliente"), são **duas** features.
- **De negócio** — alguém de negócio raciocina sobre ela e a reconhece como algo que o
  sistema *faz por ele*. "Criar índice no banco" não passa; "importar arquivo de
  retorno" passa.
- **Um ator executa ou dispara** — dá para completar a frase *"O [ator] consegue
  [verbo] [entidade]"*. Vale também para ações disparadas por tempo/evento
  (*gerar cobrança mensal* — o ator é o próprio sistema, agindo pelo negócio).
- **Começo, meio, fim** — a ação termina; existe um momento claro de "pronto".
  "Monitorar" contínuo sem desfecho é tela/painel (N2 + comportamento de tela), não
  feature — a feature é *consultar/acompanhar [entidade]* com resultado exibido.
- **Resultado observável** — dá para escrever pelo menos um cenário Gherkin com
  **Então/Then** que passa ou falha. Sem resultado observável não há como aceitar a
  entrega — e não há feature.

## Critérios objetivos (FD-1 … FD-7)

Cada critério abaixo é **testável**. A coluna "Verificação" indica o que o gate
determinístico (`scripts/validate-feature-semantics.mjs`) checa sozinho e o que fica
para revisão humana (`PROMPT_REVIEW`).

| ID | Critério | Teste concreto | Verificação |
|---|---|---|---|
| FD-1 | **Nomeada por verbo no infinitivo** | Arquivo `f-[verbo]-[entidade](-[adjetivo]).md`; o primeiro segmento consta do vocabulário canônico (ou é infinitivo bem-formado ainda não catalogado → aviso) | Automática |
| FD-2 | **Título conta a mesma ação** | Título `# [Verbo] [entidade…]` começa com o **mesmo verbo** do nome do arquivo (acentos ignorados) | Automática |
| FD-3 | **Atômica — uma ação só** | Nome do arquivo e título não encadeiam **dois** verbos canônicos ("gerar e enviar boleto" → duas features) | Automática |
| FD-4 | **Não é agrupador** | O termo na posição do verbo não é substantivo de área ("cadastro", "gestão", "painel" → isso é **Feature Set/N2**) | Automática |
| FD-5 | **Não é outro artefato** | Não é campo, regra, tela, mensagem ou NFR nomeado como feature (ver tabela de bloqueados e encaminhamentos) | Automática + humana |
| FD-6 | **Resultado observável** | `## Cenários` tem pelo menos um cenário Gherkin e **todo** cenário tem `Então/Then` | Automática (presença) + humana (qualidade) |
| FD-7 | **Regras são invariantes** | Nenhum item de `## Regras de negócio` carrega reação do sistema ("não salva", "exibe mensagem", "conforme o Design System") — reação é cenário | Automática (padrões) + humana |
| FD-8 | **Descrição declara a entrega** | `## Descrição` diz, em 1–2 frases de negócio, **o que a feature entrega** — sem placeholder, sem termo vago ("etc.", "de forma eficiente"), sem termo técnico, sem copiar a descrição de outra feature | Automática (padrões + duplicidade) + humana (sentido de negócio) |

## Teste rápido (para o analista, antes de abrir o PROMPT_3A)

1. Complete: *"O usuário consegue **[verbo]** **[entidade]**"*. Não conseguiu? Não é
   feature (ainda).
2. Existe um momento claro de **"pronto"**, com resultado que dá para verificar? Se
   não, você está descrevendo uma tela, um painel ou um processo — não uma ação.
3. Se dividir em duas partes, **cada parte entrega valor sozinha**? Se sim, são duas
   features.
4. O nome é um **substantivo** ("Cadastro de Clientes", "Gestão de Contratos")? Então é
   um **Feature Set (N2)** — as features são as ações dentro dele.

## O que NÃO é uma feature — e para onde vai

| Isto… | …não é feature porque | Encaminhamento |
|---|---|---|
| Um **campo** ("CPF do cliente") | é um dado, não uma ação | tabela de Campos do N3 + `global/data-models/[dominio].md` |
| Uma **regra de negócio** ("CPF é único") | é uma invariante, não uma ação | `## Regras de negócio` do N3 ou `RULES-DICTIONARY` |
| Uma **tela** ("Tela de clientes") | uma tela atende **várias** features | N2 (seção Telas) + `## Comportamento de tela` dos N3 |
| Uma **mensagem** ("Aviso de duplicidade") | é reação do sistema dentro de um cenário | `MESSAGE-DICTIONARY` + `## Cenários` |
| Um **requisito não-funcional** ("Responder em 2s") | descreve *quão bem*, não *o quê* | `global/NFR.md` |
| Um **agrupador** ("Cadastro de Clientes") | agrupa várias ações | **Feature Set (N2)** — cada ação vira um N3 |
| Uma **etapa de wizard** ("Passo 2 — endereço") | não entrega valor sozinha | parte da feature principal do wizard (`PROMPT_WIZARD`) |
| Uma **melhoria/ajuste** ("Melhorar a pesquisa") | é manutenção de feature existente | `PROMPT_4A`/`PROMPT_4B` sobre o N3 já existente |

## Vocabulário de verbos canônicos

Verbos aceitos na **posição do verbo** — o primeiro segmento do arquivo
`f-[verbo]-…` e a primeira palavra do título. No arquivo a grafia é kebab-case **sem
acento** (`lancar`); no título pode acentuar (`Lançar`) — a comparação ignora acentos.
A lista vale para o **slot do verbo**: os mesmos termos são livres como entidade
(`f-lancar-pagamento` ✓; `f-pagamento-cliente` ✗).

| Verbo | Categoria |
|---|---|
| `cadastrar` | CRUD e ciclo de vida |
| `criar` | CRUD e ciclo de vida |
| `registrar` | CRUD e ciclo de vida |
| `incluir` | CRUD e ciclo de vida |
| `adicionar` | CRUD e ciclo de vida |
| `editar` | CRUD e ciclo de vida |
| `alterar` | CRUD e ciclo de vida |
| `atualizar` | CRUD e ciclo de vida |
| `excluir` | CRUD e ciclo de vida |
| `remover` | CRUD e ciclo de vida |
| `desativar` | CRUD e ciclo de vida |
| `ativar` | CRUD e ciclo de vida |
| `inativar` | CRUD e ciclo de vida |
| `reativar` | CRUD e ciclo de vida |
| `arquivar` | CRUD e ciclo de vida |
| `restaurar` | CRUD e ciclo de vida |
| `duplicar` | CRUD e ciclo de vida |
| `clonar` | CRUD e ciclo de vida |
| `renomear` | CRUD e ciclo de vida |
| `reordenar` | CRUD e ciclo de vida |
| `pesquisar` | Consulta |
| `listar` | Consulta |
| `consultar` | Consulta |
| `buscar` | Consulta |
| `visualizar` | Consulta |
| `detalhar` | Consulta |
| `filtrar` | Consulta |
| `acompanhar` | Consulta |
| `monitorar` | Consulta |
| `comparar` | Consulta |
| `auditar` | Consulta |
| `aprovar` | Fluxo e decisão |
| `reprovar` | Fluxo e decisão |
| `rejeitar` | Fluxo e decisão |
| `revisar` | Fluxo e decisão |
| `submeter` | Fluxo e decisão |
| `enviar` | Fluxo e decisão |
| `reenviar` | Fluxo e decisão |
| `cancelar` | Fluxo e decisão |
| `suspender` | Fluxo e decisão |
| `retomar` | Fluxo e decisão |
| `concluir` | Fluxo e decisão |
| `finalizar` | Fluxo e decisão |
| `encerrar` | Fluxo e decisão |
| `iniciar` | Fluxo e decisão |
| `agendar` | Fluxo e decisão |
| `reagendar` | Fluxo e decisão |
| `atribuir` | Fluxo e decisão |
| `reatribuir` | Fluxo e decisão |
| `transferir` | Fluxo e decisão |
| `delegar` | Fluxo e decisão |
| `priorizar` | Fluxo e decisão |
| `homologar` | Fluxo e decisão |
| `autorizar` | Fluxo e decisão |
| `liberar` | Fluxo e decisão |
| `bloquear` | Fluxo e decisão |
| `desbloquear` | Fluxo e decisão |
| `publicar` | Fluxo e decisão |
| `despublicar` | Fluxo e decisão |
| `assinar` | Fluxo e decisão |
| `confirmar` | Fluxo e decisão |
| `contestar` | Fluxo e decisão |
| `justificar` | Fluxo e decisão |
| `calcular` | Cálculo e processamento |
| `recalcular` | Cálculo e processamento |
| `gerar` | Cálculo e processamento |
| `emitir` | Cálculo e processamento |
| `processar` | Cálculo e processamento |
| `reprocessar` | Cálculo e processamento |
| `validar` | Cálculo e processamento |
| `verificar` | Cálculo e processamento |
| `conciliar` | Cálculo e processamento |
| `consolidar` | Cálculo e processamento |
| `apurar` | Cálculo e processamento |
| `simular` | Cálculo e processamento |
| `converter` | Cálculo e processamento |
| `classificar` | Cálculo e processamento |
| `estimar` | Cálculo e processamento |
| `projetar` | Cálculo e processamento |
| `ratear` | Cálculo e processamento |
| `distribuir` | Cálculo e processamento |
| `lancar` | Cálculo e processamento |
| `importar` | Dados e integração |
| `exportar` | Dados e integração |
| `sincronizar` | Dados e integração |
| `notificar` | Dados e integração |
| `anexar` | Dados e integração |
| `desanexar` | Dados e integração |
| `baixar` | Dados e integração |
| `carregar` | Dados e integração |
| `imprimir` | Dados e integração |
| `compartilhar` | Dados e integração |
| `migrar` | Dados e integração |
| `autenticar` | Conta, acesso e parametrização |
| `recuperar` | Conta, acesso e parametrização |
| `redefinir` | Conta, acesso e parametrização |
| `vincular` | Conta, acesso e parametrização |
| `desvincular` | Conta, acesso e parametrização |
| `associar` | Conta, acesso e parametrização |
| `desassociar` | Conta, acesso e parametrização |
| `configurar` | Conta, acesso e parametrização |
| `definir` | Conta, acesso e parametrização |
| `parametrizar` | Conta, acesso e parametrização |
| `conceder` | Conta, acesso e parametrização |
| `revogar` | Conta, acesso e parametrização |
| `solicitar` | Conta, acesso e parametrização |
| `responder` | Conta, acesso e parametrização |
| `avaliar` | Conta, acesso e parametrização |
| `comentar` | Conta, acesso e parametrização |
| `pagar` | Financeiro |
| `estornar` | Financeiro |
| `faturar` | Financeiro |
| `cobrar` | Financeiro |
| `renovar` | Financeiro |
| `quitar` | Financeiro |
| `parcelar` | Financeiro |
| `provisionar` | Financeiro |

## Termos bloqueados na posição do verbo

Termos que, aparecendo como primeiro segmento do `f-…` ou primeira palavra do título,
**denunciam que aquilo não é uma feature**. O validador reprova com o encaminhamento
da terceira coluna. (Grafia sem acento — a comparação normaliza acentos.)

| Termo | O que provavelmente é | Encaminhamento |
|---|---|---|
| `cadastro` | agrupador de ações CRUD | Feature Set (N2); as ações viram `f-cadastrar-…`, `f-pesquisar-…` etc. (`PROMPT_CRUD`) |
| `cadastramento` | agrupador de ações CRUD | Feature Set (N2) + features por ação |
| `gestao` | área/agrupador | Feature Set (N2) ou Domínio (N1) |
| `gerenciamento` | área/agrupador | Feature Set (N2) ou Domínio (N1) |
| `manutencao` | área/agrupador | Feature Set (N2); cada ação vira uma feature |
| `controle` | área/agrupador | Feature Set (N2) |
| `administracao` | área/agrupador | Feature Set (N2) ou Domínio (N1) |
| `modulo` | agrupador | Domínio (N1) ou Feature Set (N2) |
| `area` | agrupador | Domínio (N1) ou Feature Set (N2) |
| `painel` | tela que atende várias features | N2 (Telas) + uma feature `consultar/acompanhar` por ação |
| `dashboard` | tela que atende várias features | N2 (Telas) + features de consulta |
| `portal` | agrupador | Domínio (N1) |
| `central` | agrupador | Feature Set (N2) |
| `fluxo` | processo com várias ações | Feature Set (N2) ou `PROMPT_WIZARD` |
| `processo` | processo com várias ações | Feature Set (N2) ou `PROMPT_WIZARD` |
| `esteira` | processo com várias ações | Feature Set (N2) |
| `jornada` | processo com várias ações | Feature Set (N2) |
| `pesquisa` | nominalização de ação | use o verbo: `f-pesquisar-…` |
| `consulta` | nominalização de ação | use o verbo: `f-consultar-…` |
| `listagem` | nominalização de ação | use o verbo: `f-listar-…` |
| `busca` | nominalização de ação | use o verbo: `f-buscar-…` |
| `edicao` | nominalização de ação | use o verbo: `f-editar-…` |
| `exclusao` | nominalização de ação | use o verbo: `f-excluir-…` |
| `criacao` | nominalização de ação | use o verbo: `f-criar-…` |
| `inclusao` | nominalização de ação | use o verbo: `f-incluir-…` |
| `alteracao` | nominalização de ação | use o verbo: `f-alterar-…` |
| `atualizacao` | nominalização de ação | use o verbo: `f-atualizar-…` |
| `visualizacao` | nominalização de ação | use o verbo: `f-visualizar-…` |
| `importacao` | nominalização de ação | use o verbo: `f-importar-…` |
| `exportacao` | nominalização de ação | use o verbo: `f-exportar-…` |
| `emissao` | nominalização de ação | use o verbo: `f-emitir-…` |
| `geracao` | nominalização de ação | use o verbo: `f-gerar-…` |
| `aprovacao` | nominalização de ação | use o verbo: `f-aprovar-…` |
| `envio` | nominalização de ação | use o verbo: `f-enviar-…` |
| `cancelamento` | nominalização de ação | use o verbo: `f-cancelar-…` |
| `agendamento` | nominalização de ação | use o verbo: `f-agendar-…` |
| `configuracao` | nominalização de ação | use o verbo: `f-configurar-…` |
| `autenticacao` | nominalização de ação | use o verbo: `f-autenticar-…` |
| `integracao` | nominalização de ação | use o verbo (`f-sincronizar-…`, `f-importar-…`) ou N2 se agrupar várias |
| `sincronizacao` | nominalização de ação | use o verbo: `f-sincronizar-…` |
| `cobranca` | nominalização de ação | use o verbo: `f-cobrar-…` / `f-gerar-cobranca` |
| `faturamento` | nominalização de ação | use o verbo: `f-faturar-…` |
| `pagamento` | nominalização de ação | use o verbo: `f-pagar-…` / `f-lancar-pagamento` |
| `campo` | dado, não ação | tabela de Campos + `global/data-models/[dominio].md` |
| `tela` | tela atende várias features | N2 (Telas) + `## Comportamento de tela` |
| `formulario` | tela/componente | N2 (Telas); a ação é a feature |
| `modal` | componente de tela | `## Comportamento de tela` da feature dona da ação |
| `botao` | componente de tela | `## Comportamento de tela` da feature dona da ação |
| `tabela` | componente de tela | `## Colunas do resultado` da feature de pesquisa |
| `grid` | componente de tela | `## Colunas do resultado` da feature de pesquisa |
| `relatorio` | saída de uma ação | use o verbo: `f-gerar-relatorio-…` / `f-emitir-…` |
| `grafico` | componente de tela | `## Comportamento de tela` da feature de consulta |
| `regra` | invariante, não ação | `## Regras de negócio` ou `RULES-DICTIONARY` |
| `validacao` | regra/reação | regra (invariante) + cenário (reação) |
| `mensagem` | reação do sistema | `MESSAGE-DICTIONARY` + `## Cenários` |
| `erro` | reação do sistema | `ERROR-DICTIONARY` + `## Cenários` |
| `alerta` | reação do sistema | `MESSAGE-DICTIONARY` + `## Cenários` |
| `api` | camada técnica | seção `dev-only` do N3 dono da ação |
| `endpoint` | camada técnica | seção `dev-only` do N3 dono da ação |
| `servico` | camada técnica | seção `dev-only` / SDD |
| `crud` | agrupador de ações | `PROMPT_CRUD` (gera N2 + os 5 N3) |
| `wizard` | processo multi-etapas | `PROMPT_WIZARD` (gera N2 + feature principal e auxiliares) |
| `login` | nominalização | use o verbo: `f-autenticar-usuario` |
| `logout` | nominalização | use o verbo: `f-encerrar-sessao` |
| `desempenho` | NFR (*quão bem*) | `global/NFR.md` |
| `performance` | NFR (*quão bem*) | `global/NFR.md` |
| `seguranca` | NFR (*quão bem*) | `global/NFR.md` |
| `disponibilidade` | NFR (*quão bem*) | `global/NFR.md` |
| `escalabilidade` | NFR (*quão bem*) | `global/NFR.md` |
| `usabilidade` | NFR (*quão bem*) | `global/NFR.md` |
| `auditoria` | NFR transversal | `global/NFR.md`; a consulta da trilha é uma feature de consulta: `f-consultar-trilha-auditoria` |
| `backup` | NFR/operação técnica | `global/NFR.md` |
| `log` | efeito técnico | `dev-only` (AuditLog) ou `global/NFR.md` |
| `monitoramento` | NFR/operação | `global/NFR.md`; consulta de indicadores é `f-acompanhar-…` |
| `infraestrutura` | técnico | fora do escopo de N3 (SDD/NFR) |
| `melhoria` | manutenção de feature existente | `PROMPT_4A`/`PROMPT_4B` no N3 existente |
| `ajuste` | manutenção de feature existente | `PROMPT_4A`/`PROMPT_4B` no N3 existente |
| `correcao` | manutenção/bug | `PROMPT_4A`/`PROMPT_4B` no N3 existente |
| `refatoracao` | técnico | fora do escopo de N3 |
| `suporte` | área/agrupador | Domínio (N1) ou Feature Set (N2) |

## Descrição — o contrato de entrega (FD-8)

A `## Descrição` do N3 é o **contrato de entrega** da feature: em **1–2 frases de
negócio**, para alguém que nunca viu o sistema, ela responde *"o que eu ganho quando
esta feature estiver pronta?"*. Três qualidades, na linguagem do analista:

- **Tangível** — nomeia a **ação e o resultado**, não uma intenção. Se a frase não
  contém nenhum verbo de ação (só "facilita", "melhora", "otimiza"), não há entrega.
- **Única** — em dois sentidos: a feature entrega **uma** coisa (se a descrição precisa
  de "e também…", provavelmente são duas features — ver FD-3); e a entrega é **dela**
  (duas features com a mesma descrição são a mesma feature duplicada ou uma descrição
  genérica demais).
- **Negocial** — linguagem de negócio pura (Modo PO): nada de endpoint, API, banco,
  JSON. E alguém de negócio reconhece valor na frase — este último julgamento é humano.

**Fórmula sugerida** (não obrigatória, mas resolve 90% dos casos):

> *"Permite que [ator] [ação] [entidade], [resultado/efeito observável]."*

| ❌ Não passa | Por quê | ✅ Passa |
|---|---|---|
| "Cadastro de clientes." | não é frase de entrega — é o nome de um agrupador | "Permite registrar um novo cliente com seus dados básicos, deixando-o disponível para os demais processos." |
| "Facilita a gestão de contratos de forma eficiente." | intenção vaga, sem ação nem resultado | "Permite suspender um contrato vigente, interrompendo as cobranças até a reativação." |
| "Endpoint que grava o cliente na tabela `clients`." | técnico — Modo PO não fala de endpoint/tabela | "Permite registrar um novo cliente…" (o técnico vai para o `dev-only`/3B) |
| (mesma descrição em dois N3) | a entrega não é única — ou é duplicata, ou é genérica | cada N3 descreve **a sua** entrega |

## Termos proibidos na Descrição

Termos que reprovam a Descrição no gate (comparação sem acento, palavra/frase
inteira). `vago` = não declara entrega tangível; `tecnico` = vaza camada técnica no
Modo PO.

| Termo | Tipo | Orientação |
|---|---|---|
| `etc` | vago | liste o que entra — ou corte; "etc." esconde escopo |
| `entre outros` | vago | idem: escopo escondido |
| `entre outras` | vago | idem: escopo escondido |
| `e afins` | vago | idem: escopo escondido |
| `e assim por diante` | vago | idem: escopo escondido |
| `diversas funcionalidades` | vago | cada funcionalidade é uma feature — nomeie a desta |
| `varias funcionalidades` | vago | cada funcionalidade é uma feature — nomeie a desta |
| `de forma eficiente` | vago | eficiência é NFR (`global/NFR.md`); a descrição diz a entrega |
| `de maneira eficiente` | vago | idem |
| `de forma agil` | vago | idem |
| `de forma rapida` | vago | idem (se for requisito de tempo, é NFR) |
| `de forma facil` | vago | facilidade é NFR/UX; a descrição diz a entrega |
| `de forma simples` | vago | idem |
| `melhorar a experiencia` | vago | intenção, não entrega — diga o que muda para o usuário |
| `otimizar o processo` | vago | intenção, não entrega — diga o que a feature faz |
| `facilitar o dia a dia` | vago | intenção, não entrega |
| `endpoint` | tecnico | Modo PO: "operação de API" — e só no `dev-only`/3B |
| `api` | tecnico | camada técnica — `dev-only`/3B |
| `backend` | tecnico | camada técnica — `dev-only`/3B |
| `frontend` | tecnico | camada técnica — `dev-only`/3B |
| `banco de dados` | tecnico | Modo PO: a estrutura física vive no data-model |
| `sql` | tecnico | camada técnica — data-model |
| `json` | tecnico | camada técnica — `dev-only`/3B |
| `http` | tecnico | camada técnica — `dev-only`/3B |
| `payload` | tecnico | camada técnica — `dev-only`/3B |
| `request` | tecnico | camada técnica — `dev-only`/3B |
| `webhook` | tecnico | Modo PO: "notificação automática entre sistemas" |
| `microsservico` | tecnico | camada técnica — SDD |
| `microservico` | tecnico | camada técnica — SDD |
| `uuid` | tecnico | Modo PO: "identificador único" |
| `enum` | tecnico | Modo PO: "lista de opções" |
| `cache` | tecnico | camada técnica — `dev-only`/3B |
| `deploy` | tecnico | fora do escopo do N3 |
| `migration` | tecnico | Modo PO: "estrutura do banco de dados" — e no data-model |
| `crud` | tecnico | nomeie a ação desta feature; o conjunto é o N2 (`PROMPT_CRUD`) |

## Como estender o vocabulário

- **Verbo legítimo que não está na tabela** (ex.: um verbo específico do domínio do
  produto): o validador emite **aviso** (não erro) quando o termo tem forma de
  infinitivo (`…ar`/`…er`/`…ir`). Confirme que é uma ação de negócio e **adicione a
  linha** na tabela de verbos — o aviso desaparece e o verbo passa a valer para todas
  as instâncias.
- **Termo que denuncia não-feature** e ainda não está bloqueado: adicione à tabela de
  bloqueados com o encaminhamento correto.
- Mudanças aqui são mudanças de **contrato do framework**: registre no `CHANGELOG.md`.

## Verificação automática — o que o gate cobre (e o que não cobre)

```
node scripts/validate-feature-semantics.mjs <modules/.../f-….md>
```

Roda também automaticamente no hook `PostToolUse` (`scripts/hooks/spec-guard.mjs`) a
cada N3 gravado, junto com o gate estrutural (`validate-doc.mjs`).

**Coberto deterministicamente** (independe de LLM): FD-1 a FD-8 conforme a tabela de
critérios — verbo no infinitivo catalogado, título coerente com o arquivo, atomicidade
(um verbo só), termos bloqueados (agrupador/nominalização/artefato/NFR), presença de
cenário com `Então/Then` em todos os cenários, regras sem cauda de reação e Descrição
com entrega declarada: sem placeholder, tamanho de 1–2 frases, sem termos vagos ou
técnicos (tabela acima), com menção a uma ação do vocabulário (aviso quando ausente) e
**não duplicada** — o gate varre os demais N3 da instância e reprova descrição idêntica
(quase idêntica gera aviso).

**Não coberto** (fica para `PROMPT_REVIEW` e revisão humana): se a ação tem valor de
negócio real ("faz sentido negocialmente" — o gate garante a **forma** da entrega, não
o seu valor), se a entidade escolhida é a correta, se a granularidade está boa além da
heurística (ex.: duas features que só fazem sentido juntas), e a qualidade dos
cenários (um `Então` genérico passa no gate, mas não na revisão).
