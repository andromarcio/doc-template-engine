# Como o método flui

## Top-down (o caminho natural)

Cada nível parte do nível acima:

```text
N0 → N1 → N2 → N3
```

Define-se a visão de produto, dela derivam-se os domínios, de cada domínio os
feature sets e, finalmente, as features campo a campo.

## Bottom-up

O método também suporta o sentido inverso — especificar uma feature (N3) primeiro
e, a partir de várias delas, **derivar** o N2 e depois o N1:

```text
N3 ──(PROMPT_N3_TO_N2)──▶ N2 ──(PROMPT_N3_TO_N1)──▶ N1
```

## Propagação

Em ambos os sentidos há **propagação**: ao gerar ou alterar um nível, o engine
**confronta e atualiza o nível imediatamente anterior** para manter tudo
consistente. Uma feature nova pode exigir ajustar o feature set; um feature set
novo pode exigir ajustar o domínio.

## O ciclo completo

```text
                         ┌─────────────┐
   necessidade  ───────▶ │  TRIAGEM    │  já existe? criar ou alterar?
                         └──────┬──────┘
                                │
              ┌─────────────────┼──────────────────┐
              ▼                 ▼                   ▼
        história (HU)     criar (3A/2A/1A)    alterar (4A/4B)
              │                 │                   │
              └────────► passada A (negócio) ──validar──► passada B (técnico)
                                                        │
                                                        ▼
                                              dimensionamento (PF/CFP)
                                                        │
                                                        ▼
                                                código + rastreabilidade
```

## Em lote

Quando um delta afeta **muitos artefatos de uma vez**, a triagem direciona ao
`PROMPT_INVESTIGADOR` (**IV**), que levanta tudo o que muda; em seguida o
`PROMPT_EXECUTOR` (**EX**) aplica as mudanças de forma consistente.

Comece pela [Triagem](#/triagem).
