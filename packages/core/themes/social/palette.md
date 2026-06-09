# social — Theme Palette

Designed for short-form vertical video (Instagram Reels, TikTok, YouTube Shorts, LinkedIn).

**Format**: 1080 × 1920 · 30fps · 15–30 second clips

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0a0a0f` | Near-black canvas |
| `surface` | `#141420` | Card / panel backgrounds |
| `text` | `#ffffff` | Primary text |
| `textMuted` | `#9ca3af` | Labels, captions |
| `accent` | `#f472b6` | Hot pink — hero numbers, highlights, CTAs |
| `accentDim` | `#831843` | Accent at lower brightness |
| `border` | `#1f2937` | Subtle dividers |
| `code` | `#1e1e2e` | Code block background |

## Typography

- **Heading / body**: Inter — bold weights (700–900) for impact
- **Mono**: JetBrains Mono

## Animation

- `entryDuration`: 8 frames (very fast entry — social content moves quickly)
- `springConfig`: tight spring `{ damping: 16, mass: 0.8, stiffness: 220 }` — snappy, not bouncy
- `transitionDuration`: 10 frames between scenes

## Composition Defaults

```json
{
  "meta": { "fps": 30, "width": 1080, "height": 1920 },
  "globalTheme": "social"
}
```

## Scene Duration Guidelines (social format)

| Scene type | Frames | Seconds |
|------------|--------|---------|
| `title` / `insight` | 60–90f | 2–3s |
| `evidence` / `quote` | 90–120f | 3–4s |
| `concept` (3 bullets) | 120–150f | 4–5s |
| `person` | 120–180f | 4–6s |
| `contrast` / `narrative` | 150–180f | 5–6s |
| `outro` | 60–90f | 2–3s |

**Target total**: 450–900f (15–30s for Reels/Shorts)
