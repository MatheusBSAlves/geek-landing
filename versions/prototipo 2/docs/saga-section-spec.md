# Saga Section Spec — `#saga` (A Saga do Freeza)

> Fonte de verdade: **prints + textos deste documento**. Copy exata, sem inventar elementos.
> Herda 100% do `DESIGN.md`. **Não introduz cores novas** — apenas tokens do `:root` (base + `css/jornada.css`).
> Seção referida no `DESIGN.md §7.3` como `#saga`, `class="jornada"` — linha do tempo **horizontal** com pin + scrub (GSAP + ScrollTrigger).

---

## 1) Objetivo

Construir a seção **A Saga** como uma **linha do tempo horizontal de 6 capítulos** que:

- Abre com um **painel de título em tela cheia** (100vw × 100vh): eyebrow, título pôster em duas linhas (branco + dourado), tagline e rótulo de scroll. Esse é o **Capítulo 01**, que também carrega o card do primeiro capítulo à direita (print 1).
- Ao rolar, a viewport **trava (pin)** e o conteúdo **desliza na horizontal** com `scrub`, revelando os cards dos capítulos 02→06 (prints 2 e 3).
- Exibe um **HUD fixo** no topo: **trilho (rail)** laranja com **dots (Esferas do Dragão)** por capítulo, **barra de progresso (fill)** e **counter `NN/06`**.
- Mostra **numerais gigantes de fundo** (`01…06`) com **parallax** relativo ao deslocamento horizontal.
- Revela **cada card** (fade/slide) conforme entra no viewport durante o scrub.
- Cada capítulo aplica sua **cor de acento própria** via `--ch-accent` (mapeada sobre os acentos do `§2`, sem cor nova).

**Comportamento-chave:** primeiro card ocupa **toda a largura e altura da tela**; ao rolar, os cards com imagens vão aparecendo lateralmente.

**Restrição estrutural:** o HTML/CSS **já deve prever** o scroll lateral GSAP — trilho horizontal (`display:flex` em faixa larga) dentro de um wrapper que será **pinado**; `transform: translate3d(var(--x)…)` acionado por JS. **Mobile = coluna vertical** (sem pin, sem scrub).

---

## 2) Inventário (source-of-truth)

### 2.1 HUD / cronologia (persistente durante o pin)
- **Rail** horizontal laranja (linha fina) atravessando o topo.
- **Dots** = Esferas do Dragão brilhantes (1 por capítulo) ancorados no rail; dot ativo com glow.
- **Counter** topo-direito: `01/06` … `06/06` — número corrente em laranja, `/06` esmaecido.
- **Fill** — barra/segmento de progresso do rail que avança com o scrub (do `01` ao `06`).

### 2.2 Numerais de fundo (parallax)
- `01`, `02`, `03`, `04`, `05`, `06` — grandes, esmaecidos, atrás dos cards; deslocam com parallax.

### 2.3 Decoração hero (somente painel de título)
- **Kanji** decorativo (traço/contorno sutil) ao fundo do painel de título.

### 2.4 Painel de título (Capítulo 01 — tela cheia)
| Elemento | Copy exata | Cor / token |
|---|---|---|
| Eyebrow | `A JORNADA EM NAMEKUSEI` | `--accent-star` |
| Título linha 1 | `A Saga do` | `--text-primary` |
| Título linha 2 | `Freeza` | `--cosmic-rose` |
| Tagline | `A BATALHA QUE FORJOU UMA LENDA` | `--text-muted` (caixa alta, `--ls-label`) |
| Scroll label + seta | `ROLE PARA ATRAVESSAR` `→` | label `--text-muted`; seta `--accent-star` |

### 2.5 Cards de capítulo — 6 (copy exata)

**Capítulo 01 — `--ch-accent: --cosmic-cyan`**
- Kicker: `CAPÍTULO 01`
- Título: `Chegada em Namekusei`
- Descrição: `Gohan, Kuririn e Bulma viajam até o distante planeta Namekusei em busca das Esferas do Dragão para reviver seus amigos — mas Freeza e seus soldados já estão lá com o mesmo objetivo.`
- Mídia: planeta Namekusei (verde) em campo estelar.

**Capítulo 02 — `--ch-accent: --cosmic-purple`**
- Kicker: `CAPÍTULO 02`
- Título: `O Esquadrão Ginyu ataca`
- Descrição: `Freeza convoca a temida força de elite. O Capitão Ginyu troca de corpo com Goku, e só a astúcia dos Guerreiros Z impede o desastre antes da chegada do verdadeiro perigo.`
- Mídia: Esquadrão Ginyu (cinco membros em pose).

**Capítulo 03 — `--ch-accent: --accent-star`**
- Kicker: `CAPÍTULO 03`
- Título: `A morte de Kuririn`
- Descrição: `No auge da batalha, Freeza assassina Kuririn diante de Goku. A perda do amigo de toda uma vida acende uma fúria capaz de despertar uma lenda adormecida.`
- Mídia: split Freeza / Kuririn gritando.

**Capítulo 04 — `--ch-accent: --cosmic-rose`**
- Kicker: `CAPÍTULO 04`
- Título: `O Despertar do Super Saiyajin`
- Descrição: `Cabelos dourados, aura flamejante: pela primeira vez em mil anos, um Saiyajin alcança a transformação lendária. Goku enfim encara Freeza de igual para igual.`
- Mídia: Goku Super Saiyajin (aura dourada).

**Capítulo 05 — `--ch-accent: --cosmic-cyan`**
- Kicker: `CAPÍTULO 05`
- Título: `A Batalha Final`
- Descrição: `Goku Super Saiyajin contra Freeza em 100% de seu poder. Um confronto colossal que define o destino do universo enquanto Namekusei se desfaz a cada golpe.`
- Mídia: Goku SSJ vs Freeza (choque de energia azul contra roxa).

**Capítulo 06 — `--ch-accent: --accent-star`**
- Kicker: `CAPÍTULO 06`
- Título: `A destruição de Namekusei`
- Descrição: `Com o planeta à beira da explosão, Goku enfrenta seus últimos instantes contra o tirano e prova que a esperança — e a coragem — sempre encontram um caminho.`
- Mídia: Namekusei se despedaçando em explosão.

> Kicker (`CAPÍTULO NN`) usa a `--ch-accent` do capítulo. Título em **Fredoka** (`--font-display`). Descrição em **Outfit** (`--font-body`), `--text-muted`.

---

## 3) HTML (estrutura semântica — não código final)

Árvore prevista para pin + trilho horizontal (a numeração de classes segue o namespace `jornada` do `DESIGN.md`):

```
<section id="saga" class="jornada" aria-label="A Saga do Freeza">

  ├─ .jornada__pin                      ← wrapper PINADO pelo ScrollTrigger (100vh, overflow oculto)
  │
  │   ├─ .jornada__hud                   ← HUD fixo dentro do pin (rail + counter + fill)
  │   │   ├─ .jornada__rail              ← linha horizontal (--jornada-rail-weight)
  │   │   │   ├─ .jornada__fill          ← progresso (scaleX via --progress)
  │   │   │   └─ .jornada__dot × 6       ← Esferas; [data-active] no ativo
  │   │   └─ .jornada__counter           ← "<span.cur>01</span>/06"
  │   │
  │   ├─ .jornada__numerals              ← camada parallax dos numerais de fundo
  │   │   └─ .jornada__numeral × 6       ← 01..06 (aria-hidden)
  │   │
  │   └─ .jornada__track                 ← TRILHO horizontal (flex, translateX var(--x))
  │       │
  │       ├─ .jornada__panel--hero       ← Capítulo 01: painel título tela cheia
  │       │   ├─ .jornada__kanji         ← decoração (aria-hidden)
  │       │   ├─ .jornada__eyebrow       "A JORNADA EM NAMEKUSEI"
  │       │   ├─ h2.jornada__title       (Anton reuso hero-stamp OU Fredoka — ver §4.4)
  │       │   │   ├─ .line--main         "A Saga do"
  │       │   │   └─ .line--saga         "Freeza"
  │       │   ├─ .jornada__tagline       "A BATALHA QUE FORJOU UMA LENDA"
  │       │   ├─ .jornada__scroll        "ROLE PARA ATRAVESSAR" + seta
  │       │   └─ article.jornada__card   ← card Cap.01 (dentro do painel hero, à direita)
  │       │
  │       └─ article.jornada__card × 5   ← Cap.02..06 (style="--ch-accent:var(--cosmic-...)")
  │           ├─ .jornada__card-media     <img> mídia do capítulo
  │           ├─ .jornada__card-kicker    "CAPÍTULO NN"
  │           ├─ h3.jornada__card-title   título
  │           └─ p.jornada__card-desc     descrição
```

Notas:
- **O painel hero e os cards vivem no mesmo `.jornada__track`** — o track é o único elemento transladado no eixo X.
- `.jornada__hud` e `.jornada__numerals` ficam **fora do track** (não transladam junto); numerais recebem parallax próprio via `--px`.
- Cada `.jornada__card` recebe `style="--ch-accent: var(--cosmic-…)"` inline conforme mapa do `§5`.
- `.jornada__card` inicia com estado "não revelado" (classe/atributo `[data-reveal]`), promovido por JS quando entra no viewport.

---

## 4) CSS por bloco

> **Regra transversal:** só tokens do `:root` (base do `DESIGN.md §8` + `css/jornada.css §5.3`). Animar apenas `transform`/`opacity`; `will-change` nos elementos animados. Nada de cor literal.

### 4.1 Seção / Pin
- `#saga.jornada`: `position: relative`; fundo `--bg-mid`; sem `overflow-x` que quebre o pin.
- `.jornada__pin`: `height: 100vh`; `overflow: hidden`; `position: relative`. É o alvo do `ScrollTrigger.pin`. O comprimento do scroll (quantos px de rolagem vertical viram X) é definido no contrato JS (`§6`), **não** no CSS.
- **Desktop:** track horizontal. **Mobile (`< --jornada-bp`):** ver `§4.8` (coluna vertical, pin desativado).

### 4.2 Track (trilho horizontal)
- `.jornada__track`: `display: flex`; `align-items: center`; `gap: var(--jornada-gap)`; `height: 100%`; `will-change: transform`; `transform: translate3d(var(--x, 0), 0, 0)`.
- Largura total = soma dos painéis/cards + gaps (intrínseca ao flex). JS lê `scrollWidth` para calcular o deslocamento máximo.
- `--x` é setado em runtime por `js/jornada.js` (negativo, avança para a esquerda).

### 4.3 Painel Hero (Capítulo 01 — tela cheia)
- `.jornada__panel--hero`: `flex: 0 0 100vw`; `min-height: 100vh`; `display: grid` (conteúdo à esquerda + card à direita, como no print 1); respiro lateral via `--space-gutter-x`.
- Colapsa para coluna única abaixo de `--jornada-bp`.

### 4.4 Tipografia do painel hero
- `.jornada__eyebrow`: `--font-hero-saga` (Oswald), caixa alta, `--ls-label`, cor `--accent-star`, `--fs-2xs`.
- `.jornada__title`: título pôster em duas linhas. **Segue o padrão hero-stamp do `DESIGN.md`** — Anton (`--font-hero-stamp`) para consistência com a Hero do site; `.line--main` cor `--text-primary`, `.line--saga` cor `--cosmic-rose`. (Se o time preferir manter a Saga em Fredoka como demais títulos de seção, trocar para `--font-display` — decisão registrada aqui; o default do spec é **hero-stamp**, espelhando o print.)
- `.jornada__tagline`: `--font-hero-saga` (Oswald), caixa alta, `--ls-label`, `--text-muted`.
- `.jornada__scroll`: `--font-hero-saga`, caixa alta, `--text-muted`; seta em `--accent-star` com micro-bob (respeita reduced-motion).

### 4.5 Card
- `.jornada__card`: `flex: 0 0 var(--jornada-panel-width)`; fundo `--bg-surface` translúcido + `backdrop-filter`; `border: 1px solid var(--border-subtle)`; `border-radius: var(--jornada-card-radius)`; topo do card com filete na `--ch-accent` (como no print). Estado inicial de reveal: `opacity: 0; transform: translateY(var(--jornada-reveal-y))`.
- `.jornada__card[data-reveal="in"]`: `opacity: 1; transform: none` (transição via `--ease-out-expo`).
- `.jornada__card-media`: `aspect-ratio: var(--jornada-media-ratio)`; `border-radius: var(--jornada-media-radius)`; `object-fit: cover`; `overflow: hidden`.
- `.jornada__card-kicker`: `--font-display` (ou body caixa-alta), `--ls-label`, cor `var(--ch-accent)`, `--fs-2xs`.
- `.jornada__card-title`: `--font-display` (Fredoka) 600–700, `--text-primary`, `--jornada-fs-heading`.
- `.jornada__card-desc`: `--font-body`, `--text-muted`, `--jornada-fs-desc`, `max-width: var(--jornada-desc-maxw)`.

### 4.6 HUD (rail + fill + counter + dots)
- `.jornada__hud`: `position: absolute`; topo do pin; `max-width: var(--jornada-hud-maxw)`; **não** transladado com o track.
- `.jornada__rail`: linha horizontal, `height: var(--jornada-rail-weight)`, cor derivada de `--accent-star` (usar `--accent-star` / `--accent-star-dim`).
- `.jornada__fill`: sobrepõe o rail; `transform-origin: left`; `transform: scaleX(var(--progress, 0))`; cor `--accent-star`.
- `.jornada__dot`: Esfera do Dragão; base `--accent-star`; ativo (`[data-active]`) ganha halo `--accent-star-glow` (drop-shadow). Sem imagem nova obrigatória — glow via token.
- `.jornada__counter`: `--font-display`; `.cur` em `--accent-star`, `/06` em `--text-faint`; `--jornada-fs-counter`.

### 4.7 Numerais de fundo (parallax)
- `.jornada__numerals`: camada absoluta atrás do track, `pointer-events: none`, `aria-hidden`.
- `.jornada__numeral`: `--font-hero-stamp` (Anton) ou `--font-display`; `font-size: var(--jornada-numeral-size)`; `opacity: var(--jornada-numeral-opacity)`; `color: --text-primary` a baixa opacidade; `transform: translate3d(var(--px,0),0,0)` (parallax mais lento que o track).

### 4.8 Mobile (`< --jornada-bp`, coluna vertical)
- `.jornada__pin`: `height: auto`; `overflow: visible` (pin desativado — ver `§6` e `§7`).
- `.jornada__track`: `display: flex; flex-direction: column`; `transform: none`; `gap` vertical.
- `.jornada__panel--hero`: `flex: 0 0 auto`; `min-height: auto` (ou `100svh` no primeiro dobra se desejado); card empilhado abaixo do texto.
- `.jornada__card`: `flex: 0 0 auto`; largura fluida (`width: 100%`), sem reveal-x.
- **HUD** vira timeline vertical simples (`--jornada-timeline-mobile`) OU é ocultado; numerais reduzidos (`--jornada-numeral-size-mobile`) e sem parallax.
- **Sem overflow horizontal** em nenhuma largura (`DESIGN.md §5`).

---

## 5) Tokens (somente existentes)

### 5.1 Base (`DESIGN.md §8`) usados aqui
Fundo: `--bg-mid`, `--bg-surface`, `--bg-overlay`.
Texto: `--text-primary`, `--text-muted`, `--text-faint`.
Acentos: `--accent-star`, `--accent-star-dim`, `--accent-star-glow`, `--cosmic-cyan`, `--cosmic-purple`, `--cosmic-rose`.
Bordas/foco: `--border-subtle`, `--border-strong`, `--ring-focus`.
Tipografia: `--font-body`, `--font-display`, `--font-hero-stamp`, `--font-hero-saga`.
Labels/escala: `--ls-label`, `--fs-2xs`, `--space-gutter-x`, `--space-section-y`.
Motion: `--ease-out-expo`, `--ease-spring`, `--stagger-*`.

### 5.2 Geometria/estado da Jornada (`css/jornada.css`, já previstos no `DESIGN.md §8`)
`--jornada-bp`, `--jornada-gap`, `--jornada-panel-width`, `--jornada-card-radius`,
`--jornada-media-ratio`, `--jornada-media-radius`, `--jornada-desc-maxw`,
`--jornada-rail-weight`, `--jornada-dot-size`, `--jornada-hud-maxw`,
`--jornada-numeral-opacity`, `--jornada-numeral-size`, `--jornada-numeral-size-mobile`,
`--jornada-kanji-opacity`,
`--jornada-parallax-strength`, `--jornada-scrub-lerp`, `--jornada-reveal-y`, `--jornada-timeline-mobile`,
`--jornada-fs-heading`, `--jornada-fs-desc`, `--jornada-fs-counter`.

### 5.3 Runtime (setados por `js/jornada.js`)
`--x` (translateX do track), `--px` (offset parallax dos numerais), `--progress` (0→1 do HUD/fill).

### 5.4 Mapa `--ch-accent` por capítulo (inline, `DESIGN.md §8`)
| Capítulo | `--ch-accent` |
|---|---|
| 01 | `var(--cosmic-cyan)` |
| 02 | `var(--cosmic-purple)` |
| 03 | `var(--accent-star)` |
| 04 | `var(--cosmic-rose)` |
| 05 | `var(--cosmic-cyan)` |
| 06 | `var(--accent-star)` |

> Nenhuma cor nova. Nenhum valor literal fora dos tokens.

---

## 6) Contrato JS (`js/jornada.js`) — GSAP + ScrollTrigger

> Sem código; apenas o contrato de comportamento. Animar `transform`/`opacity`; usar `--ease-out-expo` como easing primário; `--jornada-scrub-lerp` como valor de `scrub`.

### 6.1 Pin + trilho X com scrub (desktop, `>= --jornada-bp`)
- Criar um `ScrollTrigger` com `trigger: #saga`, `pin: .jornada__pin`, `scrub: <--jornada-scrub-lerp>`, `start: "top top"`.
- `end` = distância de scroll vertical proporcional ao deslocamento horizontal total: `end: "+=" + (track.scrollWidth - window.innerWidth)`.
- Mapear progresso `0→1` do trigger para `--x` de `0` até `-(track.scrollWidth - innerWidth)` (px). Escrever em `--x` (não animar `left`).
- `invalidateOnRefresh: true`; recalcular `scrollWidth`/`innerWidth` em `resize`/`refresh`.

### 6.2 HUD — fill + counter
- **Fill:** ligar `--progress` (0→1) ao progresso do trigger; `.jornada__fill` reflete via `scaleX(var(--progress))`.
- **Counter:** derivar índice ativo `= clamp(floor(progress * 6) + 1, 1, 6)`; atualizar `.jornada__counter .cur` para `01..06` (2 dígitos) e `[data-active]` no dot correspondente. Atualização via callback do scrub (throttled), não por observador separado.

### 6.3 Parallax dos numerais
- `--px = progress * -(scrollWidth - innerWidth) * <--jornada-parallax-strength>` (fator < 1 → numerais deslocam mais devagar que o track).
- Aplicado à camada `.jornada__numerals` (fora do track).

### 6.4 Revelação por capítulo
- Cada `.jornada__card` revela ao entrar no viewport horizontal durante o scrub.
- Preferência: `ScrollTrigger` aninhado por card (containerAnimation = a tween horizontal do track) que seta `[data-reveal="in"]` on-enter; ou cálculo por limiar de progresso por card. Reveal = `opacity 0→1` + `translateY(var(--jornada-reveal-y))→0`, easing `--ease-out-expo`, com `--stagger-*` entre mídia/kicker/título/desc.
- Reveal é **idempotente** (não re-dispara ao voltar; ou re-disparável suavemente conforme decisão de UX — default: uma vez).

### 6.5 Reduced motion / mobile
- `prefers-reduced-motion: reduce` **ou** viewport `< --jornada-bp`: **não** criar pin/scrub. Cards em coluna vertical, todos revelados (`[data-reveal="in"]` estático), sem parallax, sem bob. `ScrollTrigger` da horizontal não é instanciado (`matchMedia`).

### 6.6 Ciclo de vida
- Instanciar via `gsap.matchMedia()` para alternar desktop↔mobile sem recarregar.
- `ScrollTrigger.refresh()` após carregamento de imagens/fontes para medir `scrollWidth` correto.
- `kill()` das instâncias ao trocar de breakpoint.

---

## 7) Responsividade & Acessibilidade

**Responsividade**
- Desktop (`>= --jornada-bp`): faixa horizontal pinada; painel hero 100vw; cards em fila.
- Mobile (`< --jornada-bp`): coluna vertical, sem pin, sem overflow horizontal (`DESIGN.md §5`); numerais reduzidos, HUD simplificado/oculto.
- Tamanhos fluidos via `clamp` nos tokens `--jornada-fs-*`, `--fs-*`.

**Acessibilidade**
- `#saga` com `aria-label="A Saga do Freeza"`.
- Ordem do DOM = ordem narrativa (hero → cap.01 → … → cap.06), então **leitura por teclado/leitor segue a narrativa** mesmo com pin/scrub visual.
- Numerais de fundo e kanji: `aria-hidden="true"`.
- Cada `<img>` de mídia com `alt` descritivo do capítulo.
- Contraste: título/kicker/desc sobre `--bg-surface` atendem AA (tokens de texto já calibrados no DESIGN).
- `:focus-visible` usa `--ring-focus`; elementos interativos (se houver, ex.: dots como âncoras) navegáveis por teclado.
- `prefers-reduced-motion: reduce` → layout estático (`§6.5`); nada de conteúdo dependente exclusivamente de animação.
- Não prender o scroll: o pin libera ao fim do `end`; conteúdo permanece acessível sem JS (fallback = coluna vertical / cards visíveis).

---

## 8) Checklist de implementação

- [ ] `#saga.jornada` com `.jornada__pin` como alvo único de pin.
- [ ] `.jornada__track` em `flex`, transladado só por `--x` (translate3d).
- [ ] Painel hero `flex: 0 0 100vw`, `min-height:100vh`, com card Cap.01 embutido (print 1).
- [ ] 6 cards com **copy exata** do `§2.5` e `style="--ch-accent:…"` do `§5.4`.
- [ ] Título pôster: `.line--main` `--text-primary`, `.line--saga` `--cosmic-rose`.
- [ ] HUD: rail + fill (`scaleX(var(--progress))`) + dots (ativo com `--accent-star-glow`) + counter `NN/06`.
- [ ] Numerais `01..06` com parallax via `--px`, `aria-hidden`.
- [ ] Kanji decorativo no painel hero, `aria-hidden`, `--jornada-kanji-opacity`.
- [ ] Reveal por card (`[data-reveal]`), easing `--ease-out-expo`, stagger via `--stagger-*`.
- [ ] Só tokens do `:root` (base + jornada); **zero** cor/valor literal.
- [ ] `gsap.matchMedia`: desktop (pin/scrub) ↔ mobile (coluna vertical), sem overflow-x.
- [ ] `ScrollTrigger.refresh()` pós fonts/imagens; `invalidateOnRefresh`.
- [ ] `prefers-reduced-motion` → estático, todos os cards revelados.
- [ ] `alt` em todas as mídias; `aria-label` na seção; foco com `--ring-focus`.

---

## 9) Critérios de aceitação

1. **Abertura em tela cheia:** ao chegar em `#saga`, o painel de título ocupa 100vw × 100vh com eyebrow, título (branco + dourado), tagline e "ROLE PARA ATRAVESSAR →" — idêntico ao print 1, incluindo o card do Capítulo 01 à direita.
2. **Pin + horizontal:** ao rolar, a viewport trava e o conteúdo desliza lateralmente com scrub suave; cards 02→06 entram em cena na ordem (prints 2 e 3). Em nenhum momento há overflow horizontal indesejado da página.
3. **HUD sincronizado:** rail com dots (Esferas), fill avança de 0→100% e counter passa por `01/06 … 06/06` de forma consistente com a posição do track; dot ativo destacado com glow.
4. **Numerais com parallax:** `01…06` de fundo deslocam mais devagar que os cards, sem cobrir o texto (opacidade baixa via token).
5. **Reveal por capítulo:** cada card aparece (fade + slide-up) ao entrar, com stagger entre mídia/kicker/título/descrição.
6. **Copy exata:** todos os textos batem 1:1 com o `§2` (kickers, títulos, descrições, eyebrow, tagline, scroll label).
7. **Cores por capítulo:** kicker e filete de cada card usam a `--ch-accent` correta do `§5.4`; nenhuma cor fora do `:root`.
8. **Responsivo:** abaixo de `--jornada-bp`, a seção vira coluna vertical simples, todos os cards visíveis, sem pin e sem scroll lateral.
9. **Acessível:** navegação por teclado segue a ordem narrativa; `prefers-reduced-motion` entrega layout estático; imagens com `alt`; foco visível com `--ring-focus`.
10. **Fidelidade ao DESIGN.md:** tipografia, tokens, easings e nomenclatura `jornada__*` conforme `§3`/`§8` do `DESIGN.md`; apenas `transform`/`opacity` animados.