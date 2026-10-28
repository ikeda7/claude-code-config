# Documentação viva

Todo projeto é estruturado antes de começar, e essa estrutura vira
documentação. A documentação é a fonte de consulta e de explicação dos fluxos:
ela anda junto com o código, nunca atrás dele.

## Regra central

**Nenhuma mudança está pronta sem a documentação correspondente.** Feature,
fix, refactor, mudança de config, de schema ou de dependência: se altera o
comportamento, o fluxo, a interface ou a forma de rodar o projeto, a doc afetada
é atualizada **no mesmo commit/PR**.

Se a mudança genuinamente não afeta a doc (ex.: renomear variável local, ajuste
de teste), diga isso explicitamente ao concluir: "doc não muda porque X". Ficar
em silêncio não é opção.

## Início de projeto

Antes do primeiro código, estruture e documente. Se o repositório já tem docs,
adote a estrutura existente em vez de criar outra (skill
`living-docs-governance`). Se não tem, crie em `docs/`:

| Arquivo | Conteúdo |
|---|---|
| `docs/README.md` | Índice: o que é cada arquivo de `docs/` e por onde começar |
| `docs/visao-geral.md` | O que o sistema faz, para quem, escopo e o que está fora dele |
| `docs/arquitetura.md` | Camadas, módulos, dependências externas, diagrama |
| `docs/fluxos/<nome>.md` | Um arquivo por fluxo (ver abaixo) |
| `docs/decisoes/NNNN-<titulo>.md` | ADRs: contexto, alternativas, decisão, consequências (skill `architecture-decision-records`) |
| `docs/setup.md` | Como rodar, testar e fazer deploy; variáveis de ambiente |

Projeto pequeno pode juntar papéis num arquivo só, desde que em seções
separadas e cada fato tenha um único lugar canônico.

## Documentação de fluxo

Cada fluxo relevante (login, checkout, sincronização, job agendado...) tem seu
arquivo em `docs/fluxos/`, com:

1. **Gatilho**: o que inicia o fluxo (ação do usuário, rota, evento, cron).
2. **Passo a passo**: do gatilho ao resultado, citando os arquivos e funções
   envolvidos (`caminho/arquivo.ext` + nome da função/classe).
3. **Dados**: o que entra, o que sai, o que é persistido e onde.
4. **Erros e casos de borda**: o que pode falhar e como é tratado.
5. **Diagrama** (Mermaid) quando houver mais de 3 atores ou ramificações.

Cite caminhos e nomes, não números de linha: linha muda a cada edição.

## Durante o trabalho

- **Consulte antes de editar.** Leia `docs/README.md` e o fluxo afetado antes de
  mexer no código. Se a doc divergir do código, o código é a verdade: corrija a
  doc e avise a divergência.
- **Atualize junto.** Ao mudar um fluxo, atualize o arquivo dele. Ao criar um
  fluxo novo, crie o arquivo e registre no índice. Ao remover algo, remova da
  doc e, se a remoção for intencional, registre o motivo (ADR ou nota no fluxo)
  para ninguém recriar.
- **Decisão de arquitetura** (escolha de lib, padrão, trade-off) vira ADR.
- **Explicações** que eu pedir sobre o funcionamento do sistema partem da doc;
  se a resposta exigiu investigar código e a doc não cobria, acrescente.

## Checklist antes de concluir

- [ ] Fluxos afetados atualizados em `docs/fluxos/`
- [ ] Índice (`docs/README.md`) reflete arquivos criados/removidos
- [ ] Decisões novas registradas como ADR
- [ ] `docs/setup.md` atualizado se mudou variável, comando ou dependência
- [ ] Ou: declarado explicitamente por que a doc não muda

## Ferramentas

- `living-docs-governance` (skill): organizar/adotar a estrutura de docs.
- `architecture-decision-records` (skill): formato de ADR.
- `/update-docs` (command) e `doc-updater` (agent): atualização em lote.
- Hook `stop:docs-sync-check`: em repositório com `docs/`, ao fim de uma
  resposta com código alterado e nenhuma doc alterada, pede uma vez a
  atualização (ou a justificativa) antes de encerrar.

## Relacionado

- [fluxo-padrao.md](fluxo-padrao.md): a documentação é a fase 7, antes da
  entrega
- [gitflow-padrao.md](gitflow-padrao.md): doc e código no mesmo PR
