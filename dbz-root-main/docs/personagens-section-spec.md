# Personagens — Section Spec

> **Source of truth:** os prints da seção `Personagens`.
> **Regras de estilo:** `DESIGN.md` (somente tokens do `:root`; nenhuma cor/fonte nova).
> **Restrição dura:** não inventar botões, textos, ícones ou estados que não aparecem no print. Copy exata.
> Este documento **não** gera código de implementação — descreve o contrato de markup, camadas e tokens.

---

## 1. Objetivo

Reproduzir fielmente a seção **Personagens** como aparece no print: um **header centralizado** (eyebrow + título + subtítulo) e **9 figuras de personagens "flutuando no espaço"** sobre um **data-grid/radar de fundo** animado por JS.

A composição das figuras é **freeform (anti-grid)**: cada personagem tem coordenadas próprias, escalas e alturas variadas, posicionamento **absoluto** e parallax no scroll — conforme `DESIGN.md §4 (Personagens)` e `§5 (Layout)`. Não é grid, não é mosaico, não são cards.

O que **existe** no print e deve ser reproduzido: header (3 linhas de texto), 9 figuras com legenda, grade de fundo, blips amarelos e um glow difuso.
O que **não existe** e não deve ser criado: botões, links, filtros, tabs, ícones, cards com moldura, contadores.

---

## 2. Inventário (o que o print contém)

**Header (copy exata, uppercase conforme fornecido):**

| Papel | Texto |
|-------|-------|
| eyebrow | `OS GUERREIROS Z` |
| título (h2) | `Personagens` |
| subtítulo | `OS HERÓIS E VILÕES DA BATALHA EM NAMEKUSEI` |

**9 figuras (imagem + legenda):**

| # (DOM) | Classe modificadora | Asset | `<figcaption>` / `alt` |
|--------|---------------------|-------|------------------------|
| 1 | `personagem--goku` | `assets/images/goku-perso.png` | `Goku` |
| 2 | `personagem--vegeta` | `assets/images/vegeta-perso.png` | `Vegeta` |
| 3 | `personagem--gohan` | `assets/images/gohan-perso.png` | `Gohan` |
| 4 | `personagem--kuririn` | `assets/images/kuririn-perso.png` | `Kuririn` |
| 5 | `personagem--ginyu` | `assets/images/ginyu-perso.png` | `Capitão Ginyu` |
| 6 | `personagem--freeza` | `assets/images/freeza-perso.png` | `Freeza` |
| 7 | `personagem--piccolo` | `assets/images/piccolo-perso.png` | `Piccolo` |
| 8 | `personagem--dodoria` | `assets/images/dodoria-perso.png` | `Dodoria` |
| 9 | `personagem--zarbon` | `assets/images/zarbon-perso.png` | `Zarbon` |

**Ordem no DOM** = a ordem acima (= `DESIGN.md §7`), independente da posição visual. Todo `<img>` usa `loading="lazy"`.

**Fundo:** grade quadriculada (radar) + blips amarelos + glow difuso (preenchidos por JS; container vazio no HTML).

---

## 3. HTML (árvore / classes)

Contrato de markup — nomes de classe e hierarquia obrigatórios. Sem estilos inline; apenas estrutura.

```
section#personagens.personagens
├── div.personagens__particles-bg            ← camada de fundo (radar)
│   └── div#personagens-grid.personagens__grid   ← container VAZIO (JS preenche grade + blips)
│
├── header.personagens__header               ← header centralizado
│   ├── p.personagens__eyebrow    → "OS GUERREIROS Z"
│   ├── h2.personagens__title     → "Personagens"
│   └── p.personagens__subtitle   → "OS HERÓIS E VILÕES DA BATALHA EM NAMEKUSEI"
│
└── div.personagens__stage                   ← palco freeform (position: relative)
    ├── figure.personagem.personagem--goku
    │   ├── img.personagem__img  [src=assets/images/goku-perso.png · alt="Goku" · loading="lazy"]
    │   └── figcaption.personagem__name → "Goku"
    ├── figure.personagem.personagem--vegeta   → …/vegeta-perso.png · "Vegeta"
    ├── figure.personagem.personagem--gohan    → …/gohan-perso.png · "Gohan"
    ├── figure.personagem.personagem--kuririn  → …/kuririn-perso.png · "Kuririn"
    ├── figure.personagem.personagem--ginyu    → …/ginyu-perso.png · "Capitão Ginyu"
    ├── figure.personagem.personagem--freeza   → …/freeza-perso.png · "Freeza"
    ├── figure.personagem.personagem--piccolo  → …/piccolo-perso.png · "Piccolo"
    ├── figure.personagem.personagem--dodoria  → …/dodoria-perso.png · "Dodoria"
    └── figure.personagem.personagem--zarbon   → …/zarbon-perso.png · "Zarbon"
```

Regras do markup:
- Cada `figure.personagem` é posicionada com `position: absolute` no `.personagens__stage`. Coordenadas/escala vivem na classe modificadora `--NOME` (ver §5).
- `.personagens__stage` é `position: relative` e serve de referência de coordenadas.
- Nenhum outro elemento além dos listados. Sem wrappers de card, sem botões, sem ícones.

---

## 4. Camadas (empilhamento, de trás para frente)

1. **Grade de fundo** — `.personagens__particles-bg > #personagens-grid`
   Ocupa 100% da seção (absoluto/inset 0), `z-index` mais baixo, `pointer-events: none`. JS desenha as células do radar (pulso a partir do centro), o glow que segue o cursor e os blips amarelos. No HTML fica **vazio**.
2. **Header** — `.personagens__header`
   Centralizado no topo da seção, acima da grade. É o único texto de bloco da seção.
3. **Stage / figuras** — `.personagens__stage` com as 9 `figure`
   Camada superior. Cada figura tem seu próprio `z-index` (ver tabela §5) para sobreposições sutis de profundidade; parallax aplicado via `transform`.

Ordem de leitura (acessibilidade) segue o DOM da §3, não a posição visual.

---

## 5. Tokens & posicionamento

### 5.1 Tokens consumidos (todos do `:root` do `DESIGN.md` — nenhum novo)

| Uso | Token |
|-----|-------|
| Fundo da seção | `--bg-deep` / `--bg-mid` |
| Título `Personagens` | `--font-display` (Fredoka, 600–700) + `--text-primary` |
| Eyebrow `OS GUERREIROS Z` | `--font-body` (Outfit), caixa alta, `--ls-label` + `--accent-star` |
| Subtítulo | `--font-body`, caixa alta, `--ls-label` + `--text-muted` |
| Linhas da grade | `--border-subtle` (base) / `--border-strong` (destaque) |
| Blips do radar | `--cosmic-rose` (Amarelo Energia `#ffd23f`) |
| Glow que segue o cursor | `--cosmic-cyan` (ou `--accent-star`) + `--accent-star-glow` para halo — ver Suposição §6 |
| Halo/drop-shadow das figuras | `--accent-star-glow` |
| Foco `:focus-visible` | `--ring-focus` |
| Easing/entradas | `--ease-out-expo`, `--ease-spring`, `--stagger-*` |

### 5.2 Coordenadas das figuras (anti-grid)

Valores **relativos ao `.personagens__stage`** (`left`/`top` em % do palco). Derivados do arranjo do print; são **valores de partida ajustáveis** — o que é canônico é a **posição relativa** (quem está à esquerda/direita, quem está mais alto/baixo) e a **variação de escala**, não o pixel exato.

| Personagem | Quadrante | left | top | escala | tier | z-index | parallax (sugestão) |
|-----------|-----------|------|-----|--------|------|---------|---------------------|
| Goku | superior-esquerdo | 14% | 10% | 1.00 | B | 3 | médio |
| Gohan | superior-central | 46% | 20% | 0.85 | C | 4 | rápido |
| Vegeta | superior-direito | 76% | 12% | 1.00 | B | 3 | médio |
| Capitão Ginyu | meio-esquerdo | 12% | 42% | 1.15 | A | 2 | lento |
| Zarbon | central | 44% | 50% | 1.05 | B | 3 | médio |
| Kuririn | meio-direito | 74% | 40% | 0.80 | C | 4 | rápido |
| Dodoria | inferior-esquerdo | 15% | 70% | 1.00 | B | 2 | lento |
| Freeza | inferior-central | 47% | 74% | 0.85 | C | 3 | médio |
| Piccolo | inferior-direito | 72% | 64% | 1.20 | A | 2 | lento |

**Três tiers de escala distintos** (satisfaz o requisito ≥3):
- **A (maior, 1.15–1.20):** Capitão Ginyu, Piccolo
- **B (médio, 1.00–1.05):** Goku, Vegeta, Zarbon, Dodoria
- **C (menor, 0.80–0.85):** Gohan, Kuririn, Freeza

**Quebra de grade (por que não parece grid):**
- Dentro de cada banda vertical, os `top` são diferentes entre si (ex.: banda superior 10 / 20 / 12; central 42 / 50 / 40; inferior 70 / 74 / 64) — nenhuma linha alinhada.
- Os `left` das "colunas" também são escalonados (14/12/15 · 46/44/47 · 76/74/72), evitando alinhamento vertical perfeito.
- Escala + `z-index` variados dão profundidade, reforçando o "flutuando no espaço".

Parallax: mapear "rápido/médio/lento" para velocidades diferentes por profundidade (figuras menores/à frente movem mais; maiores/ao fundo movem menos, ou vice-versa — decidir na implementação). Animar só `transform`/`opacity`, `will-change: transform`.

---

## 6. Suposições

1. **`id` da seção** = `personagens` (não visível no print; escolhido para navegação/âncora, coerente com `DESIGN.md §7`).
2. **Glow verde do print × paleta:** o print mostra a grade e o glow com tom **esverdeado**, mas o `:root` do `DESIGN.md` **não tem token verde**. Como a regra é "só tokens do `:root`", o glow/grade devem usar um acento existente — recomendação: `--cosmic-cyan` (Azul Ki) para o glow do cursor e `--cosmic-rose` para os blips (que já são amarelos no print). **Pendência a confirmar** com o dono do design: manter o verde (exigiria novo token, fora da regra) ou padronizar em cyan/orange.
3. **Coordenadas/escala da §5.2** são valores de partida derivados do arranjo do print; o print governa a **posição relativa** e a **variação**, não o pixel exato. Ajuste fino esperado na implementação.
4. **`alt`** de cada `<img>` = o nome do personagem (igual ao `figcaption`).
5. **Ordem no DOM** segue a lista da §2/§3 (ordem de leitura/acessibilidade); a posição visual vem do CSS absoluto.
6. **Case do texto:** a copy foi fornecida em caixa alta e é reproduzida literalmente; se preferir texto natural + `text-transform: uppercase`, o resultado renderizado deve ser idêntico ao print.
7. **Header** sem CTA/scroll indicator (isso pertence à Hero, `DESIGN.md §4`); aqui só as 3 linhas de texto.

---

## 7. Responsividade

**Desktop (≥ 768px):** composição freeform com `position: absolute`, escalas variadas, parallax e grade animada (comportamento do print).

**Mobile (< 768px)** — conforme `DESIGN.md §5` ("personagens viram fluxo vertical", "sem overflow horizontal"):
- Desativar posicionamento absoluto: as 9 `figure` colapsam para **coluna única** em fluxo vertical, na ordem do DOM.
- Neutralizar as escalas divergentes (aproximar de 1.0) e centralizar cada figura; sem sobreposição.
- Grade de fundo simplificada/atenuada (densidade menor), mantendo o clima sem custo de performance.
- Header permanece centralizado, com escala fluida via `clamp(...)`.
- `@media (prefers-reduced-motion: reduce)`: parallax e pulsos da grade neutralizados; layout estático.

---

## 8. Trilho (altura para o parallax)

A seção precisa de **folga vertical** para as figuras viajarem em profundidades diferentes sem "grudar" nas bordas durante o scroll (a seção **não** é pinned — só a Saga é, `DESIGN.md §7`).

- `.personagens` / `.personagens__stage`: `min-height` alta o suficiente, ex.: `min-height: clamp(760px, 120vh, 1100px)`.
- Garantir que os `top` extremos (~10% e ~74% da §5.2) + o deslocamento de parallax caibam dentro do palco sem cortar figuras nem gerar overflow horizontal.
- Em mobile, `min-height` cede para `auto` (o fluxo vertical define a altura).

---

## 9. Checklist de implementação

- [ ] `section#personagens.personagens` criada na ordem correta (2ª seção, `DESIGN.md §7`).
- [ ] Header com as 3 linhas de copy **exatas** (eyebrow, título, subtítulo).
- [ ] Eyebrow em `--accent-star`; título em `--font-display` + `--text-primary`; subtítulo em `--text-muted`.
- [ ] `.personagens__particles-bg > #personagens-grid` presente e **vazio** (JS preenche).
- [ ] As **9** `figure.personagem.personagem--NOME` presentes, na ordem do DOM da §3.
- [ ] Cada `<img>` com `src` correto, `alt` = nome e `loading="lazy"`.
- [ ] Cada `<figcaption>` com a legenda exata (atenção: **"Capitão Ginyu"**).
- [ ] Posicionamento **absoluto** por figura (nenhum `display: grid`/`flex` de mosaico no stage).
- [ ] ≥3 tiers de escala aplicados (A/B/C da §5.2).
- [ ] Parallax só em `transform`/`opacity`, com `will-change`.
- [ ] Somente tokens do `:root` do `DESIGN.md`; nenhuma cor/fonte hardcoded nova.
- [ ] `min-height` do stage suficiente para o parallax (§8).
- [ ] Mobile: colapso para coluna única, sem overflow horizontal.
- [ ] `prefers-reduced-motion`: animações neutralizadas.
- [ ] Nenhum botão/ícone/link/card inventado.

---

## 10. Aceitação (anti-regressão)

Bloqueadores — a seção **falha** se qualquer item abaixo não passar:

- [ ] **Não é grid.** Nenhum `display: grid`/mosaico/coluna regular governa as figuras; posicionamento é absoluto e individual.
- [ ] **Espalhados em quadrantes diferentes.** As 9 figuras ocupam quadrantes distintos (superior/meio/inferior × esquerda/centro/direita), como na §5.2 — não há aglomeração em um só canto.
- [ ] **≥3 escalas distintas.** Pelo menos três tamanhos claramente diferentes coexistem (tiers A/B/C).
- [ ] **Variação vertical clara.** Os `top` variam dentro de cada banda (nenhuma "linha" de personagens alinhada horizontalmente); a leitura é de figuras flutuando em alturas diferentes.

Aceitação de conteúdo:
- [ ] Copy do header idêntica ao print (sem acréscimos).
- [ ] 9 figuras com assets, legendas e ordem corretos.
- [ ] Grade/blips/glow presentes via container de fundo; nenhum elemento fora do inventário (§2).
