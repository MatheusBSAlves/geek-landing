# Spec: Nav Flutuante — DBZ / A Saga do Freeza

> Especificação da barra de navegação flutuante. Alinhada ao `DESIGN.md` (§2 Cores, §3 Tipografia, §6 Motion). **Todas as cores/fontes/easings referenciam exclusivamente tokens do `:root`** — nenhum valor novo é introduzido.

---

## 1. Objetivo

Barra de navegação **fixa** e **flutuante** (pill arredondada) que:

- Permanece ancorada ao topo da viewport (`position: fixed`), centralizada horizontalmente.
- Fica **oculta enquanto a Hero está em tela** e **aparece (reveal) ao rolar** para além dela, com transição de fade + slide.
- Oferece **âncoras** para as seções internas via `href="#..."` (scroll para os alvos).
- Marca o **link ativo por seção** conforme a seção visível durante o scroll (`--active`).

Os itens são **exatamente os quatro do print**, nesta ordem:

| Rótulo (exibido) | Âncora | Alvo |
|------------------|--------|------|
| `DBZ` | `#hero` | Hero (topo / home) |
| `PERSONAGENS` | `#personagens` | Seção Personagens |
| `TRAILERS` | `#trailers` | Seção Trailers |
| `A SAGA` | `#saga` | Seção A Saga (`class="jornada"`) |

> Rótulos exibidos em **caixa alta** (a caixa alta é estilística; o texto no HTML pode ser natural + `text-transform`). Nenhum item além destes quatro deve existir. No print, `PERSONAGENS` aparece no estado ativo.

---

## 2. Estrutura HTML

```
nav.floating-nav[aria-label="Navegação principal"]
└── ul.floating-nav__list
    ├── li.floating-nav__item
    │   └── a.floating-nav__link[href="#hero"]           → "DBZ"
    ├── li.floating-nav__item
    │   └── a.floating-nav__link[href="#personagens"]    → "PERSONAGENS"
    ├── li.floating-nav__item
    │   └── a.floating-nav__link[href="#saga"]           → "A SAGA"
    └── li.floating-nav__item
        └── a.floating-nav__link[href="#trailers"]       → "TRAILERS"
```

> **Ordem dos itens:** aqui na Estrutura HTML, `A SAGA` vem **antes** de `TRAILERS` (DBZ · PERSONAGENS · A SAGA · TRAILERS). Isso diverge da ordem do print / da tabela §1 (DBZ · PERSONAGENS · TRAILERS · A SAGA). Rótulos e âncoras permanecem os mesmos; muda apenas a posição relativa desses dois itens. Confirmar qual ordem é a canônica antes de fechar.

Notas de estrutura:

- Os **divisores** entre itens (verticais, vistos no print) são decorativos: usar `::before`/`::after` nos `li` (a partir do 2º item) ou borda lateral. **Não** criar elementos vazios só para o traço, e marcá-los como não semânticos.
- O elemento raiz é um `<nav>` único; o reveal é controlado pela classe `.floating-nav--visible` no próprio `<nav>`.
- O link ativo recebe `.floating-nav__link--active` (e `aria-current="true"`).

---

## 3. Estados

### 3.1 Visibilidade (container)

| Estado | Classe | Comportamento |
|--------|--------|---------------|
| **Oculta (topo / Hero)** | *(sem `--visible`)* | `opacity: 0`, deslocada para cima (`translateY` negativo), `pointer-events: none`. Estado inicial. |
| **Visível (pós-threshold)** | `.floating-nav--visible` | `opacity: 1`, `translateY(0)`, `pointer-events: auto`. |

Transição entre estados usa `opacity` + `transform` com `--ease-out-expo` (§6). Sem alterar `display` (evita reflow / permite transição).

### 3.2 Link ativo

| Estado | Classe | Estilo |
|--------|--------|--------|
| **Inativo** | *(base)* | Texto em `--text-muted`. |
| **Hover / focus** | `:hover`, `:focus-visible` | Texto sobe para `--text-primary`; fundo soft opcional em `--accent-star-dim`. |
| **Ativo** | `.floating-nav__link--active` | Texto em **`--accent-star`** (Laranja Goku), conforme print. `aria-current="true"`. |
| **Foco (teclado)** | `:focus-visible` | Anel via `--ring-focus` (ver §6). |

> Apenas **um** link ativo por vez. O ativo é definido por qual seção está em vista (ver §5).

---

## 4. Estilos por bloco → tokens

Todos os valores abaixo mapeiam para tokens do `:root` do `DESIGN.md`. Onde não há token específico (raio, blur, espaçamento fino), usar a escala fluida/utilitária já existente do projeto — **sem inventar cor**.

### 4.1 Container `.floating-nav`

| Propriedade | Token / valor |
|-------------|---------------|
| `position` | `fixed`, topo centralizado (`top` com respiro; `left: 50%` + `translateX(-50%)`) |
| `z-index` | Acima do conteúdo e de overlays de seção (camada de nav; abaixo de modais, se houver). Definir alto e consistente com a escala de z do projeto. |
| Fundo | `--bg-surface-raised` (`#1a2350`) — "superfície elevada / nav flutuante" |
| `backdrop-filter` | `blur(...)` para o efeito de vidro sobre a Hero/seções (glassmorphism) |
| Borda | `1px` em `--border-subtle`; reforço opcional em `--border-strong` na borda superior |
| Raio | Pill (raio alto / arredondamento total nas pontas) |
| Sombra / halo | Drop-shadow suave; halo opcional em `--accent-star-glow` para leve brilho |
| Tipografia | `--font-body` (Outfit) — navegação é "corpo/utilitário" (§3) |

### 4.2 Lista `.floating-nav__list`

- `display: flex`, itens em linha, alinhados ao centro vertical.
- Gap horizontal consistente entre itens; padding lateral interno para o respiro do pill.
- Sem marcadores de lista.

### 4.3 Item `.floating-nav__item` (divisores)

- Divisor vertical entre itens via pseudo-elemento: fino, em `--border-subtle` (ou `--border-strong` para o traço mais visível do print).
- Primeiro item **sem** divisor à esquerda.

### 4.4 Link `.floating-nav__link`

| Propriedade | Token / valor |
|-------------|---------------|
| Família | `--font-body` (Outfit) |
| Caixa | `text-transform: uppercase` |
| Tracking | `--ls-label` (`0.12em`) — utility label (§3) |
| Cor base | `--text-muted` |
| Cor hover/focus | `--text-primary` |
| Fundo hover (opcional) | `--accent-star-dim` |
| Cor ativa | `--accent-star` |
| Transição | `color`/`background` com `--ease-out-expo` |

---

## 5. Comportamento JS

### 5.1 Reveal por threshold (mostrar após a Hero)

Objetivo: **o menu só aparece depois que o usuário rola para além da seção Hero.**

- **Gatilho:** quando o scroll ultrapassa o fim da Hero, adicionar `.floating-nav--visible` ao `<nav>`; ao voltar para dentro da Hero, remover a classe (nav volta a ocultar).
- **Threshold recomendado:** o rodapé da Hero cruzar o topo da viewport — equivalente a `scrollY >= alturaDaHero` (ou `~85–100vh`). Usar a **altura real da Hero** (medida do elemento) em vez de constante fixa, para robustez.
- **Implementação preferida:** `IntersectionObserver` observando a seção `#hero` — quando a Hero **deixa** de intersectar (sai de vista), `--visible`; quando **volta** a intersectar, remove. Alternativa: listener de `scroll` com o threshold acima (throttle/`requestAnimationFrame`).
- **Consistência com o DESIGN.md:** §6 já prevê `IntersectionObserver` para reveals leves — reutilizar essa abordagem aqui.

### 5.2 Link ativo por seção (scroll spy)

- Observar as seções-alvo (`#hero`, `#personagens`, `#trailers`, `#saga`) com `IntersectionObserver`.
- A seção com maior visibilidade / que está cruzando a zona central da viewport define o link ativo: adicionar `.floating-nav__link--active` (+ `aria-current="true"`) ao link correspondente e **removê-lo dos demais**.
- Apenas um ativo por vez.

### 5.3 Âncoras / scroll suave

- Clique num link rola até o alvo (`scroll-behavior: smooth` no CSS **ou** scroll programático no JS).
- Respeitar `prefers-reduced-motion`: sem scroll animado quando reduzido (ver §6).

### 5.4 Interação com a Jornada (pin/scrub)

- A seção `#saga` usa pin + scrub horizontal (GSAP/ScrollTrigger). O scroll-spy deve marcar `A SAGA` como ativa enquanto a seção estiver pinada; garantir que o observer considere o container pinado (e não perca o ativo durante o scrub).

---

## 6. Responsividade e foco

### Responsividade
- **Desktop:** pill horizontal centralizada, quatro itens + divisores, conforme print.
- **Mobile (< 768px, `--jornada-bp`):** manter os quatro itens em linha se couberem no respiro lateral; caso contrário, reduzir tracking/padding antes de qualquer quebra. Sem **overflow horizontal** (regra §5 do DESIGN.md). Não introduzir menu hambúrguer se não estiver nos prints — manter o pill enxuto.
- Largura do pill acompanha o conteúdo (não esticar até as gutters).

### Foco / acessibilidade
- `<nav aria-label="Navegação principal">`.
- Links navegáveis por teclado na ordem visual.
- **`:focus-visible`** → outline usando `--ring-focus` (`rgba(41, 194, 255, 0.55)`), com offset suficiente para não ser cortado pelo pill.
- Alvos de toque confortáveis (área clicável ≥ o texto, com padding).
- Link ativo expõe `aria-current="true"`.
- Contraste: `--text-muted`/`--accent-star` sobre `--bg-surface-raised` deve manter legibilidade (validar AA no texto pequeno em caixa alta).

### Reduced motion
- `@media (prefers-reduced-motion: reduce)`: neutralizar o slide do reveal (aplicar visibilidade sem `translateY` animado) e desativar scroll suave. O nav ainda aparece/oculta, apenas sem movimento.

---

## 7. Checklist de implementação

- [ ] `<nav class="floating-nav" aria-label="Navegação principal">` com `ul` + 4 `li`/`a`.
- [ ] Rótulos e âncoras exatos: DBZ→`#hero`, PERSONAGENS→`#personagens`, TRAILERS→`#trailers`, A SAGA→`#saga`.
- [ ] Divisores verticais via pseudo-elemento (`--border-subtle`/`--border-strong`); 1º item sem divisor.
- [ ] Container: `position: fixed`, centralizado, `z-index` de camada de nav, `--bg-surface-raised`, `backdrop-filter: blur`, borda `--border-subtle`, raio pill.
- [ ] Estado inicial oculto (`opacity: 0`, `translateY` negativo, `pointer-events: none`).
- [ ] `.floating-nav--visible` → `opacity: 1`, `translateY(0)`, `pointer-events: auto`; transição com `--ease-out-expo`.
- [ ] Links: `--font-body`, uppercase, `--ls-label`, cor base `--text-muted`.
- [ ] Hover/focus → `--text-primary` (+ `--accent-star-dim` opcional).
- [ ] `.floating-nav__link--active` → `--accent-star` + `aria-current="true"`.
- [ ] `:focus-visible` → `--ring-focus`.
- [ ] JS reveal: `IntersectionObserver` na `#hero` (ou threshold ≈ altura da Hero) alternando `--visible`.
- [ ] JS scroll-spy: `IntersectionObserver` nas 4 seções, um único link ativo por vez.
- [ ] Scroll suave nas âncoras, respeitando `prefers-reduced-motion`.
- [ ] `A SAGA` permanece ativa durante o pin/scrub da Jornada.
- [ ] Mobile < 768px: sem overflow horizontal; pill enxuto.
- [ ] `@media (prefers-reduced-motion: reduce)`: sem slide/scroll animado.

---

## 8. Critérios de aceitação visuais

1. **No topo (Hero em tela):** nenhum menu visível.
2. **Ao rolar para além da Hero:** o pill entra com fade + leve slide de cima, e passa a ficar fixo no topo, centralizado.
3. **Aparência do pill:** superfície elevada translúcida (`--bg-surface-raised` + blur), cantos totalmente arredondados, borda sutil — consistente com o print.
4. **Itens:** exatamente `DBZ · PERSONAGENS · TRAILERS · A SAGA`, em caixa alta com tracking, separados por divisores verticais finos.
5. **Estado base dos links:** texto atenuado (`--text-muted`).
6. **Link ativo:** em Laranja Goku (`--accent-star`) — como `PERSONAGENS` no print — e apenas um ativo por vez.
7. **Scroll-spy:** o ativo muda ao passar por Personagens → Trailers → A Saga (e volta a DBZ no topo).
8. **Foco por teclado:** anel de foco ciano (`--ring-focus`) claramente visível ao tabular.
9. **Mobile:** o pill cabe na largura sem gerar rolagem horizontal.
10. **Reduced motion:** o nav aparece/oculta sem movimento perceptível e sem scroll animado.