# Design System: Dragon Ball Z — A Saga do Freeza

> Baseado na arquitetura do projeto Super Mario Galaxy, re-tematizado para a Saga do Freeza.

## 1. Visual Theme & Atmosphere
Atmosfera cósmica de batalha em Namekusei: fundo profundo, energia de ki e o laranja icônico do kimono do Goku.
Contraste alto, brilho controlado e foco narrativo na jornada dos Guerreiros Z.

- **Density:** 5/10
- **Variance:** 6/10
- **Motion:** 6/10

## 2. Color Palette & Roles
- **Cosmic Deep** (`#04060f`) — Fundo base global (`--bg-deep`)
- **Cosmic Mid** (`#0a1228`) — Fundo intermediário de seções (`--bg-mid`)
- **Cosmic Surface** (`#121a3a`) — Superfícies de componentes (`--bg-surface`)
- **Starlight Primary** (`#f5f0e8`) — Texto principal e headings (`--text-primary`)
- **Starlight Muted** (`rgba(247, 243, 232, 0.64)`) — Texto secundário (`--text-muted`)
- **Laranja Goku** (`#ff7a18`) — Accent principal para CTA e foco (`--accent-star`)
- **Laranja Goku Dim** (`rgba(255, 122, 24, 0.14)`) — Fundo de pills, badges e hover soft (`--accent-star-dim`)
- **Azul Ki** (`#29c2ff`) — Destaques secundários e glows internos (`--cosmic-cyan`)
- **Roxo Freeza** (`#6c2bd9`) — CTA secundário e overlays (`--cosmic-purple`)
- **Amarelo Energia** (`#ffd23f`) — Acento narrativo complementar (`--cosmic-rose`)

## 3. Typography Rules
- **Display/Body:** `Outfit, sans-serif` (`--font-body`)
- **Hierarchy:** Títulos com peso 700–900; corpo entre 400–500
- **Utility labels:** Navegação e microcopy em caixa alta com leve letter-spacing
- **Fallback:** `sans-serif` quando `Outfit` não estiver disponível

## 4. Component Stylings
- **Buttons:** Primário em `Laranja Goku`; secundário pode usar `Roxo Freeza`.
- **Cards/Containers:** Base em `Cosmic Surface`; separação por contraste tonal.
- **Timeline (Saga):** Trilho vertical com nós em `Laranja Goku`; cards translúcidos sobre o fundo cósmico.
- **Badges/Pills:** Fundo `Laranja Goku Dim` com texto de alto contraste.
- **Hero:** Composição espacial de alto impacto (Goku, Vegeta e o planeta Namekusei).

## 5. Layout Principles
- Arquitetura grid-first com alinhamento consistente entre seções
- Contenção por largura máxima (1200–1400px) com respiro lateral progressivo
- Em mobile (< 768px), colapso obrigatório para coluna única sem overflow horizontal
- Escala de espaçamento vertical fluida via `clamp(...)`

## 6. Motion & Interaction
- **Primary easing:** `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- **Elastic easing:** `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Entrances:** Reveal em cascata com atraso curto (timeline revela via IntersectionObserver)
- **Performance:** Animações em `transform` e `opacity`

## 7. Estrutura das Seções
1. **Hero** — Goku + Vegeta + planeta Namekusei (vídeos), Esferas do Dragão decorativas
2. **Marquee** — faixa rolante com termos da saga
3. **Personagens** — 7 Guerreiros Z e vilões (parallax + particles.js)
4. **Trailers** — carrossel com os melhores momentos da saga (YouTube)
5. **A Saga** — linha do tempo da Saga do Freeza (substitui a contagem regressiva do projeto base)

## 8. Canonical Token Snippet
```css
:root {
  --bg-deep: #04060f;
  --bg-mid: #0a1228;
  --bg-surface: #121a3a;
  --text-primary: #f5f0e8;
  --text-muted: rgba(247, 243, 232, 0.64);
  --accent-star: #ff7a18;   /* Laranja Goku */
  --accent-star-dim: rgba(255, 122, 24, 0.14);
  --cosmic-cyan: #29c2ff;   /* Azul Ki */
  --cosmic-purple: #6c2bd9; /* Roxo Freeza */
  --cosmic-rose: #ffd23f;   /* Amarelo Energia */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --font-body: 'Outfit', sans-serif;
}
```

## 9. Assets necessários (criar depois)
Ver `README-ASSETS.md` para a lista completa de imagens e vídeos esperados em `assets/`.
