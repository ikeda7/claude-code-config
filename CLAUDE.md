# Configuração global do Claude Code

Índice factual do que está instalado em `~/.claude/` nesta máquina.
Instalado em 2026-08-14 a partir de <https://github.com/affaan-m/everything-claude-code>.

> Este arquivo descreve **o que existe**, não preferências de trabalho.
> Preferências confirmadas pelo usuário podem ser adicionadas abaixo, na seção final.

## Ambiente da máquina principal

Este arquivo é sincronizado entre 3 máquinas. Os dados abaixo são da máquina
onde a config nasceu; nas outras, confira versões antes de presumir.

- SO: Windows 11 Enterprise (`win32`)
- Shell primário: PowerShell 5.1; Bash (Git Bash) também disponível
- Node.js v24.17.0 · git 2.54.0
- **tmux não está instalado.** Binário `wsl` presente, mas o Claude Code roda nativo no Windows
- Instalação por **cópia de arquivos** para `~/.claude/`, não como plugin de marketplace

## O que está instalado

| Diretório | Qtd | Conteúdo |
|---|---|---|
| `agents/` | 26 | Subagents das stacks em uso e transversais |
| `commands/` | 46 | Slash commands |
| `skills/` | 53 | Skills em subdiretórios com `SKILL.md` |
| `rules/` | 124 | Regras em 22 subdiretórios (`common/` + 21 linguagens) |
| `scripts/` | 267 | Utilitários Node.js, implementação dos hooks e sync |
| `prompts/` | 1 | Roteiros reutilizáveis do usuário (ex.: `setup-roadmap-github.md`, usado por `/setup-github`) |
| `contexts/` | 3 | Arquivos de contexto (referência manual, não carregam sozinhos) |
| `mcp-configs/` | 1 | `mcp-servers.json` — catálogo de referência, não ativo |
| `archive/` | 236 · 42 · 49 | Skills, agents e commands de outras stacks. **Não carregam.** Para usar um, mova de volta para `skills/`, `agents/` ou `commands/` |

## Comandos

Este repositório não é uma aplicação: não há `package.json`, build ou suíte de
testes. Os "comandos" são os scripts de sincronização em `scripts/sync/`:

| Comando | Quando rodar |
|---|---|
| `node scripts\sync\make-shared.js` | Depois de mudar hooks, env, model ou plugins em `settings.json`. Regenera `settings.shared.json` e aborta se detectar segredo |
| `node scripts\sync\check-ascii.js` | Antes de commitar qualquer mudança em `.ps1`, `.js`, `.mjs` ou `.json`. Falha (exit 1) se achar BOM ou byte não-ASCII em `.ps1` — é o verificador mais próximo de um "teste" que este repo tem |
| `powershell -ExecutionPolicy Bypass -File scripts\sync\apply-shared.ps1` | Aplica `settings.shared.json` no `settings.json` local, preservando `permissions` |
| `node scripts\sync\apply-mcp.js [--force]` | Injeta os MCP servers portáteis (`scripts\sync\mcp-shared.json`) em `~/.claude.json`, preservando `oauthAccount` |
| `node scripts\sync\apply-plugins.js [--dry-run]` | Registra os marketplaces e instala os plugins de `settings.shared.json` via CLI do Claude Code (PATH ou binário da extensão do VS Code). Idempotente |
| `powershell -ExecutionPolicy Bypass -File scripts\sync\bootstrap.ps1` | Orquestra os três acima e instala o `playwright-cli` global (não instala nem configura o Headroom); usar em máquina nova, após o clone, e após `git pull` que mude plugins/settings |

Fluxo padrão antes de commitar mudança de config:

```powershell
node .\scripts\sync\make-shared.js
node .\scripts\sync\check-ascii.js
```

### Regras por linguagem (`rules/<lang>/`)

22 linguagens. Cada uma tem `coding-style.md`, `hooks.md`, `patterns.md`,
`security.md`, `testing.md`:

`angular`, `arkts`, `common`, `cpp`, `csharp`, `dart`, `fsharp`, `golang`,
`java`, `kotlin`, `nuxt`, `perl`, `php`, `python`, `react`, `react-native`,
`ruby`, `rust`, `swift`, `typescript`, `vue`, `web`

`python/` tem ainda `fastapi.md`.

> **Só `rules/common/*.md` é carregado sempre.** As regras por linguagem têm
> `paths:` e entram quando um arquivo daquele tipo é tocado; siga também a
> tabela abaixo. `common/deploy-vercel.md` só entra com `vercel.json` — em
> projeto que vai para a Vercel sem esse arquivo, leia-o à mão.

#### Quando carregar cada uma

No início de uma tarefa que envolva escrever ou revisar código, identifique a
stack pelos arquivos-marcadores na raiz do projeto e **leia os arquivos da
linguagem correspondente antes de editar**. Leia só o que for usar:
`coding-style.md` e `patterns.md` para escrever, `testing.md` para testes,
`security.md` em código que toca autenticação, entrada de usuário ou banco.

| Marcador no projeto | Leia |
|---|---|
| `pom.xml`, `build.gradle`, `*.java` | `rules/java/` |
| `angular.json` | `rules/angular/` + `rules/typescript/` |
| `pubspec.yaml`, `*.dart` | `rules/dart/` |
| `tsconfig.json`, `*.ts` sem Angular | `rules/typescript/` |
| `package.json` com `react` | `rules/react/` + `rules/typescript/` |
| `requirements.txt`, `pyproject.toml` | `rules/python/` |
| `go.mod` | `rules/golang/` |
| `Cargo.toml` | `rules/rust/` |
| HTML/CSS, acessibilidade, frontend em geral | `rules/web/` |

Quando a regra da linguagem conflitar com `rules/common/`, **a da linguagem
vence** — ela é mais específica. Exemplo: `common/coding-style.md` prega
imutabilidade como padrão, mas Go idiomático usa ponteiro para mutação.

As stacks em uso nesta máquina são Java/Spring, Angular/TypeScript e
Flutter/Dart — essas três são as que mais vão disparar a tabela.

### Agents mais relevantes para as stacks em uso nesta máquina

- Java/Spring: `java-reviewer`, `java-build-resolver`, `database-reviewer`
- Angular/TypeScript: `typescript-reviewer`, `a11y-architect`
- Flutter/Dart: `flutter-reviewer`, `dart-build-resolver`
- Transversais: `code-reviewer`, `security-reviewer`, `planner`, `architect`,
  `tdd-guide`, `silent-failure-hunter`, `performance-optimizer`, `code-explorer`

### Skills mais relevantes para as stacks em uso

`springboot-patterns`, `springboot-security`, `springboot-tdd`,
`springboot-verification`, `jpa-patterns`, `java-coding-standards`,
`angular-developer`, `dart-flutter-patterns`, `flutter-dart-code-review`,
`postgres-patterns`, `database-migrations`, `docker-patterns`, `github-ops`,
`e2e-testing`, `git-workflow`

### Frontend web (UI, landing, tela de app)

Skills `design-taste-frontend`, `awesome-design`, `image-to-code`,
`playwright-cli` e `web-design-guidelines` (de terceiros, ver
`docs/config-detalhes.md`). Fluxo: antes de codar, `design-taste-frontend`
(+ `awesome-design` se citar marca ou não houver identidade visual, + `image-to-code`
se houver imagem); com o dev server de pé, `playwright-cli` para screenshot em
desktop e mobile antes de dizer que terminou; antes do PR, `web-design-guidelines`.
Não se aplica a backend nem a Flutter. Em Angular, tokens do `DESIGN.md` vão para o tema/SCSS.

## Hooks que mudam o comportamento

Perfil `ECC_HOOK_PROFILE=standard`. Detalhes, status line, MCP, plugins e
histórico de decisões: [docs/config-detalhes.md](docs/config-detalhes.md).

- **`block-no-verify`** bloqueia `git commit --no-verify`.
- **`config-protection`** bloqueia editar config de linter/formatter existente:
  corrija o código, não afrouxe a regra.
- **`docs-sync-check`** (repo com `docs/`): bloqueia o `Stop` uma vez se houve
  código alterado sem doc alterada. Atualize a doc ou justifique.
- Desligados: `gateguard-fact-force` (`ECC_GATEGUARD=off`), `auto-tmux-dev`
  (`ECC_DISABLED_HOOKS`) e a injeção de contexto no início da sessão
  (`ECC_SESSION_START_CONTEXT=off`; a memória entre sessões é do `claude-mem`).

## Economia de tokens

Padrão: `opus` (janela 200k) com `effortLevel: medium`. Suba com `/effort high`
ou `/model opus[1m]` só quando a tarefa pedir. `/clear` ao trocar de tarefa,
`/context` para ver o que ocupa a janela. Regras em `rules/common/performance.md`.

## MCP, plugins e sincronização

- MCP ativos (`~/.claude.json`): `memory`, `sequential-thinking`, `context7`,
  `filesystem`. Pendências com credencial: `SETUP_TODO.md`.
- Plugins: `context-mode`, `claude-mem`, `cartographer`, `omniroute` (exige
  servidor OmniRoute local) e os oficiais listados
  em `settings.shared.json`. **Não** rodar `headroom init -g claude` (desliga o
  `/remote-control`).
- `settings.shared.json` é versionado; `settings.json` e `~/.claude.json` não.
  Depois de mudar hooks/env/model/plugins: `make-shared.js` + `check-ascii.js`.
  Após `git pull` que mude settings: `bootstrap.ps1`. Ver [README.md](README.md).

## Preferências do usuário

<!-- Vazio de propósito. Nada aqui foi presumido.
     Adicione preferências conforme forem confirmadas. -->
