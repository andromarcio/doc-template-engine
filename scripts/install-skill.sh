#!/usr/bin/env bash
#
# install-skill.sh — instala as skills do doc-template-engine numa instância
# de documentação (ou no diretório pessoal do Claude Code).
#
# O Claude Code (CLI, VS Code, JetBrains) só descobre skills automaticamente em:
#   - <repo-aberto>/.claude/skills/   (skills do projeto)
#   - ~/.claude/skills/               (skills pessoais, valem para todo projeto)
#
# A skill `analista-requisitos` vive no doc-template-engine. Para que o Claude a
# acione numa instância (ex.: simpf-doc), ela precisa estar fisicamente numa
# dessas pastas. Este script faz essa cópia.
#
set -euo pipefail

ENGINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ENGINE_DIR/.claude/skills"

usage() {
  cat <<EOF
Uso:
  $0 <caminho-da-instância>   instala em <caminho>/.claude/skills/
  $0 --user                   instala em ~/.claude/skills/ (todos os projetos)

Copia as skills do doc-template-engine para onde o Claude Code as descobre
automaticamente, de modo que ele possa acioná-las (ex.: a skill
'analista-requisitos' ao falar de especificação de requisitos, N0–N3, CRUD…).

Exemplos:
  $0 ../simpf-doc      # instala como skill do projeto simpf-doc
  $0 --user            # instala para todos os projetos da sua máquina
EOF
}

if [[ $# -ne 1 || "$1" == "-h" || "$1" == "--help" ]]; then
  usage
  exit "$([[ "${1:-}" =~ ^(-h|--help)$ ]] && echo 0 || echo 1)"
fi

if [[ ! -d "$SRC" ]]; then
  echo "erro: não encontrei as skills em $SRC" >&2
  exit 1
fi

if [[ "$1" == "--user" ]]; then
  DEST="$HOME/.claude/skills"
else
  INSTANCE="$1"
  if [[ ! -d "$INSTANCE" ]]; then
    echo "erro: instância '$INSTANCE' não é um diretório" >&2
    exit 1
  fi
  DEST="$INSTANCE/.claude/skills"
fi

mkdir -p "$DEST"

# Copia cada skill, sobrescrevendo versões antigas (a engine é a fonte de verdade).
for skill_dir in "$SRC"/*/; do
  name="$(basename "$skill_dir")"
  rm -rf "${DEST:?}/$name"
  cp -R "$skill_dir" "$DEST/$name"
  echo "  ✓ $name → $DEST/$name"
done

echo
echo "Skills instaladas. No Claude Code, abra o repositório de destino e confira"
echo "com '/' no chat (ou 'ls $DEST') — 'analista-requisitos' deve aparecer."
