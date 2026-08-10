function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas || !canvas.getContext) {
    return { destroy() {} };
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    return { destroy() {} };
  }

  const root = document.documentElement;

  function readTokens() {
    const cs = getComputedStyle(root);
    return {
      bgDeep: cs.getPropertyValue('--bg-deep').trim(),
      bgMid: cs.getPropertyValue('--bg-mid').trim(),
      textMuted: cs.getPropertyValue('--text-muted').trim(),
      textPrimary: cs.getPropertyValue('--text-primary').trim(),
      accentStar: cs.getPropertyValue('--accent-star').trim(),
      cosmicCyan: cs.getPropertyValue('--cosmic-cyan').trim(),
      cosmicPurple: cs.getPropertyValue('--cosmic-purple').trim(),
      cosmicRose: cs.getPropertyValue('--cosmic-rose').trim(),
    };
  }

  /** @type {{ x: number; y: number; phase: number; twinkleRate: number }[]} */
  let starsFar = [];
  /** @type {{ x: number; y: number; nx: number; ny: number; glow: boolean; glowHue: string; size: number; twinklePhase: number; twinkleRate: number }[]} */
  let starsNear = [];
  /** @type {{ nx: number; ny: number; r: number; hue: string }[]} */
  let nebulae = [];

  let cssWidth = 0;
  let cssHeight = 0;
  let dprCap = Math.min(window.devicePixelRatio || 1, 2);
  let rafId = 0;
  let scrollY = window.scrollY;
  let prefersReduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reduceMq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function rebuildStars() {
    starsFar = [];
    starsNear = [];
    nebulae = [];

    const w = cssWidth || 1;
    const h = cssHeight || 1;
    const areaFactor = Math.sqrt((w * h) / (1920 * 1080));

    const countFar = Math.round(216 * areaFactor);
    const countNear = Math.round(126 * areaFactor);

    const rand = Math.random;

    for (let i = 0; i < countFar; i++) {
      starsFar.push({
        x: rand() * w,
        y: rand() * h,
        phase: rand() * Math.PI * 2,
        twinkleRate: 0.00072 + rand() * 0.00128,
      });
    }

    for (let i = 0; i < countNear; i++) {
      const rarity = rand();
      const glow = rarity > 0.91;
      const glowHue = rand() > 0.5 ? 'cyan' : 'star';
      starsNear.push({
        x: rand() * w,
        y: rand() * h,
        nx: rand(),
        ny: rand(),
        glow,
        glowHue,
        size: 2 * (1.35 + rand() * 0.65),
        twinklePhase: rand() * Math.PI * 2,
        twinkleRate: 0.00062 + rand() * 0.00115,
      });
    }

    const nebulaCount = 3;
    for (let i = 0; i < nebulaCount; i++) {
      nebulae.push({
        nx: 0.12 + rand() * 0.76,
        ny: 0.08 + rand() * 0.84,
        r: (0.22 + rand() * 0.38) * Math.max(w, h),
        hue: rand() > 0.5 ? 'purple' : 'rose',
      });
    }
  }

  function syncCanvasDimensions() {
    dprCap = Math.min(window.devicePixelRatio || 1, 2);
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;

    const bw = Math.max(1, Math.floor(cssWidth * dprCap));
    const bh = Math.max(1, Math.floor(cssHeight * dprCap));

    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }

    ctx.setTransform(dprCap, 0, 0, dprCap, 0, 0);
    rebuildStars();
  }

  function paintFrame(animationTimeMs) {
    const t = readTokens();
    const w = cssWidth;
    const h = cssHeight;

    if (!w || !h) return;

    const g = ctx.createRadialGradient(w * 0.45, h * 0.35, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.72);
    g.addColorStop(0, t.bgMid || t.bgDeep);
    g.addColorStop(1, t.bgDeep);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < nebulae.length; i++) {
      const nb = nebulae[i];
      const cx = nb.nx * w;
      const cy = nb.ny * h;
      const col = nb.hue === 'purple' ? t.cosmicPurple : t.cosmicRose;
      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, nb.r);
      ng.addColorStop(0, col);
      ng.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.035;
      ctx.fillStyle = ng;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < starsFar.length; i++) {
      const s = starsFar[i];
      const sine = prefersReduce ? 1 : Math.sin(animationTimeMs * s.twinkleRate + s.phase);
      const blink = prefersReduce ? 1 : 0.38 + 0.62 * (0.5 + 0.5 * sine);
      ctx.fillStyle = t.textMuted;
      ctx.globalAlpha = 0.28 * blink;
      ctx.fillRect(s.x, s.y, 2, 2);
    }

    ctx.globalAlpha = 1;
    const parallax = prefersReduce ? 0 : scrollY * 0.028;

    for (let i = 0; i < starsNear.length; i++) {
      const s = starsNear[i];
      const drift = prefersReduce ? 0 : s.ny * 0.006 * Math.sin(animationTimeMs * 0.00055 + s.nx * 6.28);
      const px = (((s.x + parallax * (0.55 + s.nx * 0.45)) % w) + w) % w;
      const py = (((s.y + drift * (h / 540)) % h) + h) % h;

      const sineNear = prefersReduce
        ? 1
        : Math.sin(animationTimeMs * s.twinkleRate + s.twinklePhase);
      const blinkNear = prefersReduce ? 1 : 0.5 + 0.5 * (0.5 + 0.5 * sineNear);

      if (s.glow && !prefersReduce) {
        ctx.save();
        ctx.shadowColor = s.glowHue === 'cyan' ? t.cosmicCyan : t.accentStar;
        ctx.shadowBlur = 5 + blinkNear * 7;
      }

      ctx.fillStyle = t.textPrimary;
      ctx.globalAlpha = blinkNear;
      ctx.fillRect(px, py, s.size, s.size);

      if (s.glow && !prefersReduce) {
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1;
  }

  function frame(now) {
    paintFrame(now);
    if (!prefersReduce) {
      rafId = requestAnimationFrame(frame);
    }
  }

  function onReduceChange() {
    prefersReduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cancelAnimationFrame(rafId);
    rafId = 0;

    const now = performance.now();
    paintFrame(now);

    if (!prefersReduce) {
      rafId = requestAnimationFrame(frame);
    }
  }

  function onScrollParallax() {
    scrollY = window.scrollY;
  }

  const resizeObs =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          syncCanvasDimensions();
          paintFrame(performance.now());
        })
      : null;

  function onWinResize() {
    syncCanvasDimensions();
    paintFrame(performance.now());
  }

  if (resizeObs) {
    resizeObs.observe(root);
  }
  window.addEventListener('resize', onWinResize, { passive: true });
  window.addEventListener('scroll', onScrollParallax, { passive: true });

  syncCanvasDimensions();
  const bootNow = performance.now();
  paintFrame(bootNow);
  if (!prefersReduce) {
    rafId = requestAnimationFrame(frame);
  }

  if (reduceMq) {
    if (typeof reduceMq.addEventListener === 'function') {
      reduceMq.addEventListener('change', onReduceChange);
    } else {
      reduceMq.addListener(onReduceChange);
    }
  }

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      rafId = 0;
      resizeObs?.disconnect();
      window.removeEventListener('resize', onWinResize);
      window.removeEventListener('scroll', onScrollParallax);
      if (reduceMq) {
        if (typeof reduceMq.removeEventListener === 'function') {
          reduceMq.removeEventListener('change', onReduceChange);
        } else {
          reduceMq.removeListener(onReduceChange);
        }
      }
    },
  };
}

function initFloatingNav() {
  const nav = document.querySelector('.floating-nav');
  if (!nav) return;

  const links = nav.querySelectorAll('.floating-nav__link[data-section]');
  const sectionOrder = ['hero', 'personagens', 'trailers', 'saga'];

  function getThreshold() {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      return heroEl.offsetHeight * 0.6;
    }
    return Math.max(window.innerHeight * 0.6, 300);
  }

  function updateVisibility() {
    const threshold = getThreshold();
    if (window.scrollY > threshold) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  }

  function updateActiveFromScroll() {
    const probeY = window.scrollY + window.innerHeight * 0.25;
    let activeId = 'hero';

    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= probeY) {
        activeId = id;
      }
    }

    links.forEach((link) => {
      const sec = link.getAttribute('data-section');
      link.classList.toggle('floating-nav__link--active', sec === activeId);
    });
  }

  function onScrollOrResize() {
    updateVisibility();
    updateActiveFromScroll();
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  onScrollOrResize();
}

/**
 * Sequência cinematográfica da hero (v1/v2) com GSAP + ScrollTrigger.
 * O fundo (.hero__bg-inner) e o palco (.hero__stage) já ficam "pinned" via
 * position: sticky no CSS — então aqui só animamos os elementos com `scrub`
 * enquanto a hero está fixa, sem precisar do pin do ScrollTrigger.
 *
 * Atos:
 *  1. Entrada do título (linhas em stagger) ao carregar.
 *  2. Goku (esq.) e Freeza (dir.) recuam pros próprios lados encolhendo até sair da tela no scroll.
 *  3. Zoom lento do vídeo de fundo.
 *  4. Título e seta "Role para começar" somem ao rolar.
 */
function initHeroScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const hero = document.getElementById('hero');
  if (!hero) return;

  const goku = document.querySelector('.hero__figure--goku');
  const freeza = document.querySelector('.hero__figure--freeza');
  const gokuGlow = document.querySelector('.hero__goku-glow');
  const freezaGlow = document.querySelector('.hero__freeza-glow');
  const bgVideo = document.querySelector('.hero__bg-video');
  const poster = document.querySelector('.hero__poster');
  const lines = gsap.utils.toArray('.hero__poster-line');
  const arrow = document.querySelector('.hero__scroll');

  const mm = gsap.matchMedia();

  // Desktop — sequência completa.
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    if (poster && lines.length) {
      gsap.from(lines, {
        yPercent: 60,
        opacity: 0,
        filter: 'blur(10px)',
        stagger: 0.14,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.15,
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=90%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // O título acompanha o scroll: sobe com zoom suave e vai SUMINDO de forma
    // progressiva (não só no fim). O fade fica amarrado ao scroll e termina por
    // volta de 80%, enquanto os personagens ainda recuam pros lados.
    if (poster) {
      tl.to(poster, { yPercent: -10, scale: 1.18, ease: 'none', duration: 1 }, 0);
      tl.to(poster, { opacity: 0, ease: 'none', duration: 0.7 }, 0.1);
    }
    if (arrow) tl.to(arrow, { opacity: 0, ease: 'none', duration: 0.12 }, 0);

    // Em vez de avançarem pro centro, os personagens RECUAM pros próprios lados
    // encolhendo (como se fossem pra trás) até saírem da tela conforme o scroll.
    // GSAP preserva o translateY que o CSS já aplica e anima só x + scale.
    if (goku) {
      tl.fromTo(goku,
        { xPercent: 0, scale: 1, transformOrigin: 'left bottom' },
        { xPercent: -120, scale: 0.55, ease: 'power2.in', duration: 1 }, 0);
    }
    if (gokuGlow) tl.fromTo(gokuGlow, { xPercent: 0 }, { xPercent: -120, ease: 'power2.in', duration: 1 }, 0);

    // Freeza começa na posição natural (xPercent 0, mais à frente) e sai pela direita.
    if (freeza) {
      tl.fromTo(freeza,
        { xPercent: 0, scale: 1, transformOrigin: 'right bottom' },
        { xPercent: 120, scale: 0.55, ease: 'power2.in', duration: 1 }, 0);
    }
    if (freezaGlow) tl.fromTo(freezaGlow, { xPercent: 0 }, { xPercent: 120, ease: 'power2.in', duration: 1 }, 0);

    if (bgVideo) {
      tl.fromTo(bgVideo,
        { scale: 1, transformOrigin: '50% 50%' },
        { scale: 1.18, ease: 'none', duration: 1 }, 0);
    }
  });

  // Mobile — versão leve (sem mover os personagens, que já são pequenos).
  mm.add('(max-width: 767.98px) and (prefers-reduced-motion: no-preference)', () => {
    if (poster && lines.length) {
      gsap.from(lines, {
        yPercent: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.1,
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=80%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    if (poster) {
      tl.to(poster, { yPercent: -8, scale: 1.12, ease: 'none', duration: 1 }, 0);
      // Mesmo fade progressivo da versão desktop.
      tl.to(poster, { opacity: 0, ease: 'none', duration: 0.7 }, 0.1);
    }
    if (arrow) tl.to(arrow, { opacity: 0, ease: 'none', duration: 0.12 }, 0);
    if (bgVideo) tl.fromTo(bgVideo, { scale: 1 }, { scale: 1.12, ease: 'none', duration: 1 }, 0);
  });
}

function initPersonagensParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('personagens');
  if (!section) return;

  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const parallaxConfigs = [
    {
      selector: '.personagem--goku',
      from: { x: -14, y: -42 },
      to: { x: 22, y: 188 },
      scrub: 0.8,
    },
    {
      selector: '.personagem--vegeta',
      from: { x: 18, y: -28 },
      to: { x: -32, y: 210 },
      scrub: 3.3,
    },
    {
      selector: '.personagem--gohan',
      from: { x: -8, y: -50 },
      to: { x: 24, y: 164 },
      scrub: 1.05,
    },
    {
      selector: '.personagem--kuririn',
      from: { x: -20, y: -24 },
      to: { x: 36, y: 232 },
      scrub: 1.45,
    },
    {
      selector: '.personagem--ginyu',
      from: { x: 14, y: -38 },
      to: { x: -46, y: 176 },
      scrub: 0.65,
    },
    {
      selector: '.personagem--freeza',
      from: { x: -16, y: -18 },
      to: { x: 30, y: 198 },
      scrub: 1.15,
    },
    {
      selector: '.personagem--piccolo',
      from: { x: 16, y: -30 },
      to: { x: -28, y: 184 },
      scrub: 1.0,
    },
    {
      selector: '.personagem--dodoria',
      from: { x: -12, y: -34 },
      to: { x: 30, y: 172 },
      scrub: 1.2,
    },
    {
      selector: '.personagem--zarbon',
      from: { x: 14, y: -30 },
      to: { x: -30, y: 196 },
      scrub: 0.9,
    },
  ];

  ScrollTrigger.matchMedia({
    '(prefers-reduced-motion: no-preference) and (min-width: 768px)': function () {
      parallaxConfigs.forEach((cfg) => {
        const el = document.querySelector(cfg.selector);
        if (!el) return;

        gsap.fromTo(
          el,
          {
            x: cfg.from.x,
            y: cfg.from.y,
            force3D: true,
          },
          {
            x: cfg.to.x,
            y: cfg.to.y,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: cfg.scrub,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
  });
}

/**
 * Fundo particles.js na seção #personagens (cores via tokens --particles-* no :root).
 */
function initPersonagensBg() {
  const section = document.getElementById('personagens');
  const holderId = 'personagens-particles-js';

  if (!section || typeof window.particlesJS !== 'function') {
    return;
  }

  const root = document.documentElement;

  function hexToRgbParticles(hex) {
    if (typeof hex !== 'string' || !hex.trim()) {
      return null;
    }
    const h = hex.trim();
    if (typeof window.hexToRgb === 'function') {
      return window.hexToRgb(h);
    }
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const expanded = h.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function readParticleColorTokens() {
    const cs = getComputedStyle(root);
    return {
      dot: cs.getPropertyValue('--particles-dot').trim(),
      line: cs.getPropertyValue('--particles-line').trim(),
      accent: cs.getPropertyValue('--particles-accent').trim(),
    };
  }

  function applyParticlesColorsFromCss(pJS) {
    const t = readParticleColorTokens();
    const dot = t.dot || '#00f5ff';
    const line = t.line || '#00d9ff';
    const accent = t.accent || '#0096c7';

    pJS.particles.color.value = dot;
    const rgbDot = hexToRgbParticles(dot);
    if (rgbDot) {
      pJS.particles.color.rgb = rgbDot;
    }

    pJS.particles.shape.stroke.color = accent;

    pJS.particles.line_linked.color = line;
    const rgbLine = hexToRgbParticles(line);
    if (rgbLine) {
      pJS.particles.line_linked.color_rgb_line = rgbLine;
    }
  }

  const prefersReduceMq =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  function prefersReducedMotion() {
    return prefersReduceMq ? prefersReduceMq.matches : false;
  }

  if (prefersReducedMotion()) {
    section.classList.add('personagens--particles-reduced');
    return;
  }

  const narrowMq =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 767.98px)')
      : null;

  function isNarrowViewport() {
    return narrowMq ? narrowMq.matches : false;
  }

  function buildParticlesConfig() {
    const t = readParticleColorTokens();
    const mobile = isNarrowViewport();

    return {
      particles: {
        number: {
          value: mobile ? 80 : 140,
          density: { enable: true, value_area: 800 },
        },
        color: { value: t.dot || '#00f5ff' },
        shape: {
          type: 'circle',
          stroke: {
            width: 0.5,
            color: t.accent || '#0096c7',
          },
        },
        opacity: {
          value: 0.7,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.3,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 160,
          color: t.line || '#00d9ff',
          opacity: 0.4,
          width: 1.2,
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'bounce',
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: !mobile, mode: 'push' },
          resize: true,
        },
        modes: {
          grab: {
            distance: 220,
            line_linked: { opacity: 0.8 },
          },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: !mobile,
    };
  }

  window.particlesJS(holderId, buildParticlesConfig());

  const pjsEntry = window.pJSDom && window.pJSDom[window.pJSDom.length - 1];
  const pJS = pjsEntry && pjsEntry.pJS;
  if (!pJS) {
    return;
  }

  applyParticlesColorsFromCss(pJS);

  const cancelRaf =
    window.cancelRequestAnimFrame ||
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    clearTimeout;

  let viewportPaused = false;

  function pausePersonagensDraw() {
    if (viewportPaused) return;
    cancelRaf(pJS.fn.drawAnimFrame);
    viewportPaused = true;
  }

  function resumePersonagensDraw() {
    if (!viewportPaused) return;
    viewportPaused = false;
    pJS.fn.vendors.draw();
  }

  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            const visible = entries.some((e) => e.isIntersecting);
            if (visible) {
              resumePersonagensDraw();
            } else {
              pausePersonagensDraw();
            }
          },
          { root: null, threshold: 0, rootMargin: '0px' }
        )
      : null;

  if (io) {
    io.observe(section);
  }

  let themeDebounce = 0;
  const themeObserver =
    typeof MutationObserver !== 'undefined'
      ? new MutationObserver(() => {
          window.clearTimeout(themeDebounce);
          themeDebounce = window.setTimeout(() => {
            applyParticlesColorsFromCss(pJS);
          }, 50);
        })
      : null;

  if (themeObserver) {
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
  }

  if (prefersReduceMq) {
    const onReduce = () => {
      if (prefersReduceMq.matches) {
        pausePersonagensDraw();
      } else {
        resumePersonagensDraw();
      }
    };
    if (typeof prefersReduceMq.addEventListener === 'function') {
      prefersReduceMq.addEventListener('change', onReduce);
    } else {
      prefersReduceMq.addListener(onReduce);
    }
  }
}

/**
 * Animações de ENTRADA das seções depois da hero (#personagens, #trailers,
 * #saga) com GSAP + ScrollTrigger: cada bloco é revelado ao entrar na viewport.
 *
 * Antes esses blocos animavam via @keyframes no CSS disparando no load — como
 * ficam abaixo da dobra, a animação se perdia antes do usuário rolar até lá.
 * Aqui o gatilho é o scroll, então a entrada acontece na hora certa.
 *
 * Detalhes importantes:
 *  - Nos personagens animamos SÓ opacity: o transform (x/y) é do parallax
 *    (initPersonagensParallax), então mexer em transform aqui brigaria com ele.
 *  - Tudo dentro de matchMedia('prefers-reduced-motion: no-preference'): com
 *    movimento reduzido o GSAP não esconde nada (o conteúdo aparece estático).
 *    Sem GSAP (CDN fora do ar) o CSS já deixa tudo visível por padrão.
 */
function initSectionReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // #personagens — título e subtítulo sobem desfocando.
    const persHeader = document.querySelector('.personagens__header');
    if (persHeader) {
      gsap.from('.personagens__title, .personagens__subtitle', {
        y: 32,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: persHeader, start: 'top 85%', once: true },
      });
    }

    // #personagens — figures surgem em stagger aleatório (só opacity: o
    // transform é do parallax).
    const persStage = document.querySelector('.personagens__stage');
    const figures = gsap.utils.toArray('.personagem');
    if (persStage && figures.length) {
      gsap.from(figures, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: { each: 0.07, from: 'random' },
        scrollTrigger: { trigger: persStage, start: 'top 78%', once: true },
      });
    }

    // #trailers — header em stagger e, logo depois, o carrossel sobe.
    const trailersHeader = document.querySelector('.trailers__header');
    if (trailersHeader) {
      gsap.from('.trailers__eyebrow, .trailers__title, .trailers__subtitle', {
        y: 32,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: trailersHeader, start: 'top 85%', once: true },
      });
    }

    const carousel = document.querySelector('.trailers__carousel');
    if (carousel) {
      gsap.from(carousel, {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: carousel, start: 'top 85%', once: true },
      });
    }

    // #saga — header em stagger.
    const sagaHeader = document.querySelector('.saga__header');
    if (sagaHeader) {
      gsap.from('.saga__eyebrow, .saga__title, .saga__subtitle, .saga__divider', {
        y: 32,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sagaHeader, start: 'top 85%', once: true },
      });
    }

    // #saga — cada item da timeline revela ao entrar (batch agrupa os que
    // entram juntos e aplica o stagger). Substitui o IntersectionObserver antigo.
    const sagaItems = gsap.utils.toArray('.saga__item');
    if (sagaItems.length) {
      gsap.set(sagaItems, { opacity: 0, y: 32 });
      ScrollTrigger.batch(sagaItems, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            overwrite: true,
          }),
      });
    }
  });
}
function initTrailersCarousel() {
  const root = document.querySelector('.trailers__carousel');
  if (!root) return;

  const track = root.querySelector('.trailers__track');
  const slides = root.querySelectorAll('.trailers__slide');
  const iframes = root.querySelectorAll('.trailers__player iframe');
  const prevBtn = root.querySelector('.trailers__arrow--prev');
  const nextBtn = root.querySelector('.trailers__arrow--next');
  const dots = root.querySelectorAll('.trailers__dots .trailers__dot');
  const liveEl = document.getElementById('trailers-carousel-live');

  const total = slides.length;
  if (!track || total === 0 || iframes.length !== total) return;

  let index = 0;

  function setIframeSources(activeIndex) {
    iframes.forEach((iframe, i) => {
      const url = iframe.getAttribute('data-src');
      if (!url) return;
      if (i === activeIndex) {
        if (iframe.src !== url) iframe.src = url;
      } else {
        iframe.src = 'about:blank';
      }
    });
  }

  function announce() {
    if (!liveEl) return;
    liveEl.textContent = `Trailer ${index + 1} de ${total}`;
  }

  function updateUI() {
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    setIframeSources(index);
    announce();
  }

  function goTo(newIndex) {
    index = ((newIndex % total) + total) % total;
    updateUI();
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
    }
  });

  updateUI();
}

function initBatalhaFinalVideoLoop() {
  const video = document.querySelector('.saga__video');
  if (!video) return;

  video.loop = false;
  video.muted = true;

  let rafId = null;
  let lastTs = null;
  let active = false;

  function stopReverse() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    lastTs = null;
  }

  function playForward() {
    stopReverse();
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  // Reverso manual: decrementa currentTime na velocidade natural (1x).
  function reverseStep(ts) {
    if (!active) return;
    if (lastTs == null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const next = video.currentTime - dt;
    if (next <= 0) {
      video.currentTime = 0;
      stopReverse();
      playForward(); // chegou no início → toca pra frente de novo
      return;
    }
    video.currentTime = next;
    rafId = requestAnimationFrame(reverseStep);
  }

  function startReverse() {
    if (!active) return;
    video.pause();
    lastTs = null;
    rafId = requestAnimationFrame(reverseStep);
  }

  // Ao terminar (sentido normal), começa o reverso.
  video.addEventListener('ended', startReverse);

  function activate() {
    if (active) return;
    active = true;
    playForward();
  }

  function deactivate() {
    if (!active) return;
    active = false;
    stopReverse();
    video.pause();
  }

  // Só roda enquanto o vídeo está visível (economiza recursos e evita que
  // browsers pausem vídeo mudo fora da tela).
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activate();
          else deactivate();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(video);
  } else {
    activate();
  }
}

/**
 * Fundo de grade animada na seção #personagens — porte vanilla do componente
 * "data-grid-hero" (21st.dev). Monta uma grade de células que pulsam a partir
 * do centro e um glow que acompanha o cursor. Substitui o particles.js.
 */
function initPersonagensGrid() {
  const grid = document.getElementById('personagens-grid');
  if (!grid) return;

  const wrap = grid.parentElement;
  const reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CFG = {
    targetCell: 30, // tamanho-alvo da célula (px)
    maxCells: 1100, // teto de células (performance, seção é alta)
    gap: 5,
    duration: 5, // s
    cellMin: 0.05,
    cellMax: 0.5,
    waveDelay: 0.2,
  };

  // Verde do componente original (21st.dev): hsl(150 100% 50%).
  const color =
    getComputedStyle(document.documentElement).getPropertyValue('--grid-cell-color').trim() ||
    '#00ff80';

  // Glow do cursor: criado uma vez, sobrevive aos rebuilds da grade.
  let glow = null;
  if (!reduce && wrap) {
    glow = document.createElement('div');
    glow.className = 'personagens__grid-glow';
    wrap.appendChild(glow);
  }

  function build() {
    const w = grid.clientWidth;
    const h = grid.clientHeight;
    if (!w || !h) return;

    let cols = Math.max(6, Math.round(w / CFG.targetCell));
    let rows = Math.max(6, Math.round(h / CFG.targetCell));
    if (cols * rows > CFG.maxCells) {
      const scale = Math.sqrt((cols * rows) / CFG.maxCells);
      cols = Math.max(6, Math.round(cols / scale));
      rows = Math.max(6, Math.round(rows / scale));
    }

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    grid.style.gap = CFG.gap + 'px';
    grid.style.setProperty('--grid-color', color);
    grid.style.setProperty('--cell-min', CFG.cellMin);
    grid.style.setProperty('--cell-max', CFG.cellMax);

    const centerR = Math.floor(rows / 2);
    const centerC = Math.floor(cols / 2);
    const total = rows * cols;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      if (!reduce) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const dr = Math.abs(r - centerR);
        const dc = Math.abs(c - centerC);
        const delay = Math.sqrt(dr * dr + dc * dc) * CFG.waveDelay;
        cell.style.animation = `cell-pulse ${CFG.duration}s ${delay.toFixed(
          3
        )}s infinite alternate ease-in-out`;
      }
      frag.appendChild(cell);
    }

    grid.innerHTML = '';
    grid.appendChild(frag);
  }

  build();

  // Blips do radar do Dragon Ball: 7 pontinhos amarelos piscando (1 por esfera),
  // espalhados e fora do centro (onde fica o título/personagens).
  if (wrap) {
    for (let i = 0; i < 7; i++) {
      const blip = document.createElement('div');
      blip.className = 'personagens__grid-blip';
      blip.style.left = (8 + Math.random() * 84).toFixed(2) + '%';
      blip.style.top = (6 + Math.random() * 88).toFixed(2) + '%';
      blip.style.animationDelay = (Math.random() * 1.6).toFixed(2) + 's';
      blip.style.animationDuration = (1.3 + Math.random() * 1.0).toFixed(2) + 's';
      wrap.appendChild(blip);
    }
  }

  // Rebuild ao redimensionar (debounce via rAF; só se mudou de forma relevante).
  let raf = 0;
  let lastW = grid.clientWidth;
  let lastH = grid.clientHeight;
  function onResize() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const w = grid.clientWidth;
      const h = grid.clientHeight;
      if (Math.abs(w - lastW) > 24 || Math.abs(h - lastH) > 60) {
        lastW = w;
        lastH = h;
        build();
      }
    });
  }
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(onResize).observe(grid);
  } else {
    window.addEventListener('resize', onResize);
  }

  // Glow acompanha o cursor (coordenadas relativas ao wrapper).
  if (glow && wrap) {
    window.addEventListener(
      'mousemove',
      (e) => {
        const rect = wrap.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        glow.style.opacity = inside ? '1' : '0';
        if (inside) {
          glow.style.setProperty('--mouse-x', e.clientX - rect.left + 'px');
          glow.style.setProperty('--mouse-y', e.clientY - rect.top + 'px');
        }
      },
      { passive: true }
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFloatingNav();
  initHeroScroll();
  initPersonagensParallax();
  initPersonagensGrid();
  initTrailersCarousel();
  initSectionReveals();
  initBatalhaFinalVideoLoop();

  // Recalcula as posições do ScrollTrigger depois que toda a mídia (vídeos,
  // iframes) carrega e muda a altura da página — evita pins do hero em estado
  // errado (ex.: textos sumindo ao voltar pro topo).
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());

    const bgVideo = document.querySelector('.hero__bg-video');
    const sagaVideo = document.querySelector('.saga__video');
    [bgVideo, sagaVideo].forEach((v) => {
      if (v) v.addEventListener('loadedmetadata', () => ScrollTrigger.refresh());
    });
  }
});
