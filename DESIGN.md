# Design System: Dragon Ball Z — A Saga do Freeza

## 1. Visual Theme & Atmosphere
Atmosfera cósmica de batalha em Namekusei: fundo profundo, energia de ki e o laranja icônico do kimono do Goku.
Contraste alto, brilho controlado e foco narrativo na jornada dos Guerreiros Z.

- **Density:** 5/10
- **Variance:** 6/10
- **Motion:** 6/10

## 2. Color Palette & Roles
### Base
- **Cosmic Deep** (`#04060f`) — Fundo base global (`--bg-deep`)
- **Cosmic Mid** (`#0a1228`) — Fundo intermediário de seções (`--bg-mid`)
- **Cosmic Surface** (`#121a3a`) — Superfícies de componentes (`--bg-surface`)
- **Cosmic Surface Raised** (`#1a2350`) — Superfícies elevadas / nav flutuante (`--bg-surface-raised`)
- **Cosmic Overlay** (`rgba(8, 12, 28, 0.74)`) — Véu de overlays (`--bg-overlay`)

### Texto
- **Starlight Primary** (`#f5f0e8`) — Texto principal e títulos Fredoka (`--text-primary`)
- **Starlight Muted** (`rgba(247, 243, 232, 0.64)`) — Texto secundário (`--text-muted`)
- **Starlight Faint** (`rgba(245, 240, 232, 0.48)`) — Texto terciário / rótulos suaves (`--text-faint`)

### Acentos
- **Laranja Goku** (`#ff7a18`) — Accent principal para eyebrows, foco e detalhes (`--accent-star`)
- **Laranja Goku Dim** (`rgba(255, 122, 24, 0.12)`) — Fundo de pills, badges e hover soft (`--accent-star-dim`)
- **Laranja Goku Glow** (`rgba(255, 122, 24, 0.35)`) — Halos e drop-shadows (`--accent-star-glow`)
- **Azul Ki** (`#29c2ff`) — Destaques secundários, carrossel e glows (`--cosmic-cyan` / `--cosmic-cyan-dim`)
- **Roxo Freeza** (`#6c2bd9`) — CTA/gradientes secundários e overlays (`--cosmic-purple` / `--cosmic-purple-dim`)
- **Amarelo Energia** (`#ffd23f`) — Acento narrativo complementar, blips do radar e **linha 2 do título da Hero** (`--cosmic-rose` / `--cosmic-rose-dim`)

### Bordas / foco
- `--border-subtle` (`rgba(245, 240, 232, 0.12)`) e `--border-strong` (`rgba(245, 240, 232, 0.22)`)
- `--ring-focus` (`rgba(41, 194, 255, 0.55)`) — outline de `:focus-visible`

## 3. Typography Rules
Quatro famílias (carregadas via Google Fonts no `<head>`):

- **Corpo:** `Outfit` (`--font-body`) — parágrafos, descrições, microcopy e texto corrido
- **Títulos:** `Fredoka` (`--font-display`) — **todos os títulos fora da Hero** (h2, h3, headings de seção, títulos de cards, contadores da Jornada, etc.)
- **Hero — carimbo (título h1):** `Anton` (`--font-hero-stamp`) — **as duas linhas** do h1 (`.hero__title-line--main` e `.hero__title-line--saga`); mesma família, cores diferentes
- **Hero — labels:** `Oswald` (`--font-hero-saga`) — pill, tagline e rótulo de scroll (`.hero__pill`, `.hero__tagline`, `.hero__scroll-label`)

**Mapeamento por contexto:**

| Contexto | Token | Família |
|----------|-------|---------|
| Corpo, navegação, utilitários | `--font-body` | Outfit |
| Títulos de seção (h2, h3, `.section__title`, etc.) | `--font-display` | **Fredoka** |
| `.hero__title`, `.hero__title-line--main`, `.hero__title-line--saga` | `--font-hero-stamp` | Anton |
| `.hero__pill`, `.hero__tagline`, `.hero__scroll-label` | `--font-hero-saga` | Oswald |

> Modificadores `--main` / `--saga` no h1: **cor apenas** (`--text-primary` vs `--cosmic-rose`). Ver `docs/hero-section-spec.md §5`.
> A Hero **não** usa Fredoka — o h1 permanece em Anton.

Regras gerais:
- **Hierarchy:** Títulos em **Fredoka**, peso 600–700; corpo em Outfit entre 400–500
- **Utility labels:** Navegação, eyebrows e microcopy em caixa alta com letter-spacing (`--ls-label: 0.12em`)
- **Escala fluida:** Tamanhos via `clamp(...)` (`--fs-2xs` … `--fs-display`)
- **Fallback:** `ui-sans-serif, system-ui, sans-serif` em todas as famílias

## 4. Component Stylings
- **Nav flutuante:** Barra fixa arredondada (`--bg-surface-raised` + `backdrop-filter`), links em caixa alta; item ativo em `Laranja Goku`. Aparece ao rolar (fade/slide).
- **Hero (pôster):** Fundo de vídeo em loop + overlay dramático; figuras **Goku** (esquerda) e **Freeza** (direita) em vídeo com `mix-blend-mode: screen`. Título estilo pôster — **cores por elemento (ver `docs/hero-section-spec.md §5`):** pill laranja (`--accent-star`); linha 1 branca (`--text-primary`); linha 2 dourada (`--cosmic-rose`, **não** `--accent-star`); tagline branca (`--text-primary`); rótulo de scroll branco (`--text-primary`); seta/círculo laranja (`--accent-star`). **Tipografia:** h1 inteiro Anton (`--font-hero-stamp`, mesma fonte nas duas linhas); pill/tagline/scroll-label Oswald (`--font-hero-saga`). Indicador "Role para começar" com seta em bob. Spec: `docs/hero-section-spec.md`.
- **Personagens:** Composição freeform (posicionamento absoluto + parallax) sobre um **data-grid animado** (radar estilo 21st.dev): células que pulsam do centro, glow que segue o cursor e blips amarelos. Substitui o particles.js.
- **A Saga (Jornada):** **Linha do tempo horizontal** — a viewport "trava" (pin do ScrollTrigger) e os capítulos deslizam na horizontal com scrub; HUD com barra de progresso e contador `01/06`. Cada capítulo tem cor de acento própria via `--ch-accent`.
- **Trailers:** Carrossel de vídeos do YouTube (embed nocookie) com moldura em gradiente, setas e dots.
- **Cards/Containers:** Base em `Cosmic Surface` translúcido com `backdrop-filter`; separação por contraste tonal e `--border-subtle`.
- **Badges/Pills:** Fundo escuro translúcido ou `Laranja Goku Dim`, texto de alto contraste, borda dourada suave.

## 5. Layout Principles
- Arquitetura grid-first com alinhamento consistente entre seções
- Contenção por largura máxima (~1200–1400px) com respiro lateral progressivo (`--space-gutter-x`)
- Em mobile (< 768px), colapso obrigatório para coluna única sem overflow horizontal (personagens viram fluxo vertical; jornada vira scroll vertical simples)
- Escala de espaçamento vertical fluida via `clamp(...)` (`--space-section-y`)

## 6. Motion & Interaction
- **Primary easing:** `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- **Elastic easing:** `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Bibliotecas:** GSAP + ScrollTrigger (sequência da hero, pin/scrub horizontal da Jornada, reveals). `IntersectionObserver` para reveals leves e para o counter da Jornada.
- **Entrances:** Reveal em cascata com atraso curto (stagger via tokens `--stagger-*`)
- **Performance:** Animações em `transform` e `opacity`; `will-change` nos elementos animados
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` neutraliza animações; a Jornada cai para layout estático em coluna

## 7. Estrutura das Seções
Ordem real no `index.html`:

1. **Hero** — fundo de vídeo + figuras Goku/Freeza (vídeos) + título pôster; indicador de scroll
2. **Personagens** — 9 figuras (Goku, Vegeta, Gohan, Kuririn, Ginyu, Freeza, Piccolo, Dodoria, Zarbon) em composição freeform sobre o data-grid/radar
3. **A Saga** (`#saga`, `class="jornada"`) — linha do tempo **horizontal** da Saga do Freeza (6 capítulos, pin + scrub com GSAP)
4. **Trailers** — carrossel com os melhores momentos da saga (YouTube)
5. **Footer** — créditos e disclaimer

> Observação: existe CSS legado sem uso no `styles.css` (`.marquee-personagens`, timeline vertical `.saga__*`, hero antiga `.hero__planet/.hero__goku/.hero__vegeta/.hero__star`). Candidatos a limpeza.

## 8. Canonical Token Snippet
```css
:root {
  /* Fontes */
  --font-body: 'Outfit', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Fredoka', ui-sans-serif, system-ui, sans-serif;      /* títulos: h2, h3, section headings */
  --font-hero-stamp: 'Anton', ui-sans-serif, system-ui, sans-serif;      /* hero: h1 — ambas as linhas */
  --font-hero-saga: 'Oswald', 'Outfit', ui-sans-serif, sans-serif;       /* hero: pill, tagline, scroll */

  /* Cores base */
  --bg-deep: #04060f;
  --bg-mid: #0a1228;
  --bg-surface: #121a3a;
  --bg-surface-raised: #1a2350;
  --bg-overlay: rgba(8, 12, 28, 0.74);

  /* Texto */
  --text-primary: #f5f0e8;
  --text-muted: rgba(247, 243, 232, 0.64);
  --text-faint: rgba(245, 240, 232, 0.48);

  /* Acentos */
  --accent-star: #ff7a18;                       /* Laranja Goku */
  --accent-star-dim: rgba(255, 122, 24, 0.12);
  --accent-star-glow: rgba(255, 122, 24, 0.35);
  --cosmic-cyan: #29c2ff;                        /* Azul Ki */
  --cosmic-purple: #6c2bd9;                      /* Roxo Freeza */
  --cosmic-rose: #ffd23f;                        /* Amarelo Energia — hero: .hero__title-line--saga */

  /* Bordas / foco */
  --border-subtle: rgba(245, 240, 232, 0.12);
  --border-strong: rgba(245, 240, 232, 0.22);
  --ring-focus: rgba(41, 194, 255, 0.55);

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Tokens da seção "A Saga" (`css/jornada.css`)
Geometria/estado específicos da linha do tempo horizontal, todos derivados dos tokens acima (nenhuma cor nova). Definidos no `:root` de `css/jornada.css` (ver `docs/stories/jornada-section.md §5.3`):

```css
--jornada-bp: 768px;
--jornada-gap / --jornada-panel-width / --jornada-card-radius;
--jornada-media-ratio / --jornada-media-radius / --jornada-desc-maxw;
--jornada-rail-weight / --jornada-dot-size / --jornada-hud-maxw;
--jornada-numeral-opacity / --jornada-numeral-size / --jornada-numeral-size-mobile;
--jornada-kanji-opacity;
--jornada-parallax-strength / --jornada-scrub-lerp / --jornada-reveal-y / --jornada-timeline-mobile;
--jornada-fs-heading / --jornada-fs-desc / --jornada-fs-counter;
/* Runtime, setados por js/jornada.js: --x, --px, --progress */
```

`--ch-accent` por capítulo (inline, mapeado sobre os acentos do §2): Cap.01 `--cosmic-cyan` · Cap.02 `--cosmic-purple` · Cap.03 `--accent-star` · Cap.04 `--cosmic-rose` · Cap.05 `--cosmic-cyan` · Cap.06 `--accent-star`.

## 9. Assets necessários (criar depois)
Ver `README-ASSETS.md` para a lista completa de imagens e vídeos esperados em `assets/`.
