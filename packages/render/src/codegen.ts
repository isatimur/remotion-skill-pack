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
    default:
      return `  return <AbsoluteFill style={{ background: '${colors.background}' }} />;`;
  }
}

export function generateSceneTsx(spec: CompositionSpec, theme: Theme): string {
  const { scenes, meta } = spec;
  const totalDuration = scenes.reduce((s, sc) => s + sc.durationFrames, 0);

  const sceneComponents = scenes.map((scene) => {
    const name = `Scene_${scene.id.replace(/-/g, "_")}`;
    return `
const ${name}: React.FC = () => {
${sceneComponentBody(scene, theme)}
};`;
  });

  const safeId = (id: string) => id.replace(/-/g, "_");

  const compositionBody = scenes.map((scene) => {
    const name = `Scene_${safeId(scene.id)}`;
    return `        <Sequence from={offset_${safeId(scene.id)}} durationInFrames={${scene.durationFrames}} name={${JSON.stringify(scene.id)}}>\n          <${name} />\n        </Sequence>`;
  });

  const offsetCalcs = scenes
    .map((scene, i) => {
      const prev = scenes.slice(0, i);
      const sum = prev.reduce((s, p) => s + p.durationFrames, 0);
      return `  const offset_${safeId(scene.id)} = ${sum};`;
    })
    .join("\n");

  return `import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from 'remotion';
${sceneComponents.join("\n")}

export const ${meta.slug ? meta.slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) : "Video"}Composition: React.FC = () => {
${offsetCalcs}
  return (
    <>
${compositionBody.join("\n")}
    </>
  );
};

export const compositionId = ${JSON.stringify(meta.slug ?? "video")};
export const durationInFrames = ${totalDuration};
export const fps = ${meta.fps};
export const width = ${meta.width};
export const height = ${meta.height};
`;
}

export function generateEntryTsx(spec: CompositionSpec): string {
  const slug = spec.meta.slug ?? "video";
  const compName = slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) + "Composition";
  return `import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
registerRoot(RemotionRoot);
`;
}

export function generateRootTsx(spec: CompositionSpec): string {
  const slug = spec.meta.slug ?? "video";
  const compName = slug.replace(/-(\w)/g, (_: string, c: string) => c.toUpperCase()) + "Composition";
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
