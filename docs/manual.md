# Manual do ambiente Claude Code

Guia de uso desta configuração: o que acontece sozinho, o que você aciona e
como, por situação. Vale para as 3 máquinas e para qualquer projeto aberto
nelas. Detalhes técnicos e histórico de decisões ficam em
[config-detalhes.md](config-detalhes.md); o inventário completo de ferramentas,
em [`skills/fluxo/catalogo.md`](../skills/fluxo/catalogo.md).

## Sumário

1. [Em um minuto](#1-em-um-minuto)
2. [O que acontece sozinho](#2-o-que-acontece-sozinho)
3. [O fluxo padrão](#3-o-fluxo-padrão)
4. [Quero... então digito](#4-quero-então-digito)
5. [Por stack](#5-por-stack)
6. [Atalhos de teclado e prefixos](#6-atalhos-de-teclado-e-prefixos)
7. [Trabalho longo, paralelo e agendado](#7-trabalho-longo-paralelo-e-agendado)
8. [Contexto e custo](#8-contexto-e-custo)
9. [Várias máquinas](#9-várias-máquinas)
10. [Manter a config](#10-manter-a-config)
11. [Quando algo dá errado](#11-quando-algo-dá-errado)
12. [Onde fica cada coisa](#12-onde-fica-cada-coisa)

---

## 1. Em um minuto

- Abra qualquer projeto e peça o que quer em linguagem normal. O agente já
  classifica a tarefa, segue o fluxo padrão, cria branch, faz TDD, verifica,
  revisa, atualiza a doc, abre o PR e mergeia quando estiver verde. Ele só para
  para pedir aprovação do **plano** quando a tarefa é grande.
- Quer o rigor total e ver cada fase? `/fluxo <pedido>`.
- Projeto novo ou desconhecido? `/fluxo init`.
- Mudou de assunto? `/clear`. Contexto pesando? `/compact`.
- Errou o caminho? `Esc` `Esc` com a caixa de texto vazia abre o `/rewind`.
- Máquina estranha? `node ~/.claude/scripts/sync/check-machine.js` diz o que
  falta e como resolver.

---

## 2. O que acontece sozinho

### 2.1 Sempre no contexto, em todo projeto

| O quê | Efeito |
|---|---|
| `CLAUDE.md` (este repo) | Índice do ambiente e suas preferências: merge sem perguntar, usar as ferramentas instaladas |
| `rules/common/fluxo-padrao.md` | Classificar tipo e tamanho, seguir as fases, só pedir aprovação de plano grande |
| `rules/common/gitflow-padrao.md` | Nunca commitar em `main`/`master`/`develop`; branch `feat/`, `fix/`, `chore/`...; Conventional Commits |
| `rules/common/documentacao-viva.md` | Doc atualizada no mesmo PR, ou dizer por que não muda |
| `rules/common/testing.md` | TDD e cobertura de 80% |
| `rules/common/coding-style.md`, `patterns.md` | Imutabilidade, KISS/DRY/YAGNI, arquivos pequenos, validação de entrada |
| `rules/common/security.md` | Checklist de segurança antes de commit; parar e revisar se achar problema |
| `rules/common/code-review.md` | Quando e como revisar, níveis de severidade |
| `rules/common/agents.md` | Só delegar a subagent quando compensa o custo |
| `rules/common/performance.md` | Modelo, esforço e contexto: subir só quando a tarefa pede |
| `rules/common/git-workflow.md`, `hooks.md` | Formato de commit e de PR; tipos de hook |
| Nome e descrição de cada skill, agent e command | É assim que o agente sabe que eles existem |

### 2.2 Entra sozinho quando a tarefa casa

- **Regras da linguagem** (`rules/<lang>/`): ao tocar um arquivo `.java`,
  `.ts`, `.dart` etc. A tabela de marcadores do `CLAUDE.md` faz o agente lê-las
  também no começo da tarefa.
- **`rules/common/deploy-vercel.md`**: em projeto com `vercel.json`.
- **Skills**: o corpo de uma skill carrega quando a descrição casa com o
  pedido. Por exemplo, `springboot-tdd` ao escrever teste em Spring e `fluxo`
  em qualquer tarefa de código.

### 2.3 Hooks (rodam sem o agente decidir)

Perfil `standard`. Os que mudam o comportamento:

| Quando | Hook | O que faz |
|---|---|---|
| Antes de `git commit` | `block-no-verify` | **Bloqueia** `--no-verify` |
| Antes de editar | `config-protection` | **Bloqueia** mexer em config de linter/formatter existente: corrija o código |
| Antes de escrever `.md` solto | `doc-file-warning` | Avisa se for NOTES/TODO/SCRATCH fora de pasta de docs |
| Antes de editar | `suggest-compact` | Sugere `/compact` em ponto lógico |
| Antes de ferramenta MCP | `mcp-health-check` | Testa o servidor; se falhar, marca e tenta reconectar |
| Depois de editar | `quality-gate` | Checa formatação (Biome/Prettier, gofmt, ruff) do arquivo |
| Depois de editar JS/TS | `console-warn`, `accumulator` | Avisa `console.log`; guarda a lista para o fim da resposta |
| Depois de editar UI | `design-quality-check` | Lembra quando o visual escorrega para o genérico |
| Depois de `gh pr create` / build | `pr-created`, `build-complete` | Registra o PR e o fim do build |
| Depois de qualquer ferramenta | `ecc-context-monitor` | Avisa o agente quando o contexto ou o custo passam do limite, ou quando ele entra em loop |
| Fim de cada resposta | `format-typecheck` | Formata e roda o typecheck dos JS/TS editados, de uma vez |
| Fim de cada resposta | `check-console-log` | Aponta `console.log` esquecido |
| Fim de cada resposta | `docs-sync-check` | Em repo com `docs/`: se mudou código e não doc, segura o fim **uma vez** e pede doc ou justificativa |
| Fim de cada resposta | `plan-canvas-pending` | Avisa se ficou comentário seu do Plan Canvas sem resposta |
| Fim de cada resposta | `desktop-notify` | Notificação quando o agente termina; só funciona em macOS e WSL (no Windows nativo não faz nada) |
| Antes de compactar | `pre-compact` | Salva um resumo da sessão antes do `/compact` |

Hooks só de registro (não mudam nada): log de comandos e custo, captura de
eventos de governança (segredo detectado etc.), métricas de uso de
ferramentas e skills, custo por sessão em `~/.claude/metrics/costs.jsonl`,
gravação da sessão e observação para aprendizado contínuo.

Desligados de propósito: `gateguard-fact-force` (pedia justificativa a cada
primeiro Bash/Edit), `auto-tmux-dev` (sem tmux no Windows) e a injeção de
contexto da sessão anterior no início (a memória fica com o `claude-mem`).
`tmux-reminder`, `git-push-reminder` e `commit-quality` só rodam no perfil
`strict`.

### 2.4 Plugins que agem sozinhos

| Plugin | O que faz sem você pedir |
|---|---|
| `claude-mem` | Grava o que acontece em cada sessão e permite buscar depois ("o que fizemos no login semana passada?") |
| `context-mode` | Joga saídas grandes num índice fora do contexto, para não lotar a janela |
| `security-guidance` | Avisa padrões inseguros enquanto o código é escrito |
| `jdtls-lsp`, `typescript-lsp` | Erros de tipo logo depois de cada edição em Java e TS; navegação por símbolo |
| `superpowers` | Injeta no início da sessão o lembrete de usar as skills dele |

### 2.5 Status line

Mostra pasta, branch (`*` = alterações), modelo, % de contexto (amarelo a
partir de 60, vermelho a partir de 80), uso da assinatura em 5h e na semana
(com a hora em que reseta), custo e linhas +/−.

### 2.6 O que o agente faz por regra (sem você pedir)

- Diz o tipo e o tamanho da tarefa antes de começar.
- Cria branch se estiver em `main`/`master`/`develop`.
- Escreve teste antes; em bug, reproduz o bug num teste primeiro.
- Mostra a evidência (teste, build, screenshot) antes de dizer "pronto".
- Atualiza a doc ou diz por que não muda.
- Abre o PR e **mergeia sem perguntar** quando: sem conflito, CI verde (ou sem
  CI), nenhum comentário de revisão pendente e o diff relido.
- Usa a ferramenta instalada da fase em vez de improvisar.

---

## 3. O fluxo padrão

| # | Fase | Trivial | Pequeno | Médio | Grande |
|---|---|---|---|---|---|
| 1 | Entender | - | leve | sim | sim |
| 2 | Planejar | - | - | plano curto | plano + ADR + **sua aprovação** |
| 3 | Branch | sim | sim | sim | sim |
| 4 | Implementar com TDD | se houver teste | sim | sim | sim, em fatias |
| 5 | Verificar | sim | sim | sim | sim |
| 6 | Revisar | - | leve | sim | sim, independente |
| 7 | Documentar | sim | sim | sim | sim |
| 8 | Entregar (commit, PR, merge) | sim | sim | sim | sim |
| 9 | Aprender | quando houver algo | | | |

Tamanho: **trivial** = 1 arquivo, óbvio; **pequeno** = 1 arquivo ou função;
**médio** = 2 a 5 arquivos ou uma escolha real; **grande** = transversal,
dependência nova, API pública. Tocar autenticação, entrada de usuário, banco
ou segredo conta no mínimo como médio.

Discordou da classificação? Diga "isso é grande" ou "é trivial" e o agente
ajusta. A ferramenta de cada fase e stack está na skill
[`fluxo`](../skills/fluxo/SKILL.md).

---

## 4. Quero... então digito

Você não precisa decorar: pedir em linguagem normal funciona, porque o agente
escolhe a ferramenta. Os comandos servem para forçar uma ferramenta específica.

### Começar

| Quero | Digito |
|---|---|
| Fazer algo com o fluxo completo e as fases à vista | `/fluxo <pedido>` |
| Preparar projeto novo ou desconhecido | `/fluxo init` |
| Gerar o `CLAUDE.md` do projeto | `/init`, depois `/memory` para ajustar |
| Entender um repo grande | "mapeia o código" (`cartographer`) ou `codebase-onboarding` |
| Estruturar o repo no GitHub (roadmap, issues, board, proteção) | `/setup-github` |
| Ensinar o agente a subir meu app | `/run-skill-generator` (uma vez por projeto) |

### Pensar e planejar

| Quero | Digito |
|---|---|
| Explorar ideias antes de decidir | "vamos fazer um brainstorming" (`brainstorming`) |
| Plano antes de mexer, sem editar nada | `Shift+Tab` até o modo **plan** |
| Plano detalhado com confirmação, salvo em arquivo | `/plan <pedido>` |
| Requisitos de produto antes do plano | `/plan-prd <ideia>` |
| Revisar o plano no navegador, anotando | `/plan-canvas <arquivo>` |
| Registrar uma decisão de arquitetura | "registra um ADR" (`architecture-decision-records`) |
| Quebrar um épico em issues | `/epic-decompose` (família `/epic-*`) |
| Pesquisa na web com fontes cruzadas | `/deep-research <pergunta>` |
| Pergunta rápida sem sujar a conversa | `/btw <pergunta>` |

### Construir

| Quero | Digito |
|---|---|
| Que o agente trabalhe até uma condição valer | `/goal todos os testes passam e o lint está limpo` |
| Mudança mecânica em muitos arquivos | `/batch <instrução>` |
| Auditoria ou migração enorme com muitos agentes | "use um workflow para ..." ou `ultracode: ...` (caro: teste numa pasta antes) |
| Trabalhar em paralelo sem conflito | `claude --worktree <nome>` no terminal, ou "trabalhe num worktree" |
| Build quebrado | `/build-fix`, `/gradle-build` ou `/flutter-build` |
| Bug difícil | "debug sistemático" (`systematic-debugging`) |
| UI a partir de imagem | cole a imagem (`Ctrl+V`, `Alt+V` no Windows) e peça (`image-to-code`) |

### Verificar e revisar

| Quero | Digito |
|---|---|
| Ver o app rodando com a mudança | `/run` ou `/verify` |
| Testes Flutter | `/flutter-test` |
| Cobertura e testes que faltam | `/test-coverage` |
| Revisão de bugs no diff (nativa, com nível e correção) | `/review`, `/review high`, `/review --fix` |
| Revisão do ECC (local ou PR) | `/code-review [número do PR]` |
| Revisão completa de PR com 6 agentes | `/pr-review-toolkit:review-pr` |
| Revisão profunda na nuvem, para mudança crítica | `/ultrareview` |
| Segurança do diff | `/security-review`; varredura multiagente com patches: `/claude-security` (menu) ou `/claude-security scan my branch` |
| Limpar o código depois de verde | `/simplify` ou `/refactor-clean` |
| Ver o que mudou | `/diff` |

### Entregar

| Quero | Digito |
|---|---|
| Commit bem escrito | `/commit-commands:commit` |
| Abrir PR | `/pr` |
| Agente na nuvem vigiando e consertando o CI do PR | `/autofix-pr` |
| Limpar branches locais já removidas | `/commit-commands:clean_gone` |
| Atualizar docs a partir do código | `/update-docs` |

### Aprender e melhorar o ambiente

| Quero | Digito |
|---|---|
| Que o agente nunca mais faça X | `/hookify <descrição>` (vira hook que bloqueia) |
| Transformar um padrão da sessão em skill | `/learn` |
| Ver o que ele aprendeu sozinho | `/instinct-status`, depois `/evolve` e `/promote` |
| Melhorar o `CLAUDE.md` do projeto | `/claude-md-management:revise-claude-md` |
| Menos pedidos de permissão | `/fewer-permission-prompts` |
| Relatório dos meus hábitos de uso | `/insights` |
| Aprender recursos do Claude Code | `/powerup` |

---

## 5. Por stack

| | Java/Spring | Angular/TS | Flutter/Dart |
|---|---|---|---|
| Padrões | `springboot-patterns`, `jpa-patterns`, `java-coding-standards` | `angular-developer` | `dart-flutter-patterns` |
| TDD | `springboot-tdd` | `tdd-workflow` | `tdd-workflow`, `/flutter-test` |
| Build | `java-build-resolver`, `/gradle-build` | `/build-fix` | `/flutter-build` |
| Verificar | `springboot-verification` | `verification-loop`, `e2e-testing`, `playwright-cli` | `verification-loop` |
| Revisar | `java-reviewer` | `typescript-reviewer` | `flutter-reviewer`, `/flutter-review` |
| Segurança | `springboot-security` | `security-review` | `security-review` |
| Banco | `database-reviewer`, `postgres-patterns`, `database-migrations` | | |

Frontend web: antes de codar `design-taste-frontend` (+ `awesome-design` se
citar marca, + `image-to-code` se houver imagem); com o servidor de pé,
`playwright-cli` com screenshot em desktop e mobile; antes do PR,
`web-design-guidelines`.

---

## 6. Atalhos de teclado e prefixos

| Tecla | Faz |
|---|---|
| `Shift+Tab` (`Alt+M` em alguns terminais Windows) | Alterna o modo: Manual → aceitar edições → **plan** → auto |
| `Esc` | Interrompe o agente sem perder o que já foi feito |
| `Esc` `Esc` | Com texto: limpa o rascunho. Vazio: abre o `/rewind` |
| `Ctrl+O` | Transcrição detalhada (ferramentas, modelo de cada resposta) |
| `Ctrl+B` | Manda o comando ou agente em execução para o background |
| `Ctrl+T` | Mostra ou esconde a lista de tarefas do agente |
| `Ctrl+R` | Busca no histórico de prompts |
| `Ctrl+G` | Edita o prompt no editor externo |
| `Ctrl+V` (`Alt+V` no Windows) | Cola imagem |
| `Ctrl+X Ctrl+K` | Para todos os subagents em background |
| `/` no início | Command ou skill (até 6 encadeados: `/skill-a /skill-b pedido`) |
| `!` no início | Roda um comando no shell e o agente vê a saída |
| `@` | Menciona arquivo (autocompleta o caminho) |

---

## 7. Trabalho longo, paralelo e agendado

| Situação | Use |
|---|---|
| Tarefa com fim verificável e muitos passos | `/goal <condição>`; combine com o modo auto (`Shift+Tab`) para não parar em permissões |
| Repetir algo a cada X minutos enquanto a sessão está aberta | `/loop 10m <prompt>` |
| Rodar sem sessão aberta (triagem diária, teste noturno) | `/schedule <descrição>` (na nuvem) |
| Tarefa paralela que precisa do contexto atual | `/subtask <tarefa>` |
| Testar outra abordagem sem perder a atual | `/branch` |
| Copiar a sessão para rodar em segundo plano | `/fork` |
| Liberar o terminal e deixar a sessão rodando | `/background`; acompanhe com `/tasks` |
| Muitos agentes de uma vez | workflow (`ultracode` ou "use um workflow"); acompanhe com `/workflows` |
| Continuar do celular ou de outro PC | `/remote-control`; da nuvem para o terminal: `/teleport` |
| Retomar conversa | `/resume`; em outra máquina: `/save-session` e `/resume-session` |

---

## 8. Contexto e custo

- Padrão: `opus`, janela de 200k, esforço `medium`. Suba com `/effort high`
  (debug difícil, arquitetura) ou `/model opus[1m]` (base enorme de uma vez)
  só quando a tarefa pedir.
- `/context` mostra o que ocupa a janela; `/context all` detalha por
  ferramenta MCP.
- `/compact` quando a status line passar de ~60% e a tarefa continuar;
  `/clear` ao trocar de tarefa.
- `/usage` mostra o custo e o uso da assinatura; `/cost-report` dá o
  relatório local do ECC; `/skill-doctor` mostra quanto cada skill custa e
  quanto é usada.
- Workflows e `ultracode` gastam bem mais: use em auditoria ou migração grande,
  e teste numa fatia antes.

---

## 9. Várias máquinas

Este repo fica clonado **direto em `~/.claude`** nas 3 máquinas.

| Situação | Faça |
|---|---|
| Máquina nova | clone em `~/.claude` e rode `bootstrap.ps1` (README, "Máquina nova") |
| Depois de `git pull` | `bootstrap.ps1` se mudou plugin ou settings; na dúvida, rode |
| Conferir se está tudo certo | `node ~/.claude/scripts/sync/check-machine.js` |
| Mudei hook, env, model ou plugin no `settings.json` | `make-shared.js`, `check-fluxo.js`, `check-ascii.js`, commit e push |

O `check-machine.js` só lê. Ele confere o repo atualizado, o `settings.json`
igual ao compartilhado, os plugins e os MCP instalados, o fluxo completo e as
ferramentas (`gh`, `playwright-cli`, `python3`, `sh`). Para cada falta, mostra o
comando que resolve.

---

## 10. Manter a config

| Mudança | Depois rode |
|---|---|
| Nova skill, agent ou command | adicione uma linha em `skills/fluxo/catalogo.md`; `check-fluxo.js` |
| Tirar algo de uso | mova para `archive/`; atualize o catálogo |
| Reativar algo arquivado | mova de `archive/` de volta; adicione ao catálogo |
| Hook, env, model ou plugin | `make-shared.js` e `check-ascii.js` |
| Qualquer `.ps1`, `.js` ou `.json` | `check-ascii.js` |
| Preferência nova sua | seção "Preferências do usuário" no `CLAUDE.md` |

Os verificadores (`check-fluxo.js`, `check-ascii.js`) são os "testes" deste
repo: os dois precisam passar antes de commitar.

---

## 11. Quando algo dá errado

| Sintoma | Causa provável e saída |
|---|---|
| "Bloqueado: --no-verify" | Hook `block-no-verify`. Corrija o que o hook de commit reclamou |
| Edição em `.eslintrc`, `biome.json` etc. bloqueada | Hook `config-protection`. Corrija o código, não a regra |
| O agente não encerra e pede doc | Hook `docs-sync-check`. Atualize a doc ou justifique; ele só segura uma vez |
| `context-mode` falha com `NODE_MODULE_VERSION` | Trocou a versão do Node: `npm rebuild better-sqlite3` na pasta do plugin e reinicie |
| `omniroute` aparece como falha no `/mcp` | O servidor OmniRoute não está rodando; é opcional |
| `/remote-control` parou | Alguém rodou `headroom init -g claude`; rode `apply-shared.ps1` para remover o `ANTHROPIC_BASE_URL` |
| Plugin declarado não aparece | `apply-plugins.js` (a extensão do VS Code não instala marketplace novo sozinha) |
| Algo estranho no Claude Code em si | `/doctor`; problema de execução: `/debug` |
| Muitos pedidos de permissão | `/fewer-permission-prompts` |
| Script `.ps1` quebra com erro sem sentido | Caractere não-ASCII: `check-ascii.js` acha |

---

## 12. Onde fica cada coisa

| Caminho | O que é |
|---|---|
| `CLAUDE.md` | Índice e preferências (sempre carregado) |
| `rules/common/` | Regras sempre ativas |
| `rules/<lang>/` | Regras por linguagem |
| `skills/fluxo/` | Fluxo padrão e catálogo completo |
| `skills/`, `agents/`, `commands/` | Ferramentas ativas |
| `archive/` | Ferramentas de outras stacks (não carregam) |
| `scripts/hooks/` | Implementação dos hooks |
| `scripts/sync/` | Sincronização e verificadores |
| `settings.shared.json` | Hooks, env, modelo e plugins versionados |
| `SETUP_TODO.md` | Checklist por máquina e MCP que exigem credencial |
| `docs/config-detalhes.md` | Detalhes técnicos e histórico de decisões |
| `docs/manual.md` | Este manual |
