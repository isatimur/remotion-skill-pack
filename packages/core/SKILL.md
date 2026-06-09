---
name: remotion-video-composer
description: Make your AI agent produce structured Remotion video compositions — scene-by-scene JSON specs that render to production-ready animated video.
---

# Remotion Video Composer

You produce animated video presentations using [Remotion](https://www.remotion.dev/) — a framework that renders React components to video. You author a **composition spec** (JSON) that the `@remotion-skill-pack/render` CLI converts to a working Remotion TSX project with `@remotion/transitions` between every scene.

## Output Contract

Every session delivers:
1. **`<slug>/composition.json`** — validated against `composition.schema.json`
2. Optionally invoke the render CLI to generate the TSX scaffold

Slug: kebab-case topic name (e.g. `chapter-01-the-shift`, `daily-insight-taste-vs-compute`).

---

## Composition Spec — Top Level

```json
{
  "meta": {
    "title": "Chapter 1 — The Shift",
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "slug": "chapter-01-the-shift"
  },
  "globalTheme": "book-chapter",
  "scenes": [ ... ]
}
```

**Formats:**
- **Landscape** `1920 × 1080` — book chapters, long-form presentations
- **Social / vertical** `1080 × 1920` — Instagram Reels, TikTok, YouTube Shorts (use `social` theme)

---

## Scene Anatomy

```json
{
  "id": "s2-insight",
  "type": "insight",
  "durationFrames": 150,
  "transitionIn": "slide",
  "props": { "claim": "The bottleneck has shifted from compute to taste.", "category": "Key Insight" }
}
```

- **`id`**: unique kebab-case within the composition
- **`type`**: one of 14 scene types (see below)
- **`durationFrames`**: integer frames at 30fps
- **`transitionIn`** *(optional)*: `"fade"` | `"slide"` | `"wipe"` | `"flip"` | `"none"` — applied via `@remotion/transitions` before this scene. Default: `"fade"`. First scene has no transition.
- **`props`**: type-specific fields

---

## Scene Types

### Original 8 — presentation / chapter format

#### `title` — Chapter/section opener
```json
{ "headline": "The Shift", "subhead": "Chapter 1", "eyebrow": "From Copilot to Colleague" }
```

#### `concept` — Key idea with bullet points (max 4 bullets)
```json
{ "heading": "Three AI Relationships", "bullets": ["Assistant", "Copilot", "Delegate"], "note": "" }
```

#### `diagram` — Show an Excalidraw PNG
```json
{ "heading": "The Delegation Stack", "imagePath": "diagrams/inline/delegation-stack.png", "caption": "Three layers", "imagePosition": "center" }
```

#### `quote` — Pull quote with attribution
```json
{ "text": "The bottleneck has shifted from compute to taste.", "attribution": "Chapter 2", "context": "On human judgment" }
```

#### `code` — Code block
```json
{ "heading": "The Eval Loop", "language": "python", "code": "result = agent.run(prompt)\nassert result.score > 0.8", "caption": "Deterministic gate" }
```

#### `stats` — Key numbers grid
```json
{ "heading": "Evidence", "stats": [{ "value": "741", "label": "Videos ingested" }, { "value": "97%", "label": "High confidence" }] }
```

#### `transition` — Animated section break (accent line sweep)
```json
{ "label": "Part 2 — The Solution", "accent": true }
```

#### `outro` — Closing card
```json
{ "headline": "What endures is judgment.", "callToAction": "fromcopilottocolleague.com", "subline": "Read the full chapter" }
```

---

### New 6 (v0.2) — Knowledge Video + Social formats

#### `insight` — One non-obvious claim, full-screen kinetic typography
```json
{
  "claim": "The bottleneck has shifted from compute to taste.",
  "category": "Key Insight",
  "source": "Chapter 2"
}
```
*Use for*: the single most shareable moment in the video. Spring-scaled large text (72px, weight 800). Best scene type for social virality.

#### `evidence` — Giant stat that pops in with spring physics
```json
{
  "value": "87%",
  "label": "of developers now use AI tools weekly",
  "source": "Stack Overflow Survey 2024",
  "context": "Up from 44% the previous year"
}
```
*Use for*: credibility anchors. The value renders at 128px with a spring scale-in (0.8→1.0).

#### `person` — Headshot + name + title + pull quote
```json
{
  "name": "Geoffrey Hinton",
  "title": "Godfather of Deep Learning",
  "quote": "The model learns by gradient descent, but what it learns surprises us.",
  "imagePath": "assets/hinton.jpg"
}
```
*Use for*: expert attribution, thought leadership. Avatar circle springs in, text fades with staggered delay. `imagePath` optional — renders a placeholder circle if omitted.

#### `contrast` — Before vs After (or A vs B)
```json
{
  "heading": "Before vs. After",
  "left": { "label": "Before", "points": ["Manual review cycles", "4-hour loop", "50% coverage"] },
  "right": { "label": "After", "points": ["Automated evals", "15-minute loop", "99% coverage"] }
}
```
*Use for*: impact demonstrations. Gradient divider line sweeps in; left side enters from left, right from right. Right side uses accent color label.

#### `framework` — 2×2 matrix with staggered quadrant pop-in
```json
{
  "heading": "The Context-Autonomy Matrix",
  "quadrants": {
    "topLeft":    { "label": "Copilot",   "desc": "High context, low autonomy" },
    "topRight":   { "label": "Delegate",  "desc": "High context, high autonomy" },
    "bottomLeft": { "label": "Tool",      "desc": "Low context, low autonomy" },
    "bottomRight":{ "label": "Autopilot", "desc": "Low context, high autonomy" }
  },
  "xAxis": "Autonomy",
  "yAxis": "Context"
}
```
*Use for*: conceptual frameworks, positioning maps. Quadrants spring in one-by-one with scale animation.

#### `narrative` — Flowing prose revealed line-by-line
```json
{
  "text": "This is the central paradox of AI engineering: the more capable the model, the harder it becomes to know when to trust it.",
  "highlight": "central paradox"
}
```
*Use for*: philosophical statements, strong prose. Each line of 7 words fades + slides up in sequence. `highlight` word(s) render in accent color.

---

## Timing Rules

| Duration | Frames | Scene types |
|----------|--------|-------------|
| 2 s | 60 f | `transition`, social `outro` |
| 3 s | 90 f | Social `title`, `insight`, `evidence`, `quote` |
| 4 s | 120 f | `title`, `person`, `concept` (social) |
| 5 s | 150 f | `insight`, `evidence`, `quote`, `concept` (landscape) |
| 6 s | 180 f | `person`, `contrast` (social) |
| 8 s | 240 f | `diagram`, `contrast`, `narrative`, `code` |
| 10 s | 300 f | `framework`, `code` with many lines |

**Landscape target**: 5400–9000 f (3–5 min). **Social target**: 450–900 f (15–30 s).

- Start every composition with `title` or `insight`
- End with `outro`
- Use `transition` scene (not `transitionIn`) for major section breaks within landscape videos
- **Never exceed 9000 f** — renders balloon past 30 min

---

## Transition Guidelines

`transitionIn` on each scene (except the first) controls the `@remotion/transitions` presentation:

| Value | Effect | Best after |
|-------|--------|------------|
| `"fade"` | Spring cross-fade (default) | Any scene |
| `"slide"` | Slide from right | After `transition` scene, `insight` → `evidence` |
| `"wipe"` | Wipe from right | After `stats`, `evidence` |
| `"flip"` | Page flip | Between major sections |
| `"none"` | Hard cut | Never use unless intentional |

**Rule**: vary transitions — don't use the same one for every scene pair.

---

## Structure for Book Chapter Videos (landscape, ~4 min)

```
s1  title        120f   — chapter number + headline
s2  insight      150f   — core non-obvious claim           transitionIn: "fade"
s3  transition    60f   — "The Problem"
s4  diagram      240f   — chapter opener diagram
s5  concept      180f   — first key idea
s6  quote        150f   — strongest pull quote             transitionIn: "slide"
s7  evidence     150f   — key stat                         transitionIn: "wipe"
s8  contrast     240f   — before/after if applicable       transitionIn: "fade"
s9  framework    300f   — conceptual model if applicable
s10 transition    60f   — "What to Do"
s11 concept      150f   — 3 actionable takeaways
s12 outro        150f   — CTA to full chapter              transitionIn: "fade"
```

---

## Structure for Social Clips (vertical 1080×1920, 15–30 s)

One idea per clip. Keep it to 4–5 scenes max:

```
s1  title / insight   60–90f   — hook, < 3 seconds
s2  evidence          90f      — the proof               transitionIn: "slide"
s3  contrast / person 120f     — the implication         transitionIn: "fade"
s4  outro             60f      — follow CTA              transitionIn: "fade"
```

---

## Viral Patterns (what makes videos get shared)

1. **Spring physics everywhere** — use `transitionIn` on every scene. Linear interpolation reads as slideware; spring reads as premium.
2. **One idea per scene** — viewers rewatch to catch what they missed. Never put two claims in one scene.
3. **The `insight` scene as the hook** — lead with the non-obvious claim, not the context. Curiosity gap drives replays.
4. **`evidence` right after `insight`** — the claim → proof sequence is the most shared format on LinkedIn and Instagram.
5. **`person` scenes build authority** — a named expert's face + quote increases share rate.
6. **Vary scene duration** — robotic equal durations signal template. Let important scenes breathe (240f+).
7. **Dark background + single accent** — `book-chapter` (teal) and `social` (pink) are pre-tuned for this.

---

## Theme Contract

| Theme | Background | Accent | Format | Use for |
|-------|-----------|--------|--------|---------|
| `book-chapter` | `#0f0f14` | `#6ee7b7` teal | 1920×1080 | ai-engineer-book chapters |
| `minimal-dark` | `#111827` | `#60a5fa` blue | 1920×1080 | General presentations |
| `social` | `#0a0a0f` | `#f472b6` pink | 1080×1920 | Instagram / TikTok / Shorts |

Always declare `globalTheme`. Never hardcode colors in `props`.

---

## Common Mistakes

- **Too many bullets** — max 4 per `concept`. Split into two scenes.
- **`insight` claim > 15 words** — it loses impact. Cut ruthlessly.
- **Same `transitionIn` on every scene** — feels robotic.
- **`imagePath` as absolute path** — always relative to project root.
- **Social clip > 900 frames** — Reels skip after 30 s; keep it short.
- **`framework` with no heading** — the heading anchors the 2×2; it's required.
- **Total frames > 9000** — renders take 30+ min.

---

## Asset References (ai-engineer-book)

Chapter opener diagrams:
```
diagrams/05-chapter1-the-shift.png        diagrams/10-chapter6-runtimes.png
diagrams/06-chapter2-taste.png            diagrams/11-chapter7-security.png
diagrams/07-chapter3-harnesses.png        diagrams/12-chapter8-realtime.png
diagrams/08-chapter4-evals.png            diagrams/13-chapter9-ai-native-org.png
diagrams/09-chapter5-context.png          diagrams/14-chapter10-what-endures.png
```

Concept + inline diagrams in `diagrams/concepts/` and `diagrams/inline/`.

---

## Render

```bash
# Generate TSX scaffold (requires @remotion/transitions installed in project)
npx @remotion-skill-pack/render chapter-01/composition.json -o chapter-01/

# Generate TSX + render to MP4 (requires Chrome)
npx @remotion-skill-pack/render composition.json -o out/ --render

# Social vertical format
npx @remotion-skill-pack/render reel.json -o reel/ --theme social
```

Generated files: `Scene.tsx`, `Root.tsx`, `entry.tsx`. The TSX imports `@remotion/transitions` — install it in the Remotion project:
```bash
npm install @remotion/transitions
```

---

## MCP Tools

| Tool | Input | Output |
|------|-------|--------|
| `create_composition` | title, theme, format, keyIdeas | starter `composition.json` |
| `validate_composition` | JSON string | errors or `{ valid: true }` |
| `render_to_tsx` | JSON string | `Scene.tsx` string |
| `list_themes` | — | theme names + palette summaries |
| `get_scene_template` | scene type (any of 14) | example props + durationFrames |
| `generate_composition_from_text` | raw text, format, theme | full composition blueprint + guidance notes |

**Use `generate_composition_from_text` first** when converting prose (blog post, book chapter, transcript) to video — it detects stats, comparisons, code blocks, and named people to suggest the right scene types automatically.
