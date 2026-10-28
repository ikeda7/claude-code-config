# Agent Orchestration

Agents ficam em `~/.claude/agents/`. Os mais usados: `planner`, `architect`,
`tdd-guide`, `code-reviewer`, `security-reviewer`, `build-error-resolver`,
`e2e-runner`, `refactor-cleaner`, `doc-updater` e os reviewers de stack
(`java-reviewer`, `typescript-reviewer`, `flutter-reviewer`).
Agents de outras stacks estão em `~/.claude/archive/agents/`.

## Quando delegar

Cada subagent começa do zero e recarrega todo o contexto fixo (CLAUDE.md,
rules, lista de skills). Delegar custa tokens; só vale quando compensa:

- Busca ou análise ampla cujo resultado intermediário não precisa ficar no
  contexto principal.
- Revisão independente de uma mudança grande (`code-reviewer`,
  `security-reviewer` antes de commit em código sensível).
- Tarefas realmente independentes que podem rodar em paralelo.

Não delegue o que cabe em poucas leituras/edições diretas. Não abra vários
agents com "perspectivas" diferentes para o mesmo problema sem o usuário pedir.

## Delegation Completion Contract

Applies to every agent at every depth (parent, child, grandchild):

1. **Your final message IS the deliverable.** Never end your turn with "waiting for background agents" — a spawned task is not a completed task.
2. **If you delegate, you own collection.** Wait for results, integrate them, then return. Fire-and-forget delegation is forbidden.
3. **Decompose only when the work cannot fit in one context.** Do not re-delegate a task already sized for a single agent.
