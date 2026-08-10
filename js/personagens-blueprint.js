/**
 * Blueprint gradient mesh — adaptado de 21st.dev para vanilla JS.
 * Grade animada diagonal + célula interativa no hover + film grain.
 */
function initPersonagensBlueprint() {
    var section = document.getElementById("personagens");
    var root = section && section.querySelector(".personagens__blueprint");
    var gridCanvas = root && root.querySelector(".personagens__blueprint-grid");
    var hoverCanvas = root && root.querySelector(".personagens__blueprint-hover");
    var noiseCanvas = root && root.querySelector(".personagens__blueprint-noise");

    if (!section || !root || !gridCanvas || !hoverCanvas || !noiseCanvas) return;

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var config = {
        showGrid: true,
        direction: "diagonal",
        speed: 0.2,
        squareSize: 44,
        borderColor: "rgba(179, 205, 255, 0.28)",
        vignette: true,
        hoverFillColor: "rgba(33, 82, 131, 0.18)",
        hoverStrokeColor: "rgba(172, 193, 255, 0.70)",
        hoverGlowColor: "rgba(122, 162, 255, 0.30)",
        noiseRefresh: 2,
        noiseAlpha: 12
    };

    var gridOffset = { x: 0, y: 0 };
    var hoveredCell = null;
    var gridRaf = 0;
    var hoverRaf = 0;
    var offsetRaf = 0;
    var noiseRaf = 0;

    function cancelAllRaf() {
        if (gridRaf) cancelAnimationFrame(gridRaf);
        if (hoverRaf) cancelAnimationFrame(hoverRaf);
        if (offsetRaf) cancelAnimationFrame(offsetRaf);
        if (noiseRaf) cancelAnimationFrame(noiseRaf);
        gridRaf = hoverRaf = offsetRaf = noiseRaf = 0;
    }

    function setHiDPICanvas(canvas, ctx) {
        var parent = canvas.parentElement;
        var cw = (parent ? parent.clientWidth : window.innerWidth) | 0;
        var ch = (parent ? parent.clientHeight : window.innerHeight) | 0;
        var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

        canvas.width = Math.floor(cw * dpr);
        canvas.height = Math.floor(ch * dpr);
        canvas.style.width = cw + "px";
        canvas.style.height = ch + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function originFromOffset(offset, cell) {
        return {
            x: -((offset.x % cell) + cell) % cell,
            y: -((offset.y % cell) + cell) % cell
        };
    }

    function drawGrid() {
        var ctx = gridCanvas.getContext("2d");
        if (!ctx) return;

        var cw = gridCanvas.clientWidth;
        var ch = gridCanvas.clientHeight;
        var squareSize = config.squareSize;

        ctx.clearRect(0, 0, cw, ch);

        if (config.showGrid) {
            var origin = originFromOffset(gridOffset, squareSize);

            ctx.strokeStyle = config.borderColor;
            ctx.lineWidth = 1;

            for (var x = origin.x; x < cw + squareSize; x += squareSize) {
                ctx.beginPath();
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, ch);
                ctx.stroke();
            }

            for (var y = origin.y; y < ch + squareSize; y += squareSize) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(cw, y + 0.5);
                ctx.stroke();
            }

            if (config.vignette) {
                var grad = ctx.createRadialGradient(
                    cw / 2, ch / 2, 0,
                    cw / 2, ch / 2, Math.sqrt(cw * cw + ch * ch) / 2
                );
                grad.addColorStop(0, "rgba(0,0,0,0)");
                grad.addColorStop(1, "rgba(0,0,0,0.40)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, cw, ch);
            }
        }

        gridRaf = requestAnimationFrame(drawGrid);
    }

    function drawHover() {
        var ctx = hoverCanvas.getContext("2d");
        if (!ctx) return;

        var cw = hoverCanvas.clientWidth;
        var ch = hoverCanvas.clientHeight;
        var squareSize = config.squareSize;

        ctx.clearRect(0, 0, cw, ch);

        if (hoveredCell) {
            var origin = originFromOffset(gridOffset, squareSize);
            var cellX = origin.x + hoveredCell.x * squareSize;
            var cellY = origin.y + hoveredCell.y * squareSize;

            ctx.save();
            ctx.shadowBlur = 14;
            ctx.shadowColor = config.hoverGlowColor;
            ctx.fillStyle = config.hoverFillColor;
            ctx.fillRect(cellX, cellY, squareSize, squareSize);
            ctx.restore();

            ctx.lineWidth = 1;
            ctx.strokeStyle = config.hoverStrokeColor;
            ctx.strokeRect(cellX + 0.5, cellY + 0.5, squareSize - 1, squareSize - 1);

            var highlight = ctx.createLinearGradient(cellX, cellY, cellX, cellY + squareSize);
            highlight.addColorStop(0, "rgba(255,255,255,0.08)");
            highlight.addColorStop(1, "rgba(255,255,255,0.02)");
            ctx.fillStyle = highlight;
            ctx.fillRect(cellX, cellY, squareSize, squareSize);
        }

        hoverRaf = requestAnimationFrame(drawHover);
    }

    function initNoise() {
        var ctx = noiseCanvas.getContext("2d", { alpha: true });
        if (!ctx) return null;

        var frame = 0;
        var size = 1024;

        function resizeNoise() {
            noiseCanvas.width = size;
            noiseCanvas.height = size;
            noiseCanvas.style.width = "100%";
            noiseCanvas.style.height = "100%";
        }

        function drawNoise() {
            var img = ctx.createImageData(size, size);
            var data = img.data;
            for (var i = 0; i < data.length; i += 4) {
                var v = Math.random() * 255;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = config.noiseAlpha;
            }
            ctx.putImageData(img, 0, 0);
        }

        function noiseLoop() {
            if (!prefersReducedMotion && frame % config.noiseRefresh === 0) {
                drawNoise();
            }
            frame++;
            noiseRaf = requestAnimationFrame(noiseLoop);
        }

        resizeNoise();
        drawNoise();
        noiseLoop();

        return resizeNoise;
    }

    function tickOffset() {
        if (!prefersReducedMotion) {
            var v = Math.max(config.speed, 0.1);
            var s = config.squareSize;

            switch (config.direction) {
                case "right":
                    gridOffset.x = (gridOffset.x - v + s) % s;
                    break;
                case "left":
                    gridOffset.x = (gridOffset.x + v + s) % s;
                    break;
                case "up":
                    gridOffset.y = (gridOffset.y + v + s) % s;
                    break;
                case "down":
                    gridOffset.y = (gridOffset.y - v + s) % s;
                    break;
                case "diagonal":
                default:
                    gridOffset.x = (gridOffset.x - v + s) % s;
                    gridOffset.y = (gridOffset.y - v + s) % s;
                    break;
            }
        }

        offsetRaf = requestAnimationFrame(tickOffset);
    }

    function onPointerMove(event) {
        var rect = section.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) {
            hoveredCell = null;
            return;
        }

        var origin = originFromOffset(gridOffset, config.squareSize);
        hoveredCell = {
            x: Math.floor((mouseX - origin.x) / config.squareSize),
            y: Math.floor((mouseY - origin.y) / config.squareSize)
        };
    }

    function onPointerLeave() {
        hoveredCell = null;
    }

    function resizeCanvases() {
        var gridCtx = gridCanvas.getContext("2d");
        var hoverCtx = hoverCanvas.getContext("2d");
        if (gridCtx) setHiDPICanvas(gridCanvas, gridCtx);
        if (hoverCtx) setHiDPICanvas(hoverCanvas, hoverCtx);
    }

    var resizeNoise = initNoise();

    resizeCanvases();
    drawGrid();
    drawHover();
    tickOffset();

    section.addEventListener("mousemove", onPointerMove, { passive: true });
    section.addEventListener("mouseleave", onPointerLeave, { passive: true });

    window.addEventListener("resize", function () {
        resizeCanvases();
        if (resizeNoise) resizeNoise();
    }, { passive: true });

    return function destroy() {
        cancelAllRaf();
        section.removeEventListener("mousemove", onPointerMove);
        section.removeEventListener("mouseleave", onPointerLeave);
    };
}
