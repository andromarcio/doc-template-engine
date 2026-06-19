/* =========================================================================
   Configuração do site — doc-template-engine
   -------------------------------------------------------------------------
   Este é o único arquivo que você precisa editar para adaptar o template:
   troque o nome, o repositório e a árvore de navegação. Cada item aponta
   para um arquivo Markdown em /content (sem a extensão .md).
   ========================================================================= */
window.DOKU_CONFIG = {
  /* Identidade do site */
  name: "doc-template",
  fullName: "doc-template-engine",
  repo: "https://github.com/andromarcio/doc-template-engine",
  defaultPage: "introducao",

  /* Ícones opcionais por item (chaves definidas em assets/js/app.js → ICONS) */
  nav: [
    {
      section: "Comece aqui",
      items: [
        { title: "Introdução", page: "introducao", icon: "home" },
        { title: "Início rápido", page: "inicio-rapido", icon: "rocket" },
        { title: "Estrutura do repositório", page: "estrutura", icon: "folder" },
      ],
    },
    {
      section: "Conceitos",
      items: [
        {
          title: "Os quatro níveis",
          page: "quatro-niveis",
          icon: "layers",
          children: [
            { title: "N0 — Visão de Produto", page: "n0" },
            { title: "N1 — Domínio", page: "n1" },
            { title: "N2 — Feature Set", page: "n2" },
            { title: "N3 — Feature", page: "n3" },
          ],
        },
        { title: "Negócio e Técnico", page: "negocio-tecnico", icon: "split" },
      ],
    },
    {
      section: "Fluxo de trabalho",
      items: [
        { title: "Como o método flui", page: "fluxo-de-trabalho", icon: "flow" },
        { title: "Triagem", page: "triagem", icon: "search" },
        { title: "História de usuário", page: "historia-usuario", icon: "ticket" },
        { title: "Rastreabilidade", page: "rastreabilidade", icon: "link" },
      ],
    },
    {
      section: "Referência",
      items: [
        { title: "Prompts", page: "prompts", icon: "terminal" },
        { title: "Templates", page: "templates", icon: "file" },
      ],
    },
    {
      section: "Projeto",
      items: [
        { title: "Como usar", page: "como-usar", icon: "book" },
        { title: "Contribuindo", page: "contribuindo", icon: "git" },
      ],
    },
  ],
};
