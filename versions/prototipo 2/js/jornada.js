/* ============================================================================
   A JORNADA EM NAMEKUSEI — scroll horizontal (exclusivo do index-v2.html)
   ----------------------------------------------------------------------------
   - Desktop + movimento permitido: a viewport "trava" (pin do ScrollTrigger) e
     o trilho corre no eixo X conforme a página rola (scrub).
   - Mobile / prefers-reduced-motion / sem GSAP: nada disso roda e o CSS deixa a
     seção empilhada na vertical (legível e acessível).
   - Não depende de css/styles.css nem de js/script.js além dos tokens globais.
   ============================================================================ */
(function () {
  'use strict';

  /* Loop "vai-e-volta" do vídeo da Batalha Final (porte do comportamento da
     saga original, agora mirando .jornada__video). */
  function initJornadaVideo() {
    var video = document.querySelector('.jornada__video');
    if (!video) return;

    video.loop = false;
    video.muted = true;

    var rafId = null;
    var lastTs = null;
    var active = false;

    function stopReverse() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      lastTs = null;
    }

    function playForward() {
      stopReverse();
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    function reverseStep(ts) {
      if (!active) return;
      if (lastTs == null) lastTs = ts;
      var dt = (ts - lastTs) / 1000;
      lastTs = ts;

      var next = video.currentTime - dt;
      if (next <= 0) {
        video.currentTime = 0;
        stopReverse();
        playForward();
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

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
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

  /* Pin + trilho horizontal. */
  function initJornadaHorizontal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var section = document.getElementById('saga');
    if (!section || !section.classList.contains('jornada')) return;

    var viewport = section.querySelector('.jornada__viewport');
    var track = section.querySelector('.jornada__track');
    var panels = gsap.utils.toArray('.jornada__panel', track);
    var fill = section.querySelector('.jornada__progress-fill');
    var counter = section.querySelector('[data-counter]');

    if (!viewport || !track || panels.length === 0) return;

    var mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', function () {
      section.classList.add('is-horizontal');

      var distance = function () {
        return Math.max(0, track.scrollWidth - viewport.clientWidth);
      };

      // Tween principal: translada o trilho de 0 até -distance.
      var tween = gsap.to(track, { x: function () { return -distance(); }, ease: 'none' });

      // Bounds dos painéis (para descobrir o capítulo ativo). Recalcula no refresh.
      var bounds = [];
      var measure = function () {
        bounds = panels.map(function (p) {
          return { left: p.offsetLeft, width: p.offsetWidth, chapter: p.dataset.chapter };
        });
      };
      measure();
      ScrollTrigger.addEventListener('refreshInit', measure);

      var lastChapter = null;
      var setCounter = function (progress) {
        if (!counter || bounds.length === 0) return;
        var center = progress * distance() + viewport.clientWidth / 2;
        var idx = bounds.findIndex(function (b) {
          return center >= b.left && center < b.left + b.width;
        });
        if (idx < 0) idx = center <= bounds[0].left ? 0 : bounds.length - 1;
        var ch = bounds[idx].chapter || '1';
        if (ch !== lastChapter) {
          lastChapter = ch;
          counter.textContent = ('0' + ch).slice(-2);
          counter.classList.remove('is-pulse');
          // reinicia a animação de "pop"
          void counter.offsetWidth;
          counter.classList.add('is-pulse');
        }
      };

      var st = ScrollTrigger.create({
        animation: tween,
        trigger: viewport,
        start: 'top top',
        end: function () { return '+=' + distance(); },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (fill) fill.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
          setCounter(self.progress);
        },
      });

      var chapters = gsap.utils.toArray('.jornada__chapter', track);

      // Parallax dos numerais gigantes (profundidade) + revelação por capítulo.
      chapters.forEach(function (ch) {
        var num = ch.querySelector('.jornada__num');
        if (num) {
          gsap.fromTo(
            num,
            { xPercent: 16 },
            {
              xPercent: -16,
              ease: 'none',
              scrollTrigger: {
                trigger: ch,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }

        ScrollTrigger.create({
          trigger: ch,
          containerAnimation: tween,
          start: 'left 78%',
          onEnter: function () { ch.classList.add('is-inview'); },
          onEnterBack: function () { ch.classList.add('is-inview'); },
        });
      });

      // Abertura: revela ao chegar na seção.
      var intro = section.querySelector('.jornada__intro');
      if (intro) {
        gsap.from(intro.children, {
          y: 30,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });
      }

      // Limpeza ao sair do match (resize < 768 / reduced-motion ligado).
      return function () {
        ScrollTrigger.removeEventListener('refreshInit', measure);
        section.classList.remove('is-horizontal');
        chapters.forEach(function (c) { c.classList.remove('is-inview'); });
        if (fill) fill.style.transform = '';
        if (counter) {
          counter.classList.remove('is-pulse');
          lastChapter = null;
        }
        gsap.set(track, { clearProps: 'transform' });
        // tween/ScrollTriggers criados neste contexto são revertidos pelo matchMedia
      };
    });
  }

  function boot() {
    initJornadaVideo();
    initJornadaHorizontal();

    // Recalcula posições depois que toda a mídia carrega e muda a altura/largura.
    if (typeof ScrollTrigger !== 'undefined') {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      var video = document.querySelector('.jornada__video');
      if (video) {
        video.addEventListener('loadedmetadata', function () { ScrollTrigger.refresh(); });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
