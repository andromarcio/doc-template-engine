/* =========================================================================
   doc-template-engine — app
   Build sidebar from config, route by hash, render Markdown, theme, TOC.
   ========================================================================= */
(function () {
  "use strict";

  var CFG = window.DOKU_CONFIG || { name: "Docs", nav: [], defaultPage: "" };

  /* ---------- Inline icon set (Lucide-style) ---------- */
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    rocket:
      '<path d="M5 16c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.8-.8.8-2.2 0-3s-2.2-.8-3 0Z"/><path d="M9 12c0-4 2-7 9-9 .5 5-1 9-9 9Z"/><path d="M9 12l3 3"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    split: '<path d="M6 3v6a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v3"/><path d="m15 18 3 3 3-3"/><path d="M3 6h6"/>',
    flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    ticket:
      '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z"/><path d="M13 6v12"/>',
    link: '<path d="M9 15 15 9"/><path d="M10.5 6.5 12 5a4 4 0 0 1 6 6l-1.5 1.5"/><path d="M13.5 17.5 12 19a4 4 0 0 1-6-6l1.5-1.5"/>',
    terminal: '<path d="m4 17 6-5-6-5"/><path d="M12 19h8"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 5v14"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 2-6 5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
  };

  function icon(name) {
    var p = ICONS[name] || ICONS.doc;
    return (
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      p +
      "</svg>"
    );
  }
  var caretSvg =
    '<svg class="nav__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

  /* ---------- DOM refs ---------- */
  var $nav = document.getElementById("nav");
  var $content = document.getElementById("content");
  var $toc = document.getElementById("toc");
  var $breadcrumb = document.getElementById("breadcrumb");
  var $search = document.getElementById("search");
  var $brand = document.getElementById("brandName");
  var $repoLink = document.getElementById("repoLink");

  /* ---------- Flatten pages (order, lookup, prev/next) ---------- */
  var PAGES = []; // ordered list of {page, title, section}
  var BYPAGE = {}; // page -> {title, section}
  (function flatten() {
    CFG.nav.forEach(function (sec) {
      (sec.items || []).forEach(function (it) {
        register(it, sec.section);
        (it.children || []).forEach(function (ch) {
          register(ch, sec.section);
        });
      });
    });
    function register(it, section) {
      if (!it.page || BYPAGE[it.page]) return;
      var rec = { page: it.page, title: it.title, section: section };
      PAGES.push(rec);
      BYPAGE[it.page] = rec;
    }
  })();

  /* ---------- Branding ---------- */
  if ($brand) $brand.textContent = CFG.name || "Docs";
  document.title = CFG.fullName || CFG.name || document.title;
  if ($repoLink && CFG.repo) $repoLink.href = CFG.repo;

  /* ---------- Build sidebar ---------- */
  function buildNav() {
    var html = "";
    CFG.nav.forEach(function (sec) {
      html += '<div class="nav__section">';
      html += '<div class="nav__title">' + esc(sec.section) + "</div>";
      (sec.items || []).forEach(function (it) {
        if (it.children && it.children.length) {
          html += '<div class="nav__group" data-group="' + esc(it.page) + '">';
          html +=
            '<a class="nav__item" href="#/' +
            esc(it.page) +
            '" data-page="' +
            esc(it.page) +
            '">' +
            (it.icon ? icon(it.icon) : "") +
            "<span>" +
            esc(it.title) +
            "</span>" +
            caretSvg +
            "</a>";
          html += '<div class="nav__children">';
          it.children.forEach(function (ch) {
            html += navLeaf(ch, false);
          });
          html += "</div></div>";
        } else {
          html += navLeaf(it, true);
        }
      });
      html += "</div>";
    });
    $nav.innerHTML = html;

    // Expand/collapse groups (caret only; the label still navigates)
    $nav.querySelectorAll(".nav__group > .nav__item .nav__caret").forEach(
      function (c) {
        c.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          c.closest(".nav__group").classList.toggle("is-open");
        });
      }
    );
  }

  function navLeaf(it, withIcon) {
    return (
      '<a class="nav__item" href="#/' +
      esc(it.page) +
      '" data-page="' +
      esc(it.page) +
      '">' +
      (withIcon && it.icon ? icon(it.icon) : "") +
      "<span>" +
      esc(it.title) +
      "</span></a>"
    );
  }

  /* ---------- Markdown rendering ---------- */
  if (window.marked) {
    marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  }

  function slugify(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function paint(html, withPageNav) {
    $content.innerHTML = html;
    enhance();
    buildToc();
    setupScrollSpy();
    if (withPageNav) renderPageNav();
    window.scrollTo(0, 0);
  }

  function render(md) {
    paint(window.marked ? marked.parse(md) : "<pre>" + esc(md) + "</pre>", true);
  }

  function enhance() {
    // Wrap tables for horizontal scroll
    $content.querySelectorAll("table").forEach(function (t) {
      if (t.parentElement.classList.contains("table-wrap")) return;
      var w = document.createElement("div");
      w.className = "table-wrap";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });

    // Heading anchors
    var used = {};
    $content.querySelectorAll("h2, h3").forEach(function (h) {
      var id = slugify(h.textContent);
      if (!id) return;
      if (used[id]) id = id + "-" + ++used[id];
      else used[id] = 1;
      h.id = id;
      var a = document.createElement("a");
      a.className = "heading-anchor";
      a.href = "#" + location.hash.split("#")[1] + "#" + id;
      a.setAttribute("aria-label", "Link para esta seção");
      a.textContent = "#";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", a.getAttribute("href"));
      });
      h.appendChild(a);
    });

    // Code blocks: highlight + copy button
    $content.querySelectorAll("pre code").forEach(function (code) {
      if (window.hljs) {
        try {
          hljs.highlightElement(code);
        } catch (e) {}
      }
      var pre = code.parentElement;
      var btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Copiar");
      btn.innerHTML = copyIcon();
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(code.innerText).then(function () {
          btn.classList.add("copied");
          btn.innerHTML = checkIcon();
          setTimeout(function () {
            btn.classList.remove("copied");
            btn.innerHTML = copyIcon();
          }, 1600);
        });
      });
      pre.appendChild(btn);
    });

    // External links open in new tab
    $content.querySelectorAll('a[href^="http"]').forEach(function (a) {
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function copyIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  }
  function checkIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  }

  /* ---------- Table of contents ---------- */
  function buildToc() {
    var heads = $content.querySelectorAll("h2, h3");
    if (!heads.length) {
      $toc.innerHTML = "";
      return;
    }
    var html = '<div class="toc__title">Nesta página</div>';
    heads.forEach(function (h) {
      html +=
        '<a href="#' +
        h.id +
        '" class="' +
        (h.tagName === "H3" ? "lvl-3" : "lvl-2") +
        '" data-href="' +
        h.id +
        '">' +
        esc(h.firstChild ? h.textContent.replace(/#$/, "") : h.textContent) +
        "</a>";
    });
    $toc.innerHTML = html;
    $toc.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.dataset.href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  var spyObserver = null;
  function setupScrollSpy() {
    if (spyObserver) spyObserver.disconnect();
    var links = {};
    $toc.querySelectorAll("a").forEach(function (a) {
      links[a.dataset.href] = a;
    });
    var heads = $content.querySelectorAll("h2, h3");
    if (!heads.length) return;
    spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            Object.keys(links).forEach(function (k) {
              links[k].classList.remove("is-active");
            });
            if (links[en.target.id]) links[en.target.id].classList.add("is-active");
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    heads.forEach(function (h) {
      spyObserver.observe(h);
    });
  }

  /* ---------- Prev / next ---------- */
  function renderPageNav() {
    var cur = currentPage();
    var i = PAGES.findIndex(function (p) {
      return p.page === cur;
    });
    if (i < 0) return;
    var prev = PAGES[i - 1];
    var next = PAGES[i + 1];
    if (!prev && !next) return;
    var html = '<div class="page-nav">';
    html += prev
      ? '<a class="prev" href="#/' +
        prev.page +
        '"><span class="dir">← Anterior</span><span class="ttl">' +
        esc(prev.title) +
        "</span></a>"
      : "<span></span>";
    html += next
      ? '<a class="next" href="#/' +
        next.page +
        '"><span class="dir">Próximo →</span><span class="ttl">' +
        esc(next.title) +
        "</span></a>"
      : "<span></span>";
    html += "</div>";
    $content.insertAdjacentHTML("beforeend", html);
  }

  /* ---------- Breadcrumb ---------- */
  function setBreadcrumb(rec) {
    var chevron =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
    $breadcrumb.innerHTML =
      "<span>" +
      esc(CFG.name) +
      "</span>" +
      chevron +
      (rec
        ? "<span>" + esc(rec.section || "Docs") + "</span>" + chevron + "<b>" + esc(rec.title) + "</b>"
        : "<b>Documentação</b>");
  }

  /* ---------- Active state ---------- */
  function setActive(page) {
    $nav.querySelectorAll(".nav__item").forEach(function (a) {
      var on = a.dataset.page === page;
      a.classList.toggle("is-active", on);
      if (on) {
        var grp = a.closest(".nav__group");
        if (grp) grp.classList.add("is-open");
      }
    });
  }

  /* ---------- Routing ---------- */
  function routePath() {
    return location.hash.replace(/^#\/?/, "").split("#")[0];
  }
  function currentPage() {
    var r = routePath();
    if (r.indexOf("file/") === 0) return r; // file route, not a content page
    return r || CFG.defaultPage;
  }
  function currentAnchor() {
    var parts = location.hash.split("#");
    return parts.length > 2 ? parts[2] : "";
  }
  function skeleton() {
    return (
      '<div class="state"><div class="skeleton" style="width:45%;height:30px"></div>' +
      '<div class="skeleton" style="width:92%"></div><div class="skeleton" style="width:84%"></div>' +
      '<div class="skeleton" style="width:88%"></div></div>'
    );
  }

  function loadPage() {
    var r = routePath();
    if (r.indexOf("file/") === 0) loadFile(r.slice(5));
    else loadContent(r || CFG.defaultPage);
    closeMobileNav();
  }

  function loadContent(page) {
    var rec = BYPAGE[page];
    setActive(page);
    setBreadcrumb(rec);
    document.title = (rec ? rec.title + " · " : "") + (CFG.fullName || CFG.name);
    $content.innerHTML = skeleton();

    fetch("content/" + page + ".md", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (md) {
        render(md);
        var anchor = currentAnchor();
        if (anchor) {
          var el = document.getElementById(anchor);
          if (el) setTimeout(function () {
            el.scrollIntoView({ block: "start" });
          }, 30);
        }
      })
      .catch(function (err) {
        showError(page, err);
      });
  }

  /* ---------- Repo file viewer (abre .md/arquivos sem sair do site) ---------- */
  function rawBase() {
    var m = (CFG.repo || "").match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
    return m
      ? "https://raw.githubusercontent.com/" + m[1] + "/" + (CFG.branch || "main")
      : "";
  }
  function blobUrlFor(path) {
    return (
      (CFG.repo || "").replace(/\/$/, "") +
      "/blob/" + (CFG.branch || "main") + "/" + path
    );
  }
  function fileBanner(path) {
    return (
      '<div class="file-banner">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/></svg>' +
      "<code>" + esc(path) + "</code>" +
      '<a href="' + blobUrlFor(path) + '" target="_blank" rel="noopener">Ver no GitHub ↗</a>' +
      "</div>"
    );
  }

  function loadFile(path) {
    setActive(null);
    setBreadcrumbFile(path);
    document.title = path.split("/").pop() + " · " + (CFG.fullName || CFG.name);
    $content.innerHTML = skeleton();

    var base = rawBase();
    if (!base) {
      showFileError(path, new Error("repositório não configurado"));
      return;
    }
    fetch(base + "/" + path, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (text) {
        var isMd = /\.(md|markdown|mdx)$/i.test(path);
        var body = isMd
          ? window.marked
            ? marked.parse(text)
            : "<pre>" + esc(text) + "</pre>"
          : "<pre><code>" + esc(text) + "</code></pre>";
        paint(fileBanner(path) + body, false);
      })
      .catch(function (err) {
        showFileError(path, err);
      });
  }

  function setBreadcrumbFile(path) {
    var chevron =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
    $breadcrumb.innerHTML =
      '<a href="#/' + esc(CFG.defaultPage) + '">' + esc(CFG.name) + "</a>" +
      chevron + "<span>Arquivo</span>" + chevron +
      "<b>" + esc(path.split("/").pop()) + "</b>";
  }

  function showFileError(path, err) {
    $content.innerHTML =
      '<div class="state"><h1>Não foi possível abrir o arquivo</h1>' +
      "<p>Falha ao carregar <code>" + esc(path) + "</code>" +
      (err && err.message ? " (" + esc(err.message) + ")" : "") + ".</p>" +
      '<p>Abra direto no <a href="' + blobUrlFor(path) +
      '" target="_blank" rel="noopener">GitHub ↗</a>.</p>' +
      '<p><a href="#/' + esc(CFG.defaultPage) + '">← Voltar ao início</a></p></div>';
    $toc.innerHTML = "";
  }

  function showError(page, err) {
    var local = location.protocol === "file:";
    $content.innerHTML =
      '<div class="state"><h1>Página não encontrada</h1>' +
      "<p>Não foi possível carregar <code>content/" +
      esc(page) +
      ".md</code>" +
      (err && err.message ? " (" + esc(err.message) + ")" : "") +
      ".</p>" +
      (local
        ? "<p>Você abriu o arquivo via <code>file://</code>. O navegador bloqueia " +
          "<code>fetch</code> nesse modo — sirva a pasta por HTTP:</p>" +
          "<pre><code>python3 -m http.server -d docs 8080</code></pre>" +
          "<p>e acesse <code>http://localhost:8080</code>.</p>"
        : "<p>Verifique se o arquivo existe e está listado em <code>config.js</code>.</p>") +
      '<p><a href="#/' + esc(CFG.defaultPage) + '">← Voltar ao início</a></p></div>';
    $toc.innerHTML = "";
  }

  /* ---------- Theme ---------- */
  var hljsLight = document.getElementById("hljs-light");
  var hljsDark = document.getElementById("hljs-dark");

  function applyTheme(mode) {
    var dark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    if (hljsLight) hljsLight.disabled = dark;
    if (hljsDark) hljsDark.disabled = !dark;
    document.querySelectorAll(".theme-switch button").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.themeSet === mode);
    });
  }
  function initTheme() {
    var mode = "system";
    try {
      mode = localStorage.getItem("doku-theme") || "system";
    } catch (e) {}
    applyTheme(mode);
    document.querySelectorAll(".theme-switch button").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = b.dataset.themeSet;
        try {
          localStorage.setItem("doku-theme", m);
        } catch (e) {}
        applyTheme(m);
      });
    });
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        var m = "system";
        try {
          m = localStorage.getItem("doku-theme") || "system";
        } catch (e) {}
        if (m === "system") applyTheme("system");
      });
  }

  /* ---------- Search (filter nav) ---------- */
  function initSearch() {
    if (!$search) return;
    $search.addEventListener("input", function () {
      var q = $search.value.trim().toLowerCase();
      var anyOpen = q.length > 0;
      $nav.querySelectorAll(".nav__item").forEach(function (a) {
        if (a.querySelector(".nav__caret")) return; // group header handled below
        var match = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
        a.style.display = match ? "" : "none";
      });
      $nav.querySelectorAll(".nav__group").forEach(function (g) {
        var leaves = g.querySelectorAll(".nav__children .nav__item");
        var visible = 0;
        leaves.forEach(function (l) {
          if (l.style.display !== "none") visible++;
        });
        var header = g.querySelector(":scope > .nav__item");
        var headMatch =
          !q || header.textContent.toLowerCase().indexOf(q) !== -1;
        if (q && (visible > 0 || headMatch)) g.classList.add("is-open");
        g.style.display = visible > 0 || headMatch ? "" : "none";
        header.style.display = headMatch || visible > 0 ? "" : "none";
      });
      $nav.querySelectorAll(".nav__section").forEach(function (s) {
        var items = s.querySelectorAll(".nav__item, .nav__group");
        var anyVisible = false;
        items.forEach(function (it) {
          if (it.style.display !== "none") anyVisible = true;
        });
        s.style.display = anyVisible ? "" : "none";
      });
    });

    // "/" focuses search
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "/" &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
      ) {
        e.preventDefault();
        $search.focus();
      }
      if (e.key === "Escape" && document.activeElement === $search) {
        $search.value = "";
        $search.dispatchEvent(new Event("input"));
        $search.blur();
      }
    });
  }

  /* ---------- Mobile nav ---------- */
  function initMobile() {
    var menu = document.getElementById("menuToggle");
    var backdrop = document.getElementById("backdrop");
    if (menu)
      menu.addEventListener("click", function () {
        document.body.classList.toggle("nav-open");
      });
    if (backdrop) backdrop.addEventListener("click", closeMobileNav);
  }
  function closeMobileNav() {
    document.body.classList.remove("nav-open");
  }

  /* ---------- utils ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Boot ---------- */
  buildNav();
  initTheme();
  initSearch();
  initMobile();
  window.addEventListener("hashchange", loadPage);
  if (!location.hash) location.replace("#/" + CFG.defaultPage);
  loadPage();
})();
