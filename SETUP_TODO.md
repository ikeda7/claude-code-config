# Pendências de setup

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
sessão. Hoje você tem 4 ativos (`memory`, `sequential-thinking`, `context7`,
`filesystem`) mais o plugin `context-mode`. Ativar os 6 acima levaria a ~13 e
comeria contexto de forma perceptível.

Sugestão: ativar sob demanda, conforme o projeto — não todos de uma vez.

---

## Outras pendências

- [x] **Conectores claude.ai** — Gmail, Google Drive/Docs/Sheets/Slides e
      Vercel já aparecem autorizados (2026-10-22). O conector Vercel do claude.ai
      cobre o item 3 acima sem precisar do MCP local.
- [x] **`auto-tmux-dev` desligado** (2026-10-22) via
      `ECC_DISABLED_HOOKS=pre:bash:auto-tmux-dev`, para o agente conseguir ler o
      log do dev server.
- [x] **Replicar em outras máquinas** — feito: repo `ikeda7/claude-code-config`.
- [ ] **Headroom** (por máquina): o bootstrap instala o pacote se houver Python,
      mas `headroom init -g claude` precisa ser rodado pelo usuário — ele grava
      `ANTHROPIC_BASE_URL` no `settings.json` local e o agente não pode alterar
      a própria config de API. Rodar num terminal novo:
      `headroom init -g claude` e depois `headroom doctor`.
- [ ] **`gh` CLI** (por máquina): se `gh auth status` disser "token invalid",
      rodar `gh auth login` (interativo).
