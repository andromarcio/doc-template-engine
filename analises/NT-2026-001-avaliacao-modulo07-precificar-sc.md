# NOTA TÉCNICA Nº 001/2026

**Assunto:** Avaliação de aptidão do documento "Documento de Especificação de Requisitos: Histórias de Usuário do Módulo 07 – Precificar Solicitação de Compras" como artefato de especificação funcional para construção, teste e aceite.

**Artefato avaliado:** revisão 1.0, de 10/06/2026, elaborado por PHL Group; cards PDTIC25114-468 a 493; Sprint SP23; 6 histórias de usuário (HIST), tabela de perfis e permissões, 5 telas (TELA) com critérios de aceite e seção de informações técnicas.

**Data:** 07/07/2026 · **Elaboração:** [nome/área] · **Revisão:** [nome/área]

---

## 1. Objeto

1.1. Esta nota técnica registra a avaliação de aptidão do documento em referência para uso como especificação funcional de referência nas etapas de construção, teste e homologação do Módulo 07 – Precificar Solicitação de Compras.

1.2. A avaliação responde a uma única pergunta: o artefato permite que uma equipe construa, teste e aceite a funcionalidade sem depender do conhecimento tácito de quem o escreveu?

## 2. Método

2.1. O documento foi analisado integralmente e confrontado com os critérios clássicos de qualidade de requisitos — completude, não-ambiguidade, consistência, verificabilidade, rastreabilidade e priorização — e com o padrão interno de especificação por funcionalidade (nível N3: campos tipados, regras de negócio atômicas, cenários de aceite verificáveis, máquina de estados e permissões).

2.2. Todos os achados citam evidência literal do próprio documento. Nenhum achado decorre exclusivamente de convenção interna: as ausências apontadas (definição de dados, casos de erro, critérios passa/falha) são exigências universais de uma especificação destinada a implementação.

## 3. Síntese conclusiva

3.1. O documento comunica bem a intenção do módulo — quem faz o quê, onde e com que permissão —, mas não sustenta as decisões que uma especificação existe para sustentar: não define os dados, não especifica a regra central do fluxo, não descreve nenhum caso de erro e não contém um único critério de aceite em forma verificável (passa/falha).

3.2. Recomenda-se a **não utilização do artefato** como base de desenvolvimento, teste ou homologação, reclassificando-o como insumo de levantamento (discovery) a ser destilado em especificação estruturada antes de qualquer construção. Os fundamentos seguem nas seções 4 e 5; a pauta de lacunas a resolver, no Anexo A.

## 4. Achados

### 4.1. Achados críticos

**A-01 — Ausência de verificabilidade.** O documento não contém nenhum cenário de aceite em formato verificável. Os blocos intitulados "Critérios de Aceite (Regras)" descrevem comportamento e navegação de telas, não condições com resultado observável que passam ou falham. Não existe um único caso negativo ou de exceção no documento inteiro: nada especifica o que ocorre ao encaminhar sem valor unitário, sem anexo ou com campo obrigatório vazio. Consequência direta: a equipe de testes não tem base além do caminho feliz e o aceite torna-se juízo subjetivo.

**A-02 — Regra central do fluxo não especificada.** Evidência: "Ao Encaminhar, o sistema avalia automaticamente se o processo precisa passar pelo Gerente de Suprimentos; em caso afirmativo, direciona para a revisão (TELA_002)". O critério dessa avaliação — valor, complexidade, tipo de processo — não é declarado em nenhum ponto do documento, e o caminho complementar (quando a revisão não é exigida: quem valida, quem gera o Despacho do Presidente, para onde segue o processo) tampouco. Trata-se da decisão de roteamento que define o comportamento do módulo; como está, será decidida pela equipe de desenvolvimento, sem registro e sem validação de negócio.

**A-03 — Rastreabilidade interna inconsistente.** Foram identificadas as seguintes contradições de identificação e vínculo: (a) o identificador HIST_001 é usado para duas histórias distintas ("Precificar a Solicitação de Compra" e "Consultar SCs para Revisão"); (b) HIST_005 é referenciado na tabela de permissões, mas não existe na lista de histórias; (c) a mesma história aparece grafada como HIST_06 e HIST_006; (d) a numeração desalinha entre seções — na lista de histórias, Devolver = HIST_003 e Visualizar Despacho = HIST_004; na tabela de permissões, Consultar = HIST_003, Devolver = HIST_004 e Visualizar Despacho = HIST_005; (e) TELA_004 e TELA_005 rotulam seus critérios como "vinculados ao TELA_003" (erro de cópia); (f) a navegação é contraditória — TELA_005 declara-se "acessada pela ação Visualizar (ícone de olho) da TELA_001" e afirma que "Fechar retorna à listagem (TELA_001)", mas TELA_001 é o formulário de precificação, não uma listagem, e o documento não define em qual listagem está o referido ícone. Consequência: qualquer matriz de rastreabilidade (backlog, testes, permissões) construída sobre esses vínculos herda os erros.

### 4.2. Achados graves

**A-04 — Dados sem definição.** Nenhum campo é definido em tabela com tipo, obrigatoriedade e validação. Complexidade, Tipo do Processo, Título, Vigência, Valor Unitário e Especificação existem apenas dentro da prosa dos critérios; os oito campos herdados da Solicitação de Compra (Número, UO, CR, Filial, DT Emissão, Solicitante, Tipo SC, Just. Compra) são citados apenas como "somente leitura". Registre-se ainda a anomalia semântica da Vigência: "obrigatória, limitada a 50 caracteres" — um período de vigência modelado como texto livre, sem formato definido.

**A-05 — Ciclo de vida sem máquina de estados.** O fluxo pressupõe ao menos seis situações do processo — rascunho, encaminhado, pendente de revisão, devolvido, revisado, enviado para aprovação —, mas nenhuma é formalizada. O único status nomeado ("Status da Análise": Pendentes/Revisados) não comporta a devolução, e nenhuma transição tem condição de entrada ou saída declarada.

**A-06 — Tratamento de erros e mensagens inexistente.** Nenhuma mensagem de interface, de erro ou de confirmação tem texto definido; nenhuma condição de bloqueio é especificada. Cada mensagem exibida ao usuário será redigida na hora da implementação, sem padronização nem aprovação de negócio.

**A-07 — Lacunas funcionais e de escopo.** (a) A aprovação pelo Presidente é citada como etapa final ("O Presidente é o aprovador final do processo") e não é especificada em nenhuma história ou tela — não se sabe sequer se pertence a este módulo. (b) A devolução ao comprador não define o status resultante da SC, a possibilidade e o limite de reencaminhamento, nem a visibilidade da justificativa para o comprador. (c) Os anexos (propostas) não têm obrigatoriedade, quantidade mínima, formatos ou limites definidos. (d) O conteúdo do Mapa de Precificação e do Despacho do Presidente — documentos gerados automaticamente pelo sistema — não é definido. (e) Não há regras para o Valor Unitário (moeda, valor mínimo, obrigatoriedade de precificar todos os itens antes do encaminhamento).

### 4.3. Achados de método

**A-08 — Regras compostas e organizadas por tela.** Os critérios agregam, numa mesma frase, invariante de negócio, reação do sistema e navegação entre telas (ex.: "A Vigência é obrigatória, limitada a 50 caracteres, e é definida pelo comprador (permanece somente leitura para o Gerente em TELA_002)"), e estão vinculados a telas, não a funcionalidades. Isso impede o reuso da regra, seu teste isolado e sua manutenção — a mesma regra reaparece parafraseada em telas diferentes, com risco de divergência.

**A-09 — Ausência de priorização e de critérios de sucesso.** Nada indica ordem de implementação, recorte de MVP ou resultado mensurável esperado da funcionalidade.

**A-10 — Camada técnica ausente.** A seção "Informações Técnicas" declara "Não se aplica". Para um documento destinado a alimentar implementação, a camada técnica não é inaplicável — está ausente (contratos de operação, tratamento de erros, integrações, auditoria), e nenhum documento técnico apartado é referenciado.

## 5. Riscos decorrentes da adoção do artefato como especificação

| # | Risco | Origem | Efeito esperado |
|---|---|---|---|
| R-01 | Implementação por inferência: tipos, validações, regra de roteamento, estados e mensagens decididos silenciosamente pela equipe | A-02, A-04, A-05, A-06 | Comportamento divergente do esperado pelo negócio; retrabalho em homologação |
| R-02 | Cobertura de teste restrita ao caminho feliz | A-01, A-06 | Defeitos de exceção descobertos em produção |
| R-03 | Aceite subjetivo ("parece certo") | A-01, A-09 | Conflito de aceite e devoluções de sprint |
| R-04 | Contaminação de backlog e matriz de testes por vínculos de identificação errados | A-03 | Gestão, auditoria e rastreabilidade comprometidas |
| R-05 | Escopo oculto (aprovação do Presidente; caminho sem revisão gerencial) | A-02, A-07 | Estouro de escopo e de prazo durante a sprint |

5.2. Cabe destacar que o custo da especificação faltante não é evitado ao adotar o artefato — é apenas diferido para as fases de código, teste e homologação, nas quais cada decisão errada custa mais para ser corrigida.

## 6. Valor residual do artefato

6.1. Registre-se, por equilíbrio, o que o documento tem de aproveitável como insumo: as seis histórias são bem formadas (ator, ação, propósito); a matriz de perfis e permissões é precisa, inclusive em nuances (Vigência editável pelo Comprador e somente leitura para o Gerente); há parâmetros concretos raros em documentos congêneres (listas de valores com códigos, valor padrão de filtro, combinação de filtros por E, regra de ordenação); e a localização da funcionalidade no sistema está definida. Esse conteúdo deve ser reaproveitado como matéria-prima do processo de especificação — não como seu produto final.

## 7. Conclusão e recomendação

7.1. Pelo conjunto dos achados — nenhum critério de aceite verificável (A-01), regra central indefinida (A-02), rastreabilidade interna inconsistente (A-03) e definição de dados ausente (A-04) —, o documento não reúne condições de servir como especificação funcional de referência.

7.2. Recomenda-se: (a) **não utilizar** o artefato como base de desenvolvimento, teste ou homologação do Módulo 07; (b) **reclassificá-lo** formalmente como insumo de levantamento; (c) **condicionar o início da construção** à produção de especificação estruturada por funcionalidade (padrão N2/N3 — campos tipados, regras atômicas, cenários verificáveis incluindo casos negativos, máquina de estados e permissões), resolvendo com o responsável de produto a pauta do Anexo A; (d) **solicitar ao fornecedor** a correção das inconsistências de identificação (A-03) em qualquer versão futura do documento.

---

## Anexo A — Pauta de esclarecimentos pendentes

1. Qual é o critério objetivo que determina a passagem do processo pela revisão do Gerente de Suprimentos (valor, complexidade, tipo de processo)?
2. Qual é o fluxo quando a revisão não é exigida — quem valida e quem gera o Despacho do Presidente?
3. A aprovação pelo Presidente pertence a este módulo? Onde está especificada?
4. Após a devolução: qual status a SC assume, o comprador pode reencaminhar (há limite?), a justificativa fica visível a ele?
5. A Vigência é de fato texto livre (50 caracteres) ou um período com formato definido?
6. Anexos/propostas: são obrigatórios para encaminhar? Quantidade mínima? Formatos e tamanho máximo?
7. Todos os itens exigem Valor Unitário e Especificação antes do encaminhamento? Há valor mínimo?
8. Qual é o conteúdo (layout e dados) do Mapa de Precificação e do Despacho do Presidente?
9. Que status compõem o "Status da Análise" além de Pendente/Revisado? Onde entra "devolvido"?
10. Em qual listagem fica o "ícone de olho" que abre o Resumo da Precificação (TELA_005)?
11. Quais são os textos das mensagens de erro, bloqueio e confirmação do fluxo?
12. Existe recorte de MVP ou priorização entre as seis histórias?

## Anexo B — Quadro-síntese de conformidade

| Critério de qualidade | Situação | Achados relacionados |
|---|---|---|
| Completude | Parcial | A-02, A-04, A-05, A-06, A-07 |
| Não-ambiguidade | Fraca | A-02, A-04 (Vigência), A-03 (f) |
| Consistência | Não conforme | A-03 |
| Verificabilidade | Não conforme | A-01, A-06 |
| Rastreabilidade | Parcial (externa adequada; interna quebrada) | A-03 |
| Priorização | Ausente | A-09 |
