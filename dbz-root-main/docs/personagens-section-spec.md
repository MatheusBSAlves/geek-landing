# Spec: Seção "Personagens" — DBZ / Saga do Freeza

> **Source-of-truth:** os prints da seção Personagens. Nada fora deles foi inventado (sem botões, filtros, ícones ou textos extras). Copy transcrita exatamente como aparece.
> **Design system:** tipografia, texto, acentos das figuras e blips usam tokens do `:root` (`DESIGN.md` §8). O fundo **Blueprint Mesh** (21st.dev) usa tokens **escopados** em `.personagens` (`--personagens-blueprint-*`) — ver §5.2.

---

## 1. Objetivo

Renderizar a segunda seção da página (§7 do `DESIGN.md`, item 2): um **header** curto (eyebrow + título + subtítulo) sobre um **data-grid animado de fundo** (Blueprint Gradient Mesh adaptado de [21st.dev](https://21st.dev)), com as **9 figuras** dos personagens dispostas em **composição freeform** — posicionamento absoluto, escalas e alturas variadas, com efeito de "flutuar no espaço".

Explicitamente **anti-grid**: não é mosaico, não é galeria de cards, não usa `display:grid`/`flex` para alinhar os personagens. Cada figura tem coordenadas próprias.

O fundo é composto por **camadas CSS + três `<canvas>`** preenchidos em runtime por `js/personagens-blueprint.js`: grade quadriculada em movimento diagonal, célula interativa que segue o cursor, film grain e blips amarelos estáticos em CSS.

---

## 2. Inventário (extraído dos prints)

**Header**
- Eyebrow (linha pequena, caixa alta, acento): `OS GUERREIROS Z`
- Título (grande, Fredoka): `Personagens`
- Subtítulo (linha pequena abaixo, caixa alta suave): `OS HERÓIS E VILÕES DA BATALHA EM NAMEKUSEI`

**Fundo (Blueprint Mesh — implementação atual)**
- Base navy profunda (`#0d2b4d`) cobrindo toda a seção.
- Spotlight radial azul suave no topo (CSS).
- Grade quadriculada animada em movimento **diagonal** (canvas).
- Vignette radial nas bordas (canvas) + gradiente inferior (CSS).
- Célula iluminada que acompanha o cursor — fill, borda e glow azulados (canvas).
- Film grain sutil animado (canvas).
- Blips pontuais amarelos (dois pontos, CSS em `.personagens__grid::before/::after`).

**Figuras (9), com legenda visível em cada uma:**

| # | Classe modificadora | Imagem | Legenda (figcaption) |
|---|---------------------|--------|----------------------|
| 1 | `personagem--goku`    | `assets/images/goku-perso.png`    | Goku |
| 2 | `personagem--vegeta`  | `assets/images/vegeta-perso.png`  | Vegeta |
| 3 | `personagem--gohan`   | `assets/images/gohan-perso.png`   | Gohan |
| 4 | `personagem--kuririn` | `assets/images/kuririn-perso.png` | Kuririn |
| 5 | `personagem--ginyu`   | `assets/images/ginyu-perso.png`   | Capitão Ginyu |
| 6 | `personagem--freeza`  | `assets/images/freeza-perso.png`  | Freeza |
| 7 | `personagem--piccolo` | `assets/images/piccolo-perso.png` | Piccolo |
| 8 | `personagem--dodoria` | `assets/images/dodoria-perso.png` | Dodoria |
| 9 | `personagem--zarbon`  | `assets/images/zarbon-perso.png`  | Zarbon |

> Nada além disso aparece nos prints. **Não** há botões, tabs, contadores, badges de status, cards com borda, tooltips textuais nem descrições por personagem. Não adicionar.

---

## 3. HTML (árvore / classes)

Estrutura canônica (implementada em `index.html`):

```
<section id="personagens" class="personagens">
  │
  ├── <div class="personagens__particles-bg" aria-hidden="true">
  │     ├── <div class="personagens__blueprint">
  │     │     ├── <div class="personagens__blueprint-spotlight">
  │     │     ├── <canvas class="personagens__blueprint-grid">
  │     │     ├── <canvas class="personagens__blueprint-hover">
  │     │     ├── <canvas class="personagens__blueprint-noise">
  │     │     └── <div class="personagens__blueprint-vignette">
  │     └── <div id="personagens-grid" class="personagens__grid">   (vazio; blips via CSS)
  │
  ├── <header class="personagens__header">
  │     ├── <p  class="personagens__eyebrow">OS GUERREIROS Z</p>
  │     ├── <h2 class="personagens__title">Personagens</h2>
  │     └── <p  class="personagens__subtitle">OS HERÓIS E VILÕES DA BATALHA EM NAMEKUSEI</p>
  │
  └── <div class="personagens__stage">
        ├── <figure class="personagem personagem--goku"> …
        ├── … (9 figuras, ver §2)
        └── <figure class="personagem personagem--zarbon"> …
```

**Scripts** (ordem no `<body>`, antes de `</body>`):

```
<script src="./js/personagens-blueprint.js"></script>
<script src="./js/script.js"></script>
```

`script.js` chama `initPersonagensBlueprint()` no `DOMContentLoaded`.

Regras de marcação:
- Cada personagem é **um** `<figure class="personagem personagem--NOME">` com exatamente um `<img loading="lazy">` e um `<figcaption>`.
- `alt` da imagem = a legenda do personagem.
- A ordem no DOM segue a tabela da §2 (Goku → Zarbon), independente da posição visual (a posição vem do CSS por modificador).
- Os `<canvas>` ficam **vazios** no HTML — desenhados em runtime pelo JS.
- `#personagens-grid` permanece **vazio** no HTML — os blips amarelos são renderizados via `::before` / `::after` em CSS.

---

## 4. Camadas (empilhamento / z-index)

Do fundo para a frente:

| z-index | Elemento | Conteúdo |
|--------:|----------|----------|
| 0 | `.personagens` | Fundo sólido `--personagens-blueprint-bg` |
| 0 | `.personagens__particles-bg` | Container absoluto; `pointer-events: none` |
| 0 | `.personagens__blueprint-spotlight` | Radial gradient CSS (spotlight superior) |
| 1 | `.personagens__blueprint-grid` | Canvas — grade + vignette radial |
| 2 | `.personagens__blueprint-hover` | Canvas — célula do cursor (`pointer-events: none`) |
| 3 | `.personagens__blueprint-noise` | Canvas — film grain |
| 4 | `.personagens__blueprint-vignette` | Gradiente inferior CSS |
| 5 | `.personagens__grid` | Blips amarelos (`--cosmic-rose`) via pseudo-elementos |
| 2 | `.personagens__stage` | Palco freeform; `pointer-events: none` |
| — | `.personagem` | Cada figura: `pointer-events: auto` (foco/acessibilidade) |
| 3 | `.personagens__header` | Eyebrow + título + subtítulo |

**Pointer events**
- Rastreio do cursor: `mousemove` / `mouseleave` em `#personagens` (JS), não nos canvas — permite hover no fundo mesmo com figuras por cima.
- `.personagens__stage` com `pointer-events: none`; `.personagem` com `pointer-events: auto`.
- O glow do cursor é puramente decorativo e passa por baixo das figuras.

---

## 5. Tokens

### 5.1 Globais (`:root` — `DESIGN.md` §8)

**Tipografia**
- `.personagens__eyebrow` → `--font-body` (Outfit), caixa alta, `letter-spacing: --ls-label (0.12em)`, cor `--accent-star` (Laranja Goku).
- `.personagens__title` → `--font-display` (**Fredoka**), peso 600–700, cor `--text-primary`. (Título de seção ⇒ Fredoka. Anton é **exclusivo da Hero**.)
- `.personagens__subtitle` → `--font-body` (Outfit), caixa alta suave, cor `--text-faint`, `letter-spacing: --ls-label`.
- `.personagem__nome` (figcaption) → `--font-body` (Outfit), peso 600, cor `--text-primary`, caixa alta com `--ls-label`.

**Figuras**
- Halos/drop-shadow: `--accent-star-glow` em `.personagem__img`.
- Foco: `--ring-focus` em `.personagem:focus-visible`.

**Blips**
- `.personagens__grid::before/::after` → `--cosmic-rose` (Amarelo Energia) + glow derivado.

**Motion**
- Flutuação/reveals via `--ease-out-expo`; animar apenas `transform` e `opacity`; `will-change` nos elementos flutuantes.

### 5.2 Escopados — Blueprint Mesh (`.personagens`)

Tokens exclusivos da seção, derivados do componente **Blueprint Gradient Mesh** (21st.dev). Definidos em `css/styles.css`:

| Token | Valor canônico | Uso |
|-------|----------------|-----|
| `--personagens-blueprint-bg` | `#0d2b4d` | Fundo base navy |
| `--personagens-blueprint-spotlight` | `rgba(122, 162, 255, 0.18)` | Spotlight radial CSS |
| `--personagens-blueprint-line` | `rgba(179, 205, 255, 0.28)` | Linhas da grade (canvas) |
| `--personagens-blueprint-hover-fill` | `rgba(33, 82, 131, 0.18)` | Preenchimento da célula hover |
| `--personagens-blueprint-hover-stroke` | `rgba(172, 193, 255, 0.70)` | Borda da célula hover |
| `--personagens-blueprint-hover-glow` | `rgba(122, 162, 255, 0.30)` | Glow da célula hover |
| `--personagens-blueprint-vignette` | `rgba(13, 43, 77, 0.92)` | Vignette inferior CSS |

> **Nota:** cores do canvas estão duplicadas no objeto `config` de `js/personagens-blueprint.js` (valores espelhados da tabela acima). Ao alterar a paleta, atualizar **CSS e JS** juntos.

**Posições dos blips** (CSS, `.personagens__grid`):
- `::before` → `top: 34%`, `left: 22%`
- `::after` → `top: 62%`, `right: 28%`

---

## 6. Blueprint Mesh — JS (`js/personagens-blueprint.js`)

Adaptação vanilla do componente React `blueprint-gradient-mesh.tsx` (21st.dev). **Não** requer React, Tailwind ou shadcn.

**Entry point:** `initPersonagensBlueprint()` — chamado em `script.js` no `DOMContentLoaded`.

**Configuração runtime** (`config`):

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `showGrid` | `true` | Exibe grade quadriculada |
| `direction` | `"diagonal"` | Direção do scroll da grade (`right` \| `left` \| `up` \| `down` \| `diagonal`) |
| `speed` | `0.2` | Velocidade do offset (px/frame) |
| `squareSize` | `44` | Tamanho da célula em px |
| `borderColor` | ver §5.2 | Cor das linhas |
| `vignette` | `true` | Vignette radial desenhada no canvas da grade |
| `hoverFillColor` | ver §5.2 | Fill da célula sob o cursor |
| `hoverStrokeColor` | ver §5.2 | Borda da célula |
| `hoverGlowColor` | ver §5.2 | Shadow blur da célula |
| `noiseRefresh` | `2` | Regenera grain a cada N frames |
| `noiseAlpha` | `12` | Opacidade do grain (0–255) |

**Loops canvas** (via `requestAnimationFrame`):
1. `drawGrid` — linhas verticais/horizontais sincronizadas com `gridOffset`.
2. `drawHover` — destaca a célula sob o cursor (sincronizada com o mesmo offset).
3. `tickOffset` — avança `gridOffset` na direção configurada.
4. `noiseLoop` — film grain aleatório em canvas 1024×1024 esticado à seção.

**HiDPI:** `setHiDPICanvas` limita DPR a `min(2, devicePixelRatio)`.

**Eventos:**
- `mousemove` em `#personagens` → calcula célula (`gx`, `gy`) a partir do offset da grade.
- `mouseleave` em `#personagens` → limpa hover.
- `resize` em `window` → redimensiona canvases de grade/hover e noise.

**Escopo:** fundo contido em `.personagens__blueprint` (`absolute inset-0`), **não** `fixed` na viewport inteira (diferença em relação ao demo React original).

---

## 7. Layout da seção

### 7.1 Trilho (altura)

- `.personagens` → `min-height: clamp(140vh, 165vh, 190vh)` — espaço vertical para composição freeform.
- `.personagens__stage` → `min-height: clamp(95vh, 115vh, 135vh)` — referência para `position: absolute` das figuras.

### 7.2 Composição freeform (desktop ≥ 768px)

Cada `.personagem--NOME` tem coordenadas, escala (`--personagem-h`), z-index e delays de animação próprios em `css/styles.css`. Invariantes:

- **≥ 3 escalas distintas** entre as 9 figuras.
- **Quadrantes diferentes** — figuras espalhadas, não alinhadas em linha.
- **Variação vertical** — tops/bottoms distintos; sensação de flutuação (`personagem-float` + `personagem-reveal` em cascata).

---

## 8. Responsividade

- **Desktop (≥ 768px):** composição freeform com posicionamento absoluto por modificador; blueprint ativo.
- **Mobile (< 768px):** colapso para **coluna única** — `.personagem` vira `position: relative`, empilhado, sem overflow horizontal; header no topo; blueprint de fundo continua.
- **Reduced motion** (`prefers-reduced-motion: reduce`):
  - Figuras: apenas `personagem-reveal-static` (sem flutuação).
  - Blueprint: offset da grade e refresh do noise **pausados**; grade e grain permanecem estáticos na primeira frame.

---

## 9. Arquivos

| Arquivo | Papel |
|---------|-------|
| `index.html` | Markup da seção + scripts |
| `css/styles.css` | Tokens blueprint, camadas, header, stage, composição freeform |
| `js/personagens-blueprint.js` | Canvas: grade, hover, noise, offset animado |
| `js/script.js` | Bootstrap: `initPersonagensBlueprint()` |

---

## 10. Checklist de implementação

- [x] `<section id="personagens" class="personagens">` presente e na ordem 2 do `index.html`.
- [x] Fundo blueprint: `.personagens__particles-bg` > `.personagens__blueprint` (spotlight + 3 canvas + vignette) + `#personagens-grid` (blips CSS).
- [x] `js/personagens-blueprint.js` carregado antes de `script.js`.
- [x] Header com **copy exata**: eyebrow `OS GUERREIROS Z`, título `Personagens`, subtítulo `OS HERÓIS E VILÕES DA BATALHA EM NAMEKUSEI`.
- [x] Título em **Fredoka** (`--font-display`), não Anton.
- [x] 9 `<figure class="personagem personagem--NOME">`, cada uma com `<img loading="lazy">` + `<figcaption>`.
- [x] Caminhos de imagem: `assets/images/{goku,vegeta,gohan,kuririn,ginyu,freeza,piccolo,dodoria,zarbon}-perso.png`.
- [x] Legendas exatas, incluindo `Capitão Ginyu`.
- [x] `alt` = legenda em cada `<img>`.
- [x] Tokens globais do `:root` para tipografia, figuras e blips.
- [x] Tokens `--personagens-blueprint-*` escopados para o fundo mesh.
- [x] Sem botões/tabs/badges/descrições extras.
- [x] `min-height` da seção alta o bastante para a composição (§7.1).
- [x] Mobile: coluna única, sem overflow horizontal.
- [x] `prefers-reduced-motion`: animações de figuras e blueprint neutralizadas.

---

## 11. Aceitação — bloco anti-regressão

**Anti-grid (obrigatório):**
- [x] **Não é grid:** `.personagens__stage` **não** usa `display:grid` nem `display:flex` para alinhar personagens.
- [x] **Espalhados em quadrantes diferentes:** 9 figuras em posições distintas.
- [x] **≥ 3 escalas distintas** via `--personagem-h` por modificador.
- [x] **Variação vertical clara** — tops/bottoms diferentes.

**Fundo blueprint:**
- [x] Grade animada diagonal visível em toda a seção.
- [x] Célula iluminada segue o cursor (sync com offset da grade).
- [x] Film grain sutil presente.
- [x] Blips amarelos (`--cosmic-rose`) nos dois pontos definidos em §5.2.

**Fidelidade ao print:**
- [x] Copy do header idêntica.
- [x] Exatamente 9 personagens com legendas e imagens da §2.
- [x] Nenhum elemento inventado (botão/ícone/texto extra).

---

## 12. Histórico de decisões

| Data | Decisão |
|------|---------|
| — | Fundo original previsto: radar CSS (grade estática + sweep cônico). |
| 2026-07 | Substituído por **Blueprint Gradient Mesh** (21st.dev), portado para vanilla JS com canvas. |
| 2026-07 | Tentativa de paleta verde radar (`#576E49`) — **revertida**; paleta navy azulada mantida (§5.2). |
