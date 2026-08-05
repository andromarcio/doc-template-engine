# Especificação de Negócio — Pacote 2: Parametrização de Atas de Registro de Preços

**Portal de Compras do Sistema Indústria** · Módulo M16 — Registro de Preços · Integração Protheus (Pacote 1)

**Versão 2.0 — 02/08/2026.** Documento regenerado no padrão v3 (histórias enxutas + especificação por funcionalidade). Substitui a versão 1.0.

## 1. Contexto e objetivo

As Atas de Registro de Preços têm seus dados extraídos do Protheus (Pacote 1). Antes de ficarem disponíveis ao solicitante, as atas precisam ser parametrizadas pelo administrador: um nome amigável, a exigência de pedido mínimo, a exigência de aprovação do gestor da ata por exceção e as imagens dos produtos. Além disso, define-se quem pode autorizar o consumo da ata.

Este documento especifica o Pacote 2, composto por duas funcionalidades encadeadas: a **pesquisa de atas para parametrização**, onde o administrador localiza atas já parametrizadas (para editar) ou ainda não parametrizadas (para parametrizar); e a **parametrização da ata** selecionada, com os dados de origem do Protheus em leitura e os campos parametrizáveis editáveis.

Fora do escopo deste pacote: a consulta/seleção pelo solicitante, o acompanhamento de status, a geração de Autorização de Fornecimento e o painel do gestor — pertencem a outros pacotes.

## 2. Atores

- **Administrador:** responsável por pesquisar e parametrizar as atas.
- **Gestor da ata:** responsável pela autorização de consumo da ata (atua em pacote próprio).
- **Protheus (ERP):** origem dos dados da ata (contrato, fornecedor, vigência) e da lista inicial de autorizadores.

## 3. Glossário

| Termo | Significado |
|---|---|
| Ata parametrizada | Ata que já teve seus parâmetros definidos e salvos no Portal. |
| Nome da ata | Nome amigável, editável pelo administrador, exibido ao solicitante; não altera os dados do Protheus. |
| Pedido mínimo | Valor mínimo (R$) exigido em uma solicitação contra a ata, quando aplicável. |
| Aprovação do gestor por exceção | Exigência de que o pedido passe pelo gestor da ata antes do gestor solicitante (alçada) quando cruzar um gatilho. |
| Gatilho de exceção | Limite (valor e/ou % do saldo) que, ao ser cruzado, exige a aprovação do gestor. |
| Autorizador do consumo | Pessoa habilitada a autorizar os pedidos que caem na regra de exceção; origem automática (Protheus) ou inclusão manual. |
| Usuário ativo do Portal | Pessoa com cadastro ativo no Portal de Compras, elegível a ser incluída como autorizador. |

## 4. Macro fluxo

1. O administrador acessa a pesquisa de atas para parametrização.
2. Filtra por status e/ou busca por contrato, fornecedor ou nome da ata.
3. Aciona "Parametrizar" (ata não parametrizada) ou "Editar" (ata já parametrizada).
4. A parametrização abre com os dados do Protheus em leitura e os campos parametrizáveis.
5. O administrador define nome, pedido mínimo, aprovação do gestor (com gatilhos), imagens e autorizadores do consumo.
6. Ao salvar, as validações são aplicadas e os parâmetros ficam disponíveis para os pacotes consumidores.

## 5. Histórias da demanda (cards)

> Conforme o padrão: o card gera conversa, priorização e aceite. Todo o detalhe verificável — campos, regras, cenários, mensagens, estados, permissões e comportamento de tela — vive nas especificações de funcionalidade (seção 6), que os cards referenciam.

### História 1 — Parametrizar a ata de registro de preços

**Como** administrador do Portal de Compras, **quero** parametrizar uma ata extraída do Protheus — nome, pedido mínimo, aprovação do gestor por exceção, imagens e autorizadores do consumo —, **para** controlar como a ata poderá ser usada pelos solicitantes.

**Prioridade:** Must — sem a parametrização, a ata não pode ser disponibilizada ao solicitante. · **Especificação afetada:** *Parametrizar ata de registro de preços* (criada nesta demanda).

Critérios de aceite:

- Os dados de origem do Protheus aparecem somente para leitura.
- A ata só é salva com o nome definido e com os limites das regras ativadas preenchidos e válidos.
- Regras desativadas (pedido mínimo, aprovação por exceção) não interferem no consumo da ata.
- As imagens carregadas passam a aparecer para o solicitante na consulta da ata.
- A lista de autorizadores nasce do Protheus e pode ser ajustada no Portal sem afetar o acesso no Protheus.
- Não é possível salvar com campo de regra ativada vazio ou inválido — os campos pendentes são apontados.

### História 2 — Pesquisar atas para parametrização

**Como** administrador do Portal de Compras, **quero** pesquisar as atas e distinguir as já parametrizadas das ainda não parametrizadas, **para** localizar rapidamente a ata que desejo parametrizar ou editar.

**Prioridade:** Must — é a porta de entrada da parametrização. · **Especificação afetada:** *Pesquisar atas para parametrização* (criada nesta demanda).

Critérios de aceite:

- A busca localiza atas por contrato, fornecedor e nome, combinando os campos preenchidos.
- O filtro de status separa Todas, Parametrizadas e Não parametrizadas, com a contagem de cada grupo.
- Cada ata da lista mostra sua situação de parametrização e a ação correspondente (Parametrizar ou Editar).
- A ação da linha abre a parametrização com a ata daquela linha carregada.
- Pesquisa sem resultados informa a ausência, sem erro.

## 6. Especificações de funcionalidade

### 6.1 Parametrizar ata de registro de preços

**Objetivo.** Permite ao administrador definir os parâmetros de uso de uma ata extraída do Protheus — nome, pedido mínimo, aprovação do gestor por exceção, imagens dos produtos e autorizadores do consumo —, deixando-a disponível aos solicitantes conforme essas regras.

**Campos.**

| Label | Formato | Tam. | Obrig. | Forma de input | Edição | Origem do dado |
|---|---|---|---|---|---|---|
| Número do contrato | Alfanumérico | 20 | — | Texto | Leitura | Protheus (Pacote 1) |
| Fornecedor | Alfanumérico | 120 | — | Texto | Leitura | Protheus (Pacote 1) |
| Vigência | Data | — | — | Texto | Leitura | Protheus (Pacote 1) |
| Situação | Alfanumérico | 20 | — | Texto | Leitura | Protheus (Pacote 1) |
| Nome da ata | Alfanumérico | 120 | Sim | Campo texto | Editável | Administrador |
| Exigir valor mínimo por solicitação | Booleano | — | Não | Switch | Editável | Administrador |
| Valor mínimo (R$) | Decimal (2) | — | Condicional | Campo numérico | Editável | Administrador |
| Exigir aprovação do gestor da ata | Booleano | — | Não | Switch | Editável | Administrador |
| Gatilho por valor do pedido | Booleano | — | Não | Switch | Editável | Administrador |
| Valor limite (R$) | Decimal (2) | — | Condicional | Campo numérico | Editável | Administrador |
| Gatilho por % do saldo da ata | Booleano | — | Não | Switch | Editável | Administrador |
| Percentual do saldo (%) | Numérico | 3 | Condicional | Campo numérico | Editável | Administrador |
| Imagem do item | Arquivo (JPG/PNG) | 2 MB | Não | Upload | Editável | Administrador |
| Incluir autorizador | Lista | — | Não | Combobox | Editável | Usuários ativos do Portal |
| Autorizador — nome / e-mail | Alfanumérico | 120 | — | Texto | Leitura | Protheus ou inclusão manual |
| Origem do autorizador | Alfanumérico | 20 | — | Etiqueta | Leitura | Sistema |

**Regras de negócio.**

1. RN-01 — Os dados de contrato, fornecedor, vigência e situação têm origem no Protheus e não são editáveis no Portal.
2. RN-02 — O nome da ata é obrigatório para concluir a parametrização.
3. RN-03 — O nome da ata não altera os dados do contrato no Protheus.
4. RN-04 — Com "Exigir valor mínimo por solicitação" ativo, o valor mínimo é obrigatório e maior que zero.
5. RN-05 — Com a aprovação do gestor ativa, o valor limite do gatilho por valor, quando habilitado, é obrigatório e maior que zero.
6. RN-06 — O percentual do saldo, quando o gatilho por percentual está habilitado, é obrigatório e está entre 1 e 100.
7. RN-07 — O pedido que cruzar qualquer gatilho habilitado exige a aprovação do gestor da ata antes do gestor solicitante (alçada); os demais seguem direto.
8. RN-08 — Imagens aceitas por item: JPG ou PNG de até 2 MB.
9. RN-09 — A lista inicial de autorizadores contém as pessoas com acesso ao contrato no Protheus que possuam cadastro ativo no Portal.
10. RN-10 — Retiradas, inclusões e reinclusões de autorizadores valem apenas no Portal e não alteram o acesso da pessoa no Protheus.
11. RN-11 — Qualquer usuário ativo do Portal pode ser incluído como autorizador; a mesma pessoa não pode ser autorizadora ativa em duplicidade.
12. RN-12 — Autorizador retirado pode ser reincluído a qualquer momento, inclusive os de origem Protheus.
13. RN-13 — A origem de cada autorizador (Protheus ou inclusão manual) é registrada.

**Cenários.**

*Caminho feliz*

:: **Dado** uma ata não parametrizada aberta na parametrização, **quando** o administrador informa o nome e aciona Salvar com as regras ativadas válidas, **então** os parâmetros são registrados, a ata passa a Parametrizada e a mensagem de sucesso é exibida (ver Mensagens).

:: **Dado** a aprovação do gestor ativada com um gatilho habilitado e preenchido, **quando** a parametrização é salva, **então** os pedidos que cruzarem o gatilho passarão a exigir a aprovação do gestor da ata (RN-07).

*Erros de validação*

:: **Dado** o nome da ata vazio ou um campo de regra ativada vazio ou inválido, **quando** o administrador aciona Salvar, **então** o salvamento é bloqueado, os campos pendentes são destacados e a mensagem de validação é exibida (ver Mensagens).

:: **Dado** o gatilho por percentual habilitado, **quando** o percentual informado está fora do intervalo de 1 a 100, **então** o salvamento é bloqueado e o campo é apontado (RN-06).

:: **Dado** a seção de imagens, **quando** o arquivo enviado não é JPG/PNG ou excede 2 MB, **então** o arquivo é recusado e o item permanece com a imagem anterior (RN-08).

:: **Dado** o campo Incluir autorizador sem pessoa selecionada, **quando** o administrador aciona a inclusão, **então** a inclusão é bloqueada e a mensagem de seleção é exibida (ver Mensagens).

*Conflitos com dados existentes*

:: **Dado** uma pessoa que já é autorizadora ativa da ata, **quando** o administrador tenta incluí-la novamente, **então** a inclusão é bloqueada e a mensagem de duplicidade é exibida (ver Mensagens).

*Restrições de acesso*

:: **Dado** um usuário sem o perfil de administrador, **quando** tenta acessar a parametrização, **então** o acesso não é permitido (ver ⚠ 7 sobre consulta por outros perfis).

*Estados especiais*

:: **Dado** um item sem imagem cadastrada, **quando** a ata é exibida, **então** o item apresenta o estado neutro "Sem imagem".

:: **Dado** uma pessoa com acesso ao contrato no Protheus mas sem cadastro ativo no Portal, **quando** a lista de autorizadores é montada, **então** a pessoa não entra na lista (RN-09).

:: **Dado** um autorizador retirado, **quando** o administrador o reinclui, **então** a pessoa volta a ser autorizadora ativa (RN-12).

**Mensagens.**

| Condição | Texto |
|---|---|
| Salvar com nome vazio ou campo de regra ativada vazio/inválido | "Preencha o nome da ata e os limites das regras ativadas com valores válidos." |
| Salvar com sucesso | "As regras desta ata foram atualizadas com sucesso." |
| Incluir pessoa que já é autorizadora ativa | "Esta pessoa já é autorizadora ativa desta ata." |
| Incluir sem selecionar pessoa | "Selecione uma pessoa (com cadastro ativo no Portal) para incluir." |

**Estados.**

:: Não parametrizada → Parametrizada: no primeiro salvamento válido.

:: Parametrizada → Parametrizada: edições posteriores atualizam os parâmetros e mantêm o estado.

:: Não há, neste pacote, transição de retorno (desfazer a parametrização) — ver ⚠ 4.

**Permissões.**

| Perfil | Nesta funcionalidade |
|---|---|
| Administrador | Abre, parametriza, edita e salva |
| Gestor da ata | Não atua (autoriza o consumo — pacote próprio) |
| Demais perfis | Sem acesso (ver ⚠ 7) |

**Comportamento de tela.**

- Aberta a partir da pesquisa (ação Parametrizar/Editar da linha); os dados do Protheus aparecem em leitura no topo.
- O campo Valor mínimo só aparece com "Exigir valor mínimo" ativo; os gatilhos só aparecem com a aprovação do gestor ativa.
- Ao bloquear o salvamento, os campos pendentes ficam destacados.
- Cancelar descarta as alterações não salvas e recarrega os valores salvos da ata.
- Voltar retorna à pesquisa de atas.

**Rastreabilidade.**

| Demanda / História | Data | O que mudou |
|---|---|---|
| Pacote 2 · História 1 — Parametrizar a ata | 02/08/2026 | Criação da funcionalidade (versão 1 da especificação) |

### 6.2 Pesquisar atas para parametrização

**Objetivo.** Permite ao administrador localizar as atas extraídas do Protheus, distinguindo as já parametrizadas das ainda não parametrizadas, e abrir a parametrização da ata escolhida.

**Campos.**

| Label | Formato | Tam. | Obrig. | Forma de input | Edição | Origem do dado |
|---|---|---|---|---|---|---|
| Nº do contrato | Alfanumérico | 20 | Não | Campo de busca | Editável | Administrador |
| Fornecedor | Alfanumérico | 120 | Não | Campo de busca | Editável | Administrador |
| Nome da ata | Alfanumérico | 120 | Não | Campo de busca | Editável | Administrador |
| Status de parametrização | Lista (Todas · Parametrizadas · Não parametrizadas) | — | Não | Filtro | Editável | Administrador |
| Lista de atas (nome, contrato, fornecedor, vigência, status) | — | — | — | Tabela | Leitura | Protheus + parametrizações do Portal |

**Regras de negócio.**

1. RN-01 — Os campos de busca preenchidos combinam-se entre si (E).
2. RN-02 — Cada opção do filtro de status exibe a contagem de atas do grupo, considerando a busca aplicada.
3. RN-03 — Ata não parametrizada não possui nome de ata: o nome nasce na parametrização.
4. RN-04 — A ação da linha reflete o status: "Parametrizar" para ata não parametrizada (abre em branco); "Editar" para ata parametrizada (abre com os valores salvos).

**Cenários.**

*Caminho feliz*

:: **Dado** atas extraídas do Protheus, **quando** o administrador informa parte do contrato e pesquisa, **então** a lista exibe as atas correspondentes, com a etiqueta de status e a contagem por grupo.

:: **Dado** uma ata na lista, **quando** o administrador aciona a ação da linha, **então** a parametrização abre com a ata daquela linha carregada, conforme RN-04.

*Erros de validação*

:: Não se aplica — os campos de busca são livres, sem validação de formato.

*Conflitos com dados existentes*

:: Não se aplica.

*Restrições de acesso*

:: **Dado** um usuário sem o perfil de administrador, **quando** tenta acessar a pesquisa de atas para parametrização, **então** o acesso não é permitido.

*Estados especiais*

:: **Dado** filtros que não retornam atas, **quando** a pesquisa é executada, **então** a lista exibe o aviso de ausência de resultados (ver Mensagens).

**Mensagens.**

| Condição | Texto |
|---|---|
| Pesquisa sem resultados | "Nenhuma ata encontrada para os filtros aplicados." |

**Estados.**

:: A pesquisa reflete o estado das atas (Parametrizada / Não parametrizada) e não altera estados.

**Permissões.**

| Perfil | Nesta funcionalidade |
|---|---|
| Administrador | Pesquisa, filtra e abre a parametrização |
| Demais perfis | Sem acesso (ver ⚠ 7) |

**Comportamento de tela.**

- Campos de busca independentes; "Limpar" zera os campos.
- Etiqueta de status por linha ("Parametrizada" / "Não parametrizada"); atas não parametrizadas indicam a ausência de nome.
- Ação por linha conforme o status (Parametrizar / Editar).
- O retorno da parametrização ("Voltar") reabre a lista (ver ⚠ 6 sobre preservação dos filtros).

**Rastreabilidade.**

| Demanda / História | Data | O que mudou |
|---|---|---|
| Pacote 2 · História 2 — Pesquisar atas | 02/08/2026 | Criação da funcionalidade (versão 1 da especificação) |

## 7. Protótipos navegáveis

O protótipo do Pacote 2 é uma composição navegável das duas telas em um único arquivo (`composicao-atas-parametrizacao-v1.html`): a pesquisa e a parametrização. Ao acionar "Parametrizar"/"Editar" em uma linha, a parametrização abre com a ata carregada; "Voltar" retorna à lista. Inclui o "Modo requisitos": as etiquetas apontam a funcionalidade e o item da especificação (RN-xx ou cenário) que cada elemento atende, e a matriz ao final correlaciona tela ↔ especificação ↔ histórias da demanda.

- Tela de pesquisa de atas — busca, filtro por status com contagem e lista com ação por linha (funcionalidade 6.2 · História 2).
- Tela de parametrização — dados do Protheus em leitura e parâmetros editáveis, incluindo autorizadores de origem Protheus e inclusão manual (funcionalidade 6.1 · História 1).

## 8. Dependências

- **Depende** do Pacote 1 (extração do Protheus) para os dados da ata e a lista inicial de autorizadores.
- **Alimenta** os pacotes de consulta/seleção pelo solicitante (nome, imagens, pedido mínimo) e de autorização por exceção (gatilhos e autorizadores).

## 9. Perguntas em aberto (⚠)

| # | Portão | Pergunta | Dono sugerido |
|---|---|---|---|
| 1 | P2 | Sincronização dos autorizadores em novas consultas ao Protheus: quem passa a ter acesso entra automaticamente? Quem perde o acesso sai — mesmo havendo retiradas/inclusões manuais já feitas? | Negócio (Suprimentos) |
| 2 | P2 | A etiqueta de origem do autorizador (Protheus/Manual) permanece visível ao administrador ou a lista será única? | Negócio |
| 3 | P2 | Aprovação do gestor ativada sem nenhum gatilho habilitado: é permitido salvar? Qual o efeito prático? | Negócio |
| 4 | P2 | Existe caminho de retorno — desfazer a parametrização ou tornar a ata indisponível ao solicitante? | Negócio |
| 5 | P2 | Qual é o valor padrão do filtro de status ao abrir a pesquisa? | Negócio |
| 6 | P2 | Ao voltar da parametrização para a pesquisa, os filtros aplicados são preservados? | Negócio |
| 7 | P3/P5 | Outros perfis (ex.: gestor da ata) podem consultar a parametrização em modo leitura? | Negócio |
