# GitFlow padrão

Em qualquer repositório, assuma rigidamente o fluxo GitFlow otimizado.

## Regras

- `develop` é a branch de integração.
- Novas funcionalidades (features), correções (fixes) ou manutenções (chores)
  devem ser feitas em branches separadas que partem de `develop`.
- O código retorna para `develop` estritamente via Pull Request.
- É terminantemente proibido realizar commits ou pushes diretos na branch
  `master` ou `main`.
- Utilize sempre o padrão Conventional Commits (`feat:`, `fix:`, `chore:`,
  `docs:`).

## Aplicação prática

Antes de começar a editar código, verifique em qual branch está:

```bash
git rev-parse --abbrev-ref HEAD
```

Se a branch atual for `master`, `main` ou `develop`, **crie uma branch antes de
commitar**:

```bash
git checkout develop
git pull origin develop
git checkout -b <tipo>/<descricao-curta>
```

Prefixos de branch alinhados aos tipos de commit: `feat/`, `fix/`, `chore/`,
`docs/`, `refactor/`, `test/`.

## Quando o repositório não tem `develop`

Não presuma. Verifique primeiro:

```bash
git branch -a --list '*develop*'
```

Se não existir, **pergunte antes de criar**. Alguns repositórios usam
trunk-based com `main` protegida — nesse caso a regra de "nunca commitar direto
em `main`" continua valendo, e a branch de integração passa a ser a própria
`main` via PR.

## Exceção

Se o usuário pedir explicitamente um commit direto em `main`/`master`,
comunique o conflito com esta regra em uma frase e siga a instrução dele. A
decisão é do usuário; a regra existe para evitar o acidente, não para vetar a
escolha consciente.

## Relacionado

- [git-workflow.md](git-workflow.md) — formato de mensagem de commit e fluxo de PR
- [fluxo-padrao.md](fluxo-padrao.md) — fases antes do commit
