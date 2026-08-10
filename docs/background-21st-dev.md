You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
data-grid-hero.tsx
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * A generative hero component with animated grid background.
 *
 * Props:
 * - rows: number of rows
 * - cols: number of columns
 * - spacing: gap between cells (px)
 * - duration: animation duration (s)
 * - color: cell color (CSS string)
 * - animationType: "pulse" | "wave" | "random"
 * - pulseEffect: enable pulse animation
 * - mouseGlow: enable mouse-follow glow
 * - opacityMin: minimum opacity
 * - opacityMax: maximum opacity
 * - background: container background (CSS string)
 */
export default function DataGridHero({
  rows,
  cols,
  spacing,
  duration,
  color,
  animationType,
  pulseEffect,
  mouseGlow,
  opacityMin,
  opacityMax,
  background,
  children,
}) {
  const gridRef = useRef(null);

  // Build grid cells on cfg change
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gap = `${spacing}px`;
    container.style.setProperty("--mouse-glow-opacity", mouseGlow ? 1 : 0);

    const total = rows * cols;
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    for (let i = 0; i < total; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.backgroundColor = color;
      cell.style.setProperty("--opacity-min", opacityMin);
      cell.style.setProperty("--opacity-max", opacityMax);

      if (pulseEffect) {
        let delay;
        const r = Math.floor(i / cols);
        const c = i % cols;

        if (animationType === "wave") {
          delay = (r + c) * 0.1;
        } else if (animationType === "random") {
          delay = Math.random() * duration;
        } else {
          const dr = Math.abs(r - centerRow);
          const dc = Math.abs(c - centerCol);
          delay = Math.sqrt(dr * dr + dc * dc) * 0.2;
        }

        cell.style.animation = `cell-pulse ${duration}s infinite alternate`;
        cell.style.animationDelay = `${delay.toFixed(3)}s`;
      }

      container.appendChild(cell);
    }
  }, [
    rows,
    cols,
    spacing,
    color,
    animationType,
    pulseEffect,
    duration,
    opacityMin,
    opacityMax,
    mouseGlow,
  ]);

  // Mouse-follow glow
  useEffect(() => {
    if (!mouseGlow || !gridRef.current) return;
    const handler = (e) => {
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gridRef.current.style.setProperty("--mouse-x", `${x}px`);
      gridRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseGlow]);

  return (
    <div className="data-grid-hero" style={{ background }}>
      <div
        ref={gridRef}
        className="grid-container"
        aria-hidden="true"
      />
      <div
        className="hero-content"
        role="region"
        aria-label="Hero Content"
      >
        {children}
      </div>
    </div>
  );
}

DataGridHero.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  spacing: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  animationType: PropTypes.oneOf(["pulse", "wave", "random"])
    .isRequired,
  pulseEffect: PropTypes.bool.isRequired,
  mouseGlow: PropTypes.bool.isRequired,
  opacityMin: PropTypes.number.isRequired,
  opacityMax: PropTypes.number.isRequired,
  background: PropTypes.string.isRequired,
  children: PropTypes.node,
};


demo.tsx
import React, { useState, useEffect, useCallback } from "react";
import DataGridHero from "@/components/ui/data-grid-hero";

export default function DemoOne() {
  const [cfg, setCfg] = useState({
    rows: 25,
    cols: 35,
    spacing: 4,
    duration: 5.0,
    color: "hsl(var(--green))",
    animationType: "pulse",
    pulseEffect: true,
    mouseGlow: true,
    opacityMin: 0.05,
    opacityMax: 0.6,
    background: "hsl(var(--background))",
  });
  const [panelOpen, setPanelOpen] = useState(false);

  const randomize = useCallback(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    const colors = [
      "hsl(var(--green))",
      "hsl(var(--pink))",
      "hsl(var(--cyan))",
      "hsl(var(--yellow))",
      "hsl(var(--orange))",
    ];
    const anims = ["pulse", "wave", "random"];
    setCfg((c) => ({
      ...c,
      rows: Math.floor(rand(15, 40)),
      cols: Math.floor(rand(15, 40)),
      duration: rand(3, 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      animationType: anims[Math.floor(Math.random() * anims.length)],
      pulseEffect: Math.random() > 0.2,
      mouseGlow: Math.random() > 0.3,
      opacityMin: rand(0.05, 0.2),
      opacityMax: rand(0.5, 1.0),
      spacing: Math.floor(rand(2, 8)),
    }));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName.toLowerCase() === "input") return;
      const k = e.key.toLowerCase();
      if (k === "h") setPanelOpen((v) => !v);
      if (k === "r") randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [randomize]);

  return (
    <DataGridHero {...cfg}>
      <h1>DataGrid Hero</h1>
      <p>
        A generative, interactive hero component built with React. Customize
        the grid animation using the control panel.
      </p>
      <div className="buttons">
        <button className="button">Get Started</button>
        <button
          className="button-outline"
          onClick={() => setPanelOpen(true)}
        >
          Controls (H)
        </button>
      </div>

      {panelOpen && (
        <ControlPanel
          cfg={cfg}
          setCfg={setCfg}
          onClose={() => setPanelOpen(false)}
          onRandomize={randomize}
        />
      )}
    </DataGridHero>
  );
}

// -- Control Panel & Helpers --

function ControlPanel({ cfg, setCfg, onClose, onRandomize }) {
  return (
    <aside className="control-panel">
      <h3>Grid Controls</h3>
      <Slider
        label="Rows"
        min={5}
        max={50}
        step={1}
        value={cfg.rows}
        onChange={(v) => setCfg({ ...cfg, rows: v })}
      />
      <Slider
        label="Columns"
        min={5}
        max={50}
        step={1}
        value={cfg.cols}
        onChange={(v) => setCfg({ ...cfg, cols: v })}
      />
      <Slider
        label="Spacing"
        min={0}
        max={16}
        step={1}
        value={cfg.spacing}
        onChange={(v) => setCfg({ ...cfg, spacing: v })}
      />
      <Slider
        label="Duration"
        min={1}
        max={15}
        step={0.1}
        value={cfg.duration}
        onChange={(v) => setCfg({ ...cfg, duration: v })}
      />
      <Select
        label="Animation Type"
        value={cfg.animationType}
        options={[
          { label: "Pulse from Center", value: "pulse" },
          { label: "Wave", value: "wave" },
          { label: "Random", value: "random" },
        ]}
        onChange={(v) => setCfg({ ...cfg, animationType: v })}
      />
      <Toggle
        label="Pulse Effect"
        value={cfg.pulseEffect}
        onChange={(v) => setCfg({ ...cfg, pulseEffect: v })}
      />
      <Toggle
        label="Mouse Glow"
        value={cfg.mouseGlow}
        onChange={(v) => setCfg({ ...cfg, mouseGlow: v })}
      />
      <Slider
        label="Opacity Min"
        min={0}
        max={1}
        step={0.05}
        value={cfg.opacityMin}
        onChange={(v) => setCfg({ ...cfg, opacityMin: v })}
      />
      <Slider
        label="Opacity Max"
        min={0}
        max={1}
        step={0.05}
        value={cfg.opacityMax}
        onChange={(v) => setCfg({ ...cfg, opacityMax: v })}
      />
      <div className="panel-buttons">
        <button onClick={onRandomize}>Randomize (R)</button>
        <button onClick={onClose}>Close (H)</button>
      </div>
    </aside>
  );
}

function Slider({ label, min, max, step, value, onChange }) {
  return (
    <label className="panel-control">
      <div className="label-row">
        <span>{label}</span>
        <span className="value">{Number(value).toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="panel-control toggle-control">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
      >
        <span />
      </button>
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="panel-control">
      <div className="label-row">{label}</div>
      <div className="select-wrapper">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </label>
  );
}

```

Install NPM dependencies:
```bash
prop-types
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --background: 220, 20%, 10%;
  --foreground: 0, 0%, 100%;
  --foreground-muted: 0, 0%, 80%;
  --green: 150, 100%, 50%;
  --pink: 300, 100%, 70%;
  --cyan: 180, 100%, 60%;
  --yellow: 50, 100%, 60%;
  --orange: 25, 100%, 60%;
  --font-7xl: 4.5rem;
  --font-lg: 1.125rem;
  --font-bold: 800;
  --shadow-md: 0 0 20px rgba(0, 0, 0, 0.5);
}


@keyframes cell-pulse {
  from {
    opacity: var(--opacity-min);
  }
  to {
    opacity: var(--opacity-max);
  }
}
```
