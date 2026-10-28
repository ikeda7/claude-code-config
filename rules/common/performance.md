# Performance e custo de tokens

## Modelo e esforço

Padrão (em `settings.shared.json`): `opus` com `effortLevel: medium` e janela
de 200k. Suba só quando a tarefa pedir:

- `/effort high` (ou `max`) para arquitetura, debug difícil, revisão crítica.
- `/model opus[1m]` só quando a tarefa precisa mesmo de >200k de contexto
  (ex.: análise de base grande de uma vez). Janela maior = cada turno reenvia
  mais tokens.
- Subagents de busca/varredura podem usar `model: haiku` ou `sonnet`.

## Contexto

- `/clear` ao trocar de tarefa; não arraste conversa antiga para assunto novo.
- `/compact` quando a status line passar de ~60% e a tarefa continuar.
- `/context` mostra o que ocupa a janela.
- Leia trechos (offset/limit, grep) em vez de arquivos inteiros quando
  souber o que procura. Saídas grandes de comando: filtre (`| head`, `grep`).

## Build Troubleshooting

Se o build falhar: use o agent `build-error-resolver` (ou o da stack:
`java-build-resolver`, `dart-build-resolver`), corrija incrementalmente e
verifique após cada correção.
