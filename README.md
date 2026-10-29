# Ambiente Claude Code — configuração portátil

Configuração global do Claude Code, versionada para ficar idêntica em qualquer
máquina que eu use. Baseada no toolkit
[everything-claude-code](https://github.com/affaan-m/everything-claude-code),
com ajustes próprios.

O objetivo é simples: abrir um projeto em qualquer computador e ter o mesmo
agente, com as mesmas regras, os mesmos comandos e os mesmos automatismos.

## O que tem aqui

| Diretório | Qtd | O que é |
|---|---|---|
| `agents/` | 25 | Subagents das stacks em uso (Java/Spring, Angular/TS, Flutter) e transversais |
| `commands/` | 34 | Slash commands (`/plan`, `/pr`, `/setup-github`, …) |
| `skills/` | 48 | Conhecimento sob demanda, carregado quando a tarefa casa; `fluxo` é o fluxo padrão |
| `archive/` | 242 skills · 43 agents · 61 commands | Fora das stacks em uso; **não carregam**. Para reativar, mova de volta para `skills/`, `agents/` ou `commands/` |
| `rules/` | 124 | Regras: `common/` sempre ativo, 21 linguagens sob demanda |
| `scripts/` | 271 | Implementação dos hooks e utilitários de sync |
| `prompts/` | 1 | Roteiros reutilizáveis meus |
| `docs/` | 3 | `manual.md` (**como usar tudo**: o que é automático, o que acionar, atalhos, problemas comuns), `config-detalhes.md` (detalhes e histórico da config) e `rules-guide.md` (guia de instalação das regras do toolkit original) |
| `contexts/` | 3 | Referência manual |
| `terminal/` | 1 | `windows-terminal.json`: o Windows Terminal padrão (ver "Windows Terminal" abaixo) |
| `mcp-configs/` | 1 | Catálogo de MCP servers (referência, não ativo) |

Resumo em [CLAUDE.md](CLAUDE.md), que é o arquivo que o próprio
Claude Code lê no início de toda sessão.

## O que é carregado automaticamente

Só isto entra no contexto em toda sessão, de todo projeto:

- `CLAUDE.md`
- `rules/common/*.md` — 12 regras, incluindo o fluxo GitFlow e a documentação
  viva (`deploy-vercel.md` tem `paths:` e só entra em projeto com `vercel.json`)
- **o nome e a descrição de cada skill, agent e command** instalado — por isso
  o que não é das stacks em uso fica em `archive/` (ver abaixo)

O `README.md` que vinha em `rules/` foi movido para
[docs/rules-guide.md](docs/rules-guide.md): todo `.md` em `rules/` sem
`paths:` no frontmatter é carregado em toda sessão, e ele só tinha instruções
de instalação do toolkit. As regras por linguagem têm `paths:` (ex.:
`**/*.java`) e só entram quando um arquivo daquele tipo é tocado.

O corpo de cada skill é **sob demanda**, mas as descrições não: com 289 skills
elas somavam ~78 KB (~20k tokens) em todo turno de toda sessão. Em 2026-10-28
as fora das stacks em uso foram para `archive/`, baixando para ~13 KB. Skills entram quando a descrição casa
com a tarefa, agents quando são delegados, commands quando digitados, e as
regras por linguagem seguem a tabela de marcadores no `CLAUDE.md`.

## Customizações próprias

O que difere do toolkit original:

- **`rules/common/gitflow-padrao.md`** — GitFlow obrigatório: `develop` como
  integração, PR sempre, nunca commit direto em `main`/`master`, Conventional
  Commits.
- **`rules/common/deploy-vercel.md`** — três ambientes isolados (dev, preview,
  produção), nada de segredo em variável pública, proteção dos links de
  preview e limites do plano gratuito.
- **`rules/common/documentacao-viva.md`** — todo projeto nasce com `docs/`
  (visão geral, arquitetura, um arquivo por fluxo, ADRs, setup) e toda mudança
  atualiza a doc no mesmo PR, ou justifica por que não. Cobrada pelo hook
  `stop:docs-sync-check` (`scripts/hooks/docs-sync-check.js`), que pede a
  atualização uma vez quando há código alterado sem doc, só em repos com `docs/`.
- **Fluxo padrão** — `rules/common/fluxo-padrao.md` (sempre ativo) classifica a
  tarefa e define as fases; a skill `fluxo` (`/fluxo <pedido>`, `/fluxo init`)
  liga cada fase e stack à ferramenta certa, e `skills/fluxo/catalogo.md` cobre
  tudo que está instalado, inclusive os recursos nativos do Claude Code.
  `scripts/sync/check-fluxo.js` falha se algo instalado ficar fora do catálogo.
  Substituiu `development-workflow.md`, a família `orch-*`, `/prp-*` e
  `/feature-dev` (estes foram para `archive/`).
- **`commands/setup-github.md`** — `/setup-github`, que executa meu roteiro de
  estruturação de repositório (`prompts/setup-roadmap-github.md`).
- **Tabela de regras por linguagem no `CLAUDE.md`** — sem ela, as 110 regras de
  Java/Angular/Dart/etc. ficariam inertes, porque não são autocarregadas.
- **Skills de frontend de terceiros** — `design-taste-frontend`, `image-to-code`,
  `awesome-design`, `web-design-guidelines` e `playwright-cli`, copiadas dos
  repositórios originais (origem e fluxo de uso no `CLAUDE.md`). O bootstrap
  instala o binário `playwright-cli` via npm.
- **GateGuard desligado** (`ECC_GATEGUARD=off`) — por padrão ele nega o primeiro
  Bash de cada sessão e o primeiro Edit de cada arquivo, exigindo justificativa.
  Atrito alto demais para o ganho.
- **Split de `settings.json`** — ver abaixo.

## Uso em várias máquinas

Trabalho em 3 máquinas. Todas usam este mesmo repositório, clonado **direto em
`~/.claude`**, que é a pasta que o Claude Code lê.

No PC pessoal há também um clone de trabalho em
`Desktop\projects\pessoal\claude-code-config`, que é onde as mudanças são
feitas (branch, PR, merge). O `~/.claude` só recebe: depois de cada merge, rode
`git -C $env:USERPROFILE\.claude pull` (e o bootstrap, se mudou settings ou
plugins). Editar direto no `~/.claude` mexe na config em uso no meio da sessão.

### Estado atual

| Máquina | Configurada? |
|---|---|
| PC pessoal (Windows 11, este repo nasceu nele) | Sim, completo em 2026-10-29 (`check-machine.js` sem `FALTA`) |
| Note pessoal | Rodar o passo 1 abaixo |
| Note do serviço | Rodar o passo 1 abaixo, só no Windows (o WSL fica de fora e continua perfil padrão do Terminal) |

**Pendente nos dois notes** (mudanças de 2026-10-28 em diante): siga o
[checklist por máquina do `SETUP_TODO.md`](SETUP_TODO.md#checklist-por-máquina-fazer-nas-3).
Em resumo: `git pull`, rodar o `bootstrap.ps1` **antes** de qualquer
`make-shared.js`, resolver o que o `check-machine.js` apontar e reiniciar o
Claude Code.

### 1. Máquina nova (uma vez só)

Pré-requisitos: Node.js 18+, git, Claude Code instalado e logado.

```powershell
git clone https://github.com/ikeda7/claude-code-config $env:USERPROFILE\.claude
cd $env:USERPROFILE\.claude
powershell -ExecutionPolicy Bypass -File .\scripts\sync\bootstrap.ps1
```

Depois **reinicie o Claude Code** (feche e abra o VS Code ou o terminal).

Se o `git clone` reclamar que a pasta já existe, é porque o Claude Code já
criou um `~/.claude` ali. Renomeie a antiga, clone e copie de volta só o que
precisar:

```powershell
Rename-Item $env:USERPROFILE\.claude .claude.old
# clone + bootstrap como acima, depois, se quiser o histórico de sessões:
Copy-Item $env:USERPROFILE\.claude.old\projects $env:USERPROFILE\.claude\ -Recurse
```

O `bootstrap.ps1` faz tudo: confere pré-requisitos, aplica a configuração
compartilhada, injeta os MCP servers, instala os plugins e o `playwright-cli`,
aplica a personalização do Windows Terminal (ver abaixo) e no fim roda o
`check-machine.js`, que lista o que ainda falta e como resolver.
**Não** instala nem configura o Headroom: ele desligaria o `/remote-control`
(ver `SETUP_TODO.md`).

O que ele **preserva** naquela máquina:

- `permissions` do `settings.json` local — as aprovações de comando de lá
- `oauthAccount` e `projects` do `~/.claude.json` — sua autenticação
- MCP servers customizados que já existirem (use `--force` para sobrescrever)

MCP aposentados (lista `retired` do `mcp-shared.json`: `memory`,
`sequential-thinking`, `filesystem`) são **removidos** do `~/.claude.json`.

Se a máquina já tiver um `~/.claude/` com coisas suas, clone em outro lugar e
copie o que interessa — o bootstrap preserva config, mas o clone por cima
sobrescreveria arquivos.

#### Windows Terminal

`terminal/windows-terminal.json` guarda o terminal do PC pessoal, e o
`apply-terminal.js` funde esse arquivo no Terminal da máquina. O bootstrap já
chama o script, e dá para rodar sozinho:

```powershell
node $env:USERPROFILE\.claude\scripts\sync\apply-terminal.js --dry-run   # só mostra
node $env:USERPROFILE\.claude\scripts\sync\apply-terminal.js             # aplica, com backup
```

- Perfil **Claude Code** (abre `cmd /k claude`, aba laranja, ícone 🤖) como
  padrão, e perfil **Git Bash** quando o Git está em `C:\Program Files\Git`.
- Em todos os perfis: Cascadia Code 11, One Half Dark, cursor em barra,
  50 mil linhas de histórico, opacidade 97, sino pisca a barra de tarefas.
- Copiar ao selecionar, colar várias linhas sem aviso, janela 140×38.
- `Ctrl+Alt+C` abre uma aba nova do Claude Code.

Os perfis que já existem ficam intactos (o Ubuntu do WSL, por exemplo). Um
"Claude Code" antigo com outro guid é trocado pelo do repo. Se o padrão atual é
um perfil WSL, ele continua padrão; `--set-default` troca mesmo assim. O
original fica em `settings.json.bak-<data>`, na pasta do Terminal.

Mudou o terminal e quer levar para as outras máquinas? Edite
`terminal/windows-terminal.json` (as chaves têm o mesmo nome do `settings.json`
do Terminal), commite e rode o script nelas.

### 2. Antes de começar a trabalhar (todo dia)

Puxe o que as outras máquinas mandaram:

```powershell
cd $env:USERPROFILE\.claude
git pull
```

Se o pull trouxe mudança em `settings.shared.json` ou `scripts/sync/mcp-shared.json`,
rode também o bootstrap e reinicie o Claude Code. Mudança só em `agents/`,
`skills/`, `commands/`, `rules/` ou `CLAUDE.md` não precisa de bootstrap: basta
abrir uma sessão nova.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync\bootstrap.ps1
```

### 3. Depois de mudar algo (em qualquer máquina)

```powershell
cd $env:USERPROFILE\.claude
node .\scripts\sync\make-shared.js    # só se mexeu em hooks, env, model ou plugins
node .\scripts\sync\check-ascii.js    # só se mexeu em algum .ps1
git status                            # confira o que vai subir
git add -A ; git commit -m "chore: descreve a mudanca" ; git push
```

Depois faça o passo 2 nas outras máquinas.

Onde cada tipo de mudança vive:

| Quero mudar... | Edito... | Sincroniza? |
|---|---|---|
| Hooks, env, model, plugins | `settings.json`, depois `make-shared.js` | Sim, via `settings.shared.json` |
| Regras, agents, skills, commands | Os `.md` nas pastas | Sim |
| MCP servers | `scripts/sync/mcp-shared.json` | Sim, via bootstrap |
| Windows Terminal | `terminal/windows-terminal.json` | Sim, via bootstrap ou `apply-terminal.js` |
| Permissões aprovadas | Nada: ficam por máquina | Não, de propósito |
| Login do Claude, chaves de MCP | `~/.claude.json` | Não, nunca |

### Conferir se uma máquina está em dia

```powershell
cd $env:USERPROFILE\.claude
git fetch ; git status -sb
```

- `## main...origin/main` sem `[ahead]`/`[behind]`: sincronizada.
- `[behind N]`: falta `git pull` (passo 2).
- `[ahead N]`: tem commit local sem push.
- Linhas com `??` ou `M`: arquivos mudados que ainda não foram commitados.

Se houver conflito no pull porque as duas máquinas mudaram o mesmo arquivo,
resolva no arquivo, `git add` e `git commit`. Na dúvida, nunca apague o
`settings.json` local: ele não está no git e é recriado só em parte pelo
bootstrap.

## Scripts de sync

| Script | O que faz |
|---|---|
| `bootstrap.ps1` | Setup completo de máquina nova. Orquestra os três abaixo |
| `apply-shared.ps1` | Mescla `settings.shared.json` no `settings.json` local |
| `apply-mcp.js` | Injeta MCP servers em `~/.claude.json` |
| `apply-plugins.js` | Registra marketplaces e instala os plugins de `settings.shared.json` (`--dry-run` só mostra) |
| `apply-claude-mem.js` | Aplica `claude-mem-shared.json` (batch, limites de cota, redação e busca semântica do claude-mem) no `~/.claude-mem/settings.json` |
| `apply-terminal.js` | Funde `terminal/windows-terminal.json` no Windows Terminal, com backup (`--dry-run`, `--set-default`) |
| `make-shared.js` | Regenera `settings.shared.json` (com varredura de segredos) |
| `check-ascii.js` | Barra BOM e caractere não-ASCII em `.ps1` |
| `check-fluxo.js` | Barra skill, agent ou command fora do `skills/fluxo/catalogo.md` |
| `check-machine.js` | Só lê: confere se a máquina está completa e mostra o comando que resolve cada falta |
| `cloud-setup.sh` | Equivalente Linux do bootstrap para o setup script do ambiente de nuvem (ver `docs/manual.md`, seção 9.1) |

### Por que o `check-ascii.js` existe

Duas armadilhas de encoding do Windows já quebraram este repo:

1. **PowerShell 5.1 lê `.ps1` sem BOM como ANSI.** Um travessão (`—`) num
   comentário do `bootstrap.ps1` corrompeu o parser e derrubou um bloco inteiro,
   com erro apontando para a linha errada. Por isso os `.ps1` são ASCII puro.
2. **`Out-File -Encoding utf8` grava BOM no PS 5.1.** BOM quebra `JSON.parse` e
   até `node --check` no shebang. Por isso o `apply-shared.ps1` grava via
   `UTF8Encoding($false)` e o `apply-mcp.js` lê tolerando BOM alheio.

Rode `check-ascii.js` antes de commitar mudança em script.

## Segurança

Este repositório é **público** desde 2026-10-28, para o setup script das
sessões na nuvem conseguir cloná-lo (ver `docs/manual.md`, seção 9.1). Antes de
abrir, o estado atual e o histórico inteiro foram revisados: nenhuma chave,
token, senha, `settings.json` ou `.claude.json` jamais foi commitado. Nunca
versione nada disso; o `.gitignore` e o `make-shared.js` existem para isso.

**`settings.json` não é versionado.** O `permissions.allow` acumula aprovações
pontuais de cada máquina: caminhos absolutos, UUIDs de sessão temporários,
nomes de projeto de cliente — e chegou a conter uma credencial de ambiente de
desenvolvimento em texto claro. Num repositório git isso viraria permanente no
histórico.

O que sincroniza é **`settings.shared.json`**: apenas `hooks`, `env`, `model`,
`effortLevel`, `enabledPlugins`, `extraKnownMarketplaces`, `autoUpdatesChannel`
e `statusLine`. O gerador (`scripts/sync/make-shared.js`) roda uma
varredura de segredos e **aborta sem escrever** se encontrar padrão de senha,
API key, PAT do GitHub ou chave privada.

Também ficam de fora, via [.gitignore](.gitignore): `.credentials.json`,
`sessions/`, `projects/`, `history.jsonl`, `shell-snapshots/`, `file-history/`,
`cache/`, `debug/`, `metrics/`, `backups/`, `plugins/` e qualquer `.env` ou
`.log`.

> **Cuidado ao editar o `.gitignore`:** padrões genéricos sem barra inicial
> valem em qualquer profundidade. `*token*` chegou a excluir silenciosamente
> `skills/token-budget-advisor/` e `skills/evm-token-decimals/`. Os catch-alls
> de segredo estão ancorados na raiz (`/*token*`) de propósito.

`~/.claude.json` **não** está neste repositório — fica em `~/` e contém
`oauthAccount` e as credenciais dos MCP servers. Nunca versionar.

## Licença

O conteúdo herdado do `everything-claude-code` segue a licença MIT do projeto
original. As customizações deste repositório são de uso pessoal.
