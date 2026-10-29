# Detalhes da configuração

Referência completa que saiu do `CLAUDE.md` em 2026-10-28 para reduzir o que
entra no contexto em toda sessão. O `CLAUDE.md` mantém o resumo e aponta para
cá. Este arquivo **não** é carregado automaticamente.

## Skills de frontend e design (instaladas de terceiros, 2026-10-28)

Copiadas para `skills/` (não são plugin; atualizar = copiar de novo do upstream):

| Skill | Origem | Para quê |
|---|---|---|
| `design-taste-frontend` | `Leonxlnx/taste-skill` v2.1.5 (MIT) | Direção de arte anti-"cara de IA": sorteia direções, tipografia e paleta de uma biblioteca, e inspeciona a página num navegador real (`scripts/inspect.mjs`). Precisa de Node 22+ e Chrome/Edge/Chromium |
| `image-to-code` | `Leonxlnx/imagegen-skills` (MIT) | Implementa fielmente a partir de uma imagem de design (mockup, print, export do Figma). Escrita para o Codex, que gera imagem; ganhou um bloco local de adaptação: no Claude Code usa a imagem dada pelo usuário, ou uma ferramenta de imagem se houver, ou cai para `design-taste-frontend` |
| `awesome-design` | `VoltAgent/awesome-design-md` + `bergside/awesome-design-skills` (MIT) | 84 `DESIGN.md` inspirados em marcas reais (Stripe, Linear, Vercel, Notion...) em `designs/`, e 67 estilos genéricos (minimal, brutalism, glassmorphism, shadcn...) em `styles/`. Wrapper próprio com índice; os estilos do bergside entram como arquivos, não como 67 skills |
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

## Windows Terminal padronizado (2026-10-29)

Pedido do usuário: o terminal do PC pessoal virar o padrão nas 3 máquinas.
Uso está no README ("Windows Terminal").

- **Fonte:** `terminal/windows-terminal.json`, copiado do `settings.json` do
  Terminal do PC pessoal. Aplicado por `scripts/sync/apply-terminal.js`, que o
  bootstrap chama no passo 6, e conferido (como opcional) pelo `check-machine.js`.
- **Script em Node, não em `.ps1`:** o perfil tem o emoji 🤖, e o
  `ConvertTo-Json` do PowerShell 5.1 escapa e reordena o JSON. Em Node, a ordem
  das chaves se mantém.
- **Funde, não substitui:** cada máquina tem perfis próprios (o Ubuntu do WSL
  no note do serviço, perfis do Visual Studio). Só os perfis com os guids do repo
  são criados ou atualizados.
- **WSL continua padrão onde já é:** no note do serviço, o WSL fica reservado a
  outro projeto e o Ubuntu é o padrão de propósito. O script não troca isso
  sem `--set-default`.
- **Fora do escopo, de propósito:** PowerShell 7, Nerd Font e perfil do pwsh
  (aliases `ccc`, `ccr` etc.), que foram testados no note do serviço. O padrão é
  o do PC pessoal: `cmd` + Cascadia Code, que vem com o Windows 11. A status
  line é a do repo (`scripts/statusline.js`), sem ícones de Nerd Font.

### Hook injetado pelo context-mode (2026-10-29)

A cada início de sessão, o plugin `context-mode` grava no `settings.json`
**local** um hook `SessionStart` que roda `~/.claude/hooks/context-mode-cache-heal.mjs`
(caminho absoluto da máquina). Ele não vai para o `settings.shared.json`
porque não é portátil e o plugin o recria sozinho. O `check-machine.js` ignora
esse hook ao comparar `hooks`, e o arquivo está no `.gitignore`.

## Fluxo padrão (2026-10-28)

Pedido do usuário: um fluxo único, igual em todo projeto, que use tudo o que
está instalado e o que o Claude Code oferece nativamente.

- `rules/common/fluxo-padrao.md` (sempre carregado, curto): classificação por
  tipo e tamanho e as 9 fases. Substituiu `development-workflow.md`, texto
  genérico do ECC que mandava usar `gh search` e Exa.
- Skill `fluxo`: ferramenta por fase e stack, modos `/fluxo <pedido>` e
  `/fluxo init`. Fica numa skill para o detalhe só entrar no contexto quando a
  tarefa é de código.
- `skills/fluxo/catalogo.md`: inventário de skills, agents, commands, plugins,
  MCP e recursos nativos, com fase e quando usar; duplicatas têm uma escolha
  principal. `scripts/sync/check-fluxo.js` falha se algo de `skills/`,
  `agents/` ou `commands/` não estiver nele. Ignora `skills/synced/` e
  `skills/learned/`, que o próprio Claude Code cria (sync do claude.ai e
  aprendizado contínuo) e variam por máquina.
- Decisões: espinha dorsal própria (não o fluxo completo do `superpowers`; dele
  entram brainstorming, debug sistemático, verificação antes de concluir,
  recepção de revisão, worktrees e fechamento de branch); aprovação do usuário
  só no plano de tarefa grande; commit e merge sem portão.
- Arquivados por duplicarem o `fluxo`: skills `orch-pipeline`,
  `orch-add-feature`, `orch-change-feature`, `orch-fix-defect`,
  `orch-refine-code`; commands `orch-*`, `prp-plan`, `prp-implement`, `prp-pr`,
  `feature-dev`. A skill `continuous-learning` (v1) ficou porque o hook
  `evaluate-session.js` lê o `config.json` dela.
- `plan` e `code-review` do ECC têm o nome de comandos nativos. A doc oficial
  (skills, "Resolve skills that share a name") diz que o do usuário substitui o
  nativo mas não os aliases: `/plan` e `/code-review` abrem os do ECC, o modo
  plano nativo fica no `Shift+Tab` e a revisão nativa em `/review`. Mantidos
  assim porque o `/plan` do ECC alimenta o `plan-canvas` e o `/plan-prd`.
- `scripts/sync/check-machine.js` (só leitura) substituiu o checklist manual do
  `SETUP_TODO.md`: confere repo, settings, plugins, MCP, ferramentas e fluxo, e
  mostra o comando que resolve cada falta. O `bootstrap.ps1` roda no fim.
- `docs/manual.md`: manual de uso, o que é automático e o que se aciona.

## Sessões na nuvem (2026-10-28)

Na nuvem (claude.ai/code) o `~/.claude` da VM começa vazio: a doc oficial
lista `~/.claude/CLAUDE.md`, skills, agents, commands, plugins e MCP de usuário
como "não disponíveis", porque ficam no PC. O caminho oficial é um setup script
que escreve em `~/.claude` na VM; o `scripts/sync/cloud-setup.sh` faz isso com
a config inteira. Verificado numa VM de nuvem: o `~/.claude` já tem `skills/`
do próprio ambiente e não tem `settings.json`, então o script só acrescenta
(não apaga) e cria o `settings.json`. Testado com home falsa: copia tudo,
mescla `hooks`, `env`, `enabledPlugins` e `extraKnownMarketplaces`, aplica o
MCP sem `filesystem`, e o hook `block-no-verify` rodando da cópia bloqueou um
`git commit --no-verify`. `model`, `effortLevel`, `statusLine` e
`autoUpdatesChannel` ficam de fora (o modelo da nuvem é escolhido na
interface). Plugins: `apply-plugins.js` com `timeout 200`, porque o cache do
ambiente só é gravado se o setup terminar em ~5 min. O ambiente de nuvem
pessoal não tem campo Repositories (verificado na tela em 2026-10-28), então o
setup script só consegue clonar repo público: por isso o repo passou a ser
público. Testado numa sessão: um repo público não anexado clona sem erro.
Revisão antes de abrir (estado atual, inclusive `archive/`, e
todo o histórico do git): nenhuma chave ou token (padrões de GitHub, Anthropic,
OpenAI, AWS, Google, Slack, Supabase, Vercel, JWT, chave privada); nenhum
`settings.json`, `.claude.json`, credencial, sessão ou métrica jamais
commitado; `settings.shared.json` nunca teve `permissions` em nenhuma versão;
e-mails, IPs e hosts encontrados são exemplos de documentação. Dado pessoal:
o primeiro nome e uma pasta do Google Drive em caminhos de docs (trocados por
`~` no estado atual; continuam em commits antigos) e o gmail como autor de 5
commits. Reescrever o histórico para tirar isso exigiria force push e foi
deixado de lado. Não testado
ainda: o setup script real num ambiente novo e a instalação dos plugins na VM.
`check-machine.js` reconhece a nuvem (`CLAUDE_CODE_REMOTE=true`) e compara só
o que o `cloud-setup.sh` instala.

## Hooks ativos

Mesclados em `~/.claude/settings.json` sob a chave `hooks`. Nenhuma configuração
anterior foi sobrescrita — `permissions`, `model`, `effortLevel` e
`enabledPlugins` seguem como estavam.

Distribuição: `PreToolUse` 8 · `Stop` 8 · `SessionStart` 2 · `PostToolUse` 2 ·
`PostToolUseFailure` 2 · `PreCompact` 1 · `SessionEnd` 1.

Os comandos dos hooks não usam caminho fixo: trazem um resolver JS inline que
localiza a raiz via `scripts/lib/resolve-ecc-root.js`. Verificado que ele
resolve para `~\.claude` (`%USERPROFILE%\.claude`). Por isso **não há** `${CLAUDE_PLUGIN_ROOT}`
literal a substituir.

### Variáveis de controle (em `settings.json` → `env`)

| Variável | Valor | Efeito |
|---|---|---|
| `ECC_HOOK_PROFILE` | `standard` | Perfil padrão. Ativa format/typecheck no `Stop`, check de `console.log`, tracking de custo e sessão |
| `ECC_GATEGUARD` | `off` | **Desliga o GateGuard** (ver abaixo) |
| `ECC_DISABLED_HOOKS` | `pre:bash:auto-tmux-dev` | Desliga o `auto-tmux-dev` (ver abaixo) |
| `ECC_SESSION_START_CONTEXT` | `off` | Não injeta resumo da sessão anterior, instincts e learned skills no início (até 8 KB). A memória entre sessões fica com o `claude-mem`; o hook ainda grava as sessões. Para religar, remova a variável |

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
| `filesystem` | não — escopo: `~\Desktop` e uma pasta do Google Drive (`G:\Meu Drive\...`) |

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
  `superpowers` e `claude-security` (estes dois a pedido do usuário em 2026-10-28).
  `superpowers` (de `obra/superpowers`, listado no marketplace oficial) injeta
  uma skill de uso no início de cada sessão e se sobrepõe em parte ao ECC
  (`planner`, `tdd-guide`, `code-reviewer`); se o `/context` pesar, desligue-o
  primeiro. `claude-security` roda varredura de vulnerabilidades com
  `/claude-security`; seus hooks chamam `sh` (Git Bash) e os helpers são Python,
  então precisa de `python3` 3.9+ no PATH (é o nome que ele chama; no Windows,
  o alias da Microsoft Store não serve). O `check-machine.js` confere.
  `session-report` e `plugin-dev` ficam declarados como `false` (desligados em
  2026-10-28 para economizar contexto); para usar, troque para `true`.

Declarar em `enabledPlugins` + `extraKnownMarketplaces` **não basta** na
extensão do VS Code: ela instala sozinha só plugins de marketplace que já está
no disco, e pula os novos em silêncio. Quem instala é `apply-plugins.js`
(chamado pelo `bootstrap.ps1`). O cache em `plugins/` não é versionado.

Evitados por duplicarem o que já existe: `code-review` (ECC e nativo), `feature-dev` (coberto pela skill `fluxo`),
`context7` (MCP), `remember` (MCP `memory`).

Plugins de terceiros ativados a pedido do usuário (rodam hooks/código externo;
instalados por `apply-plugins.js`):

| Plugin | Marketplace | Requisito extra |
|---|---|---|
| `cartographer@cartographer-marketplace` | `kingbootoshi/cartographer` | — |
| `claude-mem@thedotmack` | `thedotmack/claude-mem` | worker em background (sobe sozinho) |
| `omniroute@omniroute-claude-plugin` | `projectsaibg/omniroute-claude-plugin` | servidor OmniRoute rodando (`npm i -g omniroute` e `omniroute`) em `localhost:20128` |

Avaliado e **não** ativado (decisão de 2026-10-22, ver `SETUP_TODO.md`):
`headroom@headroom-marketplace` (`headroomlabs-ai/headroom`). É um proxy local
(`127.0.0.1:8787`) que comprime o contexto antes de enviar à API, mas
`headroom init -g claude` aponta `ANTHROPIC_BASE_URL` para o proxy, e isso
desliga o `/remote-control`, que o usuário usa. Por isso o plugin saiu de
`settings.shared.json` e o `bootstrap.ps1` não instala o pacote nem roda o
`init`. Não rodar `headroom init -g claude`. Numa máquina onde ele já rodou,
`apply-shared.ps1` sobrescreve `env`/`hooks` e remove o `ANTHROPIC_BASE_URL`.

`omniroute` (ativado a pedido do usuário em 2026-10-28; antes estava só
avaliado) não traz commands, skills nem hooks: só registra o MCP em
`http://localhost:20128/api/mcp/stream`. Sem o servidor OmniRoute de pé, o MCP
aparece como falha de conexão no `/mcp` e nada mais quebra. O OmniRoute é um
gateway que repassa prompts a provedores de terceiros; o plugin não muda o
`ANTHROPIC_BASE_URL`, então o `/remote-control` continua funcionando.

Avaliado e **não** ativado: `caveman` (respostas telegráficas). Corta tokens
de saída em prosa, que são uma fração pequena do custo numa sessão de código
(o grosso é contexto de entrada: arquivos, tool results, histórico), e piora a
leitura das respostas.

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
