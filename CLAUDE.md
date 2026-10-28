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
| `agents/` | 68 | Subagents especializados (`.md` com frontmatter) |
| `commands/` | 95 | Slash commands |
| `skills/` | 289 | Skills em subdiretórios com `SKILL.md` |
| `rules/` | 124 | Regras em 22 subdiretórios (`common/` + 21 linguagens) |
| `scripts/` | 264 | Utilitários Node.js, implementação dos hooks e sync |
| `prompts/` | 1 | Roteiros reutilizáveis do usuário (ex.: `setup-roadmap-github.md`, usado por `/setup-github`) |
| `contexts/` | 3 | Arquivos de contexto (referência manual, não carregam sozinhos) |
| `mcp-configs/` | 1 | `mcp-servers.json` — catálogo de referência, não ativo |

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
| `powershell -ExecutionPolicy Bypass -File scripts\sync\bootstrap.ps1` | Orquestra os três acima, configura o Headroom e instala o `playwright-cli` global; usar em máquina nova, após o clone, e após `git pull` que mude plugins/settings |

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

> **Só `rules/common/*.md` é carregado automaticamente.** As regras por
> linguagem são referência sob demanda — siga a tabela abaixo.

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
- Angular/TypeScript: `typescript-reviewer`, `react-reviewer`, `a11y-architect`
- Flutter/Dart: `flutter-reviewer`, `dart-build-resolver`
- Transversais: `code-reviewer`, `security-reviewer`, `planner`, `architect`,
  `tdd-guide`, `silent-failure-hunter`, `performance-optimizer`, `code-explorer`

### Skills mais relevantes para as stacks em uso

`springboot-patterns`, `springboot-security`, `springboot-tdd`,
`springboot-verification`, `jpa-patterns`, `java-coding-standards`,
`angular-developer`, `dart-flutter-patterns`, `flutter-dart-code-review`,
`postgres-patterns`, `database-migrations`, `docker-patterns`, `github-ops`,
`e2e-testing`, `git-workflow`

### Skills de frontend e design (instaladas de terceiros, 2026-10-28)

Copiadas para `skills/` (não são plugin; atualizar = copiar de novo do upstream):

| Skill | Origem | Para quê |
|---|---|---|
| `design-taste-frontend` | `Leonxlnx/taste-skill` v2.1.5 (MIT) | Direção de arte anti-"cara de IA": sorteia direções, tipografia e paleta de uma biblioteca, e inspeciona a página num navegador real (`scripts/inspect.mjs`). Precisa de Node 22+ e Chrome/Edge/Chromium |
| `image-to-code` | `Leonxlnx/imagegen-skills` (MIT) | Gera a imagem do design **antes** de codar e implementa a partir dela. Claude Code não gera imagem sozinho: sem uma ferramenta de imagem, use com uma imagem/print de referência dada pelo usuário |
| `awesome-design` | `VoltAgent/awesome-design-md` (MIT) | 84 `DESIGN.md` inspirados em marcas reais (Stripe, Linear, Vercel, Notion...). Wrapper próprio com índice; os arquivos ficam em `skills/awesome-design/designs/` |
| `web-design-guidelines` | `vercel-labs/agent-skills` (MIT) | Revisão de UI contra as Web Interface Guidelines da Vercel (a11y, foco, forms, motion, tipografia). Busca as regras ao vivo; se o WebFetch falhar, usa `guidelines-snapshot.md` |
| `playwright-cli` | `microsoft/playwright-cli` (Apache-2.0) | Abrir, clicar, preencher e tirar screenshot/snapshot do app rodando. Precisa do binário: `npm install -g @playwright/cli@latest` (o bootstrap instala) |

Fluxo ao construir ou mexer em UI web (landing, página, tela de app):

1. **Antes de codar:** `design-taste-frontend`. Se o usuário citar uma marca
   como referência ou o projeto não tiver identidade visual, `awesome-design`
   para fixar os tokens em `DESIGN.md`. Se houver imagem de referência (ou
   ferramenta de gerar imagem), `image-to-code`.
2. **Com o dev server de pé:** `playwright-cli` para abrir a página, navegar
   e tirar screenshot em desktop e mobile. Olhe o resultado antes de dizer
   que terminou.
3. **Antes do PR:** `web-design-guidelines` nos arquivos de UI alterados.

Não se aplica a backend, nem a Flutter (as três primeiras são para web). Em
Angular, os tokens do `DESIGN.md` vão para o tema/SCSS do projeto.

## Hooks ativos

Mesclados em `~/.claude/settings.json` sob a chave `hooks`. Nenhuma configuração
anterior foi sobrescrita — `permissions`, `model`, `effortLevel` e
`enabledPlugins` seguem como estavam.

Distribuição: `PreToolUse` 8 · `Stop` 8 · `SessionStart` 2 · `PostToolUse` 2 ·
`PostToolUseFailure` 2 · `PreCompact` 1 · `SessionEnd` 1.

Os comandos dos hooks não usam caminho fixo: trazem um resolver JS inline que
localiza a raiz via `scripts/lib/resolve-ecc-root.js`. Verificado que ele
resolve para `C:\Users\Lucas\.claude`. Por isso **não há** `${CLAUDE_PLUGIN_ROOT}`
literal a substituir.

### Variáveis de controle (em `settings.json` → `env`)

| Variável | Valor | Efeito |
|---|---|---|
| `ECC_HOOK_PROFILE` | `standard` | Perfil padrão. Ativa format/typecheck no `Stop`, check de `console.log`, tracking de custo e sessão |
| `ECC_GATEGUARD` | `off` | **Desliga o GateGuard** (ver abaixo) |
| `ECC_DISABLED_HOOKS` | `pre:bash:auto-tmux-dev` | Desliga o `auto-tmux-dev` (ver abaixo) |

Outro controle disponível, não usado no momento:
`ECC_HOOKS_ENABLED=false` (mata todos os hooks).

### Status line

`statusLine` (versionado em `settings.shared.json`) roda
`scripts/statusline.js`: pasta, branch git (`*` = alterações), modelo, % de
contexto (amarelo ≥60, vermelho ≥80), uso da assinatura (`5h 23% 14:30`,
`sem 41% sex 09:00`: % consumido e quando reseta, mesmas cores), custo e
linhas +/−. O uso vem de `rate_limits` no JSON do Claude Code, que só existe
em conta Pro/Max e só chega depois da 1ª resposta da sessão.

### Comportamentos que alteram ou bloqueiam ações

- **`block-no-verify`** — BLOQUEIA (`exit 2`) `git commit --no-verify`.
  Ativo em todos os perfis. Mantido de propósito.
- **`config-protection`** — BLOQUEIA (`exit 2`) edição de arquivos de config de
  linter/formatter já existentes (ex.: `eslint.config.js`), para forçar corrigir
  o código em vez de afrouxar a regra.
- **`gateguard-fact-force`** — negaria o primeiro `Bash` da sessão e o primeiro
  `Edit` de cada arquivo, exigindo declaração de fatos antes. Usa
  `permissionDecision: "deny"`, não `exit 2`. **Desligado** via `ECC_GATEGUARD=off`.
  Para religar, remova essa env var.
- **`auto-tmux-dev`** — não bloqueia, mas **reescreve** comandos de dev server.
  No Windows, `npm run dev` vira `start "DevServer-<pasta>" cmd /k "npm run dev"`,
  abrindo uma janela cmd separada. Efeito colateral: o log do dev server fica
  nessa janela e não é legível pelo agente. **Desligado** via
  `ECC_DISABLED_HOOKS` (2026-10-22). Para religar, remova o id dessa env var.
- **`docs-sync-check`** (`stop:docs-sync-check`, customização própria) — só em
  repositório com `docs/` na raiz: se a resposta termina com código alterado e
  nenhum doc (`docs/**` ou `*.md`) alterado, bloqueia o `Stop` **uma vez** com
  `decision: "block"`, pedindo atualizar a doc ou justificar. Não repete para os
  mesmos arquivos no mesmo `HEAD` (estado em `state/docs-sync-check.json`).
  Implementa `rules/common/documentacao-viva.md`. Para desligar, acrescente
  `stop:docs-sync-check` a `ECC_DISABLED_HOOKS` (lista separada por vírgula).

### Não é um problema nesta máquina

`scripts/hooks/pre-bash-dev-server-block.js` bloquearia `npm run dev` fora do
tmux, mas está **inerte** por dois motivos independentes: tem guarda
`process.platform !== 'win32'`, e não está registrado em
`scripts/hooks/bash-hook-dispatcher.js`. É código legado. Nada foi removido.

## MCP servers

Ativos em `~/.claude.json` → `mcpServers` (nível raiz = escopo global):

| Server | Precisa de chave |
|---|---|
| `memory` | não |
| `sequential-thinking` | não |
| `context7` | não |
| `filesystem` | não — escopo: `C:\Users\Lucas\Desktop` e `G:\Meu Drive\TCC` |

Pendências com credencial estão em `~/.claude/SETUP_TODO.md`.

`~/.claude/mcp-configs/mcp-servers.json` é apenas catálogo de referência (~40
servers). Nada ali é lido automaticamente.

## Plugins

Via `settings.json` → `enabledPlugins`:

- `context-mode@context-mode` (marketplace `mksglu/context-mode`) — já existia,
  preservado. Depende do módulo nativo `better-sqlite3`: **depois de trocar a
  versão do Node**, rode `npm rebuild better-sqlite3` na pasta do plugin em
  `plugins/cache/context-mode/` e reinicie o Claude Code. Sem isso,
  `ctx_fetch_and_index` falha com `NODE_MODULE_VERSION` e o hook dele continua
  bloqueando o WebFetch.
- Marketplace oficial `claude-plugins-official` (`anthropics/claude-plugins-official`):
  `claude-code-setup`, `claude-md-management`, `hookify`, `security-guidance`,
  `jdtls-lsp`, `typescript-lsp`, `commit-commands`, `pr-review-toolkit`,
  `session-report`, `plugin-dev`.

Declarar em `enabledPlugins` + `extraKnownMarketplaces` **não basta** na
extensão do VS Code: ela instala sozinha só plugins de marketplace que já está
no disco, e pula os novos em silêncio. Quem instala é `apply-plugins.js`
(chamado pelo `bootstrap.ps1`). O cache em `plugins/` não é versionado.

Evitados por duplicarem o que já existe: `code-review`/`feature-dev` (ECC),
`context7` (MCP), `remember` (MCP `memory`).

Plugins de terceiros ativados a pedido do usuário (rodam hooks/código externo;
instalados por `apply-plugins.js`):

| Plugin | Marketplace | Requisito extra |
|---|---|---|
| `cartographer@cartographer-marketplace` | `kingbootoshi/cartographer` | — |
| `claude-mem@thedotmack` | `thedotmack/claude-mem` | worker em background (sobe sozinho) |
| `headroom@headroom-marketplace` | `headroomlabs-ai/headroom` | Python 3.10+ e `pip install headroom-ai[all]` (o bootstrap faz, se houver Python) |

Headroom é um proxy local (`127.0.0.1:8787`) que comprime o contexto antes de
enviar à API. `headroom init -g claude` grava `ANTHROPIC_BASE_URL` e hooks no
`settings.json` **local**. Isso fica fora de `settings.shared.json` de
propósito: numa máquina sem o proxy, o Claude Code ficaria sem API. Por isso o
bootstrap roda o `init` depois do `apply-shared` (que sobrescreve `env`/`hooks`).
Diagnóstico: `headroom doctor`. Para desligar: remova `ANTHROPIC_BASE_URL` do
`env` local. Efeito colateral: `/remote-control` fica indisponível enquanto
`ANTHROPIC_BASE_URL` aponta para o proxy.

Avaliado e **não** ativado: `omniroute@omniroute-claude-plugin`
(`projectsaibg/omniroute-claude-plugin`) — só conecta a um servidor OmniRoute
em `localhost:20128`, gateway que repassa prompts a provedores de terceiros.

`/plugin` não existe na extensão do VS Code. Para gerenciar plugins à mão, use o
CLI embutido: `...\extensions\anthropic.claude-code-<versão>\resources\native-binary\claude.exe plugin ...`.

## Backup

Estado anterior de `settings.json` e `.claude.json`:
`~/.claude/backups/pre-ecc-20260814-201119/`

## Sincronização entre máquinas

A conta do VS Code / claude.ai **não** replica `~/.claude/`. A sincronização é
feita por git: este diretório é um repositório. Ver [README.md](README.md).

- `settings.shared.json` — parte portátil da config (hooks, env, model,
  plugins). **Versionado.**
- `settings.json` — config local, inclui `permissions.allow` com caminhos e
  aprovações desta máquina. **Não versionado.**
- `~/.claude.json` — fica fora deste diretório; contém `oauthAccount` e os MCP
  servers. **Nunca versionar.**

Depois de mudar hooks, env, model ou plugins, rode antes de commitar (ver
tabela de Comandos acima):

```powershell
node ~\.claude\scripts\sync\make-shared.js
node ~\.claude\scripts\sync\check-ascii.js
```

Numa máquina nova, depois do clone, e depois de um `git pull` que mude
`settings.shared.json` ou `scripts/sync/mcp-shared.json`:

```powershell
powershell -ExecutionPolicy Bypass -File ~\.claude\scripts\sync\bootstrap.ps1
```

Todos os scripts de `scripts/sync/` aceitam `$env:CLAUDE_HOME` para
sobrescrever o home dir — é assim que eles são exercitados sem tocar no
`~/.claude` real da máquina.

`skills/synced/` e `state/` são estado local do runtime e ficam fora do git.

## Preferências do usuário

<!-- Vazio de propósito. Nada aqui foi presumido.
     Adicione preferências conforme forem confirmadas. -->
