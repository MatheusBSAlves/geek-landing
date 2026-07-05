# Hero Section — Spec

> Seção 1 do `index.html` (ver `DESIGN.md §7`). **Source-of-truth: os prints da Hero.** Nenhum elemento fora do print foi adicionado. Cópia transcrita literalmente; onde o print é ambíguo, marcado como **Suposição a confirmar** (§7). Cores e fontes usam **apenas tokens do `:root`** definidos em `DESIGN.md §8`.

---

## 1. Objetivo

Entregar a primeira dobra do site como um **pôster de confronto**: Goku (esquerda) e Freeza (direita) se encarando e emoldurando o título central "Dragon Ball Z / A Saga de Freeza", sobre um fundo de campo de batalha desolado (destruição de Namekusei). A seção comunica tema, tom épico e convida à rolagem via indicador "Role para começar" (→ `#personagens`).

Estado documentado aqui: **layout estático (repouso)** + **ganchos prontos** para a sequência de scroll descrita em `DESIGN.md §6/§7`. Não define a coreografia GSAP em si — apenas a estrutura, camadas e âncoras que ela vai animar.

---

## 2. Inventário visual (item a item)

Somente o que aparece nos prints. A coluna **Cópia** é transcrição literal.

### Elementos de texto

| # | Elemento | Cópia (literal) | Observação de renderização |
|---|----------|-----------------|-----------------------------|
| T1 | Pill / eyebrow | `A Saga Lendária` | Exibida em CAIXA ALTA (via `text-transform`), texto laranja dentro de cápsula escura translúcida com borda suave |
| T2 | Título — linha 1 (h1) | `Dragon Ball Z` | Branco, peso pesado (Anton), sem caixa alta forçada |
| T3 | Título — linha 2 (h1) | `A Saga de Freeza` | Dourado/amarelo, mesma fonte da linha 1 |
| T4 | Tagline | `A batalha que forjou uma lenda` | CAIXA ALTA, branco, letter-spacing amplo, tamanho pequeno |
| T5 | Rótulo de scroll | `Role para começar` | CAIXA ALTA, letter-spacing. **Cor ambígua no print** → §7 (S3) |

### Elementos gráficos

| # | Elemento | Descrição (do print) |
|---|----------|----------------------|
| V1 | Figura Goku | Goku Super Saiyajin (cabelo dourado eriçado), em perfil olhando para o centro, recortado na borda **esquerda** |
| V2 | Figura Freeza | Freeza (forma final, branco/roxo), em perfil olhando para o centro, recortado na borda **direita** |
| V3 | Glow do Goku | Halo/aura dourada-alaranjada em torno da figura do Goku |
| V4 | Glow do Freeza | Halo/aura roxa em torno da figura do Freeza |
| V5 | Fundo | Campo de batalha desolado: terra escura/queimada, montanhas ao fundo, brasas dispersas, céu dramático em laranja/marrom/dourado |
| V6 | Ícone chevron | Seta "v" para baixo dentro de círculo com contorno laranja, abaixo do rótulo T5 |

> **Não presentes no print (portanto, não especificados aqui):** navbar, botões/CTA, links de menu, logos, contadores, ornamentos extras. A nav flutuante do `DESIGN.md §4` só aparece **ao rolar** e não faz parte do estado inicial da Hero.

---

## 3. HTML — árvore e classes

Árvore de referência (sem código; nomes de classe seguindo a convenção BEM do `DESIGN.md`). A ordem no DOM segue a pilha de camadas da §4.

```
section.hero#hero
├── video.hero__bg-video                  ← V5 (fundo)          [camada 1]
├── div.hero__overlay        [aria-hidden] ← véu dramático       [camada 2]
├── div.hero__goku-glow      [aria-hidden] ← V3                  [camada 3]
├── div.hero__freeza-glow    [aria-hidden] ← V4                  [camada 3]
├── video.hero__figure.hero__figure--goku   ← V1                [camada 4]
├── video.hero__figure.hero__figure--freeza ← V2                [camada 4]
├── div.hero__overlay-front  [aria-hidden] ← legibilidade        [camada 5]
├── div.hero__content                      ← pôster             [camada 6]
│   ├── span.hero__pill                     ← T1
│   ├── h1.hero__title
│   │   ├── span.hero__title-line.hero__title-line--main  ← T2
│   │   └── span.hero__title-line.hero__title-line--saga  ← T3
│   └── p.hero__tagline                     ← T4
└── a.hero__scroll  [href="#personagens"]   ← seta               [camada 7]
    ├── span.hero__scroll-label             ← T5
    └── span.hero__scroll-arrow [aria-hidden] ← V6 (chevron/círculo)
```

Notas de estrutura:
- `h1.hero__title` contém **as duas linhas** (T2/T3) como spans irmãos; modificadores `--main`/`--saga` alteram **apenas a cor** (`DESIGN.md §3`).
- `.hero__scroll` é um **link âncora** para `#personagens` (destino: seção Personagens, `DESIGN.md §7 item 2`).
- Glows e overlays são puramente decorativos → `aria-hidden="true"`.
- O `.hero__scroll-arrow` embrulha o chevron (círculo + seta); o círculo pode ser border do próprio span ou um SVG interno — decisão de implementação, não de conteúdo.

---

## 4. Camadas (ordem de empilhamento)

Do fundo para a frente. Cada camada é isolada por `z-index`/ordem no DOM.

| Camada | Elemento(s) | Papel |
|--------|-------------|-------|
| 1 — Fundo | `.hero__bg-video` (V5) | Vídeo em loop do campo de batalha; cobre 100% da seção (`object-fit: cover`) |
| 2 — Overlay | `.hero__overlay` | Véu escuro sobre o fundo para rebaixar o brilho e dar profundidade |
| 3 — Glows | `.hero__goku-glow` (V3), `.hero__freeza-glow` (V4) | Halos coloridos atrás das figuras (dourado à esquerda, roxo à direita) |
| 4 — Vídeos das figuras | `.hero__figure--goku` (V1), `.hero__figure--freeza` (V2) | Personagens em vídeo, recortados nas bordas; `mix-blend-mode: screen` (`DESIGN.md §4`) |
| 5 — Overlay-front | `.hero__overlay-front` | Gradiente/véu **à frente das figuras e atrás do pôster** para garantir legibilidade do título central |
| 6 — Pôster | `.hero__content` (T1–T4) | Bloco central: pill, título (2 linhas), tagline |
| 7 — Seta | `.hero__scroll` (T5 + V6) | Indicador de rolagem no rodapé da seção |

> A camada 5 (`overlay-front`) é uma **camada de tratamento/legibilidade**, não um elemento de conteúdo — não adiciona texto nem gráfico visível novo. Está no stack porque foi requisitada; sua intensidade exata é ajuste de implementação (S4).

---

## 5. Tokens (somente `:root` do `DESIGN.md §8`)

Nenhuma cor/fonte nova. Mapeamento por elemento:

### Cor

| Elemento | Token | Valor |
|----------|-------|-------|
| Texto da pill (T1) | `--accent-star` | `#ff7a18` |
| Fundo da pill (T1) | `--bg-overlay` **ou** `--accent-star-dim` → §7 (S2) | `rgba(8,12,28,0.74)` / `rgba(255,122,24,0.12)` |
| Borda da pill (T1) | `--border-subtle` | `rgba(245,240,232,0.12)` |
| Título linha 1 (T2) | `--text-primary` | `#f5f0e8` |
| Título linha 2 (T3) | `--cosmic-rose` | `#ffd23f` |
| Tagline (T4) | `--text-primary` | `#f5f0e8` |
| Rótulo scroll (T5) | `--text-primary` (per `DESIGN §4`) **vs.** `--accent-star` (per print) → §7 (S3) | — |
| Chevron/círculo (V6) | `--accent-star` | `#ff7a18` |
| Glow Goku (V3) | `--accent-star-glow` | `rgba(255,122,24,0.35)` |
| Glow Freeza (V4) | `--cosmic-purple` / `--cosmic-purple-dim` | `#6c2bd9` |
| Overlays (camadas 2 e 5) | `--bg-overlay` / `--bg-deep` | `rgba(8,12,28,0.74)` / `#04060f` |
| Ring de foco (T5 link) | `--ring-focus` | `rgba(41,194,255,0.55)` |

### Tipografia

| Elemento | Token | Família |
|----------|-------|---------|
| h1 (T2 e T3, ambas as linhas) | `--font-hero-stamp` | Anton |
| Pill (T1) | `--font-hero-saga` | Oswald |
| Tagline (T4) | `--font-hero-saga` | Oswald |
| Rótulo scroll (T5) | `--font-hero-saga` | Oswald |

### Outros
- Letter-spacing de labels (T1, T4, T5): `--ls-label` (`0.12em`).
- Escala fluida de tamanhos: família `clamp(...)` / `--fs-*` (`DESIGN §3`).
- Easings de movimento (§9): `--ease-out-expo`, `--ease-spring`.

> A Hero **não** usa Fredoka (`--font-display`); o h1 permanece em Anton (`DESIGN §3`).

---

## 6. Assets mapeados

Todos obrigatórios. Vídeos com atributos `autoplay loop muted playsinline preload="auto"` e `type="video/mp4"`.

| Asset | Caminho | Elemento / classe | Camada |
|-------|---------|-------------------|--------|
| Fundo (destruição de Namekusei) | `assets/videos/hero-bg-namekusei.mp4` | `video.hero__bg-video` | 1 |
| Goku (esquerda, flutuando) | `assets/videos/goku-hero.mp4` | `video.hero__figure--goku` | 4 |
| Freeza (direita, flutuando) | `assets/videos/freeza-hero.mp4` | `video.hero__figure--freeza` | 4 |
| Glow do Goku (decorativo) | — (sem arquivo; CSS) | `div.hero__goku-glow` `aria-hidden` | 3 |
| Glow do Freeza (decorativo) | — (sem arquivo; CSS) | `div.hero__freeza-glow` `aria-hidden` | 3 |

Notas:
- Os glows são **divs decorativas** (glow via CSS/gradiente radial), sem arquivo de mídia.
- Fornecer poster/fallback estático para cada vídeo é recomendado (S5) mas não obrigatório por este spec.
- Lista global de assets: ver `README-ASSETS.md` (`DESIGN §9`).

---

## 7. Suposições a confirmar

| ID | Item | Ambiguidade | Encaminhamento sugerido |
|----|------|-------------|--------------------------|
| S1 | Fundo da pill (T1) | No print a cápsula parece **escura translúcida**, não laranja. `DESIGN §4` só fixa o **texto** como `--accent-star` | Confirmar se o fundo é `--bg-overlay` (escuro, como no print) ou `--accent-star-dim` (laranja suave) |
| S2 | Borda da pill | Print sugere borda dourada/suave; DESIGN cita "borda dourada suave" em Badges/Pills | Confirmar `--border-subtle` vs. borda com tint do `--accent-star` |
| S3 | Cor do rótulo "Role para começar" (T5) | **Conflito:** print aparenta tom quente/dourado; `DESIGN §4` especifica `--text-primary` (branco) | Confirmar cor. Default deste spec: seguir `DESIGN §4` (branco) até decisão contrária |
| S4 | Intensidade do `overlay-front` (camada 5) | Não é um elemento visível isolado no print | Ajuste fino de legibilidade na implementação |
| S5 | Poster/fallback dos vídeos | Não informado | Definir imagem de fallback por vídeo (recomendado) |
| S6 | Recorte das figuras em telas largas | O quanto Goku/Freeza podem "sangrar" para fora da viewport | Definir limite de bleed lateral |

> Nenhuma suposição adiciona **conteúdo** (texto/elemento) novo — todas tratam de tokens/tratamento de elementos já presentes no print.

---

## 8. Responsividade

Segue `DESIGN §5` (colapso obrigatório < 768px, sem overflow horizontal).

**Desktop / ≥ 768px (como no print):**
- Composição freeform: Goku fixado à esquerda, Freeza à direita, ambos recortados nas bordas; pôster centralizado entre eles.
- `.hero` ocupa ~100vh; conteúdo centralizado vertical e horizontalmente; seta ancorada perto da base.
- Título em escala grande via `clamp(...)`.

**Mobile / < 768px:**
- Colapso para **coluna única**, sem overflow horizontal.
- Figuras Goku/Freeza recuam em prioridade visual (reduzir opacidade/tamanho ou reposicionar atrás do pôster) para não competir com o texto — **sem** remover elementos do print.
- Título reduz via `clamp(...)`; manter as duas linhas empilhadas.
- Pill, tagline e seta permanecem centralizados; letter-spacing pode reduzir para caber.
- Vídeos mantêm `object-fit: cover`; garantir que o texto central fique legível sobre o `overlay-front`.

---

## 9. Comportamentos

### 9.1 Estado estático (repouso — o que o print mostra)
- Vídeos de fundo e figuras em loop, `muted`/`autoplay`/`playsinline`.
- Figuras com `mix-blend-mode: screen` sobre glows e fundo.
- Chevron (V6) com animação sutil de **bob** vertical contínuo (`DESIGN §4`).
- Foco visível (`:focus-visible`) no link `.hero__scroll` usando `--ring-focus`.

### 9.2 Ganchos prontos para scroll (a coreografia mora na §6/§7 do DESIGN)
- **Entrada em cascata** (stagger) dos itens do pôster: pill → título linha 1 → título linha 2 → tagline → seta, via GSAP + tokens `--stagger-*`, easing `--ease-out-expo`.
- **Parallax leve** nas figuras/glows conforme scroll/cursor (composição freeform, `DESIGN §4`).
- `.hero__scroll` como link âncora: clique rola suavemente para `#personagens`.
- Elementos animados marcados com `will-change: transform, opacity` (`DESIGN §6`).

### 9.3 Acessibilidade e reduced-motion
- `@media (prefers-reduced-motion: reduce)`: neutralizar bob, parallax e cascata; exibir estado estático.
- Alternativa a autoplay de vídeo em reduced-motion: pausar/usar poster estático (recomendado).
- Glows/overlays `aria-hidden="true"`.
- `h1` é o único heading nível 1 da página; pill e tagline são texto de apoio (não headings).

---

## 10. Checklist de implementação

- [ ] `section.hero#hero` presente e com altura ~100vh.
- [ ] `video.hero__bg-video` → `assets/videos/hero-bg-namekusei.mp4` com `autoplay loop muted playsinline preload="auto"`.
- [ ] `.hero__figure--goku` → `assets/videos/goku-hero.mp4` (mesmos atributos).
- [ ] `.hero__figure--freeza` → `assets/videos/freeza-hero.mp4` (mesmos atributos).
- [ ] `mix-blend-mode: screen` nas duas figuras.
- [ ] `.hero__goku-glow` e `.hero__freeza-glow` presentes, decorativos (`aria-hidden`), cores `--accent-star-glow` / `--cosmic-purple`.
- [ ] `.hero__overlay` (camada 2) e `.hero__overlay-front` (camada 5) presentes.
- [ ] Ordem de camadas 1→7 respeitada.
- [ ] Pill com texto exato `A Saga Lendária`, fonte Oswald, texto `--accent-star`.
- [ ] `h1` com linhas exatas `Dragon Ball Z` (branco, `--text-primary`) e `A Saga de Freeza` (dourado, `--cosmic-rose`), ambas Anton.
- [ ] Tagline exata `A batalha que forjou uma lenda`, Oswald, `--text-primary`.
- [ ] `.hero__scroll` com rótulo exato `Role para começar`, `href="#personagens"`, chevron em círculo `--accent-star` + bob.
- [ ] Apenas tokens do `:root` (nenhuma cor/fonte hardcoded fora deles).
- [ ] Colapso mobile em coluna única, sem overflow horizontal.
- [ ] `prefers-reduced-motion` tratado.
- [ ] `:focus-visible` no link de scroll com `--ring-focus`.
- [ ] Suposições S1–S6 resolvidas ou registradas.

---

## 11. Aceitação

A implementação é aceita quando:

1. **Fidelidade ao print:** pill, título (2 linhas), tagline, seta e as duas figuras aparecem com o mesmo posicionamento e hierarquia do print — sem nenhum elemento extra (botão, nav, badge, ícone) que não esteja no print.
2. **Cópia idêntica:** todos os textos batem literalmente com a §2 (respeitando caixa alta aplicada por CSS, não no conteúdo).
3. **Cores e fontes:** cada elemento usa o token da §5; título linha 2 é `--cosmic-rose` (dourado), **não** `--accent-star`; h1 inteiro em Anton; pill/tagline/scroll em Oswald.
4. **Assets:** os três vídeos carregam dos caminhos da §6 com os atributos obrigatórios; glows são decorativos e `aria-hidden`.
5. **Camadas:** empilhamento fundo → overlay → glows → vídeos → overlay-front → pôster → seta, com o pôster legível sobre as figuras.
6. **Responsivo:** em < 768px, coluna única sem overflow; texto legível.
7. **Movimento:** cascata de entrada, bob do chevron e parallax presentes; tudo neutralizado sob `prefers-reduced-motion`.
8. **Scroll:** o link da seta leva a `#personagens`.
9. **Suposições:** S1–S6 estão resolvidas ou explicitamente registradas como pendências; nenhuma virou conteúdo inventado.
