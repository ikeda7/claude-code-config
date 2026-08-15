# Prompt: estruturar roadmap e fluxo de GitHub num projeto

Cole o texto abaixo no Claude Code, dentro do repositório do projeto.

Funciona melhor se o repo já tiver algum histórico (commits, PRs, um `to-do.txt`
ou issues soltas). Se for projeto novo, ele monta a estrutura do zero.

---

## O prompt

```
Quero estruturar o roadmap e o fluxo de trabalho deste projeto no GitHub.
Trabalhe em etapas e me mostre o que encontrou antes de criar coisa nova.

### 1. Auditoria antes de qualquer criação

Antes de abrir issue nenhuma, descubra o que já existe e o que é verdade:

- Procure listas de tarefas soltas no repo (to-do.txt, TODO.md, ROADMAP.md,
  seções de "pendências" no README) e issues já abertas, inclusive as que
  parecem meta-issues com vários tópicos numa só.
- **Confira cada item pendente contra o código E o histórico de commits.**
  Não confie na lista: itens marcados como pendentes costumam já estar prontos.
  Procure pelo nome da funcionalidade nos commits e nas branches mergeadas, e
  confirme no código onde a coisa vive (arquivo e linha).
- Me apresente uma tabela: item | situação real | evidência (commit, arquivo:linha).

Se um item já estiver implementado, **não crie issue para ele** — e se eu já
tiver uma issue aberta sobre isso, feche com a evidência no comentário.

### 2. Issues

Converta só o que é realmente pendente. Para cada uma:

- Título curto e acionável, na forma "o que muda", não "área do sistema".
- Corpo com: o problema concreto (não a solução), o comportamento desejado,
  **casos limite** que a pessoa vai esbarrar, e onde mexer (arquivos).
- Quando houver conflito entre regras do próprio produto, aponte. Ex: "essa
  regra briga com aquela outra; decidam qual ganha antes de implementar."
- Marque o que é pré-requisito de quê, e comente nas duas issues criando o link.

Além do que está na minha lista, **abra issues para a dívida técnica que você
encontrar na revisão** — mas só o que é concreto e verificável (arquivo gigante
misturando lógica com UI, ausência de tratamento de erro em caminho crítico,
código gerado que pode dessincronizar, formatação, ausência de testes na parte
mais crítica). Cada uma com a medição que justifica: número de linhas, saída de
comando, trecho do código.

### 3. Labels

Crie um conjunto pequeno: tipo (bug, feature), áreas do domínio deste projeto
(não genéricas), mais `boa-primeira-tarefa` para as mecânicas e isoladas.
Nada de 20 labels que ninguém usa.

### 4. Board em Projects

- Crie o Project e **linke ao repositório** (`linkProjectV2ToRepository` via
  `gh api graphql`) — Project criado por CLI nasce solto no usuário e não
  aparece na aba Projects do repo.
- Renomeie as opções do campo Status para o fluxo real, **reaproveitando os IDs
  das opções existentes** (`updateProjectV2Field` com o `id` de cada option),
  senão os valores já preenchidos nos itens são apagados. Sugestão:
  Backlog / Em andamento / Em review / Concluído, cada uma com descrição.
- Crie um campo Prioridade (Alta/Média/Baixa) e **triaje as issues**, explicando
  o critério. Prioridade sem critério explícito é chute.
- Deixe a view padrão como Board (`updateProjectV2View` na view #1, não crie uma
  segunda view e deixe a tabela como padrão).
- Confirme quais workflows automáticos estão ligados (item closed, PR merged).
  O "Auto-add to project" **não tem mutation pública** — me passe o passo a
  passo da interface para eu ativar, com o filtro pronto para colar.

### 5. Fluxo de branches e proteção

- Se ainda não existir, proponha `develop` como branch de integração e explique
  o que muda no dia a dia.
- Configure proteção nos branches principais. Atenção: `Settings > Rules`
  (rulesets) não aparece na API antiga de branch protection — verifique os dois.
  E um ruleset pode estar **ativo com a lista de regras vazia**, o que não
  protege nada; confira o conteúdo, não só o status.
- Com poucos mantenedores, `required_approving_review_count: 0` costuma ser o
  certo: exige PR (bloqueia push direto) sem travar um dev quando o outro está
  indisponível. Mantenha bypass de admin para ninguém se trancar fora.
- **Só exija um status check depois que o workflow dele estiver no branch base.**
  Exigir um check que ainda não existe trava todos os PRs abertos.

### 6. Templates

Templates de issue (bug e feature) que já perguntem o que costuma faltar:
passos de reprodução, plataforma, e — para feature — os casos limite. Mais um
template de PR com checklist dos passos que este projeto esquece (regenerar
código, rodar migração, atualizar doc).

### 7. Documentação

Um `CONTRIBUTING.md` curto com o fluxo, os comandos do dia a dia e uma seção
sobre **os arquivos que mais geram conflito neste projeto específico**, com a
receita de como sair de cada conflito. Se o projeto tem código gerado, a receita
é descartar e regerar, não resolver na mão.

Se eu nunca usei issues, inclua um parágrafo explicando para que servem em
termos do meu dia a dia, não em termos abstratos.

### Regras gerais

- **Reversível antes de destrutivo.** Feche projects e issues duplicadas em vez
  de deletar. Me avise que dá para deletar de vez se eu quiser.
- **Não crie duplicata.** Se achar issue minha ou de outra pessoa cobrindo o
  mesmo assunto, cruze as duas com um comentário de mapeamento em vez de abrir
  outra.
- **Se você criar algo errado, corrija e diga.** Prefiro saber que uma issue
  nasceu de informação desatualizada do que descobrir depois.
- Diga explicitamente o que **não** deu para fazer por API e precisa de mim,
  com o caminho de cliques pronto.
- Português do Brasil em tudo: issues, labels, colunas, templates.
```

---

## Por que cada parte está aí

Notas do que deu problema na primeira vez que montei isso, para você entender o
que o prompt está prevenindo:

| Armadilha | O que o prompt faz |
|---|---|
| `to-do.txt` desatualizado | força auditoria contra código **e commits** antes de criar issue |
| issues duplicadas | manda procurar meta-issues existentes e cruzar em vez de recriar |
| Project não aparece no repo | pede o `linkProjectV2ToRepository` explicitamente |
| renomear Status apaga os valores | pede para reaproveitar os IDs das options |
| ruleset ativo sem regra nenhuma | manda conferir o conteúdo, não o status |
| check obrigatório travando tudo | ordena: workflow no base primeiro, exigência depois |
| board abrindo em tabela | pede para alterar a view #1, não criar uma segunda |
| dois devs se travando | sugere 0 aprovações obrigatórias + bypass de admin |

## Extras que valem pedir depois

Não coloquei no prompt principal para não inchar, mas são bons follow-ups:

- **Guia de ambiente local** (`SETUP.md`): rodar `flutter doctor` / equivalente
  na máquina, listar o que falta, o que cada ausência bloqueia, e ordenar a
  instalação por retorno. Mais uma tabela de "erro que você vai ver → tradução".
- **Verificação visual de verdade**: pedir para o Claude levantar o app e tirar
  print, não só rodar teste. Passou por analyze, teste e CI e ainda assim tinha
  UI quebrada — só apareceu no print.
- **Auditar CI/deploy antes de confiar**: procurar workflow que falha em
  silêncio, action depreciada, e mais de um caminho de deploy competindo pela
  mesma URL.
- **Convenção de terminal**: dizer de cara qual shell você usa (cmd, PowerShell,
  bash). Sintaxe do shell errado gera erro que não parece ser de shell.
