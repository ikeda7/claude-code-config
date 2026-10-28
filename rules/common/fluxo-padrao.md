# Fluxo padrão

Vale em todo projeto. O mapa completo (qual skill, agent, command, plugin ou
recurso nativo usar em cada fase e stack) está na skill `fluxo`: carregue-a no
início de qualquer tarefa que escreva ou revise código. `/fluxo <pedido>` força
o pipeline inteiro; `/fluxo init` prepara um projeto novo ou desconhecido.

## 1. Classifique antes de agir

Diga numa linha o **tipo** e o **tamanho**, para o usuário poder corrigir:

- Tipo: `feature` (não existe) · `mudança` (existe, comportamento muda) ·
  `bug` (comportamento errado) · `refactor` (comportamento igual) ·
  `infra/config` · `docs` · `pesquisa` (sem código).
- Tamanho, pelo maior sinal: **trivial** (1 arquivo, óbvio) · **pequeno**
  (1 arquivo ou função, claro depois de ler) · **médio** (2-5 arquivos, uma
  escolha real) · **grande** (transversal, dependência nova, API pública,
  várias perguntas abertas). Tocar autenticação, entrada de usuário, banco,
  segredo ou contrato público é no mínimo médio.

## 2. Fases

| # | Fase | Trivial | Pequeno | Médio | Grande |
|---|---|---|---|---|---|
| 1 | Entender (memória, mapa do código, docs da lib) | - | leve | sim | sim |
| 2 | Decidir e planejar | - | - | plano curto | plano + ADR, **aprovação do usuário** |
| 3 | Branch (`gitflow-padrao.md`) | sim | sim | sim | sim |
| 4 | Implementar com TDD (`testing.md`) | teste se houver | sim | sim | sim, em fatias verticais |
| 5 | Verificar (build, testes, rodar o app) | sim | sim | sim | sim |
| 6 | Revisar (reviewer da stack; segurança se sensível) | - | leve | sim | sim, independente |
| 7 | Documentar (`documentacao-viva.md`) | sim | sim | sim | sim |
| 8 | Entregar (commit, PR, CI verde, merge) | sim | sim | sim | sim |

- O único portão humano é a aprovação do plano em tarefa **grande**. O resto
  segue direto, inclusive commit e merge (preferência do usuário no `CLAUDE.md`).
- Bug: primeiro reproduza num teste que falha. Refactor: confirme os testes
  verdes antes de mexer e mantenha-os verdes.
- Nunca diga "pronto" sem a evidência da fase 5 na conversa (saída do teste,
  do build ou screenshot).

## 3. Princípios

- Ferramenta instalada antes de improviso: se a skill `fluxo` lista algo para a
  fase, use. Se nada cobre, faça direto.
- Delegação segue `agents.md`: subagent ou workflow só quando compensa o custo.
- Custo segue `performance.md`: suba esforço, modelo ou paralelismo só quando a
  tarefa pedir.
