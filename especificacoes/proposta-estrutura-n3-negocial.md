# Proposta — Especificação de Negócio no formato N3 negocial

**Objeto:** estrutura de documento para a especificação de funcionalidades do Portal de Compras, aproximada do N3 negocial do framework. Aplicada, como demonstração, a duas funcionalidades da Precificação de Solicitação de Compras (Módulo 07).

**Versão da proposta:** 1.0 — 06/08/2026.

## 1. Anatomia proposta

O documento tem uma **abertura comum** (contexto, escopo, atores, glossário, macro fluxo) e, em seguida, **uma seção por funcionalidade**, cada uma com a mesma anatomia:

| # | Seção da funcionalidade | O que entra | O que não entra |
|---|---|---|---|
| 1 | **Identificação e descrição** | Nome da funcionalidade, prioridade e uma ou duas frases de negócio dizendo quem faz o quê e o que a funcionalidade entrega | Nada de intenção vaga ("melhorar", "facilitar") |
| 2 | **Superfície** | Onde a funcionalidade vive: tela própria (com o caminho de menu) ou ação dentro de outra tela | Descrição de layout |
| 3 | **Permissões** | Perfil × o que ele faz nesta funcionalidade, incluindo os perfis que não atuam | Perfis genéricos ("usuário") |
| 4 | **Regras de negócio** | Invariantes atômicas, numeradas dentro da funcionalidade (RN-1, RN-2…): uma exigência por regra | A reação do sistema ("bloqueia", "exibe mensagem") e o texto da mensagem |
| 5 | **Cenários** | Dado/Quando/Então, um bloco por cenário, organizados em cinco grupos: caminho feliz, erros de validação, conflitos com dados existentes, restrições de acesso e estados especiais. É aqui que a reação do sistema aparece | Texto literal das mensagens (referenciado, não copiado) |
| 6 | **Campos** | Tabela: label, tipo, obrigatoriedade, forma de input, edição e validação | Definições físicas de banco |
| 7 | **Campos automáticos** | Tabela: campo, valor e quando é preenchido pelo sistema | — |
| 8 | **Mensagens** | Tabela condição → texto exibido, com críticas e sucesso | Mensagens dentro dos cenários ou das regras |
| 9 | **Comportamento e estados da tela** | Navegação, ações padrão (Cancelar, Voltar, Limpar, Fechar) e os estados: carregando, vazio, erro, sucesso e limites | Regra de negócio disfarçada de comportamento |
| 10 | **Protótipo** | Qual tela do protótipo navegável atende a funcionalidade e o que ela cobre | — |

Ao final do documento: **suposições** (⚠ assumidas para viabilizar a especificação), **perguntas em aberto** e **histórico de versões**.

**O documento é orientado à funcionalidade — a história de usuário não entra nele.** A história é o que origina a criação ou a evolução de uma funcionalidade: ela vive no backlog, dá o lastro à demanda e é citada apenas como **origem da versão** no histórico do documento. Quem descreve o que a funcionalidade é, aqui, é a sua descrição; quem prova o comportamento são as regras e os cenários.

## 2. O que muda em relação ao formato atual

| Ponto | Formato atual (histórias + critérios) | Nesta proposta (N3 negocial) |
|---|---|---|
| Verificação do comportamento | Critérios de aceite acumulavam invariante, reação e mensagem | **Regras de negócio** guardam a invariante; **cenários** guardam a reação verificável |
| Dado/Quando/Então | Aparecia dentro dos critérios de aceite, onde não cabe | Fica nos **cenários**, que é o lugar dele |
| Critérios de aceite | Eram o único recipiente de tudo | Deixam de existir como seção: quem prova a entrega é o conjunto regras + cenários |
| História de usuário | Organizava o documento — o documento era uma lista de histórias | Sai do documento: permanece no backlog como origem da criação ou da evolução, citada no histórico de versões. O documento passa a ser organizado por funcionalidade |
| Cobertura de exceções | Dependia da diligência de quem escrevia | Os **cinco grupos de cenários** tornam a ausência visível: um grupo vazio é declarado |

**Decisão implicada:** esta estrutura substitui a regra 5 do prompt (que proíbe seções de regras de negócio fora das histórias e critérios). Se a preferência for manter a regra 5, os itens de "Regras de negócio" voltam a ser critérios de aceite e a seção desaparece — o resto da anatomia permanece igual.

---

# Demonstração — Precificação de Solicitação de Compras (Módulo 07)

## Contexto e objetivo

A precificação é a etapa em que o comprador registra, sobre uma solicitação de compra, a classificação do processo de aquisição, a vigência, os valores unitários e as especificações dos itens, anexando as propostas recebidas do mercado. A partir dessas informações o processo segue para a etapa seguinte com o Despacho do Presidente e, quando o caso exige, passa antes pela revisão do Gerente de Suprimentos.

**Escopo:** precificar a solicitação, consultar as solicitações encaminhadas para revisão, revisar a precificação, devolver a precificação ao comprador, visualizar o Despacho do Presidente e visualizar o resumo de uma precificação revisada. Nesta proposta estão desenvolvidas as duas primeiras.

**Fora do escopo, tratado em documento próprio:** a aprovação do processo pelo Presidente e o quadro de alçadas; a solicitação de compra e seu fluxo até a aprovação; a condução da cotação eletrônica junto ao mercado; a formalização da contratação.

## Atores

- **Comprador:** registra a precificação e encaminha o processo.
- **Gerente de Suprimentos:** consulta, revisa, envia para aprovação ou devolve a precificação.
- **Presidente:** consulta o Despacho do Presidente; a decisão de aprovação ocorre fora deste documento.

## Glossário

| Termo | Significado |
|---|---|
| SC | Solicitação de Compras. |
| Precificação | Registro dos valores, especificações e classificação do processo sobre uma solicitação de compra. |
| Vigência | Prazo de validade da contratação, definido pelo comprador na precificação. |
| Mapa de Precificação | Documento gerado pelo sistema com o resultado da precificação, anexado ao processo. |
| Despacho do Presidente | Documento gerado a partir do título e dos dados da precificação, que formaliza o encaminhamento do processo à decisão. |
| Revisão gerencial | Análise da precificação pelo Gerente de Suprimentos, exigida nos casos definidos pela área. |

## Macro fluxo

1. O comprador abre a precificação de uma solicitação disponível na cotação eletrônica e registra classificação, título, vigência, valores, especificações e anexos.
2. Encaminha o processo, que segue para a revisão gerencial quando atende ao critério de exceção da área, ou direto para a aprovação, fora deste documento.
3. O Gerente de Suprimentos localiza as solicitações pendentes de revisão e abre a que deseja analisar.
4. Na revisão, ajusta o título, complementa as informações sobre a negociação e registra a justificativa; envia para aprovação, gerando o Despacho, ou devolve ao comprador com justificativa.
5. Concluída a revisão, a precificação permanece consultável em modo somente leitura.

---

## Funcionalidade 1 — Precificar a solicitação de compra

### Identificação e descrição

| | |
|---|---|
| Funcionalidade | Precificar a solicitação de compra |
| Conjunto | Precificação de SC — Módulo 07 (Cotação Eletrônica) |
| Prioridade | Must — é a origem do processo; sem ela nenhuma das demais funcionalidades acontece |

Permite ao comprador registrar a precificação de uma solicitação de compra — classificação do processo, título, vigência, valores unitários e especificações dos itens e anexos das propostas — e encaminhar o processo à etapa seguinte com as informações necessárias ao Despacho do Presidente.

### Superfície

Tela própria — menu Cotação Eletrônica → Precificação de SC; a precificação de um registro é aberta pela ação "$" da linha.

### Permissões

| Perfil | Nesta funcionalidade |
|---|---|
| Comprador | Registra a classificação, os valores e as especificações dos itens, anexa as propostas, salva rascunho e encaminha o processo |
| Gerente de Suprimentos | Não atua nesta funcionalidade (atua na revisão — Funcionalidade 3) |
| Presidente | Não atua nesta funcionalidade |

### Regras de negócio

| # | Regra |
|---|---|
| RN-1 | A precificação é registrada sobre solicitação de compra disponível para precificação na cotação eletrônica. |
| RN-2 | Os dados herdados da solicitação de compra não são alterados na precificação. |
| RN-3 | A complexidade é obrigatória para encaminhar o processo. |
| RN-4 | O tipo do processo é obrigatório para encaminhar o processo. |
| RN-5 | O título é obrigatório e tem conteúdo livre. |
| RN-6 | O título é o texto utilizado no cabeçalho do Despacho do Presidente. |
| RN-7 | A vigência é obrigatória e é definida pelo comprador. |
| RN-8 | O valor unitário é obrigatório em todos os itens para encaminhar o processo. (⚠ suposição 1) |
| RN-9 | A especificação é obrigatória em todos os itens para encaminhar o processo. (⚠ suposição 1) |
| RN-10 | O total do item é igual à quantidade do item multiplicada pelo valor unitário. |
| RN-11 | O Mapa de Precificação é gerado pelo sistema no encaminhamento do processo. |
| RN-12 | O processo é direcionado à revisão do Gerente de Suprimentos quando atende ao critério de exceção definido pela área. (⚠ pergunta 1) |
| RN-13 | A precificação salva como rascunho não encaminha o processo. |

### Cenários

**Caminho feliz**

Cenário: encaminhamento da precificação completa
- **Dado** uma solicitação de compra disponível para precificação
- **E** a complexidade, o tipo do processo, o título e a vigência informados
- **E** todos os itens com valor unitário e especificação informados
- **Quando** o comprador aciona Encaminhar
- **Então** o Mapa de Precificação é gerado e anexado ao processo
- **E** o processo é direcionado conforme a avaliação da revisão gerencial (RN-12)
- **E** a mensagem de encaminhamento concluído é apresentada

Cenário: salvamento da precificação como rascunho
- **Dado** uma precificação em andamento
- **Quando** o comprador aciona Salvar rascunho
- **Então** as informações registradas são preservadas sem encaminhar o processo
- **E** a mensagem de rascunho salvo é apresentada

**Erros de validação**

Cenário: encaminhamento com classificação do processo pendente
- **Dado** uma precificação sem a complexidade ou sem o tipo do processo
- **Quando** o comprador aciona Encaminhar
- **Então** o encaminhamento é bloqueado
- **E** os campos pendentes são destacados
- **E** a mensagem de informações obrigatórias pendentes é apresentada

Cenário: encaminhamento sem título ou sem vigência
- **Dado** uma precificação sem o título ou sem a vigência informados
- **Quando** o comprador aciona Encaminhar
- **Então** o encaminhamento é bloqueado
- **E** a mensagem de informações obrigatórias pendentes é apresentada

Cenário: encaminhamento com item sem valor unitário ou sem especificação
- **Dado** uma precificação com ao menos um item sem valor unitário ou sem especificação
- **Quando** o comprador aciona Encaminhar
- **Então** o encaminhamento é bloqueado
- **E** os itens pendentes são indicados
- **E** a mensagem de itens pendentes é apresentada

**Conflitos com dados existentes**

Nenhum cenário registrado nesta versão: o comportamento da precificação já encaminhada — e o da precificação devolvida — depende das respostas às perguntas 2 e 3.

**Restrições de acesso**

Cenário: acesso por perfil sem permissão
- **Dado** um usuário sem o perfil Comprador
- **Quando** tenta abrir a precificação de uma solicitação de compra
- **Então** o acesso não é permitido

**Estados especiais**

Cenário: retomada de precificação salva como rascunho
- **Dado** uma precificação salva como rascunho
- **Quando** o comprador a abre novamente
- **Então** as informações salvas são apresentadas para continuidade do registro

Cenário: pré-visualização do Despacho antes do encaminhamento
- **Dado** uma precificação em andamento com o título informado
- **Quando** o comprador aciona Visualizar Despacho
- **Então** a pré-visualização do Despacho do Presidente é apresentada (Funcionalidade 5)

### Campos

| Campo (label) | Tipo | Obrigatório | Forma de input | Edição | Validação |
|---|---|---|---|---|---|
| Nº da SC | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| UO | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| CR | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| Filial | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| DT Emissão | Data | — | Texto | Somente leitura | Herdado da solicitação de compra |
| Solicitante | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| Tipo SC | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| Just. Compra | Texto | — | Área de texto | Somente leitura | Herdado da solicitação de compra |
| Complexidade | Lista de opções | Sim | Combobox | Editável | Opções a definir (⚠ pergunta 6) |
| Tipo do processo | Lista de opções | Sim | Combobox | Editável | Opções a definir (⚠ pergunta 6) |
| Título | Alfanumérico | Sim | Campo texto | Editável | Conteúdo livre; tamanho a definir (⚠ pergunta 7) |
| Vigência | Alfanumérico | Sim | Campo texto | Editável | Até 50 caracteres (⚠ pergunta 4) |
| Item — descrição | Alfanumérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| Item — quantidade | Numérico | — | Texto | Somente leitura | Herdado da solicitação de compra |
| Item — valor unitário | Decimal (2) | Sim | Campo numérico | Editável | Maior que zero |
| Item — especificação | Texto | Sim | Área de texto | Editável | Tamanho a definir (⚠ pergunta 7) |
| Propostas (anexos) | Arquivo | a definir | Upload | Editável | Formatos e tamanho a definir (⚠ pergunta 5) |

### Campos automáticos

| Campo | Valor | Quando |
|---|---|---|
| Item — total | Quantidade do item × valor unitário informado | A cada informação ou alteração do valor unitário |
| Mapa de Precificação | Documento com o resultado da precificação | No encaminhamento do processo |

### Mensagens

| Condição | Texto |
|---|---|
| Encaminhar com informação obrigatória pendente | "Preencha as informações obrigatórias da precificação para encaminhar o processo." |
| Encaminhar com item sem valor unitário ou sem especificação | "Informe o valor unitário e a especificação de todos os itens da solicitação." |
| Encaminhamento concluído | "Precificação encaminhada com sucesso." |
| Rascunho salvo | "Rascunho da precificação salvo." |

### Comportamento e estados da tela

- Os dados herdados da solicitação de compra são apresentados em bloco no topo da tela, somente leitura; a classificação e o título vêm em seguida; os itens em tabela.
- Ações da tela: Salvar rascunho, Encaminhar e Visualizar Despacho.
- Cancelar e Voltar retornam à listagem da cotação eletrônica, descartando as alterações não salvas.
- Estado carregando: enquanto os dados da solicitação são obtidos.
- Estado de erro no carregamento: a solicitação não pôde ser aberta, com opção de tentar novamente.
- Estado de pendência: ao tentar encaminhar com informações obrigatórias faltando, os campos e os itens pendentes ficam destacados.
- Estado de sucesso: após o encaminhamento, a tela informa a conclusão e o processo deixa de estar disponível para edição pelo comprador (⚠ pergunta 2).
- Limites: solicitações com muitos itens mantêm a tabela navegável, sem perda do bloco de ações.

### Protótipo

Tela "Precificação da solicitação de compra" do protótipo navegável, cobrindo o bloco de dados herdados, a classificação, os itens com cálculo do total, os anexos e as ações da tela.

---

## Funcionalidade 2 — Consultar solicitações de compra para revisão

### Identificação e descrição

| | |
|---|---|
| Funcionalidade | Consultar solicitações de compra para revisão |
| Conjunto | Precificação de SC — Módulo 07 (Cotação Eletrônica) |
| Prioridade | Must — é a porta de entrada da revisão gerencial |

Permite ao Gerente de Suprimentos localizar as solicitações de compra encaminhadas para revisão, distinguindo as pendentes das já revisadas, e abrir a que deseja analisar para priorizar o trabalho de revisão.

### Superfície

Tela própria — menu Cotação Eletrônica → Precificação de SC, na visão do Gerente de Suprimentos.

### Permissões

| Perfil | Nesta funcionalidade |
|---|---|
| Gerente de Suprimentos | Pesquisa, filtra, abre a solicitação para revisão e acessa o resumo das já revisadas |
| Comprador | Não atua nesta funcionalidade |
| Presidente | Não atua nesta funcionalidade |

### Regras de negócio

| # | Regra |
|---|---|
| RN-1 | A consulta é de acesso exclusivo do perfil Gerente de Suprimentos. |
| RN-2 | A consulta retorna as solicitações de compra encaminhadas para revisão gerencial. |
| RN-3 | Os filtros informados são combinados entre si, retornando apenas as solicitações que atendem a todos eles. |
| RN-4 | O filtro de status da análise assume, na abertura da consulta, o valor que contempla pendentes e revisadas. |
| RN-5 | Os resultados são ordenados pela data de envio para revisão, das mais antigas para as mais recentes. |
| RN-6 | O filtro de entidade oferece as opções Todas, CNI, SESI-DN, SESI-DR, SENAI-DN e IEL. |
| RN-7 | O filtro de tipo de solicitação oferece as opções Normal (008), Aditivo (002), ETD (013), PROCOMPI (015), SOP e Consultoria. |
| RN-8 | A abertura para revisão é disponível apenas para solicitações com análise pendente. |
| RN-9 | A visualização do resumo é disponível apenas para solicitações com revisão concluída. |

### Cenários

**Caminho feliz**

Cenário: pesquisa com filtros combinados
- **Dado** solicitações de compra encaminhadas para revisão
- **Quando** o gerente informa a entidade e o tipo de solicitação e aciona Pesquisar
- **Então** são listadas apenas as solicitações que atendem aos dois filtros
- **E** os resultados são ordenados da data de envio mais antiga para a mais recente

Cenário: abertura de solicitação para revisão
- **Dado** uma solicitação com análise pendente no resultado da pesquisa
- **Quando** o gerente aciona a abertura para revisão
- **Então** a revisão da precificação daquela solicitação é apresentada (Funcionalidade 3)

**Erros de validação**

Nenhum cenário: os filtros são de preenchimento livre e opcional, sem validação de formato.

**Conflitos com dados existentes**

Nenhum cenário identificado para esta funcionalidade, que é de consulta e não altera registros.

**Restrições de acesso**

Cenário: acesso por perfil sem permissão
- **Dado** um usuário sem o perfil Gerente de Suprimentos
- **Quando** tenta acessar a consulta de solicitações para revisão
- **Então** o acesso não é permitido

Cenário: tentativa de abrir para revisão uma solicitação já revisada
- **Dado** uma solicitação com revisão concluída no resultado da pesquisa
- **Quando** o gerente aciona a ação da linha
- **Então** é apresentado o resumo da precificação, somente leitura (Funcionalidade 6)

**Estados especiais**

Cenário: pesquisa sem resultados
- **Dado** filtros que não correspondem a nenhuma solicitação encaminhada para revisão
- **Quando** o gerente aciona Pesquisar
- **Então** o resultado é apresentado vazio
- **E** a mensagem de ausência de resultados é apresentada
- **E** os filtros permanecem disponíveis para novo refinamento

### Campos

| Campo (label) | Tipo | Obrigatório | Forma de input | Edição | Validação |
|---|---|---|---|---|---|
| Entidade | Lista de opções | Não | Combobox | Editável | Todas, CNI, SESI-DN, SESI-DR, SENAI-DN, IEL |
| Nº da SC | Alfanumérico | Não | Campo de busca | Editável | Tamanho a definir (⚠ pergunta 7) |
| Nº do processo | Alfanumérico | Não | Campo de busca | Editável | Tamanho a definir (⚠ pergunta 7) |
| Ano do processo | Numérico | Não | Campo de busca | Editável | Quatro dígitos |
| Tipo de SC | Lista de opções | Não | Combobox | Editável | Normal (008), Aditivo (002), ETD (013), PROCOMPI (015), SOP, Consultoria |
| Produto | Alfanumérico | Não | Campo de busca | Editável | Tamanho a definir (⚠ pergunta 7) |
| Palavras-chave | Alfanumérico | Não | Campo de busca | Editável | Tamanho a definir (⚠ pergunta 7) |
| Status da análise | Lista de opções | Não | Combobox | Editável | Opções a definir (⚠ pergunta 8) |

Colunas do resultado: Nº da SC, Nº e ano do processo, entidade, produto, data de envio para revisão e status da análise.

### Campos automáticos

| Campo | Valor | Quando |
|---|---|---|
| Status da análise (filtro) | Valor que contempla pendentes e revisadas | Na abertura da consulta |

### Mensagens

| Condição | Texto |
|---|---|
| Pesquisa sem resultados | "Nenhuma solicitação encontrada para os filtros aplicados." |
| Filtros redefinidos | "Filtros limpos." |

### Comportamento e estados da tela

- Filtros dispostos acima da listagem; Pesquisar aplica os filtros e atualiza o resultado, Limpar redefine os campos.
- Ação por linha conforme a situação da análise: abrir para revisão (pendente) ou visualizar o resumo (concluída).
- Estado carregando: durante a pesquisa.
- Estado vazio: pesquisa sem resultados, com a mensagem correspondente e os filtros preservados.
- Estado de erro: falha na pesquisa, com opção de tentar novamente.
- Limites: resultados extensos são paginados, mantendo a ordenação por data de envio.

### Protótipo

Tela "Consulta de solicitações para revisão" do protótipo navegável, cobrindo o bloco de filtros, a listagem ordenada com a situação da análise e a ação por linha.

---

## Demais funcionalidades

Seguem a mesma anatomia e serão desenvolvidas na aprovação desta proposta:

| # | Funcionalidade | Prioridade | Observação |
|---|---|---|---|
| 3 | Revisar a precificação | Must | Ajuste do título, informações sobre a negociação, justificativa obrigatória, envio para aprovação com geração do Despacho |
| 4 | Devolver a precificação ao comprador | Must | Justificativa obrigatória; modal sobre a revisão |
| 5 | Visualizar o Despacho do Presidente | Must | Pré-visualização, download em PDF e impressão; acionável na precificação e na revisão |
| 6 | Visualizar o resumo da precificação | Should | Somente leitura, para solicitações com revisão concluída |

## Suposições

1. O valor unitário e a especificação são obrigatórios em todos os itens para encaminhar o processo (RN-8 e RN-9 da Funcionalidade 1).
2. Os valores unitários e as especificações dos itens não são alterados na revisão, cabendo ao gerente ajustar o título e as informações sobre a negociação.
3. O resumo da precificação é acessado pela consulta de solicitações para revisão, e não pela tela de precificação do comprador.
4. Os textos das mensagens são propostas de redação.
5. As prioridades MoSCoW indicadas são propostas para validação.

## Perguntas em aberto

1. Qual é o critério objetivo que, no encaminhamento, direciona o processo à revisão do Gerente de Suprimentos — valor, complexidade, tipo do processo ou combinação desses fatores?
2. Após o encaminhamento, a precificação permanece editável pelo comprador? Em caso negativo, como ela é apresentada a ele?
3. Como a precificação devolvida passa a constar para o comprador e para o gerente, a justificativa fica visível ao comprador e há limite de reencaminhamentos?
4. A vigência é texto livre de até 50 caracteres ou um período com datas de início e fim?
5. O anexo de propostas é obrigatório para encaminhar? Qual a quantidade mínima, os formatos aceitos e o tamanho máximo por arquivo?
6. Quais são as opções das listas Complexidade e Tipo do processo?
7. Quais são os tamanhos máximos dos campos textuais (Título, Especificação do item, filtros de busca)?
8. Quais situações compõem o filtro Status da análise, considerando as precificações devolvidas?
9. Que informações compõem o Mapa de Precificação e o Despacho do Presidente?

## Histórico de versões

A coluna **Origem** registra a história de usuário ou a demanda que deu lastro à criação ou à evolução das funcionalidades desta versão — é o único ponto em que a história é citada no documento.

| Versão | Data | Origem | Descrição |
|---|---|---|---|
| 1.0 | 06/08/2026 | Demanda de especificação do Módulo 07 — cards PDTIC25114-468 a 493 (Sprint SP23) | Proposta de anatomia no formato N3 negocial, com aplicação às Funcionalidades 1 e 2 da Precificação de SC. |
