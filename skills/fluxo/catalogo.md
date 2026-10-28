# Catálogo do fluxo

Inventário de tudo que está à disposição, com a fase em que entra e quando
usar. Toda skill, agent e command de `~/.claude/` aparece aqui: o
`scripts/sync/check-fluxo.js` falha se algum ficar de fora. Ao instalar algo
novo, inclua uma linha antes de commitar.

Fases: 1 Entender · 2 Planejar · 3 Branch · 4 Implementar · 5 Verificar ·
6 Revisar · 7 Documentar · 8 Entregar · 9 Aprender · T Transversal ·
F Fora do fluxo (com motivo).

Duplicatas têm uma escolha **principal**; a outra fica como alternativa.

## Skills do repo (`skills/`)

| Skill | Fase | Quando usar |
|---|---|---|
| `fluxo` | T | Este fluxo. `/fluxo <pedido>` ou `/fluxo init` |
| `codebase-onboarding` | 1 | Repo desconhecido: guia de onboarding |
| `documentation-lookup` | 1 | API de lib via `context7` |
| `search-first` | 1 | Antes de escrever utilitário: procurar lib pronta |
| `architecture-decision-records` | 2, 7 | Toda escolha real de arquitetura vira ADR |
| `plan-canvas` | 2 | Plano grande: usuário anota no navegador |
| `api-design` | 2, 4 | Contrato REST (nomes, status, paginação, erro) |
| `design-taste-frontend` | 2 | **Principal** para direção visual de UI |
| `frontend-design-direction` | 2 | Alternativa à anterior |
| `awesome-design` | 2 | UI que cita marca ou sem identidade visual |
| `image-to-code` | 2, 4 | Há mockup, screenshot ou export do Figma |
| `design-system` | 2, 6 | Tokens e consistência visual |
| `git-workflow` | 3, 8 | Branch, merge vs rebase, conflito |
| `springboot-patterns` | 4 | Java/Spring |
| `jpa-patterns` | 4 | Entidades, relações, queries JPA |
| `java-coding-standards` | 4 | Estilo Java |
| `angular-developer` | 4 | Angular |
| `frontend-patterns` | 4 | React/Next e frontend em geral |
| `dart-flutter-patterns` | 4 | Flutter/Dart |
| `backend-patterns` | 4 | Backend sem stack específica |
| `coding-standards` | 4 | Convenções transversais |
| `error-handling` | 4 | Erros tipados, retries, fronteiras |
| `postgres-patterns` | 4 | Schema, índice, query PostgreSQL |
| `redis-patterns` | 4 | Cache, lock, rate limit |
| `database-migrations` | 4, 8 | Mudança de schema e rollback |
| `docker-patterns` | 4, 8 | Dockerfile e Compose |
| `deployment-patterns` | 8 | CI/CD, health check, rollback |
| `accessibility` | 4, 6 | WCAG 2.2 AA ao construir |
| `frontend-a11y` | 6 | Auditoria de acessibilidade no frontend |
| `springboot-tdd` | 4 | **Principal** de TDD em Spring |
| `tdd-workflow` | 4 | **Principal** de TDD nas demais stacks |
| `springboot-verification` | 5 | Build, análise, testes e cobertura em Spring |
| `verification-loop` | 5 | Verificação nas demais stacks |
| `e2e-testing` | 5 | Playwright, Page Object, fluxos críticos |
| `playwright-cli` | 5 | Screenshot desktop/mobile antes de dizer pronto |
| `flutter-dart-code-review` | 6 | Checklist de revisão Flutter |
| `security-review` | 6 | Auth, entrada de usuário, segredo, API |
| `springboot-security` | 4, 6 | Spring Security |
| `web-design-guidelines` | 6 | UI antes do PR |
| `living-docs-governance` | 7 | Organizar/adotar estrutura de `docs/` |
| `github-ops` | 8 | Issues, PRs, CI, releases |
| `continuous-learning-v2` | 9 | Instintos aprendidos por sessão |
| `continuous-learning` | F | v1 obsoleta; fica só porque o hook `evaluate-session.js` lê o `config.json` dela |
| `hookify-rules` | 9 | Escrever regra do `hookify` |
| `strategic-compact` | T | `/compact` em fronteira de fase |
| `context-budget` | T | Auditar o que pesa no contexto |
| `token-budget-advisor` | T | Escolher profundidade da resposta pelo custo |
| `security-scan` | T | Auditar a própria config (`.claude/`) com AgentShield |
| `ecc-guide` | F | Guia do toolkit ECC; só para dúvidas sobre ele |

## Agents do repo (`agents/`)

| Agent | Fase | Quando delegar |
|---|---|---|
| `code-explorer` | 1 | Rastrear fluxo em tarefa média/grande |
| `docs-lookup` | 1 | Pesquisa longa de documentação |
| `planner` | 2 | Plano de tarefa grande |
| `architect` | 2 | Decisão de arquitetura de sistema |
| `code-architect` | 2 | Blueprint de feature sobre o código existente |
| `tdd-guide` | 4 | Fatia de TDD que não cabe no contexto principal |
| `build-error-resolver` | 4 | Build/TS quebrado (genérico) |
| `java-build-resolver` | 4 | Maven/Gradle quebrado |
| `dart-build-resolver` | 4 | Flutter/Dart quebrado |
| `e2e-runner` | 5 | Rodar e manter E2E |
| `pr-test-analyzer` | 5, 6 | Qualidade e lacunas dos testes do PR |
| `code-reviewer` | 6 | Revisão genérica |
| `java-reviewer` | 6 | Revisão Java/Spring |
| `typescript-reviewer` | 6 | Revisão TS/Angular |
| `flutter-reviewer` | 6 | Revisão Flutter |
| `security-reviewer` | 6 | Diff sensível |
| `database-reviewer` | 6 | SQL, schema, índices |
| `performance-optimizer` | 6 | Gargalo ou regressão de desempenho |
| `a11y-architect` | 2, 6 | Acessibilidade web e nativa |
| `silent-failure-hunter` | 4, 6 | Erros engolidos, fallback ruim |
| `type-design-analyzer` | 6 | Tipos novos: invariantes e encapsulamento |
| `comment-analyzer` | 6 | Comentários desatualizados ou enganosos |
| `code-simplifier` | 6 | Simplificar depois de verde |
| `refactor-cleaner` | 6 | Código morto |
| `doc-updater` | 7 | Atualizar docs em lote |
| `conversation-analyzer` | 9 | Usado pelo `/hookify` para achar comportamento a bloquear |

## Commands do repo (`commands/`)

| Command | Fase | Quando usar |
|---|---|---|
| `project-init` | 1 | `/fluxo init`: plano dry-run da config para a stack |
| `plan` | 2 | Plano com o `planner` e espera confirmação (ver colisão abaixo) |
| `plan-prd` | 2 | PRD enxuto quando o problema de produto não está claro |
| `plan-canvas` | 2 | Abre o plano no navegador para anotar |
| `epic-decompose` | 2 | Quebrar épico em tarefas |
| `epic-validate` | 2 | Validar dependências do épico |
| `epic-claim` | 2 | Assumir um épico |
| `epic-sync` | 8 | Sincronizar épico com o GitHub |
| `epic-publish` | 8 | Publicar atualização do épico |
| `epic-review` | 6 | Marcar revisão do épico |
| `epic-unblock` | 8 | Reabrir épicos desbloqueados |
| `build-fix` | 4 | Build quebrado (genérico) |
| `gradle-build` | 4 | Gradle (Android/KMP) |
| `flutter-build` | 4 | Flutter |
| `flutter-test` | 5 | Testes Flutter |
| `test-coverage` | 5 | Lacunas de cobertura |
| `quality-gate` | 5 | Formatação de um arquivo (o hook já roda) |
| `checkpoint` | 5 | Marco de verificação nomeado; para desfazer, prefira `/rewind` |
| `code-review` | 6 | Revisão ECC local ou de PR (ver colisão abaixo) |
| `review-pr` | 6 | Revisão de PR com agents especializados |
| `flutter-review` | 6 | Revisão Flutter |
| `refactor-clean` | 6 | Remover código morto com verificação |
| `security-scan` | T | AgentShield na config |
| `update-docs` | 7 | Docs a partir das fontes |
| `pr` | 8 | **Principal** para abrir PR |
| `setup-github` | 1, 8 | Roadmap, issues, board, proteção de branch |
| `learn` | 9 | Extrair padrão da sessão |
| `instinct-status` | 9 | Ver instintos |
| `evolve` | 9 | Evoluir instintos em skills |
| `promote` | 9 | Instinto de projeto para global |
| `hookify` | 9 | Criar hook a partir de comportamento indesejado |
| `hookify-list` | 9 | Listar regras |
| `hookify-configure` | 9 | Ligar/desligar regras |
| `hookify-help` | 9 | Ajuda |
| `save-session` | T | Salvar estado para outra máquina |
| `resume-session` | T | Retomar estado salvo |
| `cost-report` | T | Relatório de custo do ECC |
| `aside` | F | Duplica o `/btw` nativo; use `/btw` |

**Colisões com comandos nativos.** `plan` e `code-review` têm o mesmo nome de
comandos nativos. Para o modo plano nativo use `Shift+Tab`; para a revisão
nativa use `/review` (alias). Na primeira sessão de cada máquina, confira com
`/help` qual versão cada nome abre e registre em `docs/config-detalhes.md`.

## Plugins ativos

| Plugin | O que traz | Fase |
|---|---|---|
| `superpowers` | `brainstorming` (2), `systematic-debugging` (4), `verification-before-completion` (5), `receiving-code-review` (6), `using-git-worktrees` (3), `finishing-a-development-branch` (8). Fora do fluxo: `writing-plans`/`executing-plans` (usamos `planner` e modo plano), `subagent-driven-development` e `dispatching-parallel-agents` (delegação segue `agents.md`), `test-driven-development` (usamos o TDD da stack), `requesting-code-review` (usamos os reviewers) | 2-8 |
| `pr-review-toolkit` | `/pr-review-toolkit:review-pr` com 6 agents de revisão | 6 |
| `commit-commands` | `/commit-commands:commit`, `:commit-push-pr`, `:clean_gone` | 8 |
| `claude-security` | `/claude-security`: varredura antes de PR sensível | 6 |
| `security-guidance` | Hook que avisa padrões inseguros durante a escrita | 4 (passivo) |
| `jdtls-lsp`, `typescript-lsp` | Navegação por símbolo e erros de tipo após editar | 1, 4 |
| `cartographer` | Mapa do código em `docs/` | 1, 7 |
| `claude-mem` | Memória entre sessões, busca no histórico | 1, 9 |
| `context-mode` | Indexa saídas grandes fora do contexto | T |
| `claude-md-management` | `/revise-claude-md` e melhoria do `CLAUDE.md` | 9 |
| `claude-code-setup` | Recomenda automações (hooks, skills, MCP) para o projeto | 1 (`/fluxo init`) |
| `hookify` | Hooks a partir de conversa | 9 |
| `omniroute` | MCP gateway para outros provedores; exige servidor local | F, só se for rotear modelo |
| `session-report`, `plugin-dev` | Desligados para economizar contexto | F |

## MCP servers

| Server | Fase | Uso |
|---|---|---|
| `context7` | 1, 4 | Docs atualizadas de bibliotecas |
| `sequential-thinking` | 2 | Raciocínio passo a passo em problema difícil |
| `memory` | F | Grafo de memória; o histórico fica com `claude-mem` e as regras no `CLAUDE.md` |
| `filesystem` | T | Acesso a `Desktop` e `TCC` fora do projeto |
| GitHub (conector) | 8 | PRs, issues, CI quando o `gh` não está disponível |

## Recursos nativos do Claude Code

| Recurso | Fase | Uso |
|---|---|---|
| Modo plano (`Shift+Tab`) | 2 | Plano antes de editar em tarefa média |
| `/btw` | T | Pergunta paralela sem sujar o histórico |
| `/deep-research` | 1 | Pesquisa externa com fontes cruzadas |
| Worktrees (`claude --worktree <nome>`, ou pedir) | 3 | Trabalho paralelo isolado |
| `/batch` | 4 | Mudança grande dividida em unidades, um worktree cada |
| Workflows dinâmicos (`ultracode`, "use um workflow", `/workflows`) | 4, 6 | Auditoria ou migração em dezenas de arquivos; caro, testar numa fatia antes |
| `/goal <condição>` | 4 | Trabalhar até a condição verificável valer |
| `/loop`, `Monitor` | T | Repetir ou esperar algo externo |
| Subagents, `/subtask`, `/fork`, `/background`, `/tasks` | T | Paralelismo dentro da política de `agents.md` |
| `/run`, `/verify`, `/run-skill-generator` | 5 | Ver o app rodando e confirmar a mudança |
| `/review` (= `/code-review` nativo, `low`..`max`, `--fix`) | 6 | Bugs no diff ou num PR |
| `/ultrareview` | 6 | Revisão multiagente na nuvem para mudança crítica |
| `/security-review` | 6 | Vulnerabilidades no diff da branch |
| `/simplify` | 6 | Limpeza depois de verde |
| `/diff` | 6 | Ver o que mudou |
| `/autofix-pr` | 8 | Sessão na nuvem vigiando o CI do PR |
| `/install-github-app` | 8 | Claude no GitHub Actions do repo |
| `/schedule` | T | Tarefa agendada na nuvem (triagem, testes noturnos) |
| `/rewind`, `/branch` | T | Desfazer ou testar outra direção |
| `/context`, `/compact`, `/clear` | T | Gestão de contexto |
| `/effort`, `/model`, `/fast`, `/advisor` | T | Subir esforço ou modelo só quando a tarefa pedir |
| `/init`, `/memory` | 1 | `CLAUDE.md` do projeto |
| `/fewer-permission-prompts`, `/permissions` | T | Menos interrupções |
| `/doctor`, `/skill-doctor`, `/context all` | T | Saúde e custo da config |
| `/usage`, `/insights`, `/recap` | 9 | Custo, padrões de uso, resumo da sessão |
| `/resume`, `/rename`, `/teleport`, `/remote-control` | T | Sessões entre dispositivos |
| `/hooks`, `/mcp`, `/plugin`, `/reload-skills`, `/reload-plugins` | T | Inspecionar e recarregar extensões |
| `/statusline`, `/output-style`, `/config`, `/keybindings` | F | Preferência de interface, fora do fluxo |
| `update-config`, `/workflow-authoring`, `/plugin-authoring` | F | Mexer na própria config; usar quando o assunto for ela |
| Artifacts (`/artifacts`) | 7 | Relatório visual para compartilhar |

## Arquivados nesta mudança (2026-10-28)

Saíram para `archive/` por duplicarem o `fluxo`: skills `orch-pipeline`,
`orch-add-feature`, `orch-change-feature`, `orch-fix-defect`,
e `orch-refine-code`; commands
`orch-add-feature`, `orch-change-feature`, `orch-fix-defect`,
`orch-refine-code`, `prp-plan`, `prp-implement`, `prp-pr` e `feature-dev`.
