import type { CompositionSpec, Scene, Theme } from "@remotion-skill-pack/core";

function sceneComponentBody(scene: Scene, theme: Theme): string {
  const { colors, typography, animation } = theme;
  const base = `
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: ${JSON.stringify(animation.springConfig)} });
  const opacity = interpolate(frame, [0, ${animation.entryDuration}], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, ${animation.entryDuration}], [24, 0], { extrapolateRight: 'clamp' });
`;

  switch (scene.type) {
    case "title": {
      const p = scene.props as { headline?: string; subhead?: string; eyebrow?: string };
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
      {${JSON.stringify(p.eyebrow)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', opacity, marginBottom: 24 }}>{${JSON.stringify(p.eyebrow)}}</p>}
      <h1 style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 72, fontWeight: 700, textAlign: 'center', opacity, transform: \`translateY(\${translateY}px)\`, margin: 0 }}>{${JSON.stringify(p.headline ?? "")}}</h1>
      {${JSON.stringify(p.subhead)} && <p style={{ color: '${colors.accent}', fontFamily: '${typography.body}', fontSize: 24, marginTop: 32, opacity }}>{${JSON.stringify(p.subhead)}}</p>}
    </AbsoluteFill>
  );`;
    }
    case "concept": {
      const p = scene.props as { heading?: string; bullets?: string[]; note?: string };
      const bullets = p.bullets ?? [];
      const bulletJsx = bullets
        .map(
          (b, i) =>
            `      <li key={${i}} style={{ color: '${colors.text}', fontFamily: '${typography.body}', fontSize: 32, marginBottom: 16, opacity: interpolate(frame, [${animation.entryDuration + i * 8}, ${animation.entryDuration + i * 8 + animation.entryDuration}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`translateX(\${interpolate(frame, [${animation.entryDuration + i * 8}, ${animation.entryDuration + i * 8 + animation.entryDuration}], [-16, 0], { extrapolateRight: 'clamp' })}px)\` }}>${b}</li>`,
        )
        .join("\n");
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', padding: '80px' }}>
      <h2 style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 48, fontWeight: 700, opacity, transform: \`translateY(\${translateY}px)\`, marginBottom: 48 }}>{${JSON.stringify(p.heading ?? "")}}</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
${bulletJsx}
      </ul>
      {${JSON.stringify(p.note)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 18, position: 'absolute', bottom: 60, opacity }}>{${JSON.stringify(p.note)}}</p>}
    </AbsoluteFill>
  );`;
    }
    case "diagram": {
      const p = scene.props as { heading?: string; imagePath?: string; caption?: string; imagePosition?: string };
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', padding: '60px', gap: 32 }}>
      <h2 style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 40, fontWeight: 700, opacity, margin: 0 }}>{${JSON.stringify(p.heading ?? "")}}</h2>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: '${p.imagePosition === "left" ? "flex-start" : p.imagePosition === "right" ? "flex-end" : "center"}', opacity }}>
        <img src={staticFile(${JSON.stringify(p.imagePath ?? "")})} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
      {${JSON.stringify(p.caption)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 20, textAlign: 'center', opacity }}>{${JSON.stringify(p.caption)}}</p>}
    </AbsoluteFill>
  );`;
    }
    case "quote": {
      const p = scene.props as { text?: string; attribution?: string; context?: string };
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px' }}>
      <div style={{ borderLeft: '4px solid ${colors.accent}', paddingLeft: 48, opacity, transform: \`translateY(\${translateY}px)\` }}>
        <p style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 40, fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>{${JSON.stringify(p.text ?? "")}}</p>
        {${JSON.stringify(p.attribution)} && <p style={{ color: '${colors.accent}', fontFamily: '${typography.body}', fontSize: 22, marginTop: 32 }}>— {${JSON.stringify(p.attribution)}}</p>}
        {${JSON.stringify(p.context)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 18, marginTop: 12 }}>{${JSON.stringify(p.context)}}</p>}
      </div>
    </AbsoluteFill>
  );`;
    }
    case "code": {
      const p = scene.props as { heading?: string; code?: string; caption?: string };
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', padding: '60px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h2 style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 40, fontWeight: 700, opacity, margin: 0 }}>{${JSON.stringify(p.heading ?? "")}}</h2>
      <pre style={{ background: '${colors.code}', border: '1px solid ${colors.border}', borderRadius: 12, padding: 40, fontFamily: '${typography.mono}', fontSize: 24, color: '${colors.text}', opacity, overflow: 'hidden', margin: 0 }}>{${JSON.stringify(p.code ?? "")}}</pre>
      {${JSON.stringify(p.caption)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 20, opacity }}>{${JSON.stringify(p.caption)}}</p>}
    </AbsoluteFill>
  );`;
    }
    case "stats": {
      const p = scene.props as { heading?: string; stats?: Array<{ value: string; label: string }> };
      const stats = p.stats ?? [];
      const statsJsx = stats
        .map(
          (s, i) =>
            `        <div key={${i}} style={{ textAlign: 'center', opacity: interpolate(frame, [${animation.entryDuration + i * 10}, ${animation.entryDuration + i * 10 + 20}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`scale(\${interpolate(frame, [${animation.entryDuration + i * 10}, ${animation.entryDuration + i * 10 + 20}], [0.8, 1], { extrapolateRight: 'clamp' })})\` }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 80, fontWeight: 800, margin: 0 }}>${s.value}</p>
          <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 24, margin: 0 }}>${s.label}</p>
        </div>`,
        )
        .join("\n");
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: 48 }}>
      <h2 style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 48, fontWeight: 700, opacity }}>{${JSON.stringify(p.heading ?? "")}}</h2>
      <div style={{ display: 'flex', gap: 80 }}>
${statsJsx}
      </div>
    </AbsoluteFill>
  );`;
    }
    case "transition": {
      const p = scene.props as { label?: string; accent?: boolean };
      return `${base}
  const lineWidth = interpolate(progress, [0, 1], [0, 1920]);
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      ${p.accent ? `<div style={{ position: 'absolute', top: '50%', left: 0, height: 2, background: '${colors.accent}', width: lineWidth }} />` : ""}
      {${JSON.stringify(p.label)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', opacity }}>{${JSON.stringify(p.label)}}</p>}
    </AbsoluteFill>
  );`;
    }
    case "outro": {
      const p = scene.props as { headline?: string; callToAction?: string; subline?: string };
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px' }}>
      <h2 style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 56, fontWeight: 700, textAlign: 'center', opacity, transform: \`translateY(\${translateY}px)\`, margin: 0 }}>{${JSON.stringify(p.headline ?? "")}}</h2>
      {${JSON.stringify(p.callToAction)} && (
        <div style={{ marginTop: 64, textAlign: 'center', opacity }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.mono}', fontSize: 28, margin: 0 }}>{${JSON.stringify(p.callToAction)}}</p>
          {${JSON.stringify(p.subline)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 20, marginTop: 12 }}>{${JSON.stringify(p.subline)}}</p>}
        </div>
      )}
    </AbsoluteFill>
  );`;
    }

    // ── v0.2: Knowledge Video scene types ────────────────────────────────────

    case "insight": {
      const p = scene.props as { claim?: string; category?: string; source?: string };
      return `${base}
  const scaleIn = spring({ frame, fps, config: ${JSON.stringify({ ...animation.springConfig, stiffness: animation.springConfig.stiffness + 20 })} });
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: 24 }}>
      {${JSON.stringify(p.category)} && (
        <p style={{ color: '${colors.accent}', fontFamily: '${typography.body}', fontSize: 14, letterSpacing: 6, textTransform: 'uppercase', opacity, margin: 0 }}>{${JSON.stringify(p.category)}}</p>
      )}
      <p style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 72, fontWeight: 800, textAlign: 'center', lineHeight: 1.15, opacity, transform: \`scale(\${0.9 + scaleIn * 0.1})\`, margin: 0 }}>{${JSON.stringify(p.claim ?? "")}}</p>
      {${JSON.stringify(p.source)} && (
        <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 16, opacity, margin: 0 }}>{${JSON.stringify(p.source)}}</p>
      )}
    </AbsoluteFill>
  );`;
    }

    case "evidence": {
      const p = scene.props as { value?: string; label?: string; source?: string; context?: string };
      return `${base}
  const scaleIn = spring({ frame, fps, config: ${JSON.stringify({ damping: 14, mass: 1, stiffness: 240 })} });
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: 16 }}>
      <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 128, fontWeight: 900, margin: 0, lineHeight: 1, opacity, transform: \`scale(\${0.8 + scaleIn * 0.2})\` }}>{${JSON.stringify(p.value ?? "")}}</p>
      <p style={{ color: '${colors.text}', fontFamily: '${typography.body}', fontSize: 32, textAlign: 'center', opacity, margin: 0 }}>{${JSON.stringify(p.label ?? "")}}</p>
      {${JSON.stringify(p.context)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 20, textAlign: 'center', opacity, marginTop: 8 }}>{${JSON.stringify(p.context)}}</p>}
      {${JSON.stringify(p.source)} && <p style={{ color: '${colors.accentDim}', fontFamily: '${typography.mono}', fontSize: 13, opacity, marginTop: 24, textTransform: 'uppercase', letterSpacing: 2 }}>Source: {${JSON.stringify(p.source)}}</p>}
    </AbsoluteFill>
  );`;
    }

    case "person": {
      const p = scene.props as { name?: string; title?: string; quote?: string; imagePath?: string };
      const avatarInner = p.imagePath
        ? `<img src={staticFile(${JSON.stringify(p.imagePath)})} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />`
        : "";
      return `${base}
  const avatarScale = spring({ frame, fps, config: ${JSON.stringify({ damping: 18, mass: 1, stiffness: 160 })} });
  const textOpacity = interpolate(frame, [${animation.entryDuration * 2}, ${animation.entryDuration * 3}], [0, 1], { extrapolateRight: 'clamp' });
  const textSlide = interpolate(frame, [${animation.entryDuration * 2}, ${animation.entryDuration * 3}], [16, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: 32 }}>
      <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '3px solid ${colors.accent}', opacity, transform: \`scale(\${avatarScale})\`, background: '${colors.surface}', flexShrink: 0 }}>
        ${avatarInner}
      </div>
      <div style={{ textAlign: 'center', opacity: textOpacity, transform: \`translateY(\${textSlide}px)\` }}>
        <p style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 36, fontWeight: 700, margin: 0 }}>{${JSON.stringify(p.name ?? "")}}</p>
        {${JSON.stringify(p.title)} && <p style={{ color: '${colors.accent}', fontFamily: '${typography.body}', fontSize: 20, margin: '8px 0 0' }}>{${JSON.stringify(p.title)}}</p>}
      </div>
      {${JSON.stringify(p.quote)} && (
        <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.heading}', fontSize: 26, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.5, opacity: textOpacity, maxWidth: 800, margin: 0 }}>"{${JSON.stringify(p.quote)}}"</p>
      )}
    </AbsoluteFill>
  );`;
    }

    case "contrast": {
      const p = scene.props as { heading?: string; left?: { label: string; points: string[] }; right?: { label: string; points: string[] } };
      const leftPoints = p.left?.points ?? [];
      const rightPoints = p.right?.points ?? [];
      const leftBullets = leftPoints
        .map((pt, i) => {
          const s = animation.entryDuration + i * 6;
          return `        <li key={${i}} style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 24, marginBottom: 14, listStyle: 'none', opacity: interpolate(frame, [${s}, ${s + 10}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`translateX(\${interpolate(frame, [${s}, ${s + 10}], [-12, 0], { extrapolateRight: 'clamp' })}px)\` }}>${pt}</li>`;
        })
        .join("\n");
      const rightBullets = rightPoints
        .map((pt, i) => {
          const s = animation.entryDuration * 2 + i * 6;
          return `        <li key={${i}} style={{ color: '${colors.text}', fontFamily: '${typography.body}', fontSize: 24, marginBottom: 14, listStyle: 'none', opacity: interpolate(frame, [${s}, ${s + 10}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`translateX(\${interpolate(frame, [${s}, ${s + 10}], [12, 0], { extrapolateRight: 'clamp' })}px)\` }}>${pt}</li>`;
        })
        .join("\n");
      return `${base}
  const dividerH = interpolate(frame, [0, ${animation.entryDuration * 2}], [0, 100], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '${colors.background}', padding: '80px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {${JSON.stringify(p.heading)} && <h2 style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 40, fontWeight: 700, opacity, margin: 0, textAlign: 'center' }}>{${JSON.stringify(p.heading)}}</h2>}
      <div style={{ flex: 1, display: 'flex', gap: 0, alignItems: 'stretch' }}>
        <div style={{ flex: 1, paddingRight: 48, opacity: interpolate(frame, [0, ${animation.entryDuration}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`translateX(\${interpolate(frame, [0, ${animation.entryDuration}], [-20, 0], { extrapolateRight: 'clamp' })}px)\` }}>
          <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.heading}', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', margin: '0 0 20px' }}>{${JSON.stringify(p.left?.label ?? "Before")}}</p>
          <ul style={{ padding: 0, margin: 0 }}>
${leftBullets}
          </ul>
        </div>
        <div style={{ width: 2, background: \`linear-gradient(to bottom, transparent, ${colors.accent} \${dividerH}%, transparent)\` }} />
        <div style={{ flex: 1, paddingLeft: 48, opacity: interpolate(frame, [${animation.entryDuration}, ${animation.entryDuration * 2}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`translateX(\${interpolate(frame, [${animation.entryDuration}, ${animation.entryDuration * 2}], [20, 0], { extrapolateRight: 'clamp' })}px)\` }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', margin: '0 0 20px' }}>{${JSON.stringify(p.right?.label ?? "After")}}</p>
          <ul style={{ padding: 0, margin: 0 }}>
${rightBullets}
          </ul>
        </div>
      </div>
    </AbsoluteFill>
  );`;
    }

    case "framework": {
      const p = scene.props as {
        heading?: string;
        quadrants?: {
          topLeft?: { label: string; desc: string };
          topRight?: { label: string; desc: string };
          bottomLeft?: { label: string; desc: string };
          bottomRight?: { label: string; desc: string };
        };
        xAxis?: string;
        yAxis?: string;
      };
      const q = p.quadrants ?? {};
      const tl = q.topLeft ?? { label: "A", desc: "" };
      const tr = q.topRight ?? { label: "B", desc: "" };
      const bl = q.bottomLeft ?? { label: "C", desc: "" };
      const br = q.bottomRight ?? { label: "D", desc: "" };
      return `${base}
  const q1 = spring({ frame: Math.max(0, frame - ${animation.entryDuration}), fps, config: ${JSON.stringify(animation.springConfig)} });
  const q2 = spring({ frame: Math.max(0, frame - ${animation.entryDuration * 2}), fps, config: ${JSON.stringify(animation.springConfig)} });
  const q3 = spring({ frame: Math.max(0, frame - ${animation.entryDuration * 3}), fps, config: ${JSON.stringify(animation.springConfig)} });
  const q4 = spring({ frame: Math.max(0, frame - ${animation.entryDuration * 4}), fps, config: ${JSON.stringify(animation.springConfig)} });
  return (
    <AbsoluteFill style={{ background: '${colors.background}', padding: '60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {${JSON.stringify(p.heading)} && <h2 style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 36, fontWeight: 700, opacity, margin: 0, textAlign: 'center' }}>{${JSON.stringify(p.heading)}}</h2>}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
        <div style={{ background: '${colors.surface}', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: Math.min(1, q1), transform: \`scale(\${0.95 + q1 * 0.05})\` }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>{${JSON.stringify(tl.label)}}</p>
          <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 15, margin: 0 }}>{${JSON.stringify(tl.desc)}}</p>
        </div>
        <div style={{ background: '${colors.surface}', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: Math.min(1, q2), transform: \`scale(\${0.95 + q2 * 0.05})\` }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>{${JSON.stringify(tr.label)}}</p>
          <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 15, margin: 0 }}>{${JSON.stringify(tr.desc)}}</p>
        </div>
        <div style={{ background: '${colors.surface}', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: Math.min(1, q3), transform: \`scale(\${0.95 + q3 * 0.05})\` }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>{${JSON.stringify(bl.label)}}</p>
          <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 15, margin: 0 }}>{${JSON.stringify(bl.desc)}}</p>
        </div>
        <div style={{ background: '${colors.surface}', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: Math.min(1, q4), transform: \`scale(\${0.95 + q4 * 0.05})\` }}>
          <p style={{ color: '${colors.accent}', fontFamily: '${typography.heading}', fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>{${JSON.stringify(br.label)}}</p>
          <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 15, margin: 0 }}>{${JSON.stringify(br.desc)}}</p>
        </div>
      </div>
      {${JSON.stringify(p.xAxis)} && <p style={{ color: '${colors.textMuted}', fontFamily: '${typography.body}', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'right', opacity }}>{${JSON.stringify(p.xAxis)}} →</p>}
    </AbsoluteFill>
  );`;
    }

    case "narrative": {
      const p = scene.props as { text?: string; highlight?: string };
      const text = p.text ?? "";
      const highlight = (p.highlight ?? "").toLowerCase();
      const words = text.split(" ");
      const lines: string[] = [];
      let current: string[] = [];
      for (const word of words) {
        current.push(word);
        if (current.length >= 7) {
          lines.push(current.join(" "));
          current = [];
        }
      }
      if (current.length > 0) lines.push(current.join(" "));
      const perLine = animation.entryDuration * 2;
      const lineJsx = lines
        .map((line, i) => {
          const isHighlighted = highlight && line.toLowerCase().includes(highlight);
          const start = i * perLine;
          const end = start + perLine;
          return `        <span key={${i}} style={{ display: 'block', color: ${isHighlighted ? `'${colors.accent}'` : `'${colors.text}'`}, opacity: interpolate(frame, [${start}, ${end}], [0, 1], { extrapolateRight: 'clamp' }), transform: \`translateY(\${interpolate(frame, [${start}, ${end}], [12, 0], { extrapolateRight: 'clamp' })}px)\` }}>${line}</span>`;
        })
        .join("\n");
      return `${base}
  return (
    <AbsoluteFill style={{ background: '${colors.background}', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px' }}>
      <p style={{ color: '${colors.text}', fontFamily: '${typography.heading}', fontSize: 40, fontWeight: 500, lineHeight: 1.65, textAlign: 'center', margin: 0 }}>
${lineJsx}
      </p>
    </AbsoluteFill>
  );`;
    }

    default:
      return `  return <AbsoluteFill style={{ background: '${colors.background}' }} />;`;
  }
}

export function generateSceneTsx(spec: CompositionSpec, theme: Theme): string {
  const { scenes, meta } = spec;
  const safeId = (id: string) => id.replace(/-/g, "_");
  const totalDuration = scenes.reduce((s, sc) => s + sc.durationFrames, 0);

  const sceneComponents = scenes.map((scene) => {
    const name = `Scene_${safeId(scene.id)}`;
    return `\nconst ${name}: React.FC = () => {\n${sceneComponentBody(scene, theme)}\n};`;
  });

  // Collect which transition presentations are actually used (for selective imports)
  const usedTransitions = new Set<string>();
  scenes.slice(1).forEach((sc) => {
    const t = sc.transitionIn ?? "fade";
    if (t !== "none") usedTransitions.add(t);
  });

  const transitionPresentationImports: Record<string, string> = {
    fade: "import { fade } from '@remotion/transitions/fade';",
    slide: "import { slide } from '@remotion/transitions/slide';",
    wipe: "import { wipe } from '@remotion/transitions/wipe';",
    flip: "import { flip } from '@remotion/transitions/flip';",
  };
  const transitionImportLines = [...usedTransitions]
    .map((t) => transitionPresentationImports[t] ?? "")
    .filter(Boolean)
    .join("\n");

  // Build TransitionSeries body
  const presentationMap: Record<string, string> = {
    fade: "fade()",
    slide: "slide({ direction: 'from-right' })",
    wipe: "wipe({ direction: 'from-right' })",
    flip: "flip()",
  };
  const seriesBody: string[] = [];
  scenes.forEach((scene, i) => {
    const name = `Scene_${safeId(scene.id)}`;
    if (i > 0) {
      const transType = scene.transitionIn ?? "fade";
      const presentation = presentationMap[transType];
      if (presentation) {
        seriesBody.push(
          `      <TransitionSeries.Transition\n        timing={springTiming({ config: ${JSON.stringify(theme.animation.springConfig)}, durationRestThreshold: 0.001 })}\n        presentation={${presentation}}\n      />`,
        );
      }
    }
    seriesBody.push(
      `      <TransitionSeries.Sequence durationInFrames={${scene.durationFrames}} name={${JSON.stringify(scene.id)}}>\n        <${name} />\n      </TransitionSeries.Sequence>`,
    );
  });

  const compName = (meta.slug ?? "video").replace(/-(\w)/g, (_: string, c: string) => c.toUpperCase());

  return `import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
${transitionImportLines}
${sceneComponents.join("\n")}

export const ${compName}Composition: React.FC = () => (
  <TransitionSeries>
${seriesBody.join("\n")}
  </TransitionSeries>
);

export const compositionId = ${JSON.stringify(meta.slug ?? "video")};
export const durationInFrames = ${totalDuration};
export const fps = ${meta.fps};
export const width = ${meta.width};
export const height = ${meta.height};
`;
}

export function generateEntryTsx(_spec: CompositionSpec): string {
  return `import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
registerRoot(RemotionRoot);
`;
}

export function generateRootTsx(spec: CompositionSpec): string {
  const slug = spec.meta.slug ?? "video";
  const compName = slug.replace(/-(\w)/g, (_: string, c: string) => c.toUpperCase());
  return `import React from 'react';
import { Composition } from 'remotion';
import { ${compName}Composition, compositionId, durationInFrames, fps, width, height } from './Scene';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id={compositionId}
      component={${compName}Composition}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
  </>
);
`;
}
