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
  ],

  /* ----------------------------------------------------------------------
     ARESTAS — kind define o significado e o estilo visual:
       contem      hierarquia N0→N1→N2→N3        (sólida, neutra)
       origina     história → feature (rastro!)  (âmbar, o elo-chave)
       implementa  feature → repositório         (verde, tracejada)
       integra     domínio ↔ domínio             (roxa, pontilhada)
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
    { from: "CAT-PRD-01", to: "loja-api", kind: "implementa" },
    { from: "CAT-PRD-02", to: "loja-api", kind: "implementa" },
    { from: "CAT-PRD-02", to: "loja-web", kind: "implementa" },
    { from: "VND-CAR-01", to: "loja-web", kind: "implementa" },
    { from: "VND-CHK-01", to: "loja-api", kind: "implementa" },
    { from: "VND-CHK-03", to: "loja-api", kind: "implementa" },
    { from: "VND-CHK-03", to: "loja-web", kind: "implementa" },

    // Integração entre domínios (N1 ↔ N1)
    { from: "VND", to: "CAT", kind: "integra", note: "lê preço e estoque do produto" },
    { from: "VND", to: "USR", kind: "integra", note: "lê dados do cliente" },
  ],
};
