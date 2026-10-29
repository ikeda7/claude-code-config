# Pendências de setup

## Checklist por máquina (fazer nas 3)

Tudo que precisa rodar **em cada máquina** depois do `git pull` de 2026-10-28
(PRs #7 a #10, #13 e o do fluxo padrão). Marque a coluna da máquina ao terminar.

| # | Passo | PC pessoal | Note pessoal | Note do serviço |
|---|---|---|---|---|
| 1 | `cd ~\.claude` e `git pull` | [x] | [ ] | [ ] |
| 2 | `powershell -ExecutionPolicy Bypass -File .\scripts\sync\bootstrap.ps1`. No fim ele roda o `check-machine.js` | [x] | [ ] | [ ] |
| 3 | Rodar `node .\scripts\sync\check-machine.js` até não sobrar `FALTA`. Cada linha que falta já mostra o comando que resolve (settings, plugins, MCP, `gh`, `playwright-cli`, `python3`, `sh`, fluxo) | [x] | [ ] | [ ] |
| 4 | Reiniciar o Claude Code e, numa sessão nova, conferir `/context`. Se pesar demais, desligar `superpowers` (`false` no `settings.json`, depois `make-shared.js`); o fluxo usa 6 skills dele e o `skills/fluxo/catalogo.md` indica as alternativas | [ ] | [ ] | [ ] |
| 5 | Opcional: `pip uninstall headroom-ai`, se foi instalado | [ ] | [ ] | [ ] |
| 6 | Opcional, para usar o `omniroute`: `npm i -g omniroute` e deixar `omniroute` rodando | [ ] | [ ] | [ ] |
| 7 | 1º uso num projeto web: `inspect.mjs` da `design-taste-frontend` acha o Edge/Chrome | [ ] | [ ] | [ ] |

Por que o passo 2 vem **antes** de qualquer `make-shared.js`: o bootstrap roda
o `apply-shared.ps1`, que leva para o `settings.json` local o que mudou no
compartilhado (Headroom removido de `enabledPlugins`; `model: opus` em vez de
`opus[1m]`; `effortLevel: medium`; `ECC_SESSION_START_CONTEXT=off`;
`session-report`/`plugin-dev` desligados; `superpowers`, `claude-security` e
`omniroute` ligados) e instala o `playwright-cli`. Se o
`make-shared.js` rodar antes, ele lê o `settings.json` antigo e desfaz tudo
isso no `settings.shared.json`.

Os scripts da `design-taste-frontend` só tiveram a sintaxe checada na
instalação; o passo 7 é o primeiro teste real. Ele é o único que não dá para
automatizar, porque depende de um projeto web aberto.

---

## MCP servers com credencial

Criado em 2026-08-14. MCP servers que você marcou como desejados mas que
precisam de credencial. Nenhum deles foi ativado — todos estão aqui aguardando
a chave.

Para ativar qualquer um: me passe a credencial e eu insiro em
`~/.claude.json` → `mcpServers` (nível raiz = escopo global).

---

## 1. github

**Precisa:** Personal Access Token do GitHub.

Gerar em <https://github.com/settings/tokens> (classic) ou
`/settings/personal-access-tokens` (fine-grained).
Escopos típicos: `repo`, `read:org`. Adicione `workflow` se quiser que o server
mexa em GitHub Actions.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<PAT>" }
}
```

**Observação:** você já tem o `gh` CLI autenticado e funcionando nesta máquina,
e ele já está liberado em `permissions.allow` (`gh pr *`, `gh api *`, `gh run *`,
`gh issue *`). A sobreposição é grande. O MCP agrega principalmente em busca de
código entre repositórios e em leitura estruturada de issues/PRs sem passar por
saída de terminal. Se o `gh` já cobre seu fluxo, dá para pular este.

## 2. supabase

**Precisa:** access token pessoal + o `project-ref` do projeto.

Token em <https://supabase.com/dashboard/account/tokens>.
O `project-ref` é o subdomínio da URL do projeto.

```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=<REF>"],
  "env": { "SUPABASE_ACCESS_TOKEN": "<TOKEN>" }
}
```

Recomendo usar token com escopo somente-leitura se o objetivo for inspecionar
schema e dados, não migrar.

## 3. vercel

Transporte HTTP com OAuth — **não precisa de chave em arquivo**, mas exige
autorização interativa, que não dá para fazer numa sessão não-interativa.

```json
"vercel": { "type": "http", "url": "https://mcp.vercel.com" }
```

Depois de adicionar, rode `/mcp` numa sessão interativa para autorizar.

## 4. cloudflare

Também HTTP com OAuth, sem chave em arquivo. São quatro endpoints separados —
adicione só os que interessam, para não gastar contexto à toa:

```json
"cloudflare-docs":                { "type": "http", "url": "https://docs.mcp.cloudflare.com/mcp" },
"cloudflare-workers-builds":      { "type": "http", "url": "https://builds.mcp.cloudflare.com/mcp" },
"cloudflare-workers-bindings":    { "type": "http", "url": "https://bindings.mcp.cloudflare.com/mcp" },
"cloudflare-observability":       { "type": "http", "url": "https://observability.mcp.cloudflare.com/mcp" }
```

`cloudflare-docs` é o único puramente de leitura de documentação e funciona sem
conta.

## 5. railway

```json
"railway": { "command": "npx", "args": ["-y", "@railway/mcp-server"] }
```

Autentica pelo Railway CLI local. Se você não tem o CLI logado, precisa rodar
`railway login` antes.

## 6. clickhouse

```json
"clickhouse": { "type": "http", "url": "https://mcp.clickhouse.cloud/mcp" }
```

HTTP + OAuth, exige conta ClickHouse Cloud. Se você não usa ClickHouse, ignore —
marquei porque estava agrupado com vercel/cloudflare/railway na pergunta.

---

## Aviso sobre quantidade de MCP servers

O próprio catálogo do toolkit recomenda **manter menos de 10 servers ativos**,
porque cada um injeta as definições das suas ferramentas no contexto de toda
sessão. Hoje você tem 1 ativo (`context7`) mais o plugin `context-mode`. Ativar os 6
acima levaria a ~8 e
comeria contexto de forma perceptível.

Sugestão: ativar sob demanda, conforme o projeto — não todos de uma vez.

---

## Outras pendências

- [ ] **Decidir sobre o plugin `omniroute`** (adiado em 2026-10-28). Hoje só
      registra um MCP em `localhost:20128`, sem benefício, e na nuvem aparece como
      falha no `/mcp`. O modo gateway (que troca de modelo quando a cota acaba)
      exige `ANTHROPIC_BASE_URL`, o que desliga o `/remote-control`, e passar a
      assinatura Claude por ele contraria os termos. Opções: desligar em
      `settings.shared.json` ou manter. Detalhes na conversa de 2026-10-28.
- [ ] **Faxina da nuvem**: arquivar o ambiente `claude-code-config` (o setup
      script ficou no Default) e a sessão "Context" de 2026-10-28 18:40.
- [x] **Conectores claude.ai** — Gmail, Google Drive/Docs/Sheets/Slides e
      Vercel já aparecem autorizados (2026-10-22). O conector Vercel do claude.ai
      cobre o item 3 acima sem precisar do MCP local.
- [x] **`auto-tmux-dev` desligado** (2026-10-22) via
      `ECC_DISABLED_HOOKS=pre:bash:auto-tmux-dev`, para o agente conseguir ler o
      log do dev server.
- [x] **Replicar em outras máquinas** — feito: repo `ikeda7/claude-code-config`.
      O que falta rodar em cada uma está no checklist no topo.
- [x] **Headroom — decidido: NÃO ativar** (2026-10-22). O `init` aponta
      `ANTHROPIC_BASE_URL` para o proxy, e isso desliga o `/remote-control`, que
      o usuário usa. O plugin saiu de `settings.shared.json` e o bootstrap não
      instala o pacote nem roda o `init` (2026-10-28). Não rodar
      `headroom init -g claude`.
