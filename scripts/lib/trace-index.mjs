// trace-index.mjs — modelo compartilhado da rastreabilidade história ↔ feature ↔ código.
// Varre uma instância (modules/ + global/) e devolve, em memória, o que está registrado
// nas três fontes do elo:
//
//   1. `## Origem` de cada N3            (feature → histórias)
//   2. `## Rastreabilidade …` de cada    (história → features)
//      `modules/_backlog/[chave].md`
//   3. `## Rastreabilidade: história → spec → código` do `modules/INDEX.md`
//
// Consumido por: audit-trace-links.mjs (consistência), suspect-links.mjs (carimbos
// trace-verified) e build-trace-data.mjs (mapa visual). Determinístico: só leitura
// de disco, sem git e sem rede. Placeholders de template (STRYxxxxxxx, [SIGLA]-…)
// são filtrados pelos próprios regex de ID (exigem dígitos reais).

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

export const STORY_KEY_RE = /\bSTRY\d{4,}\b/i;
export const FEATURE_ID_RE = /\b[A-Z]{3}-[A-Z]{3}-\d{2}\b/;
export const STATUS_ICONS = ['📋', '🔄', '✅', '⚠️', '❌'];
export const STAMP_RE = /<!--\s*trace-verified:\s*(\S+)\s*@\s*([0-9a-f]{7,40})\s*-->/g;

const read = (p) => readFileSync(p, 'utf8');
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

export function normalizeStoryKey(s) {
  const m = String(s || '').match(STORY_KEY_RE);
  return m ? m[0].toUpperCase() : null;
}

// Sobe a partir de `start` até achar a raiz da instância (pasta que contém modules/).
export function findInstanceRoot(start) {
  let dir = resolve(start);
  for (let i = 0; i < 15; i++) {
    if (isDir(join(dir, 'modules'))) return dir;
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}

// Linhas (cruas) da seção cujo título `## …` começa com `prefix`, até o próximo `## `.
// Devolve { start, end, lines } com índices no array original, ou null.
export function sectionSlice(lines, prefix) {
  const start = lines.findIndex((l) => l.trim().startsWith(`## ${prefix}`));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith('## ')) { end = i; break; }
  }
  return { start, end, lines: lines.slice(start + 1, end) };
}

export function splitRow(row) {
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

// Linhas de dados de uma tabela dentro de um slice (sem header e sem separador).
export function tableRowsOf(sliceLines) {
  const rows = sliceLines.map((l) => l.trim()).filter((l) => l.startsWith('|'));
  return rows.filter((r) => !/^\|[\s:|-]+\|$/.test(r)).slice(1);
}

// Links markdown [texto](alvo) de um slice — para checagem de referência quebrada.
export function linksOf(sliceLines) {
  const out = [];
  for (const l of sliceLines) {
    for (const m of l.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) out.push(m[1].trim());
  }
  return out;
}

export function stampsOf(sliceLines) {
  const out = [];
  for (const l of sliceLines) {
    for (const m of l.matchAll(STAMP_RE)) out.push({ target: m[1].toUpperCase(), hash: m[2] });
  }
  return out;
}

export function statusIconOf(cell) {
  for (const icon of STATUS_ICONS) if (String(cell || '').includes(icon)) return icon;
  return null;
}

function firstLine(lines, re) {
  return lines.find((l) => re.test(l)) || null;
}

export function levelId(lines) {
  const line = firstLine(lines, /> \*\*Nível [0-3]\*\*/);
  if (!line) return null;
  const m = line.match(/`([A-Z]{2,6}(?:-[A-Z]{3})?(?:-\d{2})?)`/);
  return m ? m[1] : null;
}

export function titleOf(lines) {
  const line = (firstLine(lines, /^#\s+/) || '').trim();
  const m = line.match(/^#\s+[^:]*:\s*(.+)$/);
  return (m ? m[1] : line.replace(/^#\s+/, '')).trim() || null;
}

function collect(dir, pred, out) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.git' || name === 'engine') continue;
    const p = join(dir, name);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) collect(p, pred, out);
    else if (pred(p)) out.push(p);
  }
}

// Placeholder de template: célula/linha ainda não preenchida.
const isPlaceholderCell = (s) => /\[(chave|dominio|feature|SIGLA|SFS|NN)\b/i.test(s) || /STRYx/i.test(s);

// ---------------------------------------------------------------------------
// Varredura da instância
// ---------------------------------------------------------------------------
export function scanInstance(root) {
  const rel = (p) => relative(root, p).replace(/\\/g, '/');
  const model = { root, features: [], stories: [], index: null, problems: [] };

  // --- N3 (features) --------------------------------------------------------
  const n3Files = [];
  collect(join(root, 'modules'), (p) => /(^|\/)modules\/[^/]+\/[^/]+\/f-[^/]+\.md$/.test(p.replace(/\\/g, '/')), n3Files);
  for (const file of n3Files.sort()) {
    let raw;
    try { raw = read(file); } catch { continue; }
    const lines = raw.split(/\r?\n/);
    const id = levelId(lines);
    const feat = {
      kind: 'feature', id, file, path: rel(file), title: titleOf(lines),
      origem: [], links: [], stamps: [], implRepos: [], statusImpl: null,
    };
    const orig = sectionSlice(lines, 'Origem');
    if (orig) {
      for (const row of tableRowsOf(orig.lines)) {
        const cells = splitRow(row);
        if (!cells.length || isPlaceholderCell(cells[0])) continue;
        const key = normalizeStoryKey(cells[0]);
        if (key) feat.origem.push({ key, tipo: cells[1] || '', note: cells[2] || '' });
      }
      feat.links.push(...linksOf(orig.lines).map((t) => ({ target: t, section: 'Origem' })));
      feat.stamps.push(...stampsOf(orig.lines));
    }
    const impl = sectionSlice(lines, 'Implementação');
    if (impl) {
      for (const row of tableRowsOf(impl.lines)) {
        const cells = splitRow(row);
        const repo = (cells[1] || '').replace(/[`[\]]/g, '').trim();
        if (repo && !/^\[?repo\]?$/i.test(repo) && !isPlaceholderCell(cells[1] || '')) feat.implRepos.push(repo);
      }
      const st = impl.lines.find((l) => /\*\*Status\*\*/.test(l));
      if (st) {
        const m = st.match(/\[x\]\s*(Especificado|Em desenvolvimento|Implementado|Deprecado)/i);
        if (m) feat.statusImpl = m[1];
      }
    }
    model.features.push(feat);
  }

  // --- Histórias (_backlog) --------------------------------------------------
  const backlogDir = join(root, 'modules', '_backlog');
  if (isDir(backlogDir)) {
    for (const name of readdirSync(backlogDir).sort()) {
      if (!name.endsWith('.md') || name.startsWith('_')) continue;
      const file = join(backlogDir, name);
      let raw;
      try { raw = read(file); } catch { continue; }
      const lines = raw.split(/\r?\n/);
      const key = normalizeStoryKey(firstLine(lines, /\*\*Origem\*\*/) || '') || normalizeStoryKey(name);
      const story = {
        kind: 'story', key, file, path: rel(file), title: titleOf(lines),
        feats: [], links: [], stamps: [],
      };
      const rast = sectionSlice(lines, 'Rastreabilidade');
      if (rast) {
        for (const row of tableRowsOf(rast.lines)) {
          const cells = splitRow(row);
          if (!cells.length || isPlaceholderCell(cells[0])) continue;
          const m = cells[0].match(FEATURE_ID_RE);
          if (m) story.feats.push({ id: m[0], status: statusIconOf(cells[2]) });
        }
        story.links.push(...linksOf(rast.lines).map((t) => ({ target: t, section: 'Rastreabilidade' })));
        story.stamps.push(...stampsOf(rast.lines));
      }
      model.stories.push(story);
    }
  }

  // --- INDEX.md ---------------------------------------------------------------
  const indexFile = join(root, 'modules', 'INDEX.md');
  if (existsSync(indexFile)) {
    const lines = read(indexFile).split(/\r?\n/);
    const idx = { file: indexFile, path: rel(indexFile), rows: [], links: [] };
    const sec = sectionSlice(lines, 'Rastreabilidade');
    if (sec) {
      for (const row of tableRowsOf(sec.lines)) {
        const cells = splitRow(row);
        if (!cells.length || isPlaceholderCell(cells[0]) || isPlaceholderCell(cells[1] || '')) continue;
        const key = normalizeStoryKey(cells[0]);
        const fm = (cells[1] || '').match(FEATURE_ID_RE);
        if (key && fm) {
          idx.rows.push({
            key, featId: fm[0], domain: cells[2] || '', status: statusIconOf(cells[3]),
            pf: cells[4] || '', cfp: cells[5] || '',
          });
        }
      }
      idx.links.push(...linksOf(sec.lines).map((t) => ({ target: t, section: 'Rastreabilidade (INDEX)' })));
    }
    model.index = idx;
  }

  return model;
}

// Resolve um alvo de link markdown relativo ao arquivo de origem; devolve
// { target, abs, exists } — alvos http(s) e âncoras puras são ignorados (null).
export function resolveLink(fromFile, target) {
  const t = String(target).trim();
  if (/^(https?:)?\/\//i.test(t) || t.startsWith('#') || t.startsWith('mailto:')) return null;
  if (/[[\]]/.test(t)) return null; // placeholder de template
  const clean = t.split('#')[0];
  if (!clean) return null;
  const abs = resolve(dirname(fromFile), clean);
  return { target: t, abs, exists: existsSync(abs) };
}

// Índices auxiliares
export function featureById(model) {
  const map = new Map();
  for (const f of model.features) if (f.id) map.set(f.id, f);
  return map;
}
export function storyByKey(model) {
  const map = new Map();
  for (const s of model.stories) if (s.key) map.set(s.key, s);
  return map;
}
