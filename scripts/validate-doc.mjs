#!/usr/bin/env node
// validate-doc.mjs — valida a conformidade estrutural de artefatos N1/N2/N3
// gerados pelos PROMPTs 1A / 2A / 3A. Determinístico: independe do modelo/harness
// que produziu o arquivo. O nível é detectado pela linha "**Nível X**" do subtítulo.
//
// Uso:
//   node scripts/validate-doc.mjs <arquivo.md> [outro.md …]
//
// Saída: violações por arquivo. Código 0 se todos passarem; 1 se algum violar;
// 2 em erro de uso.
//
// Notas de calibração (ver CHANGELOG 1.1.0):
//   - N2 é integralmente negocial (prompt único 2A) → lista FECHADA de seções + ordem.
//   - N1 e N3 são compostos por múltiplos prompts (1A+1B; 3A+3B+CONTAGEM) → valida
//     seções OBRIGATÓRIAS presentes + proibições, não lista fechada.
//   - O caractere separador do subtítulo (- vs —) NÃO é enforçado (cosmético e
//     inconsistente no acervo); valida-se só "**Nível X**" + ID em crase.

import { readFileSync } from 'node:fs';

const trunc = (s) => (s.length > 60 ? `${s.slice(0, 60)}…` : s).trim();

function splitRow(row) {
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

// Linhas (cruas) de uma seção `## nome` até o próximo `## `.
function sectionSlice(lines, name) {
  const start = lines.findIndex((l) => l.trim() === `## ${name}`);
  if (start === -1) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith('## ')) break;
    out.push(lines[i]);
  }
  return out;
}

// Linhas de dados de uma tabela numa seção (sem header e sem separador).
function tableRows(lines, name) {
  const slice = sectionSlice(lines, name);
  if (!slice) return [];
  const rows = slice.map((l) => l.trim()).filter((l) => l.startsWith('|'));
  return rows.filter((r) => !/^\|[\s:|-]+\|$/.test(r)).slice(1);
}

// Header (primeira linha `|`) de uma tabela numa seção.
function tableHeader(lines, name) {
  const slice = sectionSlice(lines, name);
  if (!slice) return null;
  const first = slice.map((l) => l.trim()).find((l) => l.startsWith('|'));
  return first ? splitRow(first) : null;
}

function extractMermaid(raw) {
  const m = raw.match(/```mermaid\s*([\s\S]*?)```/);
  return m ? m[1] : null;
}

function parseEdges(mermaid) {
  const edgeRe =
    /([A-Za-z0-9_]+)(?:\[[^\]]*\]|\(\[[^\]]*\]\)|\{[^}]*\}|\([^)]*\))?\s*--+>\s*(?:\|[^|]*\|)?\s*([A-Za-z0-9_]+)/;
  const adj = new Map();
  for (const line of mermaid.split(/\r?\n/)) {
    const m = line.match(edgeRe);
    if (!m) continue;
    const [, from, to] = m;
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
    if (!adj.has(to)) adj.set(to, []);
  }
  return adj;
}

function findCycle(adj) {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map([...adj.keys()].map((n) => [n, WHITE]));
  const stack = [];
  function dfs(node) {
    color.set(node, GRAY);
    stack.push(node);
    for (const next of adj.get(node) || []) {
      if (color.get(next) === GRAY) return [...stack.slice(stack.indexOf(next)), next];
      if (color.get(next) === WHITE) {
        const cyc = dfs(next);
        if (cyc) return cyc;
      }
    }
    stack.pop();
    color.set(node, BLACK);
    return null;
  }
  for (const node of adj.keys()) {
    if (color.get(node) === WHITE) {
      const cyc = dfs(node);
      if (cyc) return cyc;
    }
  }
  return null;
}

const N2_SECTIONS = [
  'Descrição',
  'Features',
  'Fluxo Principal',
  'Dependências entre features',
  'Telas',
  'Permissões por perfil',
  'Changelog',
];

function checkCommon(lines, errors) {
  const titleLine = lines.find((l) => l.trim().startsWith('# '));
  if (!titleLine) errors.push('Falta o título "# …".');
  if (!lines.some((l) => l.trim() === '## Changelog')) errors.push('Falta a seção "## Changelog".');
  return titleLine;
}

function requireSections(lines, names, errors) {
  const present = new Set(lines.filter((l) => /^## /.test(l)).map((l) => l.replace(/^##\s+/, '').trim()));
  const missing = names.filter((n) => !present.has(n));
  if (missing.length) {
    errors.push(`Seção(ões) obrigatória(s) ausente(s): ${missing.map((s) => `"${s}"`).join(', ')}.`);
  }
}

function validateN1(lines, raw, errors) {
  const title = checkCommon(lines, errors);
  if (title && !/^# Domínio: .+/.test(title.trim())) errors.push('Título deve ser "# Domínio: [Nome]".');
  const sub = lines.find((l) => l.trim().startsWith('> **Nível 1**'));
  if (sub && !/`[A-Z]{3}`/.test(sub)) errors.push('Subtítulo N1 sem SIGLA `XXX` (3 maiúsculas) em crase.');
  requireSections(lines, ['Descrição', 'Feature Sets', 'Regras transversais de negócio'], errors);
  if (!lines.some((l) => l.trim() === '### O que este domínio NÃO faz')) {
    errors.push('Falta a subseção "### O que este domínio NÃO faz".');
  }
}

function validateN2(lines, raw, errors) {
  const title = checkCommon(lines, errors);
  if (title && !/^# Feature Set: .+/.test(title.trim())) errors.push('Título deve ser "# Feature Set: [Nome]".');
  const sub = lines.find((l) => l.trim().startsWith('> **Nível 2**'));
  if (sub) {
    if (sub.includes('—')) errors.push('Subtítulo N2 usa em-dash (—); o contrato 2A pede hífen (-).');
    if (!/`[A-Z]{3}-[A-Z]{3}`/.test(sub)) errors.push('Subtítulo N2 sem ID `SIGLA-SFS` em crase.');
  }

  // Lista FECHADA de seções + ordem
  const sections = lines.filter((l) => /^## /.test(l)).map((l) => l.replace(/^##\s+/, '').trim());
  const extras = sections.filter((s) => !N2_SECTIONS.includes(s));
  if (extras.length) errors.push(`Seção(ões) não permitida(s) no N2: ${extras.map((s) => `"${s}"`).join(', ')}.`);
  const missing = N2_SECTIONS.filter((s) => !sections.includes(s));
  if (missing.length) errors.push(`Seção(ões) obrigatória(s) ausente(s): ${missing.map((s) => `"${s}"`).join(', ')}.`);
  const present = sections.filter((s) => N2_SECTIONS.includes(s));
  const expected = N2_SECTIONS.filter((s) => sections.includes(s));
  if (present.join('|') !== expected.join('|')) errors.push('Seções do N2 fora da ordem canônica.');

  if (!/\*\*Não faz\*\*:/.test(raw)) errors.push('Falta a linha "**Não faz**:" na Descrição.');

  for (const row of tableRows(lines, 'Features')) {
    const cells = splitRow(row);
    if (cells.length < 3) continue;
    const [feat, n3] = cells;
    if (!/\*\*.+\*\*\s*<small>[A-Z]{3}-[A-Z]{3}-\d{2}<\/small>/.test(feat)) {
      errors.push(`Feature mal formatada (esperado "**Nome** <small>SIGLA-SFS-NN</small>"): ${trunc(feat)}`);
    }
    if (!/\[[^\]]+\.md\]\([^)]+\.md\)/.test(n3)) {
      errors.push(`Coluna N3 não é link markdown "[f-….md](f-….md)": ${trunc(n3)}`);
    }
  }

  const mermaid = extractMermaid(raw);
  if (!mermaid) {
    errors.push('Fluxo Principal sem bloco ```mermaid```.');
  } else {
    if (!/flowchart\s+TD/.test(mermaid)) errors.push('Mermaid deve usar "flowchart TD".');
    const cyc = findCycle(parseEdges(mermaid));
    if (cyc) errors.push(`Fluxo Principal tem caminho de volta (ciclo): ${cyc.join(' -> ')}.`);
  }

  if (sections.includes('Permissões por perfil')) {
    if (!/Fonte única de permissões/.test(raw)) errors.push('Permissões sem a nota de "Fonte única de permissões".');
    if (!/^Perfis:\s*\*\*/m.test(raw)) errors.push('Permissões sem a linha "Perfis: **…**".');
  }
}

function validateN3(lines, raw, errors) {
  checkCommon(lines, errors);
  const sub = lines.find((l) => l.trim().startsWith('> **Nível 3**'));
  if (sub && !/`[A-Z]{3}-[A-Z]{3}-\d{2}`/.test(sub)) errors.push('Subtítulo N3 sem ID `SIGLA-SFS-NN` em crase.');
  requireSections(
    lines,
    ['Descrição', 'Superfície', 'Regras de negócio', 'Cenários', 'Campos', 'Campos automáticos', 'Comportamento de tela'],
    errors,
  );
  // Anti-vazamento técnico: a tabela de Campos é só Label PO — nunca Label Dev / campo banco.
  const header = tableHeader(lines, 'Campos');
  if (header) {
    if (!header.some((c) => /label po/i.test(c))) errors.push('Tabela "## Campos" sem a coluna "Label PO".');
    if (header.some((c) => /label dev/i.test(c) || /banco/i.test(c))) {
      errors.push('Tabela "## Campos" vaza camada técnica (Label Dev / campo banco) — proibido no N3.');
    }
  }
}

function validate(file) {
  const errors = [];
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);

  const levelLine = lines.find((l) => /> \*\*Nível [123]\*\*/.test(l));
  const level = levelLine ? levelLine.match(/Nível ([123])/)[1] : null;

  if (level === '1') validateN1(lines, raw, errors);
  else if (level === '2') validateN2(lines, raw, errors);
  else if (level === '3') validateN3(lines, raw, errors);
  else errors.push('Nível não detectado (falta o subtítulo "> **Nível 1|2|3**").');

  return { level, errors };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Uso: node scripts/validate-doc.mjs <arquivo.md> [outro.md …]');
  process.exit(2);
}

let failed = 0;
for (const f of files) {
  let res;
  try {
    res = validate(f);
  } catch (e) {
    console.error(`✗ ${f}: erro ao ler — ${e.message}`);
    failed++;
    continue;
  }
  const tag = res.level ? `N${res.level}` : '??';
  if (res.errors.length) {
    failed++;
    console.error(`✗ [${tag}] ${f}`);
    for (const e of res.errors) console.error(`    - ${e}`);
  } else {
    console.log(`✓ [${tag}] ${f}`);
  }
}
process.exit(failed ? 1 : 0);
