function initFloatingNav() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;

    const hero = document.getElementById('hero');
    const links = nav.querySelectorAll('.floating-nav__link');
    const sectionOrder = ['hero', 'personagens', 'saga', 'trailers'];

    function getScrollThreshold() {
        if (hero && hero.offsetHeight > 0) {
            return hero.offsetHeight * 0.6;
        }
        if (window.innerHeight > 0) {
            return window.innerHeight * 0.6;
        }
        return 300;
    }

    function updateVisibility() {
        if (window.scrollY >= getScrollThreshold()) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
    }

    function setActiveSection(sectionId) {
        links.forEach(function (link) {
            link.classList.toggle(
                'floating-nav__link--active',
                link.dataset.section === sectionId
            );
        });
    }

    const sections = sectionOrder
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    if (sections.length) {
        const observer = new IntersectionObserver(
            function (entries) {
                const visible = entries.filter(function (entry) {
                    return entry.isIntersecting;
                });
                if (!visible.length) return;

                const best = visible.reduce(function (prev, curr) {
                    return curr.intersectionRatio > prev.intersectionRatio ? curr : prev;
                });

                setActiveSection(best.target.id);
            },
            {
                rootMargin: '-40% 0px -40% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1]
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    nav.addEventListener('click', function (event) {
        const link = event.target.closest('.floating-nav__link');
        if (!link) return;

        event.preventDefault();

        const target = document.getElementById(link.dataset.section);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
    updateVisibility();
}

/* ── Personagens: fundo blueprint (grade + hover + noise) e radar ── */

function initPersonagensBackground() {
    const section = document.getElementById('personagens');
    const gridContainer = document.getElementById('personagens-grid');
    const particlesBg = section
        ? section.querySelector('.personagens__particles-bg')
        : null;
    if (!section || !gridContainer || !particlesBg) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function token(name) {
        return rootStyles.getPropertyValue(name).trim();
    }

    function withAlpha(color, alpha) {
        if (color.charAt(0) === '#') {
            const value = parseInt(color.slice(1), 16);
            const r = (value >> 16) & 255;
            const g = (value >> 8) & 255;
            const b = value & 255;
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }
        return color.replace(/rgba?\(([^)]+)\)/, function (match, channels) {
            const rgb = channels.split(',').slice(0, 3).join(',');
            return 'rgba(' + rgb + ', ' + alpha + ')';
        });
    }

    const colors = {
        lineBase: token('--border-subtle'),
        blip: token('--cosmic-rose'),
        accent: token('--cosmic-cyan'),
        highlight: token('--text-primary'),
        deep: token('--bg-deep')
    };

    function createCanvas(className) {
        const canvas = document.createElement('canvas');
        canvas.className = className;
        gridContainer.appendChild(canvas);
        return canvas;
    }

    const gridCanvas = createCanvas('personagens__grid-canvas');
    const noiseCanvas = createCanvas('personagens__noise-canvas');
    const hoverCanvas = createCanvas('personagens__hover-canvas');
    const gridCtx = gridCanvas.getContext('2d');
    const hoverCtx = hoverCanvas.getContext('2d');

    const radar = document.createElement('div');
    radar.className = 'personagens__radar';
    radar.setAttribute('aria-hidden', 'true');
    radar.innerHTML =
        '<span class="personagens__radar-ring"></span>' +
        '<span class="personagens__radar-core"></span>' +
        '<span class="personagens__radar-sweep"></span>';
    particlesBg.appendChild(radar);

    const BLIPS = [
        { x: 0.22, y: 0.48 },
        { x: 0.09, y: 0.2 },
        { x: 0.38, y: 0.82 },
        { x: 0.57, y: 0.12 },
        { x: 0.71, y: 0.55 },
        { x: 0.86, y: 0.3 },
        { x: 0.93, y: 0.88 }
    ];

    const offset = { x: 0, y: 0 };
    const hovered = { active: false, x: 0, y: 0 };
    let rafId = 0;
    let running = false;

    function cellSize() {
        return mobileQuery.matches ? 60 : 44;
    }

    function speed() {
        return reducedMotionQuery.matches ? 0 : 0.2;
    }

    function gridOrigin(cell) {
        return {
            x: -(((offset.x % cell) + cell) % cell),
            y: -(((offset.y % cell) + cell) % cell)
        };
    }

    function resizeCanvas(canvas, ctx) {
        const width = gridContainer.clientWidth;
        const height = gridContainer.clientHeight;
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function paintNoise() {
        const ctx = noiseCanvas.getContext('2d');
        const SIZE = 512;
        noiseCanvas.width = SIZE;
        noiseCanvas.height = SIZE;
        const image = ctx.createImageData(SIZE, SIZE);
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 10;
        }
        ctx.putImageData(image, 0, 0);
    }

    function drawGrid(time) {
        const width = gridContainer.clientWidth;
        const height = gridContainer.clientHeight;
        const cell = cellSize();
        const origin = gridOrigin(cell);

        gridCtx.clearRect(0, 0, width, height);
        gridCtx.lineWidth = 1;
        gridCtx.strokeStyle = colors.lineBase;

        for (let x = origin.x; x < width + cell; x += cell) {
            gridCtx.beginPath();
            gridCtx.moveTo(x + 0.5, 0);
            gridCtx.lineTo(x + 0.5, height);
            gridCtx.stroke();
        }
        for (let y = origin.y; y < height + cell; y += cell) {
            gridCtx.beginPath();
            gridCtx.moveTo(0, y + 0.5);
            gridCtx.lineTo(width, y + 0.5);
            gridCtx.stroke();
        }

        BLIPS.forEach(function (blip, index) {
            const pulse = reducedMotionQuery.matches
                ? 0.7
                : 0.45 + 0.4 * Math.sin(time / 700 + index * 2.4);
            gridCtx.save();
            gridCtx.shadowBlur = 10;
            gridCtx.shadowColor = colors.blip;
            gridCtx.fillStyle = withAlpha(colors.blip, Math.max(0.15, pulse));
            gridCtx.beginPath();
            gridCtx.arc(blip.x * width, blip.y * height, 2.5, 0, Math.PI * 2);
            gridCtx.fill();
            gridCtx.restore();
        });

        const vignette = gridCtx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.sqrt(width * width + height * height) / 2
        );
        vignette.addColorStop(0, withAlpha(colors.deep, 0));
        vignette.addColorStop(1, withAlpha(colors.deep, 0.4));
        gridCtx.fillStyle = vignette;
        gridCtx.fillRect(0, 0, width, height);

        const bottomFade = gridCtx.createLinearGradient(0, height * 0.72, 0, height);
        bottomFade.addColorStop(0, withAlpha(colors.deep, 0));
        bottomFade.addColorStop(1, withAlpha(colors.deep, 0.92));
        gridCtx.fillStyle = bottomFade;
        gridCtx.fillRect(0, 0, width, height);
    }

    function drawHover() {
        const width = gridContainer.clientWidth;
        const height = gridContainer.clientHeight;
        hoverCtx.clearRect(0, 0, width, height);

        if (!hovered.active) return;

        const cell = cellSize();
        const origin = gridOrigin(cell);
        const cellX = origin.x + hovered.x * cell;
        const cellY = origin.y + hovered.y * cell;

        hoverCtx.save();
        hoverCtx.shadowBlur = 14;
        hoverCtx.shadowColor = withAlpha(colors.accent, 0.3);
        hoverCtx.fillStyle = withAlpha(colors.accent, 0.16);
        hoverCtx.fillRect(cellX, cellY, cell, cell);
        hoverCtx.restore();

        hoverCtx.lineWidth = 1;
        hoverCtx.strokeStyle = withAlpha(colors.accent, 0.6);
        hoverCtx.strokeRect(cellX + 0.5, cellY + 0.5, cell - 1, cell - 1);

        const shine = hoverCtx.createLinearGradient(cellX, cellY, cellX, cellY + cell);
        shine.addColorStop(0, withAlpha(colors.highlight, 0.07));
        shine.addColorStop(1, withAlpha(colors.highlight, 0.02));
        hoverCtx.fillStyle = shine;
        hoverCtx.fillRect(cellX, cellY, cell, cell);
    }

    function frame(time) {
        const v = speed();
        if (v) {
            const cell = cellSize();
            offset.x = (offset.x - v + cell) % cell;
            offset.y = (offset.y - v + cell) % cell;
        }
        drawGrid(time);
        drawHover();
        rafId = requestAnimationFrame(frame);
    }

    function start() {
        if (running) return;
        running = true;
        rafId = requestAnimationFrame(frame);
    }

    function stop() {
        if (!running) return;
        running = false;
        cancelAnimationFrame(rafId);
    }

    function resizeAll() {
        resizeCanvas(gridCanvas, gridCtx);
        resizeCanvas(hoverCanvas, hoverCtx);
    }

    section.addEventListener('mousemove', function (event) {
        if (!hoverQuery.matches) return;
        const rect = gridContainer.getBoundingClientRect();
        const cell = cellSize();
        const origin = gridOrigin(cell);
        hovered.active = true;
        hovered.x = Math.floor((event.clientX - rect.left - origin.x) / cell);
        hovered.y = Math.floor((event.clientY - rect.top - origin.y) / cell);
    });

    section.addEventListener('mouseleave', function () {
        hovered.active = false;
    });

    const visibility = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                start();
            } else {
                stop();
            }
        });
    }, { rootMargin: '100px' });
    visibility.observe(section);

    window.addEventListener('resize', function () {
        resizeAll();
        drawGrid(0);
        drawHover();
    }, { passive: true });

    resizeAll();
    paintNoise();
    drawGrid(0);
    drawHover();
}

document.addEventListener('DOMContentLoaded', function () {
    initFloatingNav();
    initPersonagensBackground();
});
