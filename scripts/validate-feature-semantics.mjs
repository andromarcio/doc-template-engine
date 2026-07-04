#!/usr/bin/env node
// validate-feature-semantics.mjs — gate SEMÂNTICO determinístico de N3: verifica se o
// artefato é mesmo uma FEATURE segundo a definição canônica (engine/FEATURE-DEFINITION.md,
// critérios FD-1…FD-7). Complementa o validate-doc.mjs (estrutura): lá se checa se as
// seções existem; aqui, se o que foi nomeado como feature é uma ação atômica com
// resultado observável — sem LLM, independe do modelo/harness que produziu o arquivo.
//
// O vocabulário (verbos canônicos + termos bloqueados) NÃO vive neste script: é lido
// das tabelas máquina-legíveis do FEATURE-DEFINITION.md — fonte única; estender o
// vocabulário é editar a tabela, não o código.
//
// Uso:
//   node scripts/validate-feature-semantics.mjs <modules/.../f-….md> [outro.md …]
//
// Saída: erros (reprovam) e avisos (não reprovam) por arquivo. Código 0 se todos
// passarem (avisos permitidos); 1 se algum reprovar; 2 em erro de uso/configuração.
//
// Checks (IDs espelham a tabela de critérios do FEATURE-DEFINITION.md):
//   FD-1  primeiro segmento do arquivo é verbo no infinitivo (canônico → ✓; forma de
//         infinitivo não catalogada → aviso; termo bloqueado ou não-verbo → erro)
//   FD-2  título começa com o MESMO verbo do arquivo (acentos ignorados)
//   FD-3  atomicidade: nome/título não encadeiam dois verbos canônicos
//   FD-4  termo bloqueado na posição do verbo (agrupador/nominalização/artefato/NFR)
//         → erro com o encaminhamento da tabela
//   FD-5  (via FD-4) não é campo/regra/tela/mensagem/NFR nomeado como feature
//   FD-6  resultado observável: ## Cenários com ≥1 cenário Gherkin e todo cenário
//         com Então/Then; coerência entidade↔título/descrição (aviso)
//   FD-7  regras são invariantes: nenhum item de ## Regras de negócio carrega reação
//         do sistema ("não salva", "exibe mensagem", "conforme o Design System")

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const norm = (s) =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const trunc = (s) => (s.length > 70 ? `${s.slice(0, 70)}…` : s).trim();

// ---------------------------------------------------------------- vocabulário
// Localiza o FEATURE-DEFINITION.md: primeiro relativo ao script (repo do engine ou
// instância que embarca engine/), senão subindo a partir do arquivo validado.
function findDefinition(sampleFile) {
  const local = join(HERE, '..', 'engine', 'FEATURE-DEFINITION.md');
  if (existsSync(local)) return local;
  let dir = dirname(resolve(sampleFile));
  for (let i = 0; i < 15; i++) {
    const cand = join(dir, 'engine', 'FEATURE-DEFINITION.md');
    if (existsSync(cand)) return cand;
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}

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

function tableFirstCells(lines, name) {
  const slice = sectionSlice(lines, name);
  if (!slice) return null;
  const rows = slice
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && !/^\|[\s:|-]+\|$/.test(l))
    .slice(1); // sem o header
  return rows.map((r) => {
    const cells = r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    return cells.map((c) => c.replace(/`/g, ''));
  });
}

function loadVocabulary(sampleFile) {
  const defFile = findDefinition(sampleFile);
  if (!defFile) return { error: 'engine/FEATURE-DEFINITION.md não encontrado (fonte do vocabulário).' };
  const lines = readFileSync(defFile, 'utf8').split(/\r?\n/);
  const verbRows = tableFirstCells(lines, 'Vocabulário de verbos canônicos');
  const blockRows = tableFirstCells(lines, 'Termos bloqueados na posição do verbo');
  if (!verbRows || !verbRows.length) {
    return { error: `Seção "## Vocabulário de verbos canônicos" ausente/vazia em ${defFile}.` };
  }
  if (!blockRows || !blockRows.length) {
    return { error: `Seção "## Termos bloqueados na posição do verbo" ausente/vazia em ${defFile}.` };
  }
  const verbs = new Set(verbRows.map((c) => norm(c[0])));
  const blocked = new Map(blockRows.map((c) => [norm(c[0]), { what: c[1] || '?', where: c[2] || '?' }]));
  return { verbs, blocked, defFile };
}

// ------------------------------------------------------------------- helpers
// Forma de infinitivo pt-BR (heurística p/ verbo ainda não catalogado → aviso).
const looksInfinitive = (t) => /^[a-z]{2,}(ar|er|ir)$/.test(t);

const stripHtmlComments = (raw) => raw.replace(/<!--[\s\S]*?-->/g, '');

function titleOf(lines) {
  const l = lines.find((x) => x.trim().startsWith('# '));
  return l ? l.trim().replace(/^#\s*/, '').trim() : null;
}

// Palavras "de conteúdo" do título (sem pontuação/markdown).
const titleWords = (title) =>
  norm(title).replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean);

// Padrões de REAÇÃO do sistema dentro de regra de negócio (regra absoluta #9:
// regra é invariante; reação é cenário).
const REACTION_PATTERNS = [
  /exib\w*[^.;]{0,40}\b(mensagem|erro|toast|alerta|aviso)\b/i,
  /\bmostra\w*[^.;]{0,40}\b(mensagem|erro|toast|alerta|aviso)\b/i,
  /\bmensagem\s+de\s+(erro|sucesso|valida)/i,
  /conforme\s+o\s+design\s+system/i,
  /n[ãa]o\s+(salva|grava|deixa\s+salvar|permite\s+salvar)\b/i,
  /bloqueia\s+(o\s+)?(bot[ãa]o|salvamento|a\s+tela)/i,
  /\btoast\b/i,
];

// Cenários do(s) bloco(s) gherkin de uma seção: [{ name, hasThen }].
function gherkinScenarios(sectionLines) {
  if (!sectionLines) return null;
  const text = sectionLines.join('\n');
  const blocks = [...text.matchAll(/```gherkin\s*([\s\S]*?)```/g)].map((m) => m[1]);
  if (!blocks.length) return null;
  const scenarios = [];
  for (const block of blocks) {
    let current = null;
    for (const line of block.split(/\r?\n/)) {
      const s = line.trim();
      const m = s.match(/^(?:Scenario(?:\s+Outline)?|Cen[aá]rio|Esquema do Cen[aá]rio)\s*:\s*(.*)$/i);
      if (m) {
        if (current) scenarios.push(current);
        current = { name: m[1] || '(sem nome)', hasThen: false };
        continue;
      }
      if (current && /^(Then|Ent[aã]o)\b/i.test(s)) current.hasThen = true;
    }
    if (current) scenarios.push(current);
  }
  return scenarios;
}

// ------------------------------------------------------------------ validação
function validate(file, vocab) {
  const errors = [];
  const warnings = [];
  const raw = stripHtmlComments(readFileSync(file, 'utf8'));
  const lines = raw.split(/\r?\n/);

  // Só N3 (detecção idêntica ao validate-doc). Outros artefatos passam batido.
  if (!lines.some((l) => /> \*\*Nível 3\*\*/.test(l))) return { skip: true, errors, warnings };

  const { verbs, blocked } = vocab;

  // --- FD-1/FD-4 — nome do arquivo -------------------------------------------
  const base = basename(file);
  const slugMatch = base.match(/^f-(.+)\.md$/);
  let fileVerb = null;
  let entityTokens = [];
  if (!slugMatch) {
    errors.push(`[FD-1] Arquivo "${base}" fora do padrão \`f-[verbo]-[entidade].md\`.`);
  } else {
    const tokens = slugMatch[1].split('-').filter(Boolean);
    fileVerb = norm(tokens[0] || '');
    entityTokens = tokens.slice(1);
    if (blocked.has(fileVerb)) {
      const b = blocked.get(fileVerb);
      errors.push(
        `[FD-4] "${fileVerb}" na posição do verbo não nomeia uma feature — provavelmente é ${b.what}. Encaminhamento: ${b.where}.`,
      );
    } else if (!verbs.has(fileVerb)) {
      if (looksInfinitive(fileVerb)) {
        warnings.push(
          `[FD-1] Verbo "${fileVerb}" não consta do vocabulário canônico (engine/FEATURE-DEFINITION.md). Se é mesmo uma ação de negócio, adicione-o à tabela de verbos.`,
        );
      } else {
        errors.push(
          `[FD-1] Primeiro segmento "${fileVerb}" não é um verbo no infinitivo — o nome da feature é \`f-[verbo]-[entidade]\` (ex.: f-cadastrar-cliente).`,
        );
      }
    }
    if (!entityTokens.length) {
      errors.push('[FD-1] Nome sem entidade após o verbo — a feature é um verbo + UMA entidade (`f-[verbo]-[entidade]`).');
    }
    // FD-3 — dois verbos canônicos no slug = duas ações num arquivo só.
    const slugVerbs = tokens.map(norm).filter((t) => verbs.has(t));
    if (new Set(slugVerbs).size > 1) {
      errors.push(
        `[FD-3] Nome encadeia mais de uma ação (${[...new Set(slugVerbs)].join(', ')}) — cada verbo é uma feature própria (um N3 por ação).`,
      );
    }
  }

  // --- FD-2/FD-3/FD-4 — título ------------------------------------------------
  const title = titleOf(lines);
  if (!title) {
    errors.push('[FD-2] Sem título "# …" para verificar a ação.');
  } else {
    const words = titleWords(title);
    const first = words[0] || '';
    if (blocked.has(first)) {
      const b = blocked.get(first);
      errors.push(
        `[FD-4] Título "${trunc(title)}" começa com "${first}" — provavelmente é ${b.what}, não uma feature. Encaminhamento: ${b.where}.`,
      );
    } else if (fileVerb && first && first !== fileVerb) {
      errors.push(
        `[FD-2] Verbo do título ("${first}") difere do verbo do arquivo ("${fileVerb}") — título e arquivo contam a mesma ação.`,
      );
    } else if (first && !verbs.has(first) && !looksInfinitive(first)) {
      errors.push(
        `[FD-2] Título "${trunc(title)}" não começa com verbo no infinitivo — o nome de uma feature é "[Verbo] [entidade]" (ex.: "Cadastrar cliente").`,
      );
    }
    const titleVerbs = [...new Set(words.filter((w) => verbs.has(w)))];
    if (titleVerbs.length > 1) {
      errors.push(
        `[FD-3] Título encadeia mais de uma ação (${titleVerbs.join(', ')}) — se cada parte entrega valor sozinha, são features separadas.`,
      );
    }
    // FD-6 (coerência, aviso) — a entidade do arquivo aparece no título/descrição?
    if (entityTokens.length) {
      const ent = norm(entityTokens[0]);
      const desc = sectionSlice(lines, 'Descrição') || [];
      const hay = norm([title, ...desc].join(' '));
      const stems = [ent, ent.replace(/s$/, ''), ent.length > 5 ? ent.slice(0, ent.length - 2) : ent];
      if (!stems.some((s) => s && hay.includes(s))) {
        warnings.push(
          `[FD-6] Entidade do arquivo ("${entityTokens.join(' ')}") não aparece no título nem na Descrição — confirme se o nome do arquivo e o conteúdo falam da mesma coisa.`,
        );
      }
    }
  }

  // --- FD-6 — resultado observável (Cenários com Então/Then) ------------------
  const cen = sectionSlice(lines, 'Cenários');
  const scenarios = gherkinScenarios(cen);
  if (!cen || scenarios === null) {
    errors.push('[FD-6] Sem bloco ```gherkin``` em "## Cenários" — sem cenário não há resultado observável (e sem resultado observável não há feature).');
  } else if (!scenarios.length) {
    errors.push('[FD-6] Bloco gherkin sem nenhum "Scenario:" — descreva ao menos o caminho feliz com resultado observável.');
  } else {
    for (const sc of scenarios.filter((s) => !s.hasThen)) {
      errors.push(`[FD-6] Cenário sem "Então/Then" (resultado observável): "${trunc(sc.name)}".`);
    }
  }

  // --- FD-7 — regras são invariantes (sem cauda de reação) --------------------
  const rules = sectionSlice(lines, 'Regras de negócio') || [];
  for (const line of rules) {
    const hit = REACTION_PATTERNS.find((re) => re.test(line));
    if (hit) {
      errors.push(
        `[FD-7] Regra carrega REAÇÃO do sistema ("${trunc(line)}") — regra é invariante ("o quê"); a reação (mensagem/bloqueio) vira cenário em "## Cenários".`,
      );
    }
  }

  return { skip: false, errors, warnings };
}

// ------------------------------------------------------------------------ CLI
const files = process.argv.slice(2);
if (!files.length) {
  console.error('Uso: node scripts/validate-feature-semantics.mjs <f-….md> [outro.md …]');
  process.exit(2);
}

const vocab = loadVocabulary(files[0]);
if (vocab.error) {
  console.error(`✗ configuração: ${vocab.error}`);
  process.exit(2);
}

let failed = 0;
for (const f of files) {
  const path = resolve(f).replace(/\\/g, '/');
  if (/(^|\/)engine\//.test(path)) {
    console.log(`- [N3-sem] ${f}: engine/ (template) — isento.`);
    continue;
  }
  let res;
  try {
    res = validate(f, vocab);
  } catch (e) {
    console.error(`✗ ${f}: erro ao ler — ${e.message}`);
    failed++;
    continue;
  }
  if (res.skip) {
    console.log(`- [N3-sem] ${f}: não é N3 — fora do escopo deste gate.`);
    continue;
  }
  if (res.errors.length) {
    failed++;
    console.error(`✗ [N3-sem] ${f}`);
    for (const e of res.errors) console.error(`    - ${e}`);
  } else {
    console.log(`✓ [N3-sem] ${f}`);
  }
  for (const w of res.warnings) console.error(`    ! ${w}`);
}
process.exit(failed ? 1 : 0);
