export type SceneType =
  | "title"
  | "concept"
  | "diagram"
  | "quote"
  | "code"
  | "stats"
  | "transition"
  | "outro";

export interface CompositionMeta {
  title: string;
  fps: 24 | 25 | 30 | 60;
  width: number;
  height: number;
  slug?: string;
}

export interface Scene {
  id: string;
  type: SceneType;
  durationFrames: number;
  props: Record<string, unknown>;
}

export interface CompositionSpec {
  meta: CompositionMeta;
  globalTheme: "book-chapter" | "minimal-dark";
  scenes: Scene[];
}

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentDim: string;
  border: string;
  code: string;
}

export interface ThemeTypography {
  heading: string;
  body: string;
  mono: string;
}

export interface ThemeAnimation {
  entryDuration: number;
  transitionDuration: number;
  springConfig: { damping: number; mass: number; stiffness: number };
}

export interface Theme {
  name: string;
  version: string;
  description?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  animation: ThemeAnimation;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
