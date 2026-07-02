#!/usr/bin/env node
// apply-spec-protocol.mjs — ferramenta de manutenção do engine.
// Insere (idempotente) o CALLOUT do "Protocolo obrigatório de sessão" (F1 preflight +
// F2 autovalidação) no topo de cada prompt de ESPECIFICAÇÃO, logo abaixo do cabeçalho
// "## INSTRUÇÕES PARA O CLAUDE". Serve o caminho copiar-colar/CLI (onde o SKILL e os
// hooks não são carregados): a instrução viaja dentro do próprio prompt.
//
// Uso (a partir da raiz do repo):  node scripts/apply-spec-protocol.mjs
// Mexeu no CALLOUT abaixo? rode de novo em cada repo — reinsere só onde ainda não há
// (detecta pelo SENTINELA). Só toca nos prompts que existem no repo (respeita o escopo
// reduzido do -caixa, que não tem os prompts técnicos B).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ANCHOR = '## INSTRUÇÕES PARA O CLAUDE';
const SENTINEL = 'Protocolo obrigatório desta sessão (F1 preflight';

const CALLOUT = [
  '> **Protocolo obrigatório desta sessão (F1 preflight · F2 autovalidação):**',
  '> 1. **Antes de gerar** — rode `node scripts/preflight-spec.mjs [dominio] [feature-set]` (ou, sem disco, leia o N0 + `modules/INDEX.md` + o N1/N2 pertinentes) e apresente um bloco **"Contexto verificado"**: o que já existe, IDs tomados, próximo NN livre, regras/campos já canônicos a **referenciar** (não reescrever). Não duplique ID/pasta/regra/campo existente.',
  '> 2. **Depois de gravar** — rode `node scripts/validate-doc.mjs <arquivo>`; se reprovar, **apresente os desvios, corrija e repita até `✓`**. Nunca conclua com o validador reprovando.',
  '> *(No Claude Code os hooks em `.claude/settings.json` já enforçam isso automaticamente.)*',
].join('\n');

// Prompts de especificação (geram artefatos N0–N3 / data-model). Exclui o 2B (tombstone
// "não é mais necessário") e os prompts de execução da esteira (não geram artefatos de nível).
const TARGETS = [
  'PROMPT_N0_VISAO',
  'PROMPT_N0_VISAO_PRODUTO', // variante do desenvolve-ai
  'PROMPT_1A_N1_negocio',
  'PROMPT_1B_N1_tecnico',
  'PROMPT_2A_N2_negocio',
  'PROMPT_3A_N3_negocio',
  'PROMPT_3B_N3_tecnico',
  'PROMPT_4A_N3_UPDATE_negocio',
  'PROMPT_4B_N3_UPDATE_tecnico',
  'PROMPT_CRUD',
  'PROMPT_WIZARD',
];

const dir = join(process.cwd(), 'engine', 'prompts');
const report = [];
for (const base of TARGETS) {
  const file = join(dir, `${base}.md`);
  if (!existsSync(file)) { continue; } // não existe neste repo — pula em silêncio
  let content = readFileSync(file, 'utf8');
  if (content.includes(SENTINEL)) { report.push(`skip  ${base}.md (já tem o protocolo)`); continue; }
  if (!content.includes(ANCHOR)) { report.push(`⚠ AUSÊNCIA de âncora em ${base}.md (não inserido)`); continue; }
  content = content.replace(ANCHOR, (m) => `${m}\n\n${CALLOUT}`);
  writeFileSync(file, content);
  report.push(`ok    ${base}.md (protocolo inserido)`);
}
console.log(report.length ? report.join('\n') : 'nenhum prompt-alvo encontrado em engine/prompts/');
