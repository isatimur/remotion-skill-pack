# Available Themes

## book-chapter

Designed for *From Copilot to Colleague* — matches the Excalidraw stripe-press visual language.

```json
{
  "name": "book-chapter",
  "colors": {
    "background": "#0f0f14",
    "surface": "#1a1a24",
    "text": "#f0f0f0",
    "textMuted": "#a0a0b0",
    "accent": "#6ee7b7",
    "accentDim": "#2d9e7a",
    "border": "#2a2a3a",
    "code": "#1e1e2e"
  },
  "typography": {
    "heading": "Inter, system-ui, sans-serif",
    "body": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, Fira Code, monospace"
  },
  "animation": {
    "entryDuration": 15,
    "transitionDuration": 15,
    "springConfig": { "damping": 20, "mass": 1, "stiffness": 180 }
  }
}
```

**Use for**: all ai-engineer-book chapter videos.

---

## minimal-dark

Clean, neutral dark theme. Good for general technical presentations.

```json
{
  "name": "minimal-dark",
  "colors": {
    "background": "#111827",
    "surface": "#1f2937",
    "text": "#e5e7eb",
    "textMuted": "#9ca3af",
    "accent": "#60a5fa",
    "accentDim": "#2563eb",
    "border": "#374151",
    "code": "#0f172a"
  },
  "typography": {
    "heading": "Inter, system-ui, sans-serif",
    "body": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, monospace"
  },
  "animation": {
    "entryDuration": 8,
    "transitionDuration": 8,
    "springConfig": { "damping": 18, "mass": 0.8, "stiffness": 200 }
  }
}
```

**Use for**: general-purpose video presentations.

---

## social

9:16 vertical format — Instagram Reels, TikTok, YouTube Shorts, LinkedIn. High-contrast, kinetic, one idea per scene.

**Composition defaults:** `1080 × 1920 · 30fps`

```json
{
  "name": "social",
  "colors": {
    "background": "#0a0a0f",
    "surface": "#141420",
    "text": "#ffffff",
    "textMuted": "#9ca3af",
    "accent": "#f472b6",
    "accentDim": "#831843",
    "border": "#1f2937",
    "code": "#1e1e2e"
  },
  "typography": {
    "heading": "Inter, system-ui, sans-serif",
    "body": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, Fira Code, monospace"
  },
  "animation": {
    "entryDuration": 8,
    "transitionDuration": 10,
    "springConfig": { "damping": 16, "mass": 0.8, "stiffness": 220 }
  }
}
```

**Scene duration targets:** title/insight 60–90f · evidence/quote 90–120f · concept 120–150f · outro 60f · **total ≤ 900f (30 s)**

**Use for**: Instagram Reels, TikTok clips, YouTube Shorts, LinkedIn carousels. Pair with `insight` + `evidence` + `person` scene types for maximum virality.
