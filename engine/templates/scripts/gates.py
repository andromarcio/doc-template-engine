#!/usr/bin/env python3
"""Esteira de checkpoints (gates) do doc-template.

Lê o front-matter YAML dos N3 (features) e governa a máquina de estados do ciclo
de vida de cada requisito — da especificação ao código. Cada *gate* é um
checkpoint humano; a próxima etapa só é permitida quando a anterior foi aprovada.

Fonte de verdade: o bloco `gates` no front-matter de cada N3. O campo `estado`
é DERIVADO desses gates (e verificado, não mantido à mão). O `modules/INDEX.md`
é apenas um ESPELHO regenerado a partir dos N3 — mesma filosofia das demais
seções geradas do framework (Pendências, Contagem-PF).

Subcomandos
-----------
  check     valida, num Pull Request, que nenhum gate foi pulado e que a
            transição é legal (uso típico: workflow gate-check.yml).
  status    imprime a esteira (readiness) de todas as features em stdout.
  promote   regenera a seção de gates do INDEX.md a partir dos N3
            (com --write, grava o arquivo; uso típico: promote-estado.yml).

Sem dependências além de PyYAML (pré-instalado nos runners; senão
`pip install pyyaml`). Python 3.8+.
"""
from __future__ import annotations

import argparse
import glob
import os
import subprocess
import sys

try:
    import yaml
except ImportError:  # pragma: no cover - orientação amigável
    sys.stderr.write(
        "ERRO: PyYAML não encontrado. Instale com 'pip install pyyaml'.\n"
    )
    sys.exit(2)

# ── Modelo da máquina de estados ────────────────────────────────────────────

# Ordem dos checkpoints. Um gate só pode ser aprovado depois do anterior.
GATE_ORDER = ["requisitos", "modelo-dados", "testes", "codigo"]

# Checkpoint → estado alcançado quando ele é aprovado.
GATE_TO_ESTADO = {
    "requisitos": "requisitos-aprovados",
    "modelo-dados": "modelo-validado",
    "testes": "especificado",
    "codigo": "implementado",
}

# Estados manuais (não derivados de gates) que o autor pode declarar.
ESTADOS_MANUAIS = {"em-desenvolvimento", "revisao-necessaria", "deprecado"}

# Estado → ícone (legenda do INDEX.md).
ICONES = {
    "rascunho": "✏️",
    "requisitos-aprovados": "📝",
    "modelo-validado": "🧱",
    "especificado": "📋",
    "em-desenvolvimento": "🔄",
    "implementado": "✅",
    "revisao-necessaria": "⚠️",
    "deprecado": "❌",
}

# Marcadores da seção gerada no INDEX.md.
MARK_INI = "<!-- GATES:INICIO -->"
MARK_FIM = "<!-- GATES:FIM -->"


# ── Parsing de front-matter ─────────────────────────────────────────────────


def parse_front_matter(text: str):
    """Devolve (meta: dict | None) do front-matter YAML no topo do texto."""
    if not text.startswith("---"):
        return None
    # separa o primeiro bloco --- ... ---
    parts = text.split("\n")
    if parts[0].strip() != "---":
        return None
    for i in range(1, len(parts)):
        if parts[i].strip() == "---":
            raw = "\n".join(parts[1:i])
            try:
                meta = yaml.safe_load(raw)
            except yaml.YAMLError:
                return None
            return meta if isinstance(meta, dict) else None
    return None


def has_gates(meta) -> bool:
    return isinstance(meta, dict) and isinstance(meta.get("gates"), dict)


def gate_aprovado(meta, gate: str) -> bool:
    g = meta.get("gates", {}).get(gate)
    return bool(g and g.get("aprovado") is True)


def derivar_estado(meta) -> str:
    """Estado derivado puramente dos gates aprovados, na ordem."""
    estado = "rascunho"
    for gate in GATE_ORDER:
        if gate_aprovado(meta, gate):
            estado = GATE_TO_ESTADO[gate]
        else:
            break
    return estado


def estado_de_exibicao(meta) -> str:
    """Estado mostrado no INDEX: respeita o manual se declarado, senão deriva."""
    declarado = meta.get("estado")
    if declarado in ESTADOS_MANUAIS:
        return declarado
    return derivar_estado(meta)


def proximo_checkpoint(meta) -> str:
    for gate in GATE_ORDER:
        if not gate_aprovado(meta, gate):
            return gate
    return ""  # todos aprovados


# ── Descoberta de arquivos ──────────────────────────────────────────────────


def _ignorar(path: str) -> bool:
    norm = path.replace("\\", "/")
    return "/_template" in norm or os.path.basename(norm).startswith("_template")


def listar_n3(root: str):
    """Todos os .md sob modules/ que tenham um bloco `gates` no front-matter."""
    achados = []
    padrao = os.path.join(root, "modules", "**", "*.md")
    for path in sorted(glob.glob(padrao, recursive=True)):
        if _ignorar(path):
            continue
        try:
            with open(path, encoding="utf-8") as fh:
                meta = parse_front_matter(fh.read())
        except OSError:
            continue
        if has_gates(meta):
            achados.append((path, meta))
    return achados


# ── git helpers (usados pelo check) ─────────────────────────────────────────


def _git(args):
    return subprocess.run(
        ["git", *args], capture_output=True, text=True
    )


def arquivos_alterados(base: str):
    r = _git(["diff", "--name-only", "--diff-filter=d", f"{base}...HEAD"])
    if r.returncode != 0:
        return None  # sem git/base: o chamador decide o fallback
    return [l for l in r.stdout.splitlines() if l.strip()]


def meta_no_ref(ref: str, path: str):
    r = _git(["show", f"{ref}:{path}"])
    if r.returncode != 0:
        return None  # arquivo novo neste PR
    return parse_front_matter(r.stdout)


def meta_no_disco(path: str):
    try:
        with open(path, encoding="utf-8") as fh:
            return parse_front_matter(fh.read())
    except OSError:
        return None


# ── check ───────────────────────────────────────────────────────────────────


def validar_estrutura(meta, rotulo, erros):
    gates = meta.get("gates", {})
    for gate in GATE_ORDER:
        if gate not in gates:
            erros.append(f"{rotulo}: gate '{gate}' ausente no front-matter.")
        elif not isinstance(gates[gate], dict) or "aprovado" not in gates[gate]:
            erros.append(f"{rotulo}: gate '{gate}' sem campo 'aprovado'.")


def validar_prefixo(meta, rotulo, erros):
    """Gates aprovados devem formar um prefixo contíguo (sem pular etapa)."""
    visto_falso = False
    for gate in GATE_ORDER:
        if gate_aprovado(meta, gate):
            if visto_falso:
                erros.append(
                    f"{rotulo}: gate '{gate}' aprovado, mas um anterior não está. "
                    "Os checkpoints devem ser aprovados em ordem."
                )
        else:
            visto_falso = True


def validar_estado(meta, rotulo, erros):
    declarado = meta.get("estado")
    derivado = derivar_estado(meta)
    if declarado in ESTADOS_MANUAIS:
        if declarado == "em-desenvolvimento" and derivado != "especificado":
            erros.append(
                f"{rotulo}: estado 'em-desenvolvimento' exige que os gates "
                "requisitos+modelo-dados+testes estejam aprovados (estado "
                f"derivado atual: '{derivado}')."
            )
        return
    if declarado != derivado:
        erros.append(
            f"{rotulo}: campo 'estado' é '{declarado}', mas o derivado dos gates "
            f"é '{derivado}'. Ajuste 'estado' para '{derivado}'."
        )


def validar_transicao(after, before, rotulo, erros):
    """A transição deste PR é legal? (no máximo 1 gate novo, predecessor já na base)."""
    novos = [
        g for g in GATE_ORDER
        if gate_aprovado(after, g) and not gate_aprovado(before, g)
    ]
    if len(novos) > 1:
        erros.append(
            f"{rotulo}: {len(novos)} gates aprovados de uma vez ({', '.join(novos)}). "
            "Cada checkpoint é uma aprovação humana separada — um gate por PR."
        )
    for gate in novos:
        idx = GATE_ORDER.index(gate)
        if idx > 0:
            pred = GATE_ORDER[idx - 1]
            if not gate_aprovado(before, pred):
                erros.append(
                    f"{rotulo}: gate '{gate}' está sendo aprovado, mas o anterior "
                    f"('{pred}') ainda não foi aprovado na base. Não pule etapas."
                )
        info = after.get("gates", {}).get(gate, {})
        if not info.get("por"):
            erros.append(f"{rotulo}: gate '{gate}' aprovado sem preencher 'por'.")
        if not info.get("em"):
            erros.append(f"{rotulo}: gate '{gate}' aprovado sem preencher 'em' (data).")


def cmd_check(args):
    base = args.base
    alterados = arquivos_alterados(base)
    erros = []

    if alterados is None:
        # Sem git/base acessível: valida consistência interna de todos os N3.
        sys.stderr.write(
            f"aviso: não consegui comparar com a base '{base}'; "
            "validando apenas a consistência interna de todos os N3.\n"
        )
        alvos = [(p, m, {}) for p, m in listar_n3(args.root)]
    else:
        alvos = []
        for path in alterados:
            if not path.replace("\\", "/").startswith("modules/"):
                continue
            if not path.endswith(".md") or _ignorar(path):
                continue
            after = meta_no_disco(os.path.join(args.root, path))
            if not has_gates(after):
                continue
            before = meta_no_ref(base, path)
            before = before if has_gates(before) else {"gates": {}}
            alvos.append((path, after, before))

    if not alvos:
        print("Nenhum N3 com gates alterado — nada a validar. ✔")
        return 0

    for path, after, before in alvos:
        rotulo = path
        validar_estrutura(after, rotulo, erros)
        validar_prefixo(after, rotulo, erros)
        validar_estado(after, rotulo, erros)
        if before is not None:
            validar_transicao(after, before, rotulo, erros)

    if erros:
        print("❌ Esteira de gates: transição inválida\n")
        for e in erros:
            print(f"  • {e}")
        print(
            "\nRegra: a próxima etapa só ocorre após a aprovação da anterior.\n"
            f"Ordem dos checkpoints: {' → '.join(GATE_ORDER)}."
        )
        return 1

    print("✔ Esteira de gates: todas as transições são válidas.")
    for path, after, _ in alvos:
        print(f"  • {path}: estado → {estado_de_exibicao(after)}")
    return 0


# ── status / promote ────────────────────────────────────────────────────────


def montar_linhas(root: str):
    linhas = []
    for path, meta in listar_n3(root):
        rel = os.path.relpath(path, root).replace("\\", "/")
        estado = estado_de_exibicao(meta)
        icone = ICONES.get(estado, "•")
        prox = proximo_checkpoint(meta)
        if estado == "deprecado":
            pronto = "❌ deprecado"
        elif estado == "implementado":
            pronto = "✅ implementado"
        elif estado == "especificado":
            pronto = "📋 pronto para desenvolvimento"
        elif estado == "em-desenvolvimento":
            pronto = "🔄 em desenvolvimento"
        else:
            pronto = f"aguardando **{prox}**" if prox else "—"
        linhas.append(
            {
                "id": str(meta.get("id", "—")),
                "servicenow": str(meta.get("servicenow", "—")),
                "rel": rel,
                "icone": icone,
                "estado": estado,
                "pronto": pronto,
            }
        )
    linhas.sort(key=lambda x: (x["servicenow"], x["id"]))
    return linhas


def render_tabela(linhas, data: str) -> str:
    out = []
    out.append(MARK_INI)
    out.append("## Esteira de checkpoints (gates)")
    out.append("")
    out.append(
        "> ⚙️ **Seção gerada por `scripts/gates.py` — não editar à mão.** "
        "Espelha o estado de cada feature na esteira (CP1 requisitos → CP2 "
        "modelo de dados → CP3 testes → CP4 código). "
        f"Reflete o estado em **{data}**."
    )
    out.append("")
    if not linhas:
        out.append("_Nenhuma feature com esteira de gates ainda._")
    else:
        out.append("| Feature | História | Estado | Situação |")
        out.append("|---|---|---|---|")
        for l in linhas:
            out.append(
                f"| `{l['id']}` ([spec](./{l['rel']})) | {l['servicenow']} "
                f"| {l['icone']} {l['estado']} | {l['pronto']} |"
            )
        prontas = sum(1 for l in linhas if l["estado"] == "especificado")
        out.append("")
        out.append(
            f"**{prontas}** de **{len(linhas)}** feature(s) prontas para desenvolvimento."
        )
    out.append(MARK_FIM)
    return "\n".join(out)


def cmd_status(args):
    linhas = montar_linhas(args.root)
    data = hoje()
    print(render_tabela(linhas, data))
    return 0


def cmd_promote(args):
    index_path = os.path.join(args.root, "modules", "INDEX.md")
    if not os.path.exists(index_path):
        sys.stderr.write(f"aviso: {index_path} não encontrado; nada a fazer.\n")
        return 0
    linhas = montar_linhas(args.root)
    bloco = render_tabela(linhas, hoje())

    with open(index_path, encoding="utf-8") as fh:
        conteudo = fh.read()

    if MARK_INI in conteudo and MARK_FIM in conteudo:
        ini = conteudo.index(MARK_INI)
        fim = conteudo.index(MARK_FIM) + len(MARK_FIM)
        novo = conteudo[:ini] + bloco + conteudo[fim:]
    else:
        sep = "" if conteudo.endswith("\n") else "\n"
        novo = conteudo + sep + "\n---\n\n" + bloco + "\n"

    if novo == conteudo:
        print("INDEX.md já está atualizado — nada a regravar.")
        return 0

    if args.write:
        with open(index_path, "w", encoding="utf-8") as fh:
            fh.write(novo)
        print(f"INDEX.md atualizado: {index_path}")
    else:
        print("INDEX.md desatualizado (rode com --write para gravar).")
        print(bloco)
    return 0


def hoje() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).date().isoformat()


# ── CLI ──────────────────────────────────────────────────────────────────────


def main(argv=None):
    p = argparse.ArgumentParser(description="Esteira de checkpoints (gates) do doc-template.")
    p.add_argument("--root", default=".", help="raiz do repositório de docs (default: .)")
    sub = p.add_subparsers(dest="cmd", required=True)

    pc = sub.add_parser("check", help="valida transições de gate num PR")
    pc.add_argument("--base", default="origin/main", help="ref base de comparação")
    pc.set_defaults(func=cmd_check)

    ps = sub.add_parser("status", help="imprime a esteira (readiness)")
    ps.set_defaults(func=cmd_status)

    pp = sub.add_parser("promote", help="regenera a seção de gates do INDEX.md")
    pp.add_argument("--write", action="store_true", help="grava o INDEX.md")
    pp.set_defaults(func=cmd_promote)

    args = p.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
