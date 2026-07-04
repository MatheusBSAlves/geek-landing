# Especificação: Navegação Flutuante (Nav Section) - V2

## 1. Objetivo
Definir a estrutura, o visual e o comportamento da barra de navegação principal. A navegação atua como uma "pílula" (pill) flutuante que permanece fixa na tela, sendo revelada apenas após um determinado limite de rolagem (scroll). Ela fornece âncoras para as seções da página e atualiza seu estado ativo dinamicamente com base na área visível (Spy Scroll).

## 2. Estrutura HTML
A semântica deve ser baseada em uma lista de navegação padrão. Conforme orientação de layout, a seção da Saga deve preceder a de Trailers na ordenação estrutural.

* `<nav>` (Container principal, fixo na tela)
    * `<ul>` (Lista de navegação)
        * `<li>` -> `<a>` (Texto: "DBZ", Link topo/home, atributo `data-section="hero"`)
        * `<li aria-hidden="true">` (Separador visual vertical)
        * `<li>` -> `<a>` (Texto: "PERSONAGENS", atributo `data-section="personagens"`)
        * `<li aria-hidden="true">` (Separador visual vertical)
        * `<li>` -> `<a>` (Texto: "A SAGA", atributo `data-section="saga"`)
        * `<li aria-hidden="true">` (Separador visual vertical)
        * `<li>` -> `<a>` (Texto: "TRAILERS", atributo `data-section="trailers"`)

## 3. Estados
* **Oculto (Padrão/Topo):** A navegação inicia invisível (`opacity: 0`) e levemente deslocada (ex: `translateY(-100%)` se no topo, ou `translateY(20px)` se na base). Fica inativa para cliques (pointer-events: none).
* **Visível (`.visible`):** Após cruzar o threshold de scroll, assume `opacity: 1`, `translateY(0)` e `pointer-events: auto`. Transição gerida por `--ease-out-expo`.
* **Link Inativo:** Estado padrão dos itens de navegação (cor cinza/suave).
* **Link Hover:** Transição suave para maior brilho/opacidade quando o mouse passa sobre o link.
* **Link Ativo (`.floating-nav__link--active`):** Indica a seção atual na viewport. O texto adquire a cor de destaque (Laranja).

## 4. Estilos por Bloco (Mapeamento de Tokens)
* **Container (`<nav>` / `<ul>`):**
    * Fundo: `--bg-surface-raised` com efeito de desfoque (`backdrop-filter: blur(...)`).
    * Formato: Bordas totalmente arredondadas (pílula / `border-radius: 999px`).
    * Borda externa (opcional/sutil): `--border-subtle` para delimitação espacial.
    * Z-index: Alto o suficiente para sobrepor todas as seções e overlays.
* **Tipografia dos Links:**
    * Família: `--font-body` (Outfit).
    * Caixa alta (Uppercase).
    * Espaçamento: `letter-spacing: var(--ls-label, 0.12em)`.
    * Peso: Médio/Bold (500-600) para legibilidade.
* **Cores dos Links:**
    * Inativo: `--text-muted`.
    * Hover: `--text-primary`.
    * Ativo (`--active`): `--accent-star` (Laranja Goku).
* **Separadores (`aria-hidden="true"`):**
    * Linha vertical fina.
    * Cor: `--border-subtle`.
    * Altura: Parcial em relação à altura da barra de navegação (não toca as bordas).

## 5. Comportamento JS
* **Reveal da Nav (Threshold):**
    * Calcular o limite de rolagem: `altura do #hero * 0.6`.
    * Fallbacks de segurança: `window.innerHeight * 0.6` ou um valor fixo de `300px` caso o elemento hero não seja mensurável no momento.
    * Ao cruzar o limite para baixo, adicionar a classe `.visible`. Ao voltar para o topo, remover.
* **Scroll Spy (Seção Ativa):**
    * Utilizar `IntersectionObserver` nas seções alvo respeitando a ordem cronológica (`#hero`, `#personagens`, `#saga`, `#trailers`).
    * Ao cruzar o threshold da seção visível no centro da tela, aplicar a classe `.floating-nav__link--active` ao link correspondente e remover dos demais.
* **Smooth Scroll:**
    * Interceptron o clique nos links para garantir uma rolagem suave (`behavior: 'smooth'`) até a âncora correspondente.

## 6. Responsividade e Foco
* **Foco pelo Teclado (`:focus-visible`):**
    * Navegação por tab deve exibir o anel de foco configurado no token `--ring-focus`.
    * O `outline` deve ter um offset (distância) para não grudar no texto do link.
* **Mobile (< 768px):**
    * Reduzir levemente o espaçamento interno (padding) lateral dos links e o tamanho da fonte (`--fs-xs` ou similar escalar).
    * Se o espaço da tela for insuficiente para todos os itens, o container `<ul>` deve permitir rolagem horizontal (`overflow-x: auto`) ocultando a barra de rolagem nativa (`scrollbar-width: none` / `::-webkit-scrollbar { display: none; }`), mantendo o layout de pílula intacto.

## 7. Checklist de Implementação
- [ ] Criar marcação semântica baseada em lista (`nav` > `ul` > `li`).
- [ ] Garantir a ordem dos itens com "A SAGA" posicionado antes de "TRAILERS".
- [ ] Aplicar tokens de cor (Background `--bg-surface-raised`, ativo `--accent-star`).
- [ ] Aplicar tipografia exata (`--font-body`, uppercase, letter-spacing).
- [ ] Criar os traços separadores embutidos semanticamente.
- [ ] Implementar CSS de estados (hidden, visible, hover, active, focus-visible).
- [ ] Configurar lógica JS do limite de scroll (`#hero * 0.6`) para o reveal da nav.
- [ ] Configurar JS de IntersectionObserver seguindo a sequência correta das seções.
- [ ] Testar navegação por teclado e foco.
- [ ] Validar comportamento em resoluções menores.

## 8. Critérios de Aceitação Visuais
1.  **Fidelidade e Ordenação:** A barra deve se apresentar como uma pílula escura levemente translúcida, exibindo a sequência corrigida estruturalmente. O texto deve estar alinhado verticalmente com os traços divisórios perfeitamente centralizados.
2.  **Contraste e Leitura:** Os itens inativos (`--text-muted`) devem ser legíveis sobre o `--bg-surface-raised`, mas nitidamente secundários em relação ao item ativo (`--accent-star` brilhante e saturado).
3.  **Transições de Estado:** As mudanças de cor no hover e o surgimento/desaparecimento geral da barra de navegação devem usar o easing fluido estipulado pelo design system (`--ease-out-expo`).
