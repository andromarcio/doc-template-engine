#!/usr/bin/env node
// spec-guard.mjs — hook do Claude Code que dá "dentes" ao protocolo de especificação.
// Um único script serve dois eventos (despacha por hook_event_name):
//
//   • PostToolUse  (Write|Edit|MultiEdit) → F2: roda o validador estrutural no artefato
//     recém-gravado; se reprovar, devolve os desvios ao modelo (exit 2) para ele corrigir
//     até sair ✓. Model-agnostic: quem enforça é o harness, não o texto do prompt.
//
//   • UserPromptSubmit → F1: ao detectar intenção de especificar, injeta no contexto um
//     lembrete obrigatório de rodar o preflight e confrontar o que já existe ANTES de gerar.
//
// Filosofia: fail-open. Qualquer erro interno do guard → exit 0 (nunca trava a sessão).
// Configuração em .claude/settings.json (ver README de hooks).

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = join(HERE, '..', 'validate-doc.mjs'); // scripts/validate-doc.mjs
const SEM_VALIDATOR = join(HERE, '..', 'validate-feature-semantics.mjs'); // gate semântico de N3
const N3_PATTERN = /(^|\/)modules\/[^/]+\/[^/]+\/f-[^/]+\.md$/;

// Só validamos artefatos de nível (N0–N3, DATA-MODEL). INDEX, _backlog, prompts,
// scripts, README de projeto etc. passam batido. Padrões espelham LOCATION_RULES do validador.
const ARTIFACT_PATTERNS = [
  /(^|\/)global\/N0_PRODUCT_VISION\.md$/,
  /(^|\/)global\/DATA-MODEL\.md$/,
  /(^|\/)global\/data-models\/[^/]+\.md$/,
  /(^|\/)modules\/[^/]+\/README\.md$/,               // N1
  /(^|\/)modules\/[^/]+\/[^/]+\/README\.md$/,          // N2
  /(^|\/)modules\/[^/]+\/[^/]+\/f-[^/]+\.md$/,         // N3
];

const SPEC_INTENT = /(especific|funcionalidad|feature|\bN1\b|\bN2\b|\bN3\b|feature\s?set|dom[ií]nio|cadastr|\bCRUD\b|requisito|PROMPT_(0|1A|1B|2A|2B|3A|3B|4A|4B))/i;

const readStdin = () => { try { return readFileSync(0, 'utf8'); } catch { return ''; } };

function main() {
  let data = {};
  try { data = JSON.parse(readStdin() || '{}'); } catch { return 0; }
  const event = data.hook_event_name || '';

  if (event === 'PostToolUse') {
    const file = data.tool_input && data.tool_input.file_path;
    if (!file) return 0;
    const path = String(file).replace(/\\/g, '/');
    if (/(^|\/)engine\//.test(path)) return 0;               // templates do motor — isentos
    if (!ARTIFACT_PATTERNS.some((re) => re.test(path))) return 0; // não é artefato de nível
    const problems = [];
    if (existsSync(VALIDATOR)) {                             // validador ausente → fail-open
      const r = spawnSync('node', [VALIDATOR, file], { encoding: 'utf8' });
      if (r.status && r.status !== 0) {
        problems.push(
          'GATE DE ESTRUTURA (validate-doc) reprovou o artefato recém-gravado.\n' +
          'Corrija os desvios abaixo e reescreva o arquivo até o validador sair ✓ ' +
          '(node scripts/validate-doc.mjs <arquivo>).\n\n' +
          `${r.stdout || ''}${r.stderr || ''}`.trim(),
        );
      }
    }
    // Gate SEMÂNTICO de N3: o artefato nomeado como feature é mesmo uma feature?
    // (definição canônica: engine/FEATURE-DEFINITION.md, critérios FD-1…FD-7)
    if (N3_PATTERN.test(path) && existsSync(SEM_VALIDATOR)) {
      const s = spawnSync('node', [SEM_VALIDATOR, file], { encoding: 'utf8' });
      if (s.status && s.status !== 0) {
        problems.push(
          'GATE SEMÂNTICO (validate-feature-semantics) reprovou: o artefato não passa na ' +
          'definição canônica de feature (engine/FEATURE-DEFINITION.md). Corrija os critérios ' +
          'FD abaixo e reescreva até sair ✓ (node scripts/validate-feature-semantics.mjs <arquivo>).\n\n' +
          `${s.stdout || ''}${s.stderr || ''}`.trim(),
        );
      }
    }
    if (problems.length) {
      process.stderr.write(problems.join('\n\n') + '\nNão declare a etapa concluída antes de todos os gates saírem ✓.\n');
      return 2; // feedback ao modelo (não bloqueia a escrita já feita, mas força a correção)
    }
    return 0;
  }

  if (event === 'UserPromptSubmit') {
    const text = String(data.user_input || data.prompt || JSON.stringify(data) || '');
    if (!SPEC_INTENT.test(text)) return 0;
    process.stdout.write(
      '⚠️ PREFLIGHT DE ESPECIFICAÇÃO (obrigatório antes de gerar N1/N2/N3):\n' +
      '1. Rode `node scripts/preflight-spec.mjs <dominio> [feature-set]` e leia o estado atual.\n' +
      '2. Confronte N0 (`global/N0_PRODUCT_VISION.md`) + `modules/INDEX.md` + o N1 do domínio + o N2 do Feature Set.\n' +
      '3. Produza um bloco "Contexto verificado" (o que já existe, IDs tomados, próximo NN livre, ' +
      'regras/campos já canônicos a referenciar) ANTES de especificar — não recrie IDs nem pastas existentes.\n' +
      'Ao gravar, o hook roda `scripts/validate-doc.mjs` e devolve desvios estruturais para você corrigir até sair ✓.\n',
    );
    return 0;
  }

  return 0;
}

try { process.exit(main()); } catch { process.exit(0); }
