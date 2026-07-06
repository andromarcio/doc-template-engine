#!/usr/bin/env node
// validate-doc.mjs — valida a conformidade estrutural de artefatos N0/N1/N2/N3 e do
// DATA-MODEL (índice global + fragmentos de domínio). Determinístico: independe do
// modelo/harness que produziu o arquivo. N0–N3 são detectados pela linha "**Nível X**"
// do subtítulo; o data-model, pelo título "# DATA-MODEL.md" (índice) ou "# Data Model:"
// (fragmento).
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
//   - DATA-MODEL (fragmento): cada entidade exige anotação ALI/AIE + o cabeçalho
//     canônico (Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas) e
//     não pode repetir os campos globais implícitos. Caixa (snake_case/camelCase) NÃO é
//     enforçada aqui — fica para a revisão semântica (PROMPT_REVIEW).
//   - LOCALIZAÇÃO: o tipo detectado precisa bater com a pasta (N3 → modules/<dom>/<fs>/
//     f-*.md; N1/N2 → README.md; N0/DATA-MODEL → global/). Pega o caso do arquivo gerado
//     na pasta errada. Agnóstico ao prefixo da pasta do Feature Set (g- ou sem g-).
//     Isenta o engine/ (templates com nomes de placeholder) e caminhos fora da instância.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

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

const N0_SECTIONS = [
  'Propósito',
  'Proposta de valor',
  'Público-alvo e personas',
  'Objetivos do produto',
  'Métricas de sucesso (KPIs)',
  'Escopo',
  'Domínios previstos (N1)',
  'Tom de voz e princípios de experiência',
  'Restrições e premissas',
];

function validateN0(lines, raw, errors) {
  const title = checkCommon(lines, errors);
  if (title && !/^# Visão de Produto: .+/.test(title.trim())) {
    errors.push('Título deve ser "# Visão de Produto: [Nome]".');
  }
  const sub = lines.find((l) => l.trim().startsWith('> **Nível 0**'));
  if (sub && !/`[A-Z]{2,6}`/.test(sub)) {
    errors.push('Subtítulo N0 sem SIGLA do produto em crase (ex.: `SIGEF`).');
  }
  requireSections(lines, N0_SECTIONS, errors);
  if (!lines.some((l) => l.trim() === '### Está dentro')) {
    errors.push('Falta a subseção "### Está dentro" em "## Escopo".');
  }
  if (!lines.some((l) => l.trim() === '### Está fora (não-objetivos)')) {
    errors.push('Falta a subseção "### Está fora (não-objetivos)" em "## Escopo".');
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

// Feature de pesquisa/listagem? Detecta pelo verbo do título ou pelo prefixo do arquivo
// (verbos de busca no framework: pesquisar, listar, consultar, buscar).
function isSearchFeature(lines, file) {
  const title = (lines.find((l) => l.trim().startsWith('# ')) || '').replace(/^#\s*/, '').trim();
  const verb = (title.split(/\s+/)[0] || '').toLowerCase();
  const byTitle = /^(pesquisar|listar|consultar|buscar)$/.test(verb);
  const byFile = /(^|\/)f-(pesquisar|listar|consultar|buscar)-/.test(String(file || '').replace(/\\/g, '/').toLowerCase());
  return byTitle || byFile;
}

function validateN3(lines, raw, errors, file) {
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
  // Gate de resultado: feature de pesquisa/listagem exige a tabela das colunas do resultado.
  if (isSearchFeature(lines, file)) {
    if (!lines.some((l) => l.trim() === '## Colunas do resultado')) {
      errors.push('Feature de pesquisa/listagem sem a seção "## Colunas do resultado" (tabela dos campos exibidos no resultado da busca).');
    } else {
      const rh = tableHeader(lines, 'Colunas do resultado');
      if (!rh) errors.push('Seção "## Colunas do resultado" sem tabela.');
      else if (!rh.some((c) => /coluna|label po/i.test(c))) {
        errors.push('Tabela "## Colunas do resultado" sem a coluna "Coluna (Label PO)".');
      }
    }
  }
  // Gate de fidelidade: se a Superfície declara "Fidelidade ao protótipo: obrigatória",
  // precisa apontar o caminho do protótipo (prototypes/… ou um link .html).
  const fid = lines.find((l) => /fidelidade ao prot[óo]tipo/i.test(l));
  if (fid && /obrigat[óo]ri/i.test(fid) && !/(prototypes\/|\.html)/i.test(fid)) {
    errors.push('Fidelidade ao protótipo "obrigatória" sem o caminho do protótipo (aponte o arquivo em `prototypes/…`).');
  }
}

// Campos globais implícitos — não devem ser repetidos nas tabelas de entidade.
const DM_GLOBAL_FIELDS = new Set(['id', 'organization_id', 'created_at', 'updated_at', 'deleted_at']);
// Cabeçalho canônico da tabela de campos de uma entidade no fragmento.
const DM_ENTITY_HEADER = ['Label PO', 'Label Dev', 'Campo banco', 'Tipo SQL', 'Obrigatório', 'Notas'];

// Detecta se o arquivo é um data-model (índice global ou fragmento de domínio).
function dataModelKind(titleLine) {
  if (!titleLine) return null;
  const t = titleLine.trim();
  if (/^# DATA-MODEL\.md\b/.test(t)) return 'index';
  if (/^# Data Model:/.test(t)) return 'fragment';
  return null;
}

function validateDataModel(lines, raw, kind, errors) {
  if (kind === 'index') {
    // Índice: só as seções-âncora obrigatórias (a estrutura completa varia por instância).
    requireSections(
      lines,
      ['Convenção de nomenclatura', 'Campos globais (presentes em todas as tabelas)', 'Modelos por domínio'],
      errors,
    );
    return;
  }

  // Fragmento de domínio (global/data-models/[dominio].md).
  const headings = [];
  lines.forEach((l, i) => {
    if (/^## /.test(l)) headings.push({ name: l.replace(/^##\s+/, '').trim(), idx: i });
  });
  const isLogical = (name) => /^Arquivos Lógicos/i.test(name);
  const entities = headings.filter((h) => !isLogical(h.name));

  if (!entities.length) errors.push('Nenhuma entidade (seção "## [Entidade]") encontrada no fragmento.');
  if (!headings.some((h) => isLogical(h.name))) {
    errors.push('Falta a seção "## Arquivos Lógicos deste domínio" (contagem ALI/AIE).');
  }

  for (const ent of entities) {
    const next = headings.find((h) => h.idx > ent.idx);
    const slice = lines.slice(ent.idx + 1, next ? next.idx : lines.length);

    // Anotação de ALI/AIE logo abaixo do título da entidade.
    if (!slice.some((l) => /^>\s*\*\*(ALI|AIE):/.test(l.trim()))) {
      errors.push(`Entidade "${ent.name}" sem anotação de ALI/AIE ("> **ALI: …**").`);
    }

    // Tabela de campos com o cabeçalho canônico.
    const headerRow = slice.map((l) => l.trim()).find((l) => l.startsWith('|'));
    if (!headerRow) {
      errors.push(`Entidade "${ent.name}" sem tabela de campos.`);
      continue;
    }
    const cells = splitRow(headerRow);
    const missing = DM_ENTITY_HEADER.filter((c) => !cells.some((x) => x.toLowerCase() === c.toLowerCase()));
    if (missing.length) {
      errors.push(`Tabela da entidade "${ent.name}" sem coluna(s): ${missing.map((s) => `"${s}"`).join(', ')}.`);
    }

    // Campos globais implícitos não podem ser listados na entidade.
    const bancoIdx = cells.findIndex((x) => /campo banco/i.test(x));
    if (bancoIdx >= 0) {
      const dataRows = slice
        .map((l) => l.trim())
        .filter((l) => l.startsWith('|') && !/^\|[\s:|-]+\|$/.test(l))
        .slice(1);
      for (const row of dataRows) {
        const banco = (splitRow(row)[bancoIdx] || '').trim().toLowerCase();
        if (DM_GLOBAL_FIELDS.has(banco)) {
          errors.push(`Entidade "${ent.name}" repete o campo global "${banco}" (id/organization_id/created_at/updated_at/deleted_at são implícitos — não listar).`);
        }
      }
    }
  }
}

// Variante NEGOCIAL do data-model (usada pelo doc-template-engine-caixa): só a parte
// das ENTIDADES, sem a camada física de banco. Detectada pelo marcador
// "> **Modelo de entidades (negocial)**". Valida a estrutura reduzida e PROÍBE
// vazamento físico (Label Dev / Campo banco / Tipo SQL).
function validateDataModelNegocial(lines, raw, kind, errors) {
  if (kind === 'index') {
    requireSections(lines, ['Modelos por domínio'], errors);
  } else {
    const NON_ENTITY = new Set(['Relacionamentos', 'Enums', 'Changelog']);
    const headings = lines.filter((l) => /^## /.test(l)).map((l) => l.replace(/^##\s+/, '').trim());
    const entities = headings.filter((h) => !NON_ENTITY.has(h));
    if (!entities.length) errors.push('Fragmento negocial sem nenhuma entidade ("## [Entidade]").');
    for (const ent of entities) {
      const header = tableHeader(lines, ent);
      if (!header) { errors.push(`Entidade "${ent}" sem tabela de atributos.`); continue; }
      if (!header.some((c) => /label po/i.test(c) || /atributo/i.test(c))) {
        errors.push(`Tabela da entidade "${ent}" sem a coluna "Label PO"/"Atributo".`);
      }
    }
  }
  // Anti-vazamento físico: o modelo negocial NÃO carrega nomes de banco.
  if (/\bcampo banco\b/i.test(raw)) errors.push('Modelo negocial vaza camada física: "Campo banco" — nomes de banco vivem só no data-model técnico.');
  if (/\btipo sql\b/i.test(raw)) errors.push('Modelo negocial vaza camada física: "Tipo SQL".');
  if (/\blabel dev\b/i.test(raw)) errors.push('Modelo negocial vaza camada física: "Label Dev".');
}

// Local esperado por tipo de artefato (g-/sem-g- agnóstico: a pasta do Feature Set é
// [^/]+, com ou sem prefixo). Ancoradas ao FIM do caminho.
const LOCATION_RULES = {
  N0: { re: /(^|\/)global\/N0_PRODUCT_VISION\.md$/, hint: 'global/N0_PRODUCT_VISION.md' },
  N1: { re: /(^|\/)modules\/[^/]+\/README\.md$/, hint: 'modules/[dominio]/README.md' },
  N2: { re: /(^|\/)modules\/[^/]+\/[^/]+\/README\.md$/, hint: 'modules/[dominio]/[feature-set]/README.md' },
  N3: { re: /(^|\/)modules\/[^/]+\/[^/]+\/f-[^/]+\.md$/, hint: 'modules/[dominio]/[feature-set]/f-….md' },
  DM: { re: /(^|\/)global\/data-models\/[^/]+\.md$/, hint: 'global/data-models/[dominio].md' },
  'DM-idx': { re: /(^|\/)global\/DATA-MODEL\.md$/, hint: 'global/DATA-MODEL.md' },
};

// Guarda determinística de LOCALIZAÇÃO: o tipo do artefato precisa bater com a pasta.
// Só se aplica a artefatos de instância (caminho sob modules/ ou global/) e ISENTA o
// motor (engine/ — onde ficam os templates com nomes de placeholder).
function checkLocation(file, tag, errors) {
  const path = file.replace(/\\/g, '/');
  if (/(^|\/)engine\//.test(path)) return; // templates do engine — isentos
  const instanceScoped = /(^|\/)(modules|global)\//.test(path);
  if (!instanceScoped) return; // arquivo avulso/scratchpad — valida só o conteúdo
  const rule = LOCATION_RULES[tag];
  if (rule && !rule.re.test(path)) {
    errors.push(`Artefato ${tag} em local inesperado: esperado \`${rule.hint}\` (o arquivo não está na pasta correta).`);
  }
}

// --- Cross-artifact: ID duplicado na mesma instância (determinístico) -------
// IDs (SIGLA / SIGLA-SFS / SIGLA-SFS-NN) são únicos e nunca reutilizados. Este
// check varre a instância (modules/ + global/) e reprova se o ID deste artefato
// já aparece em outro. Isenta o engine/ (templates com IDs de placeholder).
function artifactId(lines) {
  const line = lines.find((l) => /> \*\*Nível [0-3]\*\*/.test(l));
  if (!line) return null;
  const m = line.match(/`([A-Z]{2,3}(?:-[A-Z]{3})?(?:-\d{2})?)`/);
  return m ? m[1] : null;
}
function instanceRoot(file) {
  let dir = dirname(resolve(file));
  for (let i = 0; i < 15; i++) {
    if (existsSync(join(dir, 'modules')) || existsSync(join(dir, 'global'))) return dir;
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}
function collectMd(dir, out) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.git' || name === 'engine') continue;
    const p = join(dir, name);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) collectMd(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
}
function checkDuplicateId(file, id, errors) {
  const abs = resolve(file).replace(/\\/g, '/');
  if (/(^|\/)engine\//.test(abs) || !id) return; // templates isentos / sem ID detectável
  const root = instanceRoot(file);
  if (!root) return;
  const found = [];
  for (const d of ['modules', 'global']) collectMd(join(root, d), found);
  const clashes = [];
  for (const f of found) {
    if (resolve(f).replace(/\\/g, '/') === abs) continue;
    try {
      if (artifactId(readFileSync(f, 'utf8').split(/\r?\n/)) === id) {
        clashes.push(resolve(f).replace(/\\/g, '/').replace(`${root.replace(/\\/g, '/')}/`, ''));
      }
    } catch { /* arquivo ilegível — ignora */ }
  }
  if (clashes.length) {
    errors.push(`ID "${id}" duplicado — já usado em: ${clashes.join(', ')} (IDs são únicos e não se reutilizam).`);
  }
}

function validate(file) {
  const errors = [];
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);

  const levelLine = lines.find((l) => /> \*\*Nível [0123]\*\*/.test(l));
  const level = levelLine ? levelLine.match(/Nível ([0123])/)[1] : null;
  const titleLine = lines.find((l) => l.trim().startsWith('# '));
  const dmKind = dataModelKind(titleLine);

  if (level === '0') validateN0(lines, raw, errors);
  else if (level === '1') validateN1(lines, raw, errors);
  else if (level === '2') validateN2(lines, raw, errors);
  else if (level === '3') validateN3(lines, raw, errors, file);
  else if (dmKind) {
    if (/Modelo de entidades \(negocial\)/.test(raw)) validateDataModelNegocial(lines, raw, dmKind, errors);
    else validateDataModel(lines, raw, dmKind, errors);
  }
  else errors.push('Tipo não detectado (falta o subtítulo "> **Nível 0|1|2|3**" ou o título "# Data Model: …").');

  const tag = level ? `N${level}` : dmKind ? (dmKind === 'index' ? 'DM-idx' : 'DM') : '??';
  if (tag !== '??') checkLocation(file, tag, errors);
  if (['1', '2', '3'].includes(level)) checkDuplicateId(file, artifactId(lines), errors);
  return { tag, errors };
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
  const tag = res.tag;
  if (res.errors.length) {
    failed++;
    console.error(`✗ [${tag}] ${f}`);
    for (const e of res.errors) console.error(`    - ${e}`);
  } else {
    console.log(`✓ [${tag}] ${f}`);
  }
}
process.exit(failed ? 1 : 0);
