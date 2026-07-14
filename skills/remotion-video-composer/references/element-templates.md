# Scene Element Templates

Reference props for each scene type. Copy and fill in your content.

## title
```json
{
  "headline": "Chapter N — Title Here",
  "subhead": "Chapter N",
  "eyebrow": "From Copilot to Colleague"
}
```

## concept
```json
{
  "heading": "Section Heading",
  "bullets": [
    "First key point — keep under 12 words",
    "Second key point",
    "Third key point"
  ],
  "note": "Optional footnote or source"
}
```

## diagram
```json
{
  "heading": "Diagram Title",
  "imagePath": "diagrams/concepts/your-diagram.png",
  "caption": "One-line caption",
  "imagePosition": "center"
}
```
`imagePosition`: `"center"` | `"left"` | `"right"`

## quote
```json
{
  "text": "The quote text goes here — keep it to 2–3 lines max.",
  "attribution": "Chapter N or speaker name",
  "context": "Brief framing of why this quote matters"
}
```

## code
```json
{
  "heading": "Code Example Title",
  "language": "python",
  "code": "# Your code here\nresult = agent.run(prompt)",
  "caption": "What this illustrates"
}
```
Supported languages: `python`, `typescript`, `bash`, `json`, `yaml`

## stats
```json
{
  "heading": "By the Numbers",
  "stats": [
    { "value": "42", "label": "Short label" },
    { "value": "97%", "label": "Short label" },
    { "value": "3×", "label": "Short label" }
  ]
}
```
Max 4 stats per scene. Values should be short (under 6 chars).

## transition
```json
{
  "label": "Part 2 — The Solution",
  "accent": true
}
```
`accent: true` draws a full-width accent line.

## outro
```json
{
  "headline": "Your closing one-liner.",
  "callToAction": "fromcopilottocolleague.com",
  "subline": "Read the full chapter"
}
```
