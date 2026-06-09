import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { CompositionSpec, ValidationResult } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let _ajv: Ajv | null = null;
let _validate: ReturnType<Ajv["compile"]> | null = null;

async function getValidator() {
  if (_validate) return _validate;
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const schemaPath = join(__dirname, "..", "composition.schema.json");
  const schema = JSON.parse(await readFile(schemaPath, "utf-8")) as Record<string, unknown>;
  _ajv = ajv;
  _validate = ajv.compile(schema);
  return _validate;
}

export async function validateComposition(spec: unknown): Promise<ValidationResult> {
  const validate = await getValidator();
  const valid = validate(spec) as boolean;
  if (valid) return { valid: true, errors: [] };
  const errors = (_ajv?.errorsText(validate.errors) ?? "Unknown validation error").split(", ");
  return { valid: false, errors };
}

export function totalFrames(spec: CompositionSpec): number {
  return spec.scenes.reduce((sum, s) => sum + s.durationFrames, 0);
}
