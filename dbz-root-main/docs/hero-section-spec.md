# Hero Section — Spec

> Source-of-truth: os prints da Hero (`hero.png`) + `DESIGN.md`.
> Restrição: **somente** tokens do `:root` do DESIGN.md. Nenhum elemento fora dos prints.

---

## 1. Objetivo

Entregar a Hero como um **pôster de abertura** em tela cheia (viewport): um fundo de vídeo (destruição de Namekusei) sob overlay dramático, com **Goku à esquerda** e **Freeza à direita** flutuando (vídeos com blend), e um bloco de título centralizado ao estilo pôster (pill → h1 duas linhas → tagline). Um indicador de scroll no rodapé convida a avançar para a próxima seção.

A Hero é a seção 1 da ordem do `index.html` (§7 do DESIGN.md) e precisa estar **pronta para o scroll/sequência** GSAP descrita no DESIGN.md §6, mas o estado-base (sem JS) já deve renderizar completo e legível.

---

## 2. Inventário visual (item a item)

Cada item abaixo aparece **literalmente** nos prints. Nada além disto.

| # | Item | Descrição no print | Origem |
|---|------|--------------------|--------|
| 1 | **Fundo** | Planície devastada, montanhas no horizonte, chão rachado com brasas laranjas; céu turbulento em laranja/marrom/dourado com luz difusa central | vídeo |
| 2 | **Overlay dramático** | Escurecimento geral que garante contraste do texto central e das bordas | CSS |
| 3 | **Goku (esquerda)** | Super Saiyajin de perfil (cabelo dourado espetado, olhos claros), voltado ao centro; entra pela borda esquerda | vídeo |
| 4 | **Freeza (direita)** | Forma final (cabeça branca/roxa, olho vermelho) de perfil, voltado ao centro; entra pela borda direita | vídeo |
| 5 | **Glow do Goku** | Halo/energia junto à figura da esquerda | CSS decorativo |
| 6 | **Glow do Freeza** | Aura roxa junto à figura da direita | CSS decorativo |
| 7 | **Pill** | Rótulo em caixa alta "A SAGA LENDÁRIA" em fundo escuro translúcido arredondado, texto laranja | texto |
| 8 | **Título linha 1** | "Dragon Ball Z" — branco | texto (h1) |
| 9 | **Título linha 2** | "A Saga de Freeza" — dourado/amarelo | texto (h1) |
| 10 | **Tagline** | "A BATALHA QUE FORJOU UMA LENDA" — branca, caixa alta, espaçada | texto |
| 11 | **Rótulo de scroll** | "ROLE PARA COMEÇAR" — branco, caixa alta, espaçado | texto |
| 12 | **Seta de scroll** | Chevron "˅" dentro de um círculo, laranja | ícone/link |

> **Não presentes nos prints** (portanto **não** incluir): nav/menu, botões/CTA, contadores, ícones sociais, logos de marca, ornamentos extras.

---

## 3. HTML — árvore/classes

Sem código; apenas a árvore de classes e a semântica esperada.

```
section.hero                          (role de banner/topo; min-height: 100svh)
├─ div.hero__bg            (aria-hidden)  ← camada de fundo
│   └─ video.hero__bg-video
├─ div.hero__overlay       (aria-hidden)  ← véu dramático (atrás das figuras)
├─ div.hero__figures       (aria-hidden)  ← wrapper das duas figuras + glows
│   ├─ div.hero__goku-glow      (aria-hidden)
│   ├─ video.hero__figure.hero__figure--goku
│   ├─ div.hero__freeza-glow    (aria-hidden)
│   └─ video.hero__figure.hero__figure--freeza
├─ div.hero__overlay-front (aria-hidden)  ← véu frontal (sobre figuras, sob o pôster)
├─ div.hero__poster                       ← bloco de conteúdo central
│   ├─ span.hero__pill
│   ├─ h1.hero__title
│   │   ├─ span.hero__title-line.hero__title-line--main
│   │   └─ span.hero__title-line.hero__title-line--saga
│   └─ p.hero__tagline
└─ a.hero__scroll  (href="#personagens")  ← indicador de scroll
    ├─ span.hero__scroll-label
    └─ span.hero__scroll-arrow   (aria-hidden)
```

Observações de acessibilidade:
- Todas as camadas puramente decorativas (bg, overlays, figuras em vídeo, glows, seta gráfica) recebem `aria-hidden="true"`.
- O h1 é o único heading da seção; a ordem textual acessível é: pill → h1 → tagline → rótulo de scroll.
- `.hero__scroll` é um link real para `#personagens` (âncora da seção 2).

---

## 4. Camadas (ordem de empilhamento, de trás para frente)

```
z0  Fundo            .hero__bg / .hero__bg-video
z1  Overlay          .hero__overlay              (escurece o fundo)
z2  Glows + Vídeos   .hero__goku-glow, .hero__freeza-glow,
                     .hero__figure--goku, .hero__figure--freeza
z3  Overlay-front    .hero__overlay-front        (unifica tom sob o texto)
z4  Pôster           .hero__poster               (pill + h1 + tagline)
z5  Seta             .hero__scroll               (rodapé, centralizada)
```

- As figuras usam `mix-blend-mode: screen` (DESIGN.md §4) — os glows ficam **atrás** de cada figura para reforçar o halo.
- O `overlay-front` é sutil: sua função é assentar o texto sobre as figuras sem apagá-las.

---

## 5. Tokens (cores por elemento) — **apenas `:root`**

Regra do DESIGN.md: no h1 os modificadores mudam **cor apenas**; a Hero **não** usa Fredoka.

| Elemento | Propriedade | Token |
|----------|-------------|-------|
| Fundo base da seção | `background` | `--bg-deep` |
| Overlay / overlay-front | `background` | `--bg-overlay` |
| Pill — fundo | `background` | `--accent-star-dim` (ou `--bg-overlay`) |
| Pill — borda | `border-color` | `--border-subtle` / `--border-strong` |
| Pill — texto | `color` | `--accent-star` |
| h1 linha 1 (`--main`) | `color` | `--text-primary` |
| h1 linha 2 (`--saga`) | `color` | `--cosmic-rose` *(amarelo energia — **não** `--accent-star`)* |
| Tagline | `color` | `--text-primary` |
| Rótulo de scroll | `color` | `--text-primary` |
| Seta / círculo | `color` / `border` | `--accent-star` |
| Glow Goku | `background` (radial) | `--accent-star-glow` |
| Glow Freeza | `background` (radial) | `--cosmic-purple` / `--cosmic-purple-dim` |
| Foco (`:focus-visible` no link) | `outline` | `--ring-focus` |

Tipografia (tokens de fonte do `:root`):

| Elemento | Token | Família |
|----------|-------|---------|
| `.hero__title` (ambas as linhas) | `--font-hero-stamp` | Anton |
| `.hero__pill`, `.hero__tagline`, `.hero__scroll-label` | `--font-hero-saga` | Oswald |

Utilidades de escala/label (do `:root`): `--fs-2xs … --fs-display` para tamanhos fluidos; `--ls-label: 0.12em` nas labels em caixa alta (pill, tagline, scroll).

Motion (do `:root`): `--ease-out-expo` para reveals; `--ease-spring` para o bob da seta.

---

## 6. Assets mapeados

Todos com `<video autoplay loop muted playsinline preload="auto">`.

| Elemento | Classe | Arquivo | type |
|----------|--------|---------|------|
| Fundo (destruição de Namekusei) | `.hero__bg-video` | `assets/videos/hero-bg-namekusei.mp4` | `video/mp4` |
| Goku (esquerda, flutuando) | `.hero__figure--goku` | `assets/videos/goku-hero.mp4` | `video/mp4` |
| Freeza (direita, flutuando) | `.hero__figure--freeza` | `assets/videos/freeza-hero.mp4` | `video/mp4` |
| Glow Goku | `.hero__goku-glow` | — (puro CSS, `aria-hidden`) | — |
| Glow Freeza | `.hero__freeza-glow` | — (puro CSS, `aria-hidden`) | — |

> Poster/fallback de imagem para os vídeos: **não** especificado nos prints → ver §7.

---

## 7. Suposições a confirmar

1. **Âncora da seta:** o print mostra só a seta; o destino `#personagens` vem da instrução, não do print. → *Suposição a confirmar* (o alvo/id).
2. **Caixa alta das labels:** "A SAGA LENDÁRIA", "A BATALHA QUE FORJOU UMA LENDA" e "ROLE PARA COMEÇAR" aparecem em maiúsculas no print; a copy canônica ("A Saga Lendária", "A batalha que forjou uma lenda", "Role para começar") sugere caixa alta via CSS (`text-transform`) e não no conteúdo. → *Suposição a confirmar* (transformar via CSS mantendo o texto em caixa mista no HTML).
3. **Título "de Freeza" vs "do Freeza":** o print e a copy usam **"A Saga de Freeza"**; o cabeçalho do DESIGN.md diz "do Freeza". Mantido **"de Freeza"** (source = print). → registrado.
4. **Fundo/poster de fallback dos vídeos** (imagem estática enquanto o vídeo carrega): não visível no print. → *Suposição a confirmar* (usar frame do próprio vídeo).
5. **Glow do Freeza** — cor exata (roxo) inferida da aura no print; token escolhido `--cosmic-purple`. → confere com o print; sem cor nova.

---

## 8. Responsividade

- **Desktop (≥ 768px):** layout do print — figuras absolutas nas bordas (Goku esq., Freeza dir.), pôster centralizado; seção em `min-height: 100svh`.
- **Mobile (< 768px):** conforme DESIGN.md §5 (colapso para coluna única, sem overflow horizontal). O pôster permanece centralizado e prioritário; as figuras reduzem/afastam-se para as bordas ou recuam em opacidade para não competir com o texto (viram fluxo vertical/decorativo). Escalas de fonte já fluidas via `clamp()`.
- Sem scroll horizontal em nenhuma largura.
- Seta e labels mantêm `--ls-label` e caixa alta.

---

## 9. Comportamentos

**Estado estático (sem JS):**
- Vídeos em loop mudo com autoplay; a seção renderiza completa e legível sem depender de JS.
- Seta com micro-animação de "bob" (loop vertical) usando `--ease-spring` — decorativa.

**Pronto para o scroll (§6/§7 do DESIGN.md):**
- A Hero deve suportar a sequência GSAP + ScrollTrigger (reveal em cascata do pôster; parallax leve das figuras). Elementos animados usam `transform`/`opacity` + `will-change`.
- O link `.hero__scroll` faz scroll suave até a seção seguinte (`#personagens`).

**Reduced motion (`prefers-reduced-motion: reduce`):**
- Neutraliza o bob da seta e reveals; vídeos podem congelar/parar. Layout permanece estático e legível.

---

## 10. Checklist de implementação

- [ ] `min-height: 100svh`, sem overflow horizontal.
- [ ] Camadas na ordem da §4 (bg → overlay → glows+figuras → overlay-front → pôster → seta).
- [ ] 3 vídeos com `autoplay loop muted playsinline preload="auto"` e `type="video/mp4"`.
- [ ] Figuras com `mix-blend-mode: screen`; glows atrás de cada figura.
- [ ] h1 inteiro em Anton (`--font-hero-stamp`); linha 1 `--text-primary`, linha 2 `--cosmic-rose`.
- [ ] Pill/tagline/scroll em Oswald (`--font-hero-saga`); caixa alta via CSS + `--ls-label`.
- [ ] Pill laranja (`--accent-star`); seta/círculo laranja (`--accent-star`).
- [ ] Todas as camadas decorativas com `aria-hidden`; único heading = h1.
- [ ] Link da seta → `#personagens`, com `:focus-visible` usando `--ring-focus`.
- [ ] Nenhum elemento fora dos prints (sem nav, botões, ícones extras).
- [ ] Apenas tokens do `:root`; nenhuma cor/fonte nova.

---

## 11. Critérios de aceitação

1. **Fidelidade ao print:** posição de Goku (esq.) e Freeza (dir.), pôster central, seta ao rodapé — todos correspondem ao `hero.png`.
2. **Copy exata:** "A Saga Lendária", "Dragon Ball Z", "A Saga de Freeza", "A batalha que forjou uma lenda", "Role para começar".
3. **Cores por elemento:** linha 1 branca, linha 2 dourada (`--cosmic-rose`), pill e seta laranja — batendo com a §5.
4. **Tipografia:** h1 em Anton nas duas linhas; pill/tagline/scroll em Oswald.
5. **Assets:** os 3 vídeos mapeados nos caminhos da §6, com atributos obrigatórios; glows presentes e decorativos.
6. **Acessibilidade:** decorativos ocultos ao leitor de tela; heading único; link de scroll navegável por teclado com anel de foco.
7. **Responsivo:** coluna única em < 768px, sem overflow horizontal.
8. **Restrição respeitada:** nenhum elemento inventado; somente tokens do `:root`.