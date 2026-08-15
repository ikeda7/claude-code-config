---
description: Estrutura roadmap, issues, board, proteção de branches e docs de um repositório no GitHub, seguindo o roteiro salvo em ~/.claude/prompts/setup-roadmap-github.md
argument-hint: "[nada — roda no repositório atual]"
---

# Setup GitHub

Este comando executa o roteiro pessoal de estruturação de GitHub do usuário.

## Passo obrigatório antes de qualquer ação

**Leia o arquivo de roteiro na íntegra, agora, antes de fazer qualquer outra
coisa:**

```
~/.claude/prompts/setup-roadmap-github.md
```

No Windows isso resolve para `%USERPROFILE%\.claude\prompts\setup-roadmap-github.md`.
Se a ferramenta Read exigir caminho absoluto, monte-o a partir do diretório home
do usuário atual — **não presuma um nome de usuário**.

Use a ferramenta Read no caminho acima. Não execute nada de memória e não
resuma o roteiro para si mesmo — o conteúdo dele é a especificação desta tarefa,
e as armadilhas documentadas ali são o motivo de ele existir.

Se o arquivo não for encontrado, **pare e avise o usuário**. Não improvise um
fluxo substituto.

## O que executar

O roteiro contém **7 etapas numeradas**, mais uma seção final de regras gerais:

1. **Auditoria antes de qualquer criação** — descobrir o que já existe e
   conferir cada pendência contra o código *e* o histórico de commits
2. **Issues** — converter só o que é realmente pendente
3. **Labels** — conjunto pequeno, áreas do domínio real do projeto
4. **Board em Projects** — criar, linkar ao repo, configurar Status e Prioridade
5. **Fluxo de branches e proteção** — `develop`, rulesets, required reviews
6. **Templates** — issue (bug/feature) e PR
7. **Documentação** — `CONTRIBUTING.md`

Execute todas as 7, na ordem, seguindo o texto do roteiro como fonte da verdade.
As instruções detalhadas de cada etapa estão no arquivo — este comando é só o
gatilho, não uma reescrita do conteúdo.

## Como executar

**Passo a passo, não tudo de uma vez.** Ao final de cada etapa, mostre o que foi
feito e o que vem a seguir antes de continuar.

**Pare e peça aprovação quando encontrar item conflitante**, incluindo:

- item da lista de pendências que o código mostra já estar implementado
- issue já aberta cobrindo o mesmo assunto que você ia criar
- regra de proteção de branch já configurada de forma diferente da proposta
- Project já existente no repositório
- qualquer operação destrutiva (deletar issue, project, branch ou ruleset)

Nesses casos, apresente a evidência (commit, `arquivo:linha`, número da issue) e
espere a decisão do usuário. Não decida sozinho.

## Restrições herdadas do roteiro

- **Reversível antes de destrutivo** — fechar, não deletar
- **Não criar duplicata** — cruzar com comentário de mapeamento
- **Se criar algo errado, corrigir e dizer**
- **Declarar explicitamente o que não deu para fazer por API** e precisa de
  clique manual, com o caminho pronto
- **Português do Brasil em tudo**: issues, labels, colunas, templates

## Contexto desta máquina

- Shell: PowerShell 5.1 (primário) e Git Bash. `&&` não funciona no PowerShell —
  use `;` com `if ($?)`.
- `gh` CLI já está instalado e autenticado.
- Vale a regra global [gitflow-padrao.md](../rules/common/gitflow-padrao.md):
  `develop` como integração, PR obrigatório, nunca commit direto em
  `main`/`master`, Conventional Commits.
