# Especificação de Negócio — Precificação de Solicitação de Compras

**Portal de Compras do Sistema Indústria** · Módulo 07 — Cotação Eletrônica · Precificação de SC

**Versão 2.0 — 06/08/2026.** Documento reestruturado a partir da Nota Técnica nº 001/2026. Substitui a versão 1.0 (10/06/2026).

## 1. Contexto e objetivo

A precificação é a etapa em que o comprador registra, sobre uma solicitação de compra, a classificação do processo de aquisição, a vigência, os valores unitários e as especificações dos itens, anexando as propostas recebidas do mercado. A partir dessas informações o processo segue para a etapa seguinte com o Despacho do Presidente, e, quando o caso exige, passa antes pela revisão do Gerente de Suprimentos.

Este documento especifica seis funcionalidades encadeadas: precificar a solicitação, consultar as solicitações encaminhadas para revisão, revisar a precificação, devolver a precificação ao comprador, visualizar o Despacho do Presidente e visualizar o resumo de uma precificação já revisada.

**Escopo deste documento:** as seis funcionalidades acima, com seus critérios de aceite, telas e protótipos.

**Fora do escopo deste documento, tratado em documento próprio:** a aprovação do processo pelo Presidente e o quadro de alçadas; a solicitação de compra e seu fluxo até a aprovação; a condução da cotação eletrônica junto ao mercado; e a formalização da contratação. Quando uma funcionalidade deste documento entrega o processo a uma dessas etapas, o documento registra apenas o ponto de entrega.

## 2. Atores

- **Comprador:** registra a precificação e encaminha o processo.
- **Gerente de Suprimentos:** consulta, revisa, envia para aprovação ou devolve a precificação ao comprador.
- **Presidente:** consulta o Despacho do Presidente (a decisão de aprovação ocorre fora deste documento).

## 3. Glossário

| Termo | Significado |
|---|---|
| SC | Solicitação de Compras. |
| Precificação | Registro dos valores, especificações e classificação do processo sobre uma solicitação de compra. |
| Complexidade | Classificação do processo de aquisição informada pelo comprador. |
| Tipo do processo | Classificação do processo de aquisição informada pelo comprador. |
| Vigência | Prazo de validade da contratação, definido pelo comprador na precificação. |
| Mapa de Precificação | Documento gerado pelo sistema com o resultado da precificação, anexado ao processo. |
| Despacho do Presidente | Documento gerado a partir do título e dos dados da precificação, que formaliza o encaminhamento do processo à decisão. |
| Revisão gerencial | Análise da precificação pelo Gerente de Suprimentos, exigida nos casos definidos pela área. |
| Resumo da precificação | Visão somente leitura de uma precificação cuja revisão já foi concluída. |

## 4. Macro fluxo

1. O comprador abre a precificação de uma solicitação de compra disponível na cotação eletrônica.
2. Informa a classificação do processo, o título, a vigência, os valores e as especificações dos itens, e anexa as propostas.
3. Encaminha o processo — que segue para a revisão do Gerente de Suprimentos quando atender ao critério de exceção da área, ou diretamente para a aprovação, fora deste documento.
4. O Gerente de Suprimentos localiza as solicitações pendentes de revisão e abre a que deseja analisar.
5. Na revisão, ajusta o título, complementa as informações sobre a negociação e registra a justificativa; então envia para aprovação — gerando o Despacho do Presidente — ou devolve a precificação ao comprador com a justificativa da devolução.
6. Concluída a revisão, a precificação permanece consultável em modo somente leitura.

## 5. Histórias de usuário e critérios de aceite

### História 1 — Precificar a solicitação de compra

**Como** comprador, **quero** registrar a precificação de uma solicitação de compra — classificação do processo, título, vigência, valores e especificações dos itens e anexos das propostas —, **para** encaminhar o processo à etapa seguinte com as informações necessárias ao Despacho do Presidente.

**Prioridade: Must.** É a origem do processo de precificação: sem ela, nenhuma das demais funcionalidades acontece.

Critérios de aceite:

1. A precificação é registrada sobre uma solicitação de compra disponível para precificação na cotação eletrônica.
2. Os dados herdados da solicitação de compra são exibidos somente para leitura e não são alterados nesta funcionalidade.
3. A complexidade é de informação obrigatória para encaminhar o processo.
4. O tipo do processo é de informação obrigatória para encaminhar o processo.
5. O título é de informação obrigatória, tem conteúdo livre e é o texto utilizado no cabeçalho do Despacho do Presidente.
6. A vigência é de informação obrigatória e é definida pelo comprador.
7. O valor unitário de cada item é de informação obrigatória para encaminhar o processo.
8. A especificação de cada item é de informação obrigatória para encaminhar o processo.
9. O total de cada item é calculado pelo sistema, multiplicando a quantidade do item pelo valor unitário informado, e não é editável.
10. As propostas recebidas dos fornecedores são anexadas ao processo pelo comprador.
11. O Mapa de Precificação é gerado pelo sistema e anexado ao processo no encaminhamento.
12. O encaminhamento é bloqueado enquanto houver informação obrigatória pendente, e os campos pendentes são indicados ao comprador.
13. No encaminhamento, o processo é direcionado à revisão do Gerente de Suprimentos quando atender ao critério de exceção definido pela área; não atendendo, segue para a aprovação, fora do escopo deste documento.
14. A precificação pode ser salva como rascunho, preservando as informações registradas sem encaminhar o processo.
15. A precificação salva como rascunho é retomada pelo próprio comprador para continuidade do registro.
16. A pré-visualização do Despacho do Presidente está disponível ao comprador durante a precificação.

### História 2 — Consultar solicitações de compra para revisão

**Como** gerente de suprimentos, **quero** pesquisar as solicitações de compra encaminhadas para revisão, filtrando pelos dados do processo, **para** localizar e priorizar as que estão pendentes de revisão e abri-las para análise.

**Prioridade: Must.** É a porta de entrada da revisão gerencial.

Critérios de aceite:

1. A consulta é acessível somente ao perfil Gerente de Suprimentos.
2. A consulta retorna as solicitações de compra encaminhadas para revisão gerencial.
3. Os filtros informados são combinados entre si, retornando apenas as solicitações que atendem a todos eles.
4. O filtro de status da análise assume, ao abrir a consulta, o valor que contempla pendentes e revisadas.
5. Os resultados são ordenados pela data de envio para revisão, das mais antigas para as mais recentes.
6. O filtro de entidade oferece as opções Todas, CNI, SESI-DN, SESI-DR, SENAI-DN e IEL.
7. O filtro de tipo de solicitação oferece as opções Normal (008), Aditivo (002), ETD (013), PROCOMPI (015), SOP e Consultoria.
8. Cada solicitação retornada indica se a análise está pendente ou já foi concluída.
9. A ação da linha abre a revisão da precificação da solicitação selecionada, quando a análise está pendente.
10. A ação de visualizar o resumo está disponível apenas para as solicitações cuja revisão já foi concluída.
11. Pesquisa sem resultados é informada ao gerente, mantendo os filtros disponíveis para novo refinamento.

### História 3 — Revisar a precificação

**Como** gerente de suprimentos, **quero** revisar a precificação encaminhada pelo comprador, conferindo os dados, ajustando o título, complementando as informações sobre a negociação e registrando a justificativa, **para** validar o processo e enviá-lo para aprovação com o Despacho do Presidente.

**Prioridade: Must.** É a validação exigida nos processos de exceção antes da aprovação.

Critérios de aceite:

1. A revisão é acessível somente ao perfil Gerente de Suprimentos.
2. A revisão ocorre sobre precificação encaminhada pelo comprador e direcionada à revisão gerencial.
3. Os dados da solicitação de compra e os valores registrados pelo comprador são exibidos ao gerente.
4. O título é ajustável pelo gerente antes do envio para aprovação.
5. A vigência é exibida somente para leitura na revisão, permanecendo como definida pelo comprador.
6. As informações sobre a negociação são complementadas ou ajustadas pelo gerente.
7. Os valores unitários e as especificações dos itens não são alterados na revisão.
8. A justificativa é de informação obrigatória para enviar o processo para aprovação.
9. O envio para aprovação é bloqueado enquanto a justificativa não estiver registrada.
10. No envio para aprovação, o Despacho do Presidente é gerado pelo sistema e anexado ao processo.
11. No envio para aprovação, o processo é entregue à etapa de aprovação, fora do escopo deste documento.
12. Após o envio para aprovação, a precificação não é mais editável pelo gerente.
13. A devolução da precificação ao comprador está disponível ao gerente durante a revisão.
14. A pré-visualização do Despacho do Presidente está disponível ao gerente durante a revisão.

### História 4 — Devolver a precificação ao comprador

**Como** gerente de suprimentos, **quero** devolver a precificação ao comprador de origem informando a justificativa da devolução, **para** que os ajustes necessários sejam realizados antes do envio para aprovação.

**Prioridade: Must.** Sem a devolução, a precificação inadequada só teria como caminho o envio para aprovação.

Critérios de aceite:

1. A devolução é realizada somente pelo Gerente de Suprimentos, a partir da revisão da precificação.
2. A justificativa da devolução é de informação obrigatória.
3. A devolução é bloqueada enquanto a justificativa não estiver registrada.
4. A precificação devolvida retorna ao comprador que a encaminhou.
5. A precificação devolvida deixa de constar como pendente de revisão para o gerente.
6. A devolução não altera os valores, as especificações e os anexos registrados pelo comprador.

### História 5 — Visualizar o Despacho do Presidente

**Como** comprador, gerente de suprimentos ou presidente, **quero** visualizar o Despacho do Presidente gerado a partir da precificação, com as opções de baixar em PDF e imprimir, **para** conferir a formalização da decisão sobre o processo de compra.

**Prioridade: Must.** É o documento que formaliza o encaminhamento do processo.

Critérios de aceite:

1. A visualização do Despacho do Presidente é disponível aos perfis Comprador, Gerente de Suprimentos e Presidente.
2. O Despacho é apresentado somente para leitura, sem edição de conteúdo.
3. O conteúdo do Despacho é composto pelo título e pelos dados da precificação.
4. A pré-visualização é acionável a partir da precificação e a partir da revisão.
5. O Despacho pode ser baixado em PDF.
6. O Despacho pode ser enviado para impressão.
7. O Despacho anexado ao processo é o gerado no envio para aprovação.

### História 6 — Visualizar o resumo da precificação

**Como** gerente de suprimentos, **quero** visualizar o resumo da precificação de uma solicitação já revisada, em modo somente leitura, **para** consultar o resultado de uma revisão concluída sem alterar o registro.

**Prioridade: Should.** É consulta posterior ao processo: sua ausência não impede o fluxo, mas compromete a conferência do que foi decidido.

Critérios de aceite:

1. O resumo é acessível somente ao perfil Gerente de Suprimentos.
2. O resumo está disponível apenas para solicitações cuja revisão já foi concluída e registrada.
3. Todas as informações do resumo são exibidas somente para leitura.
4. As ações de enviar para aprovação e de devolver ao comprador não estão disponíveis no resumo.
5. O Despacho do Presidente pode ser visualizado e baixado em PDF a partir do resumo.
6. Os anexos da cotação e da precificação podem ser baixados a partir do resumo.

## 6. Telas e protótipos

Os protótipos navegáveis são entregues em arquivo próprio. Esta seção reúne, para cada tela, a configuração dos campos, as mensagens apresentadas ao usuário e o comportamento de tela.

### 6.1 Precificação da solicitação de compra (História 1)

Campos:

| Campo (label) | Formato | Tamanho | Obrigatório | Forma de input | Edição |
|---|---|---|---|---|---|
| Nº da SC | Alfanumérico | a definir | — | Texto | Somente leitura |
| UO | Alfanumérico | a definir | — | Texto | Somente leitura |
| CR | Alfanumérico | a definir | — | Texto | Somente leitura |
| Filial | Alfanumérico | a definir | — | Texto | Somente leitura |
| DT Emissão | Data | — | — | Texto | Somente leitura |
| Solicitante | Alfanumérico | a definir | — | Texto | Somente leitura |
| Tipo SC | Alfanumérico | — | — | Texto | Somente leitura |
| Just. Compra | Texto | a definir | — | Área de texto | Somente leitura |
| Complexidade | Lista de opções | — | Sim | Combobox | Editável |
| Tipo do processo | Lista de opções | — | Sim | Combobox | Editável |
| Título | Alfanumérico | a definir | Sim | Campo texto | Editável |
| Vigência | Alfanumérico | 50 | Sim | Campo texto | Editável |
| Item — descrição | Alfanumérico | — | — | Texto | Somente leitura |
| Item — quantidade | Numérico | — | — | Texto | Somente leitura |
| Item — valor unitário | Decimal (2) | — | Sim | Campo numérico | Editável |
| Item — especificação | Texto | a definir | Sim | Área de texto | Editável |
| Item — total | Decimal (2) | — | — | Calculado pelo sistema | Somente leitura |
| Propostas (anexos) | Arquivo | a definir | a definir | Upload | Editável |
| Mapa de Precificação | Arquivo | — | — | Gerado pelo sistema | Somente leitura |

Mensagens:

| Condição | Texto |
|---|---|
| Encaminhar com informação obrigatória pendente | "Preencha as informações obrigatórias da precificação para encaminhar o processo." |
| Encaminhar com item sem valor unitário ou sem especificação | "Informe o valor unitário e a especificação de todos os itens da solicitação." |
| Encaminhamento concluído | "Precificação encaminhada com sucesso." |
| Rascunho salvo | "Rascunho da precificação salvo." |

Comportamento de tela:

- Acesso pelo item de menu Cotação Eletrônica → Precificação de SC; a precificação de um registro é aberta pela ação "$" da linha.
- Os dados herdados da solicitação de compra são apresentados em bloco no topo da tela, somente leitura.
- Os itens são apresentados em tabela; o total do item é recalculado ao informar o valor unitário.
- Ações disponíveis: Salvar rascunho, Encaminhar e Visualizar Despacho.
- Ao tentar encaminhar com pendências, os campos pendentes são destacados.
- Cancelar e Voltar retornam à listagem da cotação eletrônica sem gravar as alterações não salvas.
- Estados previstos: carregando, erro no carregamento e sucesso após o encaminhamento.

### 6.2 Consulta de solicitações para revisão (História 2)

Campos:

| Campo (label) | Formato | Tamanho | Obrigatório | Forma de input | Edição |
|---|---|---|---|---|---|
| Entidade | Lista de opções | — | Não | Combobox | Editável |
| Nº da SC | Alfanumérico | a definir | Não | Campo de busca | Editável |
| Nº do processo | Alfanumérico | a definir | Não | Campo de busca | Editável |
| Ano do processo | Numérico | 4 | Não | Campo de busca | Editável |
| Tipo de SC | Lista de opções | — | Não | Combobox | Editável |
| Produto | Alfanumérico | a definir | Não | Campo de busca | Editável |
| Palavras-chave | Alfanumérico | a definir | Não | Campo de busca | Editável |
| Status da análise | Lista de opções | — | Não | Combobox | Editável |
| Resultado — SC, processo, entidade, produto, data de envio, status da análise | — | — | — | Tabela | Somente leitura |

Mensagens:

| Condição | Texto |
|---|---|
| Pesquisa sem resultados | "Nenhuma solicitação encontrada para os filtros aplicados." |
| Filtros redefinidos | "Filtros limpos." |

Comportamento de tela:

- Acesso exclusivo do perfil Gerente de Suprimentos, pelo menu da precificação de SC.
- Filtros dispostos acima da listagem; Pesquisar aplica os filtros e atualiza o resultado, Limpar redefine os campos.
- Resultado em tabela ordenada pela data de envio para revisão, das mais antigas para as mais recentes.
- Ação por linha conforme a situação da análise: abrir para revisão (pendente) ou visualizar o resumo (concluída).
- Estados previstos: carregando, resultado vazio e erro na pesquisa.

### 6.3 Revisão da precificação (História 3)

Campos:

| Campo (label) | Formato | Tamanho | Obrigatório | Forma de input | Edição |
|---|---|---|---|---|---|
| Dados da SC (Nº, UO, CR, Filial, DT Emissão, Solicitante, Tipo SC, Just. Compra) | — | — | — | Texto | Somente leitura |
| Complexidade | Lista de opções | — | — | Texto | Somente leitura |
| Tipo do processo | Lista de opções | — | — | Texto | Somente leitura |
| Título | Alfanumérico | a definir | Sim | Campo texto | Editável |
| Vigência | Alfanumérico | 50 | — | Texto | Somente leitura |
| Itens (descrição, quantidade, valor unitário, especificação, total) | — | — | — | Tabela | Somente leitura |
| Informações sobre a negociação | Texto | a definir | Não | Área de texto | Editável |
| Justificativa | Texto | a definir | Sim | Área de texto | Editável |
| Anexos da cotação e da precificação | Arquivo | — | — | Lista com download | Somente leitura |

Mensagens:

| Condição | Texto |
|---|---|
| Enviar para aprovação sem justificativa registrada | "Registre a justificativa para enviar o processo para aprovação." |
| Envio para aprovação concluído | "Processo enviado para aprovação. O Despacho do Presidente foi anexado." |

Comportamento de tela:

- Aberta a partir da consulta de solicitações para revisão (6.2), com a solicitação da linha carregada.
- Título e informações sobre a negociação editáveis; demais informações da precificação em leitura.
- Ações disponíveis: Enviar para aprovação, Devolver ao comprador e Visualizar Despacho.
- Devolver ao comprador abre a confirmação da devolução (6.4).
- Voltar retorna à consulta de solicitações para revisão.
- Estados previstos: carregando, erro no carregamento e sucesso após o envio.

### 6.4 Devolução ao comprador (História 4)

Campos:

| Campo (label) | Formato | Tamanho | Obrigatório | Forma de input | Edição |
|---|---|---|---|---|---|
| Justificativa da devolução | Texto | a definir | Sim | Área de texto | Editável |

Mensagens:

| Condição | Texto |
|---|---|
| Devolver sem justificativa registrada | "Informe a justificativa da devolução." |
| Devolução concluída | "Precificação devolvida ao comprador." |

Comportamento de tela:

- Apresentada como modal sobre a revisão da precificação (6.3).
- Ações disponíveis: Devolver e Cancelar; Cancelar fecha o modal e mantém a revisão em andamento.
- Estados previstos: pendente de preenchimento, erro no envio e sucesso após a devolução.

### 6.5 Despacho do Presidente (História 5)

Campos:

| Campo (label) | Formato | Tamanho | Obrigatório | Forma de input | Edição |
|---|---|---|---|---|---|
| Documento do Despacho do Presidente | Documento | — | — | Pré-visualização | Somente leitura |

Mensagens:

| Condição | Texto |
|---|---|
| Falha ao gerar a pré-visualização | "Não foi possível exibir o Despacho do Presidente. Tente novamente." |

Comportamento de tela:

- Apresentada como modal de pré-visualização, acionada na precificação (6.1) e na revisão (6.3).
- Ações disponíveis: Baixar em PDF, Imprimir e Fechar.
- Estados previstos: carregando o documento, documento exibido e erro na geração.

### 6.6 Resumo da precificação (História 6)

Campos:

| Campo (label) | Formato | Tamanho | Obrigatório | Forma de input | Edição |
|---|---|---|---|---|---|
| Dados da SC, classificação, título, vigência, itens e totais | — | — | — | Texto e tabela | Somente leitura |
| Informações sobre a negociação | Texto | — | — | Texto | Somente leitura |
| Justificativa da revisão | Texto | — | — | Texto | Somente leitura |
| Anexos da cotação e da precificação | Arquivo | — | — | Lista com download | Somente leitura |

Mensagens:

| Condição | Texto |
|---|---|
| Falha ao baixar anexo | "Não foi possível baixar o arquivo. Tente novamente." |

Comportamento de tela:

- Aberta pela ação de visualizar da consulta de solicitações para revisão (6.2), apenas para solicitações com revisão concluída.
- Nenhum campo editável; as ações de enviar para aprovação e devolver não são apresentadas.
- Ações disponíveis: Visualizar Despacho, Baixar o Despacho em PDF, baixar anexos e Fechar.
- Fechar retorna à consulta de solicitações para revisão.
- Estados previstos: carregando e erro no carregamento.

## 7. Suposições

As suposições abaixo foram assumidas para permitir a especificação e o protótipo; devem ser confirmadas pela área.

1. O valor unitário e a especificação são obrigatórios em todos os itens para encaminhar o processo (critérios 7 e 8 da História 1).
2. Os valores unitários e as especificações dos itens não são alterados na revisão, cabendo ao gerente ajustar o título e as informações sobre a negociação (critério 7 da História 3).
3. O resumo da precificação é acessado pela consulta de solicitações para revisão, e não pela tela de precificação do comprador.
4. Os textos das mensagens desta especificação são propostas de redação.
5. A priorização MoSCoW indicada em cada história é proposta para validação.

## 8. Perguntas em aberto

1. Qual é o critério objetivo que, no encaminhamento, direciona o processo à revisão do Gerente de Suprimentos — valor, complexidade, tipo do processo ou combinação desses fatores?
2. Quando a revisão gerencial não é exigida, o Despacho do Presidente é gerado no próprio encaminhamento pelo comprador?
3. Como a precificação devolvida passa a constar para o comprador e para o gerente, e a justificativa da devolução fica visível ao comprador?
4. Há limite de devoluções e reencaminhamentos do mesmo processo?
5. A vigência é texto livre de até 50 caracteres ou um período com datas de início e fim?
6. O anexo de propostas é obrigatório para encaminhar? Qual a quantidade mínima, os formatos aceitos e o tamanho máximo por arquivo?
7. Quais são as opções das listas Complexidade e Tipo do processo?
8. Quais são os tamanhos máximos dos campos Título, Especificação do item, Informações sobre a negociação e Justificativa?
9. Que informações compõem o Mapa de Precificação e o Despacho do Presidente?
10. Quais situações compõem o filtro Status da análise, considerando as precificações devolvidas?

## 9. Recomendações para a próxima iteração

1. Responder às perguntas 1 e 2, que definem o roteamento do processo e condicionam os critérios 13 da História 1 e 2 da História 3.
2. Definir as opções de Complexidade e Tipo do processo (pergunta 7), necessárias para o protótipo da tela de precificação.
3. Confirmar as suposições 1 e 2, que determinam o bloqueio do encaminhamento e o que o gerente pode alterar na revisão.

## 10. Histórico de versões

| Versão | Data | Descrição |
|---|---|---|
| 2.0 | 06/08/2026 | Documento reestruturado a partir da Nota Técnica nº 001/2026: histórias renumeradas na ordem do processo, com identificação sequencial; critérios de aceite objetivos, atômicos e numerados dentro de cada história; configuração de campos, mensagens e comportamento de tela reunidos junto às telas; escopo e fronteiras explicitados; suposições e perguntas em aberto registradas. |
| 1.0 | 10/06/2026 | Elaboração da documentação. Cards PDTIC25114-468 a 493 · Sprint SP23. |

Correspondência com a versão 1.0:

| Versão 1.0 | Versão 2.0 |
|---|---|
| HIST_001 — Precificar a Solicitação de Compra | História 1 — Precificar a solicitação de compra |
| HIST_001 / HIST_003 — Consultar SCs para Revisão | História 2 — Consultar solicitações de compra para revisão |
| HIST_002 — Revisar a Precificação e o Despacho | História 3 — Revisar a precificação |
| HIST_003 / HIST_004 — Devolver a Precificação ao Comprador | História 4 — Devolver a precificação ao comprador |
| HIST_004 / HIST_005 — Visualizar o Despacho do Presidente | História 5 — Visualizar o Despacho do Presidente |
| HIST_06 / HIST_006 — Visualizar o Resumo da Precificação | História 6 — Visualizar o resumo da precificação |
