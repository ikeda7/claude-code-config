# Deploy na Vercel

Meus projetos web são publicados na Vercel com integração GitHub: todo push
gera um deploy. Aplique esta regra em qualquer projeto que tenha `vercel.json`,
`.vercel/` ou que eu diga que vai para a Vercel.

## Três ambientes, sempre

Arquitete assumindo **Development** (local), **Preview** (toda branch/PR) e
**Production** (branch principal). Nunca presuma que compartilham recursos.

- `DATABASE_URL` e qualquer serviço com estado (storage, filas, e-mail, pagamento)
  têm valor **diferente** em Production e em Preview/Development.
- O banco de Preview é descartável e sem dado real: qualquer branch com push o
  acessa. Gateways de pagamento em Preview usam chave de teste.
- Precisou de valor por branch: `vercel env add NOME preview <branch>`.
- Ao criar uma variável nova, diga em quais dos três escopos ela deve existir.

## Segredos

- Zero credencial no repositório. Toda branch gera um deploy, então o que está
  no código está publicado.
- Mantenha `.env.example` com os nomes das variáveis e valores fictícios; `.env*`
  real fica no `.gitignore`.
- **Prefixos públicos vão para o navegador**: `NEXT_PUBLIC_`, `VITE_`,
  `PUBLIC_`, `NUXT_PUBLIC_`, `REACT_APP_`. Segredo nunca leva esse prefixo e só
  é lido em código de servidor.
- Valide no startup que as variáveis obrigatórias existem e falhe com mensagem
  clara se faltar alguma.

## Links de preview

Cada deploy ganha uma URL própria e imutável, que continua no ar depois.

- Deixe ativa a **Vercel Authentication** (Settings → Deployment Protection):
  exige login na Vercel para abrir previews. Existe no plano gratuito.
  Proteção por senha é recurso pago.
- Mantenha a **Git fork protection** ativa: PR de fork não faz deploy sem
  aprovação.
- Configure a **Deployment Retention** para expirar previews antigos: uma
  versão com bug de segurança continua acessível pela URL dela.
- Em fetch no cliente, use caminho relativo (`/api/x`), não `VERCEL_URL`, para
  não quebrar com a proteção ativa.

## Plano e custo

- Plano Hobby (grátis) **proíbe uso comercial**: cobrar usuário, anúncio,
  venda. Quando o projeto começar a gerar receita, avise que é hora do Pro.
- Sem dependência desnecessária de recurso exclusivo da Vercel. A lógica de
  negócio fica em módulos comuns, chamados pelas rotas/funções, para que o
  projeto possa ir para Docker numa VPS se o custo de banda ou funções crescer.
  Quando usar algo exclusivo (Edge Config, KV, Blob), diga isso explicitamente.
