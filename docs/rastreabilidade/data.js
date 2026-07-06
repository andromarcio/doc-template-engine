/* =========================================================================
   PROTÓTIPO — índice de rastreabilidade (graph index)
   -------------------------------------------------------------------------
   Este arquivo é uma SIMULAÇÃO do que um passo de build geraria
   automaticamente ao varrer os artefatos .md de uma instância:

     - cabeçalho de cada N3  → id (SIGLA-SFS-NN), título, status
     - seção "## Origem"      → arestas história → feature (kind: origina)
     - seção "## Implementação"→ arestas feature → repositório (kind: implementa)
     - N1 "Feature Sets" / N2 → hierarquia (kind: contem)
     - N1 "Integrações"       → arestas domínio ↔ domínio (kind: integra)
     - modules/INDEX.md       → status consolidado, PF/CFP

   NÍVEL DE CÓDIGO (Fase A — dados fictícios; a extração real é a Fase B):
     - análise estática de cada repo (JavaParser/Spoon p/ Java, ts-morph p/ TS)
       emitiria classes (kind: contem), métodos (kind: declara) e chamadas
       método→método (kind: chama);
     - a âncora feature→código vem das marcações já previstas pelo engine:
       @RequiresFeature("SIGLA-SFS-NN") no back e *appFeature="ID" no front
       (ver global/AUTHZ.md), mais o caminho da seção "## Implementação" do N3;
     - a fronteira front→back (componente → endpoint HTTP) é Fase C — por isso
       os métodos do loja-web não têm arestas "chama" cruzando para o loja-api.

   Aqui os dados são de um sistema-exemplo ("Loja Acme") só para o grafo ter
   o que mostrar. Numa instância real, `data.js` seria gerado, não escrito.
   ========================================================================= */
window.TRACE_DATA = {
  meta: {
    system: "Loja Acme",
    subtitle: "sistema-exemplo — dados fictícios para o protótipo",
    generatedAt: "2026-06-24",
    engineVersion: "1.0.0",
    repo: "https://github.com/andromarcio/doc-template-engine",
  },

  /* ----------------------------------------------------------------------
     NÓS — cada artefato é um nó. `path` aponta para o .md de origem.
     status (só features): spec | dev | impl | revisao | deprecado
     ---------------------------------------------------------------------- */
  nodes: [
    // N0 — Visão de produto
    { id: "N0", type: "produto", label: "Loja Acme", sub: "Visão de Produto",
      desc: "E-commerce B2C de catálogo próprio, do cadastro do cliente ao checkout.",
      path: "global/N0_PRODUCT_VISION.md" },

    // N1 — Domínios
    { id: "USR", type: "dominio", label: "Usuários", sub: "Domínio · USR",
      desc: "Identidade, cadastro de clientes e perfis de acesso.",
      path: "modules/usuarios/README.md" },
    { id: "CAT", type: "dominio", label: "Catálogo", sub: "Domínio · CAT",
      desc: "Produtos, categorias e busca.",
      path: "modules/catalogo/README.md" },
    { id: "VND", type: "dominio", label: "Vendas", sub: "Domínio · VND",
      desc: "Carrinho e checkout — a jornada de compra.",
      path: "modules/vendas/README.md" },

    // N2 — Feature Sets
    { id: "USR-CAD", type: "featureset", label: "Cadastro", sub: "Feature Set · USR-CAD", domain: "USR",
      desc: "Criar e manter o cadastro do cliente.",
      path: "modules/usuarios/cadastro/README.md" },
    { id: "USR-PRM", type: "featureset", label: "Permissões", sub: "Feature Set · USR-PRM", domain: "USR",
      desc: "Perfis e controle de acesso.",
      path: "modules/usuarios/permissoes/README.md" },
    { id: "CAT-PRD", type: "featureset", label: "Produtos", sub: "Feature Set · CAT-PRD", domain: "CAT",
      desc: "Cadastro e busca de produtos.",
      path: "modules/catalogo/produtos/README.md" },
    { id: "VND-CAR", type: "featureset", label: "Carrinho", sub: "Feature Set · VND-CAR", domain: "VND",
      desc: "Itens em carrinho antes do checkout.",
      path: "modules/vendas/carrinho/README.md" },
    { id: "VND-CHK", type: "featureset", label: "Checkout", sub: "Feature Set · VND-CHK", domain: "VND",
      desc: "Frete, cupom e fechamento do pedido.",
      path: "modules/vendas/checkout/README.md" },

    // N3 — Features
    { id: "USR-CAD-01", type: "feature", label: "Cadastrar Cliente", status: "impl", pf: 7,
      sub: "Feature · USR-CAD-01", domain: "USR",
      desc: "Cliente cria a própria conta com e-mail e dados básicos.",
      path: "modules/usuarios/cadastro/f-cadastrar-cliente.md" },
    { id: "USR-CAD-02", type: "feature", label: "Editar Cliente", status: "dev", pf: 5,
      sub: "Feature · USR-CAD-02", domain: "USR",
      desc: "Cliente atualiza seus dados de cadastro.",
      path: "modules/usuarios/cadastro/f-editar-cliente.md" },
    { id: "USR-PRM-01", type: "feature", label: "Definir Perfil", status: "spec", pf: null,
      sub: "Feature · USR-PRM-01", domain: "USR",
      desc: "Administrador atribui perfil de acesso a um usuário.",
      path: "modules/usuarios/permissoes/f-definir-perfil.md" },
    { id: "CAT-PRD-01", type: "feature", label: "Cadastrar Produto", status: "impl", pf: 6,
      sub: "Feature · CAT-PRD-01", domain: "CAT",
      desc: "Operador cadastra um produto no catálogo.",
      path: "modules/catalogo/produtos/f-cadastrar-produto.md" },
    { id: "CAT-PRD-02", type: "feature", label: "Buscar Produto", status: "impl", pf: 4,
      sub: "Feature · CAT-PRD-02", domain: "CAT",
      desc: "Cliente busca produtos por nome e categoria.",
      path: "modules/catalogo/produtos/f-buscar-produto.md" },
    { id: "VND-CAR-01", type: "feature", label: "Adicionar ao Carrinho", status: "impl", pf: 5,
      sub: "Feature · VND-CAR-01", domain: "VND",
      desc: "Cliente adiciona um produto ao carrinho.",
      path: "modules/vendas/carrinho/f-adicionar-item.md" },
    { id: "VND-CAR-02", type: "feature", label: "Remover do Carrinho", status: "dev", pf: 4,
      sub: "Feature · VND-CAR-02", domain: "VND",
      desc: "Cliente remove um item do carrinho.",
      path: "modules/vendas/carrinho/f-remover-item.md" },
    { id: "VND-CHK-01", type: "feature", label: "Calcular Frete", status: "dev", pf: 6,
      sub: "Feature · VND-CHK-01", domain: "VND",
      desc: "Sistema calcula o frete pelo CEP de destino.",
      path: "modules/vendas/checkout/f-calcular-frete.md" },
    { id: "VND-CHK-02", type: "feature", label: "Aplicar Cupom", status: "spec", pf: null,
      sub: "Feature · VND-CHK-02", domain: "VND",
      desc: "Cliente aplica um cupom de desconto ao pedido.",
      path: "modules/vendas/checkout/f-aplicar-cupom.md" },
    { id: "VND-CHK-03", type: "feature", label: "Finalizar Compra", status: "revisao", pf: 7,
      sub: "Feature · VND-CHK-03", domain: "VND",
      desc: "Cliente confirma e fecha o pedido.",
      path: "modules/vendas/checkout/f-finalizar-compra.md" },

    // Histórias (ServiceNow)
    { id: "STRY0012345", type: "historia", label: "Frete por CEP", sub: "História · STRY0012345",
      desc: "Como cliente, quero ver o frete pelo meu CEP antes de fechar.",
      path: "modules/_backlog/STRY0012345.md" },
    { id: "STRY0012501", type: "historia", label: "Cupons promocionais", sub: "História · STRY0012501",
      desc: "Como cliente, quero usar cupons de desconto na compra.",
      path: "modules/_backlog/STRY0012501.md" },
    { id: "STRY0013002", type: "historia", label: "Cadastro self-service", sub: "História · STRY0013002",
      desc: "Como visitante, quero criar e editar minha conta sozinho.",
      path: "modules/_backlog/STRY0013002.md" },
    { id: "STRY0013110", type: "historia", label: "Perfis de acesso", sub: "História · STRY0013110",
      desc: "Como admin, quero controlar o que cada usuário acessa.",
      path: "modules/_backlog/STRY0013110.md" },
    { id: "STRY0013455", type: "historia", label: "Catálogo inicial", sub: "História · STRY0013455",
      desc: "Como operador, quero cadastrar e expor os produtos.",
      path: "modules/_backlog/STRY0013455.md" },
    { id: "STRY0013700", type: "historia", label: "Fluxo de compra completo", sub: "História · STRY0013700",
      desc: "Como cliente, quero montar o carrinho e finalizar a compra.",
      path: "modules/_backlog/STRY0013700.md" },

    // Repositórios (código)
    { id: "loja-web", type: "repo", label: "loja-web", sub: "Repositório · frontend",
      desc: "Angular — interface do cliente.",
      path: "https://github.com/acme/loja-web" },
    { id: "loja-api", type: "repo", label: "loja-api", sub: "Repositório · backend",
      desc: "Java/Spring — API e regras de negócio.",
      path: "https://github.com/acme/loja-api" },

    /* ------------------------------------------------------------------
       NÍVEL DE CÓDIGO (Fase A) — classes e métodos, expandíveis sob demanda.
       `repo`/`classe` apontam para o nó-pai; o grafo só os mostra quando o
       pai é expandido (duplo-clique ou botão no painel).
       ------------------------------------------------------------------ */
    // loja-api — classes (Java/Spring)
    { id: "api.ClienteController", type: "classe", repo: "loja-api",
      label: "ClienteController", sub: "Classe · Java/Spring",
      desc: "REST — endpoints de cadastro do cliente.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/cliente/ClienteController.java" },
    { id: "api.ClienteService", type: "classe", repo: "loja-api",
      label: "ClienteService", sub: "Classe · Java/Spring",
      desc: "Regras de negócio do cadastro de cliente.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/cliente/ClienteService.java" },
    { id: "api.ProdutoController", type: "classe", repo: "loja-api",
      label: "ProdutoController", sub: "Classe · Java/Spring",
      desc: "REST — cadastro e busca de produtos.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/catalogo/ProdutoController.java" },
    { id: "api.ProdutoService", type: "classe", repo: "loja-api",
      label: "ProdutoService", sub: "Classe · Java/Spring",
      desc: "Regras de negócio do catálogo.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/catalogo/ProdutoService.java" },
    { id: "api.CheckoutController", type: "classe", repo: "loja-api",
      label: "CheckoutController", sub: "Classe · Java/Spring",
      desc: "REST — frete, cupom e fechamento do pedido.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/CheckoutController.java" },
    { id: "api.FreteService", type: "classe", repo: "loja-api",
      label: "FreteService", sub: "Classe · Java/Spring",
      desc: "Cálculo de frete por CEP.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/FreteService.java" },
    { id: "api.PedidoService", type: "classe", repo: "loja-api",
      label: "PedidoService", sub: "Classe · Java/Spring",
      desc: "Fechamento do pedido e validações de estoque.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/PedidoService.java" },

    // loja-api — métodos
    { id: "api.ClienteController.criarCliente", type: "metodo", classe: "api.ClienteController",
      label: "criarCliente()", sub: "Método · POST /clientes",
      desc: '@RequiresFeature("USR-CAD-01") — cria a conta do cliente.',
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/cliente/ClienteController.java" },
    { id: "api.ClienteController.atualizarCliente", type: "metodo", classe: "api.ClienteController",
      label: "atualizarCliente()", sub: "Método · PUT /clientes/{id}",
      desc: '@RequiresFeature("USR-CAD-02") — atualiza dados do cadastro.',
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/cliente/ClienteController.java" },
    { id: "api.ClienteService.salvar", type: "metodo", classe: "api.ClienteService",
      label: "salvar()", sub: "Método",
      desc: "Persiste o cliente após validações.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/cliente/ClienteService.java" },
    { id: "api.ClienteService.validarEmail", type: "metodo", classe: "api.ClienteService",
      label: "validarEmail()", sub: "Método",
      desc: "Valida formato e unicidade do e-mail.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/cliente/ClienteService.java" },
    { id: "api.ProdutoController.cadastrarProduto", type: "metodo", classe: "api.ProdutoController",
      label: "cadastrarProduto()", sub: "Método · POST /produtos",
      desc: '@RequiresFeature("CAT-PRD-01") — inclui produto no catálogo.',
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/catalogo/ProdutoController.java" },
    { id: "api.ProdutoController.buscarProdutos", type: "metodo", classe: "api.ProdutoController",
      label: "buscarProdutos()", sub: "Método · GET /produtos",
      desc: '@RequiresFeature("CAT-PRD-02") — busca por nome e categoria.',
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/catalogo/ProdutoController.java" },
    { id: "api.ProdutoService.salvar", type: "metodo", classe: "api.ProdutoService",
      label: "salvar()", sub: "Método",
      desc: "Persiste o produto.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/catalogo/ProdutoService.java" },
    { id: "api.ProdutoService.pesquisar", type: "metodo", classe: "api.ProdutoService",
      label: "pesquisar()", sub: "Método",
      desc: "Consulta produtos com preço e estoque.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/catalogo/ProdutoService.java" },
    { id: "api.CheckoutController.calcularFrete", type: "metodo", classe: "api.CheckoutController",
      label: "calcularFrete()", sub: "Método · GET /checkout/frete",
      desc: '@RequiresFeature("VND-CHK-01") — frete pelo CEP de destino.',
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/CheckoutController.java" },
    { id: "api.CheckoutController.finalizarCompra", type: "metodo", classe: "api.CheckoutController",
      label: "finalizarCompra()", sub: "Método · POST /checkout",
      desc: '@RequiresFeature("VND-CHK-03") — confirma e fecha o pedido.',
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/CheckoutController.java" },
    { id: "api.FreteService.calcularPorCep", type: "metodo", classe: "api.FreteService",
      label: "calcularPorCep()", sub: "Método",
      desc: "Consulta a transportadora e calcula o frete.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/FreteService.java" },
    { id: "api.PedidoService.fechar", type: "metodo", classe: "api.PedidoService",
      label: "fechar()", sub: "Método",
      desc: "Fecha o pedido: valida estoque, grava e dispara eventos.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/PedidoService.java" },
    { id: "api.PedidoService.validarEstoque", type: "metodo", classe: "api.PedidoService",
      label: "validarEstoque()", sub: "Método",
      desc: "Confere estoque de cada item junto ao catálogo.",
      path: "https://github.com/acme/loja-api/blob/main/src/main/java/com/acme/loja/venda/PedidoService.java" },

    // loja-web — classes (Angular)
    { id: "web.CadastroClienteComponent", type: "classe", repo: "loja-web",
      label: "CadastroClienteComponent", sub: "Classe · Angular",
      desc: "Formulário de criação/edição da conta do cliente.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/cliente/cadastro-cliente.component.ts" },
    { id: "web.CarrinhoComponent", type: "classe", repo: "loja-web",
      label: "CarrinhoComponent", sub: "Classe · Angular",
      desc: "Itens do carrinho — incluir, remover, totalizar.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/venda/carrinho.component.ts" },
    { id: "web.BuscaProdutoComponent", type: "classe", repo: "loja-web",
      label: "BuscaProdutoComponent", sub: "Classe · Angular",
      desc: "Busca e listagem de produtos do catálogo.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/catalogo/busca-produto.component.ts" },
    { id: "web.CheckoutPage", type: "classe", repo: "loja-web",
      label: "CheckoutPage", sub: "Classe · Angular",
      desc: "Página de fechamento: frete, cupom e confirmação.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/venda/checkout.page.ts" },

    // loja-web — métodos
    { id: "web.CadastroClienteComponent.onSubmit", type: "metodo", classe: "web.CadastroClienteComponent",
      label: "onSubmit()", sub: "Método",
      desc: "Envia o formulário de cadastro à API.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/cliente/cadastro-cliente.component.ts" },
    { id: "web.CarrinhoComponent.adicionarItem", type: "metodo", classe: "web.CarrinhoComponent",
      label: "adicionarItem()", sub: "Método",
      desc: "Inclui o produto no carrinho e recalcula o total.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/venda/carrinho.component.ts" },
    { id: "web.CarrinhoComponent.removerItem", type: "metodo", classe: "web.CarrinhoComponent",
      label: "removerItem()", sub: "Método",
      desc: "Remove o item e recalcula o total.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/venda/carrinho.component.ts" },
    { id: "web.BuscaProdutoComponent.pesquisar", type: "metodo", classe: "web.BuscaProdutoComponent",
      label: "pesquisar()", sub: "Método",
      desc: "Consulta produtos na API por nome/categoria.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/catalogo/busca-produto.component.ts" },
    { id: "web.CheckoutPage.confirmarPedido", type: "metodo", classe: "web.CheckoutPage",
      label: "confirmarPedido()", sub: "Método",
      desc: "Confirma o pedido e envia o checkout à API.",
      path: "https://github.com/acme/loja-web/blob/main/src/app/venda/checkout.page.ts" },
  ],

  /* ----------------------------------------------------------------------
     ARESTAS — kind define o significado e o estilo visual:
       contem      hierarquia N0→N1→N2→N3 e repo→classe (sólida, neutra)
       origina     história → feature (rastro!)  (âmbar, o elo-chave)
       implementa  feature → repo/classe/método  (verde, tracejada)
       integra     domínio ↔ domínio             (roxa, pontilhada)
       declara     classe → método               (ciano-neutra, fina)
       chama       método → método (call graph)  (ciano, com seta)
     ---------------------------------------------------------------------- */
  edges: [
    // Hierarquia
    { from: "N0", to: "USR", kind: "contem" },
    { from: "N0", to: "CAT", kind: "contem" },
    { from: "N0", to: "VND", kind: "contem" },

    { from: "USR", to: "USR-CAD", kind: "contem" },
    { from: "USR", to: "USR-PRM", kind: "contem" },
    { from: "CAT", to: "CAT-PRD", kind: "contem" },
    { from: "VND", to: "VND-CAR", kind: "contem" },
    { from: "VND", to: "VND-CHK", kind: "contem" },

    { from: "USR-CAD", to: "USR-CAD-01", kind: "contem" },
    { from: "USR-CAD", to: "USR-CAD-02", kind: "contem" },
    { from: "USR-PRM", to: "USR-PRM-01", kind: "contem" },
    { from: "CAT-PRD", to: "CAT-PRD-01", kind: "contem" },
    { from: "CAT-PRD", to: "CAT-PRD-02", kind: "contem" },
    { from: "VND-CAR", to: "VND-CAR-01", kind: "contem" },
    { from: "VND-CAR", to: "VND-CAR-02", kind: "contem" },
    { from: "VND-CHK", to: "VND-CHK-01", kind: "contem" },
    { from: "VND-CHK", to: "VND-CHK-02", kind: "contem" },
    { from: "VND-CHK", to: "VND-CHK-03", kind: "contem" },

    // Rastreabilidade história → feature (M:N)
    { from: "STRY0012345", to: "VND-CHK-01", kind: "origina", note: "calcular frete pelo CEP" },
    { from: "STRY0012501", to: "VND-CHK-02", kind: "origina", note: "aplicar cupom" },
    { from: "STRY0012501", to: "VND-CAR-01", kind: "origina", note: "recalcular total do carrinho" },
    { from: "STRY0013002", to: "USR-CAD-01", kind: "origina", note: "criar conta" },
    { from: "STRY0013002", to: "USR-CAD-02", kind: "origina", note: "editar conta" },
    { from: "STRY0013110", to: "USR-PRM-01", kind: "origina", note: "atribuir perfil" },
    { from: "STRY0013455", to: "CAT-PRD-01", kind: "origina", note: "cadastrar produto" },
    { from: "STRY0013455", to: "CAT-PRD-02", kind: "origina", note: "buscar produto" },
    { from: "STRY0013700", to: "VND-CAR-01", kind: "origina", note: "adicionar item" },
    { from: "STRY0013700", to: "VND-CAR-02", kind: "origina", note: "remover item" },
    { from: "STRY0013700", to: "VND-CHK-03", kind: "origina", note: "finalizar pedido" },

    // Implementação feature → repositório
    { from: "USR-CAD-01", to: "loja-api", kind: "implementa" },
    { from: "USR-CAD-01", to: "loja-web", kind: "implementa" },
    { from: "USR-CAD-02", to: "loja-api", kind: "implementa" },
    { from: "USR-CAD-02", to: "loja-web", kind: "implementa" },
    { from: "CAT-PRD-01", to: "loja-api", kind: "implementa" },
    { from: "CAT-PRD-02", to: "loja-api", kind: "implementa" },
    { from: "CAT-PRD-02", to: "loja-web", kind: "implementa" },
    { from: "VND-CAR-01", to: "loja-web", kind: "implementa" },
    { from: "VND-CAR-02", to: "loja-web", kind: "implementa" },
    { from: "VND-CHK-01", to: "loja-api", kind: "implementa" },
    { from: "VND-CHK-03", to: "loja-api", kind: "implementa" },
    { from: "VND-CHK-03", to: "loja-web", kind: "implementa" },

    // Integração entre domínios (N1 ↔ N1)
    { from: "VND", to: "CAT", kind: "integra", note: "lê preço e estoque do produto" },
    { from: "VND", to: "USR", kind: "integra", note: "lê dados do cliente" },

    /* ------------------------------------------------------------------
       NÍVEL DE CÓDIGO (Fase A) — o que a análise estática (Fase B) emitiria
       ------------------------------------------------------------------ */
    // repo → classe (hierarquia, viria da varredura do repositório)
    { from: "loja-api", to: "api.ClienteController", kind: "contem" },
    { from: "loja-api", to: "api.ClienteService", kind: "contem" },
    { from: "loja-api", to: "api.ProdutoController", kind: "contem" },
    { from: "loja-api", to: "api.ProdutoService", kind: "contem" },
    { from: "loja-api", to: "api.CheckoutController", kind: "contem" },
    { from: "loja-api", to: "api.FreteService", kind: "contem" },
    { from: "loja-api", to: "api.PedidoService", kind: "contem" },
    { from: "loja-web", to: "web.CadastroClienteComponent", kind: "contem" },
    { from: "loja-web", to: "web.CarrinhoComponent", kind: "contem" },
    { from: "loja-web", to: "web.BuscaProdutoComponent", kind: "contem" },
    { from: "loja-web", to: "web.CheckoutPage", kind: "contem" },

    // classe → método (declara)
    { from: "api.ClienteController", to: "api.ClienteController.criarCliente", kind: "declara" },
    { from: "api.ClienteController", to: "api.ClienteController.atualizarCliente", kind: "declara" },
    { from: "api.ClienteService", to: "api.ClienteService.salvar", kind: "declara" },
    { from: "api.ClienteService", to: "api.ClienteService.validarEmail", kind: "declara" },
    { from: "api.ProdutoController", to: "api.ProdutoController.cadastrarProduto", kind: "declara" },
    { from: "api.ProdutoController", to: "api.ProdutoController.buscarProdutos", kind: "declara" },
    { from: "api.ProdutoService", to: "api.ProdutoService.salvar", kind: "declara" },
    { from: "api.ProdutoService", to: "api.ProdutoService.pesquisar", kind: "declara" },
    { from: "api.CheckoutController", to: "api.CheckoutController.calcularFrete", kind: "declara" },
    { from: "api.CheckoutController", to: "api.CheckoutController.finalizarCompra", kind: "declara" },
    { from: "api.FreteService", to: "api.FreteService.calcularPorCep", kind: "declara" },
    { from: "api.PedidoService", to: "api.PedidoService.fechar", kind: "declara" },
    { from: "api.PedidoService", to: "api.PedidoService.validarEstoque", kind: "declara" },
    { from: "web.CadastroClienteComponent", to: "web.CadastroClienteComponent.onSubmit", kind: "declara" },
    { from: "web.CarrinhoComponent", to: "web.CarrinhoComponent.adicionarItem", kind: "declara" },
    { from: "web.CarrinhoComponent", to: "web.CarrinhoComponent.removerItem", kind: "declara" },
    { from: "web.BuscaProdutoComponent", to: "web.BuscaProdutoComponent.pesquisar", kind: "declara" },
    { from: "web.CheckoutPage", to: "web.CheckoutPage.confirmarPedido", kind: "declara" },

    // método → método (chama — o grafo de chamadas)
    { from: "api.ClienteController.criarCliente", to: "api.ClienteService.salvar", kind: "chama" },
    { from: "api.ClienteController.atualizarCliente", to: "api.ClienteService.salvar", kind: "chama" },
    { from: "api.ClienteService.salvar", to: "api.ClienteService.validarEmail", kind: "chama" },
    { from: "api.ProdutoController.cadastrarProduto", to: "api.ProdutoService.salvar", kind: "chama" },
    { from: "api.ProdutoController.buscarProdutos", to: "api.ProdutoService.pesquisar", kind: "chama" },
    { from: "api.CheckoutController.calcularFrete", to: "api.FreteService.calcularPorCep", kind: "chama" },
    { from: "api.CheckoutController.finalizarCompra", to: "api.PedidoService.fechar", kind: "chama" },
    { from: "api.PedidoService.fechar", to: "api.PedidoService.validarEstoque", kind: "chama" },
    { from: "api.PedidoService.validarEstoque", to: "api.ProdutoService.pesquisar", kind: "chama",
      note: "VND consulta o catálogo — espelha a integração VND→CAT no código" },

    // feature → classe/método (âncora fina: @RequiresFeature / *appFeature)
    { from: "USR-CAD-01", to: "api.ClienteController.criarCliente", kind: "implementa", note: '@RequiresFeature("USR-CAD-01")' },
    { from: "USR-CAD-02", to: "api.ClienteController.atualizarCliente", kind: "implementa", note: '@RequiresFeature("USR-CAD-02")' },
    { from: "CAT-PRD-01", to: "api.ProdutoController.cadastrarProduto", kind: "implementa", note: '@RequiresFeature("CAT-PRD-01")' },
    { from: "CAT-PRD-02", to: "api.ProdutoController.buscarProdutos", kind: "implementa", note: '@RequiresFeature("CAT-PRD-02")' },
    { from: "VND-CHK-01", to: "api.CheckoutController.calcularFrete", kind: "implementa", note: '@RequiresFeature("VND-CHK-01")' },
    { from: "VND-CHK-03", to: "api.CheckoutController.finalizarCompra", kind: "implementa", note: '@RequiresFeature("VND-CHK-03")' },
    { from: "USR-CAD-01", to: "web.CadastroClienteComponent", kind: "implementa", note: '*appFeature="USR-CAD-01"' },
    { from: "USR-CAD-02", to: "web.CadastroClienteComponent", kind: "implementa", note: '*appFeature="USR-CAD-02"' },
    { from: "CAT-PRD-02", to: "web.BuscaProdutoComponent", kind: "implementa", note: '*appFeature="CAT-PRD-02"' },
    { from: "VND-CAR-01", to: "web.CarrinhoComponent", kind: "implementa", note: '*appFeature="VND-CAR-01"' },
    { from: "VND-CAR-02", to: "web.CarrinhoComponent", kind: "implementa", note: '*appFeature="VND-CAR-02"' },
    { from: "VND-CHK-03", to: "web.CheckoutPage", kind: "implementa", note: '*appFeature="VND-CHK-03"' },
  ],
};
