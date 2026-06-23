#!/usr/bin/env bash
#
# stamp.sh — insere ou atualiza o carimbo de versão (invisível) num artefato.
#
# O carimbo é um comentário HTML na primeira linha do arquivo:
#   <!-- doc-template-engine: 1.0.0 | prompt: PROMPT_3A | atualizado: 2026-06-23 -->
# Invisível no documento renderizado (PDF/HTML/preview), legível só no source .md.
# Ver engine/VERSIONING.md.
#
set -euo pipefail

ENGINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<EOF
Uso: $0 <arquivo.md> <PROMPT_ID>

Lê a versão de $ENGINE_DIR/VERSION e grava (ou reescreve) o carimbo na
primeira linha de <arquivo.md>. Idempotente: rodar de novo só atualiza versão/data.

Exemplo:
  $0 ../simpf-doc/modules/cadastro/clientes/f-cadastrar-cliente.md PROMPT_3A
EOF
}

if [[ $# -ne 2 || "$1" =~ ^(-h|--help)$ ]]; then
  usage
  [[ "${1:-}" =~ ^(-h|--help)$ ]] && exit 0 || exit 1
fi

FILE="$1"
PROMPT_ID="$2"

if [[ ! -f "$ENGINE_DIR/VERSION" ]]; then
  echo "erro: $ENGINE_DIR/VERSION não encontrado" >&2
  exit 1
fi
if [[ ! -f "$FILE" ]]; then
  echo "erro: arquivo '$FILE' não existe" >&2
  exit 1
fi

VERSION="$(tr -d '[:space:]' < "$ENGINE_DIR/VERSION")"
TODAY="$(date +%F)"
STAMP="<!-- doc-template-engine: ${VERSION} | prompt: ${PROMPT_ID} | atualizado: ${TODAY} -->"

tmp="$(mktemp)"
if head -n 1 "$FILE" | grep -q '^<!-- doc-template-engine:'; then
  # Reescreve o carimbo existente, preserva o resto.
  printf '%s\n' "$STAMP" > "$tmp"
  tail -n +2 "$FILE" >> "$tmp"
  echo "carimbo atualizado → $FILE"
else
  # Insere carimbo no topo.
  printf '%s\n' "$STAMP" > "$tmp"
  cat "$FILE" >> "$tmp"
  echo "carimbo inserido → $FILE"
fi
cat "$tmp" > "$FILE"
rm -f "$tmp"
