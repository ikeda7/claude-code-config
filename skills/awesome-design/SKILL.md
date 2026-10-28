---
name: awesome-design
description: >-
  Biblioteca local de 84 DESIGN.md (tokens de cor, tipografia, espaçamento,
  componentes e regras) inspirados em sites reais: Stripe, Linear, Vercel,
  Notion, Apple, Airbnb, Spotify, Supabase, Figma e outros. Use quando o
  usuário pedir uma interface "no estilo de" / "parecida com" / "inspirada em"
  uma marca ou produto, quando um projeto de frontend novo precisar de um
  design system de partida, ou quando for criar o DESIGN.md de um projeto.
---

# Awesome DESIGN.md

Coleção de [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
(MIT, ver `LICENSE`). Cada arquivo é um DESIGN.md no formato do Google Stitch:
frontmatter YAML com tokens (`colors`, `typography`, `spacing`, `radius`,
componentes) seguido de prosa com as regras do sistema visual.

Os arquivos são **análises inspiradas** nas marcas, não os design systems
oficiais. Fontes proprietárias (Sohne, Geist, SF Pro...) aparecem com
fallbacks; não copie logotipo, nome ou marca registrada para o projeto do
usuário: use a linguagem visual, não a identidade.

## Como usar

1. Escolha a referência no índice abaixo pelo pedido do usuário. Se ele não
   nomeou marca, proponha 2 ou 3 que casem com o produto e pergunte.
2. Leia `designs/<marca>/DESIGN.md` inteiro antes de escrever UI.
3. Copie-o para a raiz do projeto como `DESIGN.md` (ou adapte: troque nome,
   ajuste a cor primária à marca do usuário) e trate-o como fonte da verdade
   visual dali em diante. Se o projeto já tem `DESIGN.md`, ele vence; não
   sobrescreva sem pedir.
4. Traduza os tokens para o mecanismo do projeto: CSS custom properties,
   `tailwind.config`, tema do Angular Material, `ThemeData` do Flutter.
5. Ao implementar, combine com as skills irmãs:
   - `design-taste-frontend` para direção de arte e o loop de inspeção no
     navegador (o DESIGN.md fixa tokens; ela decide composição);
   - `web-design-guidelines` para revisar o resultado;
   - `playwright-cli` para abrir a página e tirar screenshot.

## Índice

#### AI & LLM Platforms

- **Claude** (`designs/claude/DESIGN.md`) - Anthropic's AI assistant. Warm terracotta accent, clean editorial layout
- **Cohere** (`designs/cohere/DESIGN.md`) - Enterprise AI platform. Vibrant gradients, data-rich dashboard aesthetic
- **ElevenLabs** (`designs/elevenlabs/DESIGN.md`) - AI voice platform. Dark cinematic UI, audio-waveform aesthetics
- **Jobright** (`designs/jobright/DESIGN.md`) - AI job-hunting platform. Spring-mint green, black pill buttons, condensed Titillium headlines
- **Minimax** (`designs/minimax/DESIGN.md`) - AI model provider. Bold dark interface with neon accents
- **Mistral AI** (`designs/mistral.ai/DESIGN.md`) - Open-weight LLM provider. French-engineered minimalism, purple-toned
- **Ollama** (`designs/ollama/DESIGN.md`) - Run LLMs locally. Terminal-first, monochrome simplicity
- **OpenCode AI** (`designs/opencode.ai/DESIGN.md`) - AI coding platform. Developer-centric dark theme
- **Replicate** (`designs/replicate/DESIGN.md`) - Run ML models via API. Clean white canvas, code-forward
- **Runway** (`designs/runwayml/DESIGN.md`) - AI creative-tools platform with an editorial film-festival aesthetic — cinematic dark heroes, paper-white reading bands, single proprietary sans, and pure black pill CTAs.
- **Together AI** (`designs/together.ai/DESIGN.md`) - Open-source AI infrastructure. Technical, blueprint-style design
- **VoltAgent** (`designs/voltagent/DESIGN.md`) - AI agent framework. Void-black canvas, emerald accent, terminal-native
- **xAI** (`designs/x.ai/DESIGN.md`) - Elon Musk's AI lab. Stark monochrome, futuristic minimalism

#### Developer Tools & IDEs

- **Cursor** (`designs/cursor/DESIGN.md`) - AI-first code editor. Sleek dark interface, gradient accents
- **Expo** (`designs/expo/DESIGN.md`) - React Native platform. Dark theme, tight letter-spacing, code-centric
- **Lovable** (`designs/lovable/DESIGN.md`) - AI full-stack builder. Playful gradients, friendly dev aesthetic
- **Raycast** (`designs/raycast/DESIGN.md`) - Productivity launcher. Sleek dark chrome, vibrant gradient accents
- **Superhuman** (`designs/superhuman/DESIGN.md`) - Fast email client. Premium dark UI, keyboard-first, purple glow
- **Vercel** (`designs/vercel/DESIGN.md`) - Frontend deployment platform. Black and white precision, Geist font
- **Warp** (`designs/warp/DESIGN.md`) - Modern terminal. Dark IDE-like interface, block-based command UI

#### Backend, Database & DevOps

- **ClickHouse** (`designs/clickhouse/DESIGN.md`) - Fast analytics database. Yellow-accented, technical documentation style
- **Composio** (`designs/composio/DESIGN.md`) - Tool integration platform. Modern dark with colorful integration icons
- **HashiCorp** (`designs/hashicorp/DESIGN.md`) - Infrastructure automation. Enterprise-clean, black and white
- **MongoDB** (`designs/mongodb/DESIGN.md`) - Document database. Green leaf branding, developer documentation focus
- **Oracle** (`designs/oracle/DESIGN.md`) - Enterprise cloud and database software. Warm neutral ladder, charcoal-only actions, red saved for the wordmark
- **PostHog** (`designs/posthog/DESIGN.md`) - Product analytics. Playful hedgehog branding, developer-friendly dark UI
- **Sanity** (`designs/sanity/DESIGN.md`) - Headless content platform with a dark-first editorial marketing surface — 112px display type, IBM Plex Mono technical eyebrows, and a single coral-red accent reserved for the highest-priority CTA.
- **Sentry** (`designs/sentry/DESIGN.md`) - Error monitoring. Dark dashboard, data-dense, pink-purple accent
- **Supabase** (`designs/supabase/DESIGN.md`) - Open-source Firebase alternative. Dark emerald theme, code-first

#### Productivity & SaaS

- **Cal.com** (`designs/cal/DESIGN.md`) - Open-source scheduling. Clean neutral UI, developer-oriented simplicity
- **Intercom** (`designs/intercom/DESIGN.md`) - Customer messaging. Friendly blue palette, conversational UI patterns
- **Linear** (`designs/linear.app/DESIGN.md`) - Project management for engineers. Ultra-minimal, precise, purple accent
- **Mintlify** (`designs/mintlify/DESIGN.md`) - Documentation platform. Clean, green-accented, reading-optimized
- **Notion** (`designs/notion/DESIGN.md`) - All-in-one workspace. Warm minimalism, serif headings, soft surfaces
- **Resend** (`designs/resend/DESIGN.md`) - Email API for developers. Minimal dark theme, monospace accents
- **SAP** (`designs/sap/DESIGN.md`) - Enterprise business software. White canvas, flat blue bands, application-frame chrome
- **Zapier** (`designs/zapier/DESIGN.md`) - Automation platform. Warm orange, friendly illustration-driven
- **Slack** (`designs/slack/DESIGN.md`) - Workplace messaging. Deep aubergine primary, cream-lavender hero gradients, pill CTAs

#### Design & Creative Tools

- **Airtable** (`designs/airtable/DESIGN.md`) - Spreadsheet-database hybrid. Colorful, friendly, structured data aesthetic
- **Clay** (`designs/clay/DESIGN.md`) - Creative agency. Organic shapes, soft gradients, art-directed layout
- **Figma** (`designs/figma/DESIGN.md`) - Collaborative design tool. Vibrant multi-color, playful yet professional
- **Framer** (`designs/framer/DESIGN.md`) - Website builder. Bold black and blue, motion-first, design-forward
- **Miro** (`designs/miro/DESIGN.md`) - Visual collaboration. Bright yellow accent, infinite canvas aesthetic
- **Webflow** (`designs/webflow/DESIGN.md`) - Visual web builder. Blue-accented, polished marketing site aesthetic

#### Fintech & Crypto

- **Binance** (`designs/binance/DESIGN.md`) - Crypto exchange. Bold Binance Yellow on monochrome, trading-floor urgency
- **Coinbase** (`designs/coinbase/DESIGN.md`) - Crypto exchange. Clean blue identity, trust-focused, institutional feel
- **Kraken** (`designs/kraken/DESIGN.md`) - Crypto trading platform. Purple-accented dark UI, data-dense dashboards
- **Mastercard** (`designs/mastercard/DESIGN.md`) - Global payments network. Warm cream canvas, orbital pill shapes, editorial warmth
- **Mercury** (`designs/mercury/DESIGN.md`) - Startup banking platform. Ink-violet night world, indigo action pill, light custom sans
- **NerdWallet** (`designs/nerdwallet/DESIGN.md`) - Personal finance comparison platform. Deep spruce green, mint washes, near-square corners
- **Revolut** (`designs/revolut/DESIGN.md`) - Digital banking. Sleek dark interface, gradient cards, fintech precision
- **Stripe** (`designs/stripe/DESIGN.md`) - Payment infrastructure. Signature purple gradients, weight-300 elegance
- **Wise** (`designs/wise/DESIGN.md`) - International money transfer. Bright green accent, friendly and clear

#### E-commerce & Retail

- **Airbnb** (`designs/airbnb/DESIGN.md`) - Travel marketplace. Warm coral accent, photography-driven, rounded UI
- **Meta** (`designs/meta/DESIGN.md`) - Tech retail store. Photography-first, binary light/dark surfaces, Meta Blue CTAs
- **mydealz** (`designs/mydealz/DESIGN.md`) - German deals community. Dense white-card feed, hot and cold voting pill, brand green
- **Nike** (`designs/nike/DESIGN.md`) - Athletic retail. Monochrome UI, massive uppercase Futura, full-bleed photography
- **Shopify** (`designs/shopify/DESIGN.md`) - E-commerce platform. Dark-first cinematic, neon green accent, ultra-light display type
- **Starbucks** (`designs/starbucks/DESIGN.md`) - Coffee retail flagship. Four-tier earth-green system, warm cream canvas, proprietary SoDoSans typography

#### Media & Consumer Tech

- **1win** (`designs/1win/DESIGN.md`) - Crypto casino and sportsbook. Near-black canvas, vivid green action color, dense game-tile rails
- **Al Jazeera** (`designs/aljazeera/DESIGN.md`) - Global news network. Flat white paper, dense Roboto headlines, orange signature and live red
- **Apple** (`designs/apple/DESIGN.md`) - Consumer electronics. Premium white space, SF Pro, cinematic imagery
- **DJI** (`designs/dji/DESIGN.md`) - Drone and camera maker. Studio product tiles, engineering-blue pills, tight Open Sans
- **HP** (`designs/hp/DESIGN.md`) - PC and printer maker. Pure white canvas, HP Electric Blue signal CTA, geometric Forma DJR Micro, blue chevron decorations
- **IBM** (`designs/ibm/DESIGN.md`) - Enterprise technology. Carbon design system, structured blue palette
- **NVIDIA** (`designs/nvidia/DESIGN.md`) - GPU computing. Green-black energy, technical power aesthetic
- **Oura** (`designs/oura/DESIGN.md`) - Smart ring wellness brand. Warm paper cream, editorial serif, earth-tone accents
- **Pinterest** (`designs/pinterest/DESIGN.md`) - Visual discovery platform. Red accent, masonry grid, image-first
- **PlayStation** (`designs/playstation/DESIGN.md`) - Gaming console retail. Three-surface channel layout, cyan hover-scale interaction
- **SpaceX** (`designs/spacex/DESIGN.md`) - Space technology. Stark black and white, full-bleed imagery, futuristic
- **Spotify** (`designs/spotify/DESIGN.md`) - Music streaming. Vibrant green on dark, bold type, album-art-driven
- **The Verge** (`designs/theverge/DESIGN.md`) - Tech editorial media. Acid-mint and ultraviolet accents, Manuka display type
- **Uber** (`designs/uber/DESIGN.md`) - Mobility platform. Bold black and white, tight type, urban energy
- **Vodafone** (`designs/vodafone/DESIGN.md`) - Global telecom brand. Monumental uppercase display, Vodafone Red chapter bands
- **WIRED** (`designs/wired/DESIGN.md`) - Tech magazine. Paper-white broadsheet density, custom serif, ink-blue links

#### Automotive

- **BMW** (`designs/bmw/DESIGN.md`) - Luxury automotive. Dark premium surfaces, precise German engineering aesthetic
- **BMW M** (`designs/bmw-m/DESIGN.md`) - Performance automotive. Motorsport-inspired contrast, M color accents, precision-driven layout
- **Bugatti** (`designs/bugatti/DESIGN.md`) - Luxury hypercar. Cinema-black canvas, monochrome austerity, monumental display type
- **Ferrari** (`designs/ferrari/DESIGN.md`) - Luxury automotive. Chiaroscuro black-white editorial, Ferrari Red with extreme sparseness
- **Lamborghini** (`designs/lamborghini/DESIGN.md`) - Luxury automotive. True black cathedral, gold accent, LamboType custom Neo-Grotesk
- **Renault** (`designs/renault/DESIGN.md`) - French automotive. Vivid aurora gradients, NouvelR proprietary typeface, zero-radius buttons
- **Tesla** (`designs/tesla/DESIGN.md`) - Electric vehicles. Radical subtraction, cinematic full-viewport photography, Universal Sans

#### Retro Web · DESIGN.md Nostalgia


- **Dell (1996)** (`designs/dell-1996/DESIGN.md`) - Catalog-era enterprise web. Literal black page frame, flat color-block "ribbon cards", chunky Helvetica-Black titles over Times Roman body, and hand-cut GIF stickers (NEW! bursts, award seals, beveled product photos).
- **Nintendo.com (2001)** (`designs/nintendo-2001/DESIGN.md`) - Y2K "console chrome" web. Brushed-periwinkle beveled metal panels, a halftone-dotted carbon nav glowing amber, outlined Arial-Black box-art wordmarks over circuit-board hero fields, and a pixel Mario welcome bubble.


