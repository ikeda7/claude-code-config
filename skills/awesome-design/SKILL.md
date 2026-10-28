---
name: awesome-design
description: >-
  Biblioteca local de 84 DESIGN.md (tokens de cor, tipografia, espaçamento,
  componentes e regras) inspirados em sites reais: Stripe, Linear, Vercel,
  Notion, Apple, Airbnb, Spotify, Supabase, Figma e outros, mais 67 estilos
  genéricos (minimal, brutalism, glassmorphism, neumorphism, editorial,
  bento, shadcn, material, retro...). Use quando o usuário pedir uma
  interface "no estilo de" / "parecida com" / "inspirada em" uma marca,
  produto ou estilo visual nomeado, quando um projeto de frontend novo
  precisar de um design system de partida, ou quando for criar o DESIGN.md de
  um projeto.
---

# Awesome DESIGN.md

Coleção de [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
(MIT, ver `LICENSE`). Cada arquivo é um DESIGN.md no formato do Google Stitch:
frontmatter YAML com tokens (`colors`, `typography`, `spacing`, `radius`,
componentes) seguido de prosa com as regras do sistema visual.

Os 67 estilos em `styles/` vêm de
[bergside/awesome-design-skills](https://github.com/bergside/awesome-design-skills)
(MIT, ver `LICENSE-styles`). Cada um tem `DESIGN.md` (tokens) e `GUIDE.md`
(regras de uso, acessibilidade e tom de escrita; era o `SKILL.md` original,
renomeado para não virar 67 skills separadas).

Os arquivos de `designs/` são **análises inspiradas** nas marcas, não os
design systems oficiais. Fontes proprietárias (Sohne, Geist, SF Pro...) aparecem com
fallbacks; não copie logotipo, nome ou marca registrada para o projeto do
usuário: use a linguagem visual, não a identidade.

## Como usar

1. Escolha a referência no índice abaixo pelo pedido do usuário: marca em
   `designs/`, estilo genérico (ex.: "brutalista", "glassmorphism") em
   `styles/`. Se ele não nomeou nenhum, proponha 2 ou 3 que casem com o
   produto e pergunte.
2. Leia o `DESIGN.md` escolhido inteiro antes de escrever UI (em `styles/`,
   leia também o `GUIDE.md`).
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

## Índice: marcas (`designs/`)

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

## Índice: estilos (`styles/`)

- **agentic** (`styles/agentic/DESIGN.md`) - Conversational AI-first interface with minimal controls, clear outcomes, and delegated task flows for agentic workflows.
- **ant** (`styles/ant/DESIGN.md`) - Structured, enterprise-focused design system emphasizing clarity, consistency, and efficiency for data-dense web applications.
- **artistic** (`styles/artistic/DESIGN.md`) - High-contrast, expressive style with creative typography and bold color choices for visually striking interfaces.
- **basic** (`styles/basic/DESIGN.md`) - Print-inspired visual language for books, magazines, and reports with editorial grids and expressive typography.
- **bento** (`styles/bento/DESIGN.md`) - Modular grid layout with card-like blocks, clear hierarchy, soft spacing, and subtle visual contrast for organized, scannable interfaces.
- **bold** (`styles/bold/DESIGN.md`) - Strong visual presence with heavyweight typography, high-contrast colors, and commanding layouts.
- **brutalism** (`styles/brutalism/DESIGN.md`) - Raw, anti-design aesthetic inspired by concrete architecture with unadorned elements, jarring layouts, and functional minimalism.
- **cafe** (`styles/cafe/DESIGN.md`) - Cozy cafe-inspired interface with warm tones, soft typography, and clean layouts for a relaxed browsing experience.
- **claude** (`styles/claude/DESIGN.md`) - A research-journal aesthetic printed on warm stone — authoritative, editorial, almost achromatic. Pages live on warm ivory parchment (never pure white), with near-black slate as the dominant ink.
- **claymorphism** (`styles/claymorphism/DESIGN.md`) - Soft, rounded 3D-like shapes mimicking malleable clay with playful, puffy elements and colorful surfaces.
- **clean** (`styles/clean/DESIGN.md`) - Simplicity-focused design with ample whitespace, legible typography, and a limited color palette to reduce visual clutter.
- **codex** (`styles/codex/DESIGN.md`) - A radically minimal, blank-canvas interface built as a pure edge-to-edge surface, with almost no color and typography carrying the visual weight. Black serves as the only filled color, the only divider, and the sole surface tone cards.
- **colorful** (`styles/colorful/DESIGN.md`) - Vibrant, high-contrast palettes and gradients for engaging, memorable, and modern user experiences.
- **contemporary** (`styles/contemporary/DESIGN.md`) - Current-era minimalist design with bento grids, dark mode support, and high-performance accessible layouts.
- **corporate** (`styles/corporate/DESIGN.md`) - Professional, brand-aligned design with structured grids, minimalist layouts, and consistent enterprise patterns.
- **cosmic** (`styles/cosmic/DESIGN.md`) - Futuristic sci-fi aesthetic with dark themes, vibrant neon accents, and immersive spatial elements.
- **creative** (`styles/creative/DESIGN.md`) - Playful, character-driven design with expressive typography and bold graphics for landing pages and creative projects.
- **dithered** (`styles/dithered/DESIGN.md`) - Dot-pattern rendering technique that simulates shades with a limited palette for nostalgic, retro, high-contrast visuals.
- **doodle** (`styles/doodle/DESIGN.md`) - Hand-drawn, sketch-like style with doodles, handwritten fonts, and imperfect lines for a playful, informal feel.
- **dramatic** (`styles/dramatic/DESIGN.md`) - High-contrast, theatrical design with bold layouts, immersive visuals, and unconventional compositions that command attention.
- **editorial** (`styles/editorial/DESIGN.md`) - Magazine-inspired editorial layout with refined serif typography, structured grids, and elegant reading experiences.
- **enterprise** (`styles/enterprise/DESIGN.md`) - Dark-themed cloud-platform aesthetic with modular grids, glass-like panels, and strong data hierarchy for productivity dashboards.
- **expressive** (`styles/expressive/DESIGN.md`) - Vibrant, personality-driven design with bold colors, playful graphics, and dynamic layouts that balance creativity with structure.
- **fantasy** (`styles/fantasy/DESIGN.md`) - Game-inspired fantasy aesthetic with bold, premium visuals, rich color palettes, and immersive thematic elements.
- **fiction** (`styles/fiction/DESIGN.md`) - A playful, energetic, cartoonesque interface inspired by friendly children's-book illustrations — warm cream backgrounds, big bold custom display typography, saturated brand color blocks, thick black outlines, generously rounded shapes
- **flat** (`styles/flat/DESIGN.md`) - Two-dimensional minimalist style with vibrant colors, clean typography, and no 3D effects for fast, user-friendly interfaces.
- **friendly** (`styles/friendly/DESIGN.md`) - Approachable, intuitive design with rounded elements, ample whitespace, and soft pastel color palettes.
- **futuristic** (`styles/futuristic/DESIGN.md`) - Forward-looking design with tech-inspired typography, modern layouts, and a sleek, innovation-driven aesthetic.
- **geometric** (`styles/geometric/DESIGN.md`) - Geometric, structured design with clean typography, neutral colors, precise shapes, and intuitive layouts that stay out of the way.
- **glassmorphism** (`styles/glassmorphism/DESIGN.md`) - Frosted glass effect with translucent layers, subtle blur, and luminous borders for depth and modern elegance.
- **gradient** (`styles/gradient/DESIGN.md`) - Smooth color transitions and gradient-rich surfaces for modern, playful interfaces with visual depth.
- **immersive** (`styles/immersive/DESIGN.md`) - An immersive, interactive, exhibit-style interface that blends storytelling, animation, and gamified elements to create a playful, experience-driven journey. The entire app sits on a single continuous brand-colored canvas (deep green)
- **impeccable** (`styles/impeccable/DESIGN.md`) - A modern, graphic, editorial-poster aesthetic — warm and confident — built on alternating cream and burnt orange sections, an amber brand color.
- **levels** (`styles/levels/DESIGN.md`) - Conversion-focused design that removes friction and guides users toward action through clarity, trust, and speed.
- **lingo** (`styles/lingo/DESIGN.md`) - Playful, minimal design with bright colors, rounded shapes, tactile 3D borders, and friendly illustrations for approachable interfaces.
- **material** (`styles/material/DESIGN.md`) - Google's Material Design with layered surfaces, dynamic theming, built-in motion, and responsive cross-platform patterns.
- **matrix** (`styles/matrix/DESIGN.md`) - A cyber-slick, dark-only Matrix-inspired interface defined by minimalist fashion, high-tech digital elements
- **minimal** (`styles/minimal/DESIGN.md`) - Stripped-back design emphasizing whitespace, clean typography, and restrained color for maximum clarity and focus.
- **modern** (`styles/modern/DESIGN.md`) - Contemporary editorial style with serif typography, minimal palettes, and clean layouts for polished digital products.
- **mono** (`styles/mono/DESIGN.md`) - Monospace-driven, matrix-inspired design with high-contrast elements, compact density, and a hacker-chic aesthetic.
- **neobrutalism** (`styles/neobrutalism/DESIGN.md`) - Modern take on brutalism with bold borders, vivid accent colors, and raw, high-contrast layouts on warm surfaces.
- **neon** (`styles/neon/DESIGN.md`) - Electric neon glow effects with high-contrast color pairings for bold, attention-grabbing interfaces.
- **neumorphism** (`styles/neumorphism/DESIGN.md`) - Soft, extruded UI elements with inner and outer shadows on monochromatic surfaces for a tactile, embedded look.
- **pacman** (`styles/pacman/DESIGN.md`) - Retro arcade-inspired design with pixel fonts, dotted borders, playful high-contrast colors, and 8-bit game aesthetics.
- **paper** (`styles/paper/DESIGN.md`) - Paper-textured, print-inspired design with minimal colors, clean serif/sans typography, and tactile surface qualities.
- **perspective** (`styles/perspective/DESIGN.md`) - Spatial depth design with isometric views, vanishing points, and layered elements that guide attention through 3D-like realism.
- **power** (`styles/power/DESIGN.md`) - High-end dark aesthetic with bold headings, monochromatic palette, and premium feel for premium brand experiences.
- **premium** (`styles/premium/DESIGN.md`) - Apple-inspired premium aesthetic with precise spacing, modern typography, and a refined, polished visual language.
- **professional** (`styles/professional/DESIGN.md`) - Polished, business-ready design with modern typography, structured layouts, and a trustworthy visual identity.
- **pulse** (`styles/pulse/DESIGN.md`) - Dynamic, vibrant style with thick borders, geometric shapes, high-contrast colors, and expressive typography conveying motion and vitality.
- **refined** (`styles/refined/DESIGN.md`) - Carefully curated, modern minimal style with elegant serif typography and understated, sophisticated palettes.
- **retro** (`styles/retro/DESIGN.md`) - Throwback design with vintage-inspired typography, high-contrast retro palettes, and nostalgic visual elements.
- **riso** (`styles/riso/DESIGN.md`) - A playful, joyful, two-color risograph print aesthetic built on a single warm off-white paper surface running through every section
- **roku** (`styles/roku/DESIGN.md`) - App dashboard with purple-themed aesthetic, top-bar navigation, card-based layouts, and developer-first workflows.
- **sega** (`styles/sega/DESIGN.md`) - A playful, arcade-inspired interface for games — built on the VT323 pixel typeface, hard-edged 0px corners, chunky pill buttons that physically press into solid offset blocks
- **shadcn** (`styles/shadcn/DESIGN.md`) - Shadcn/ui-inspired design with minimal, clean components, monochrome palette, and utility-first patterns.
- **sketch** (`styles/sketch/DESIGN.md`) - A friendly, hand-drawn sketch interface inspired by pencil illustrations on warm cream paper. Soft teal brand accents, hand-written display headings, rounded pill controls.
- **skeumorphism** (`styles/skeumorphism/DESIGN.md`) - Real-world mimicry with textured surfaces, 3D effects, and familiar physical metaphors for intuitive digital interfaces.
- **sleek** (`styles/sleek/DESIGN.md`) - Modern minimalist aesthetic with clean lines, intentional color palette, subtle interactions, and consistent spacing.
- **spacious** (`styles/spacious/DESIGN.md`) - Generous whitespace, consistent padding, and grid-based layouts for clean, readable, and breathing interfaces.
- **square** (`styles/square/DESIGN.md`) - Graceful, refined aesthetic with delicate typography, minimal palettes, and polished layouts that exude sophistication.
- **stitch** (`styles/stitch/DESIGN.md`) - Clean, high-contrast enterprise design for data-driven workflows with intuitive drag-and-drop patterns and structured layouts.
- **storytelling** (`styles/storytelling/DESIGN.md`) - Narrative-driven design using visuals, copy, and interaction to guide users through engaging, emotionally resonant journeys.
- **terracotta** (`styles/terracotta/DESIGN.md`) - A sun-baked, clay-toned editorial interface built on warm cream surfaces, ink-brown headlines set in a display serif, and a single terracotta accent.
- **tetris** (`styles/tetris/DESIGN.md`) - Classic block-game inspired design with playful colors, bold display fonts, and compact, high-energy layouts.
- **vibrant** (`styles/vibrant/DESIGN.md`) - Lively, colorful design with bold playful typography, warm accents, and dynamic visual energy.
- **vintage** (`styles/vintage/DESIGN.md`) - 1950s-1990s nostalgia with skeuomorphic touches, grainy textures, retro color palettes, and pixel-style typography.
