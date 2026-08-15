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
| `agents/` | 68 | Subagents especializados por linguagem e por função |
| `commands/` | 95 | Slash commands (`/plan`, `/pr`, `/setup-github`, …) |
| `skills/` | 285 | Conhecimento sob demanda, carregado quando a tarefa casa |
| `rules/` | 123 | Regras: `common/` sempre ativo, 22 linguagens sob demanda |
| `scripts/` | 260 | Implementação dos hooks e utilitários de sync |
| `prompts/` | 1 | Roteiros reutilizáveis meus |
| `contexts/` | 3 | Referência manual |
| `mcp-configs/` | 1 | Catálogo de MCP servers (referência, não ativo) |

Detalhamento completo em [CLAUDE.md](CLAUDE.md), que é o arquivo que o próprio
Claude Code lê no início de toda sessão.

## O que é carregado automaticamente

Só isto entra no contexto em toda sessão, de todo projeto:

- `CLAUDE.md`
- `rules/common/*.md` — 11 regras, incluindo o fluxo GitFlow
- `rules/README.md`

Todo o resto é **sob demanda**, e isso é proposital: 285 skills carregadas de
uma vez destruiriam a janela de contexto. Skills entram quando a descrição casa
com a tarefa, agents quando são delegados, commands quando digitados, e as
regras por linguagem seguem a tabela de marcadores no `CLAUDE.md`.

## Customizações próprias

O que difere do toolkit original:

- **`rules/common/gitflow-padrao.md`** — GitFlow obrigatório: `develop` como
  integração, PR sempre, nunca commit direto em `main`/`master`, Conventional
  Commits.
- **`commands/setup-github.md`** — `/setup-github`, que executa meu roteiro de
  estruturação de repositório (`prompts/setup-roadmap-github.md`).
- **Tabela de regras por linguagem no `CLAUDE.md`** — sem ela, as 110 regras de
  Java/Angular/Dart/etc. ficariam inertes, porque não são autocarregadas.
- **GateGuard desligado** (`ECC_GATEGUARD=off`) — por padrão ele nega o primeiro
  Bash de cada sessão e o primeiro Edit de cada arquivo, exigindo justificativa.
  Atrito alto demais para o ganho.
- **Split de `settings.json`** — ver abaixo.

## Instalar em uma máquina nova

Pré-requisitos: Node.js 18+, git, Claude Code.

```powershell
git clone <url-deste-repo> $env:USERPROFILE\.claude
cd $env:USERPROFILE\.claude
powershell -ExecutionPolicy Bypass -File .\scripts\sync\apply-shared.ps1
```

Depois:

1. Configure os MCP servers em `~/.claude.json` — ver [SETUP_TODO.md](SETUP_TODO.md)
2. Reinicie o Claude Code

Se a máquina já tiver um `~/.claude/` com coisas suas, clone em outro lugar e
copie o que interessa — o script de apply preserva `permissions`, mas o clone
por cima sobrescreveria arquivos.

## Fluxo de sincronização

Depois de mudar hooks, env, model ou plugins:

```powershell
node .\scripts\sync\make-shared.js
git add -A ; git commit -m "chore: atualiza config" ; git push
```

Na outra máquina:

```powershell
git pull ; powershell -ExecutionPolicy Bypass -File .\scripts\sync\apply-shared.ps1
```

## Segurança

Este repositório é **privado**, mas foi montado para não vazar nada mesmo assim.

**`settings.json` não é versionado.** O `permissions.allow` acumula aprovações
pontuais de cada máquina: caminhos absolutos, UUIDs de sessão temporários,
nomes de projeto de cliente — e chegou a conter uma credencial de ambiente de
desenvolvimento em texto claro. Num repositório git isso viraria permanente no
histórico.

O que sincroniza é **`settings.shared.json`**: apenas `hooks`, `env`, `model`,
`effortLevel`, `enabledPlugins`, `extraKnownMarketplaces` e
`autoUpdatesChannel`. O gerador (`scripts/sync/make-shared.js`) roda uma
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
