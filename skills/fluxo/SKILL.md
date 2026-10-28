---
name: fluxo
description: Fluxo padrão de desenvolvimento para qualquer projeto. Mapeia cada fase (entender, planejar, branch, TDD, verificar, revisar, documentar, entregar, aprender) para a skill, agent, command, plugin ou recurso nativo do Claude Code certo, por stack. Use no início de toda tarefa que escreva ou revise código, ou com /fluxo <pedido> para rodar o pipeline completo e /fluxo init para preparar um projeto.
argument-hint: "[init | <pedido>]"
---

# Fluxo padrão

Pipeline único para todo projeto. A regra sempre ativa
(`rules/common/fluxo-padrao.md`) define a classificação e as fases; esta skill
diz **com o que** executar cada fase. O inventário completo, com o destino de
cada ferramenta instalada (inclusive as que ficam fora do fluxo e por quê),
está em [catalogo.md](catalogo.md).

## Modos

- `/fluxo init`: projeto novo ou repositório desconhecido. Ver "Início de
  projeto" abaixo.
- `/fluxo <pedido>`: executa o pipeline inteiro para o pedido, anunciando cada
  fase numa linha (`Fase 4/8 - Implementar`).
- Sem `/`: a skill é carregada automaticamente quando a tarefa envolve código.
  Siga as fases que o tamanho exige, sem anunciar todas.

## Passo 0 - Classificar e detectar a stack

1. Tipo e tamanho em uma linha (critérios em `fluxo-padrao.md`).
2. Stack pelos marcadores na raiz (tabela do `CLAUDE.md`) e leia as regras da
   linguagem antes de editar.
3. Escolha a coluna da stack abaixo e siga.

| Fase | Java/Spring | Angular/TS | Flutter/Dart | Outras / transversal |
|---|---|---|---|---|
| Padrões | `springboot-patterns`, `jpa-patterns`, `java-coding-standards` | `angular-developer`, `frontend-patterns` | `dart-flutter-patterns` | `coding-standards`, `backend-patterns`, `api-design`, `error-handling` |
| TDD | `springboot-tdd` | `tdd-workflow` | `tdd-workflow` + `/flutter-test` | `tdd-workflow` |
| Build quebrado | `java-build-resolver`, `/gradle-build` | `build-error-resolver`, `/build-fix` | `dart-build-resolver`, `/flutter-build` | `/build-fix` |
| Verificar | `springboot-verification` | `verification-loop` + `e2e-testing` | `verification-loop` + `/flutter-test` | `verification-loop` |
| Revisar | `java-reviewer` | `typescript-reviewer` | `flutter-reviewer`, `/flutter-review`, `flutter-dart-code-review` | `code-reviewer` |
| Segurança | `springboot-security` | `security-review` | `security-review` | `security-review` |
| Banco | `database-reviewer`, `postgres-patterns`, `database-migrations` | - | - | `redis-patterns` quando houver cache |
| LSP | `jdtls-lsp` | `typescript-lsp` | - | - |

## Fases

### 1. Entender

- O que já foi feito antes: busque no `claude-mem` (histórico entre sessões).
- Repositório desconhecido ou grande: `cartographer` gera o mapa do código em
  `docs/`; `codebase-onboarding` para um guia de onboarding.
- Rastrear um fluxo específico: LSP primeiro (definição e referências); em
  tarefa média ou grande, agent `code-explorer`.
- API de biblioteca: MCP `context7` (skill `documentation-lookup`, agent
  `docs-lookup` se a pesquisa for longa). Nunca de memória.
- Antes de escrever utilitário: `search-first` (lib pronta > código novo).
- Pergunta externa ampla, com várias fontes: `/deep-research` (workflow nativo).
- Problema de raciocínio difícil: MCP `sequential-thinking`, ou `/effort high`.
- Dúvida paralela sem poluir o contexto: `/btw`.

### 2. Decidir e planejar (médio e grande)

- Requisito vago ou várias soluções possíveis: skill `brainstorming`
  (superpowers) antes de qualquer plano.
- Médio: modo plano nativo (`Shift+Tab` até "plan mode") com plano curto em
  fatias verticais.
- Grande: agent `planner` (ou `architect` / `code-architect` para estrutura);
  `/plan-prd` quando o problema de produto ainda não está claro; ADR com
  `architecture-decision-records` para cada escolha real; `plan-canvas` para o
  usuário anotar o plano no navegador. **Pare e peça aprovação do plano.**
- Trabalho que vira várias issues: `/epic-decompose` e família `/epic-*`.
- UI: `design-taste-frontend` primeiro; `awesome-design` se citar marca ou não
  houver identidade visual; `image-to-code` se houver imagem; `design-system`
  para tokens e consistência; `frontend-design-direction` como alternativa.

### 3. Branch

- `gitflow-padrao.md`: nunca em `main`/`master`/`develop`.
- Trabalho paralelo isolado: worktree nativo (`claude --worktree` ou pedir
  "use um worktree"). `using-git-worktrees` (superpowers) dá o passo a passo.

### 4. Implementar

- TDD pela skill da stack (tabela acima). Bug: teste que reproduz primeiro.
  Refactor: testes verdes antes e depois.
- Grande, com tarefas independentes: agent `tdd-guide` por fatia só se a fatia
  não couber no contexto principal (`agents.md`).
- Bug difícil: `systematic-debugging` (superpowers): reproduzir, isolar,
  hipótese, prova. `silent-failure-hunter` quando o sintoma é "nada acontece".
- Mudança mecânica em muitos arquivos: `/batch` (nativo, um worktree por
  unidade) ou um workflow dinâmico ("use um workflow" / `ultracode`).
- Meta verificável e longa ("todos os testes passam"): `/goal <condição>`.
- Esperar algo externo (deploy, CI): `/loop` ou `Monitor`, nunca `sleep`.
- Padrões de domínio: `docker-patterns`, `deployment-patterns`, `api-design`,
  `redis-patterns`, `postgres-patterns`, `database-migrations`, `accessibility`.

### 5. Verificar

- Rodar build e testes da stack e mostrar a saída. Princípio da skill
  `verification-before-completion` (superpowers): sem evidência, não está pronto.
- Ver o app funcionando: `/run` (nativo) e `/verify` (nativo). Na primeira vez
  num projeto, `/run-skill-generator` ensina os dois a subir o app.
- Frontend web: `playwright-cli` com screenshot desktop e mobile; fluxos
  críticos com `e2e-testing` / agent `e2e-runner`.
- Cobertura: `/test-coverage` (meta de 80% em `testing.md`).
- Formatação de um arquivo: `/quality-gate` (o hook já roda sozinho).

### 6. Revisar (pequeno leve; médio e grande completo)

- Reviewer da stack (tabela) ou `code-reviewer`.
- PR médio/grande: `/pr-review-toolkit:review-pr` (testes, erros silenciosos,
  tipos, comentários, simplificação em paralelo). Os agents dele também
  existem soltos: `pr-test-analyzer`, `silent-failure-hunter`,
  `type-design-analyzer`, `comment-analyzer`, `code-simplifier`.
- Revisão nativa de bugs no diff: `/review` (alias do `/code-review` nativo,
  com nível `low`..`max` e `--fix`). Crítico ou grande: `/ultrareview` (nuvem,
  multiagente, custa mais).
- Segurança (auth, entrada de usuário, banco, segredo, arquivo, API externa):
  `security-review` + agent `security-reviewer`, `/security-review` (nativo) no
  diff e `/claude-security` antes do PR. O plugin `security-guidance` já avisa
  durante a escrita.
- Específicos: `database-reviewer` (SQL/schema), `performance-optimizer`,
  `a11y-architect` / `frontend-a11y` (acessibilidade), `web-design-guidelines`
  (UI antes do PR).
- Limpeza depois de verde: `/simplify` (nativo) ou `/refactor-clean`.
- Ao receber revisão: `receiving-code-review` (superpowers): verificar cada
  apontamento antes de aceitar.

### 7. Documentar

- `documentacao-viva.md`: doc no mesmo PR, ou dizer por que não muda.
- `living-docs-governance` para organizar; `architecture-decision-records`
  para ADR; `/update-docs` ou agent `doc-updater` para atualização em lote;
  `cartographer` para atualizar o mapa do código.

### 8. Entregar

- Commit: Conventional Commits; `/commit-commands:commit` ajuda a redigir.
- PR: `/pr` (descobre template, analisa o histórico inteiro). Repo sem
  estrutura no GitHub: `/setup-github`.
- CI e revisão no PR: acompanhe pelos eventos; na nuvem, `/autofix-pr` vigia e
  corrige o CI sozinho. `github-ops` para operações de repo.
- Merge sem perguntar quando: sem conflito, CI verde, nenhum thread aberto,
  diff relido (`CLAUDE.md`). Depois: `/commit-commands:clean_gone` limpa
  branches locais já removidas. `finishing-a-development-branch`
  (superpowers) cobre o encerramento.
- Deploy: `deployment-patterns`, `docker-patterns`, `deploy-vercel.md`.

### 9. Aprender (fim de tarefa relevante)

- Erro repetido do agente: regra no `CLAUDE.md` (`/revise-claude-md` do
  `claude-md-management`) ou hook que bloqueia (`/hookify`).
- Padrão reutilizável: `/learn`; instintos com `continuous-learning-v2`
  (`/instinct-status`, `/evolve`, `/promote`).
- Pausar para continuar em outra máquina: `/save-session` e
  `/resume-session`. Na mesma máquina, `/resume` nativo basta.

## Início de projeto (`/fluxo init`)

1. `cartographer` ou `codebase-onboarding` para entender o que existe.
2. `/init` se não houver `CLAUDE.md` do projeto; ajuste com `/memory`.
3. `/project-init` (dry-run) para ver o que da config se aplica à stack.
4. `docs/` conforme `documentacao-viva.md` (`living-docs-governance` se já
   existir doc).
5. `/setup-github` para roadmap, issues, board e proteção de branch.
6. `/run-skill-generator` para `/run` e `/verify` saberem subir o app.
7. `/fewer-permission-prompts` depois das primeiras sessões.

## Durante qualquer fase

- Contexto: `/context` para ver o peso; `/compact` em fronteira de fase
  (`strategic-compact`); `/clear` ao trocar de tarefa. O `context-mode` já
  indexa saídas grandes.
- Errou o caminho: `/rewind` volta código e conversa a um checkpoint; `/branch`
  testa outra direção sem perder a atual.
- Trabalho em paralelo: `/subtask` (subagent em background com o contexto
  atual), `/fork` (cópia da sessão), `/background` (solta a sessão),
  `/tasks` para acompanhar.
- Custo: `/usage`, `/cost-report`, `token-budget-advisor`, `/skill-doctor`.

## Quando NÃO seguir o pipeline

Pergunta, explicação ou pesquisa sem código: responda direto. Mudança só de
texto/doc: fases 3, 7 e 8. Configuração do próprio Claude Code: `update-config`
e o fluxo de sync do repositório de config.
