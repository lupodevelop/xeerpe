import type {Builder} from "../core/index.ts";
import type {presetCategories} from "../presets/catalog.ts";

export type PresetConfig = (builder: Builder) => void;

export type PresetCategory = keyof typeof presetCategories
