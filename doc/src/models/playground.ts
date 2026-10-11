import {Dispatch, ReactNode} from "react";

export type Primitive = string | number | boolean
export type Params = Record<string, Primitive>
export type Literal = Primitive | Literal[] | { [key: string]: Literal }

export type MethodGroup = 'gradient' | 'pattern' | 'effect' | 'filter' | 'animation'
export type FieldKind = 'color' | 'text' | 'number' | 'select' | 'boolean'

export interface Field {
    key: string
    label: string
    kind: FieldKind
    initial?: Primitive
    fallback?: Primitive
    options?: string[]
    min?: number
    max?: number
    step?: number
    placeholder?: string
    asNumber?: boolean
    advanced?: boolean
    excludes?: string[]
}

export interface Method {
    name: string
    label: string
    group: MethodGroup
    fields: Field[]
    pointKey?: string
    pointLabel?: string
    pointFields?: Field[]
    pointInitial?: Params
    initialPoints?: number
    minPoints?: number
    animates?: string[]
}

export interface Layer {
    id: string
    method: string
    visible: boolean
    params: Params
    points: Params[]
}

export interface PlaygroundState {
    layers: Layer[]
}

export interface PlaygroundHistory {
    past: PlaygroundState[]
    present: PlaygroundState
    future: PlaygroundState[]
    lastKey: string | null
}

export type PlaygroundAction =
    | { type: 'ADD_LAYER'; id: string; method: string }
    | { type: 'UPDATE_PARAMS'; id: string; key: string; value: Primitive }
    | { type: 'ADD_POINT'; id: string }
    | { type: 'UPDATE_POINT'; id: string; index: number; key: string; value: Primitive }
    | { type: 'REMOVE_POINT'; id: string; index: number }
    | { type: 'REMOVE'; id: string }
    | { type: 'MOVE'; id: string; direction: -1 | 1 }
    | { type: 'DUPLICATE'; id: string; newId: string }
    | { type: 'TOGGLE_VISIBILITY'; id: string }
    | { type: 'LOAD'; state: PlaygroundState }
    | { type: 'RESET' }
    | { type: 'UNDO' }
    | { type: 'REDO' }

export interface BuildResult {
    style: Record<string, string>
    error: string | null
    errors: Record<string, string>
    warnings: Record<string, string>
}

export interface RecordedCall {
    method: string
    options: Record<string, unknown>
}

export interface LayerListProps {
    layers: Layer[]
    selectedId: string | undefined
    errors: Record<string, string>
    warnings: Record<string, string>
    dispatch: Dispatch<PlaygroundAction>
    onSelect: (id: string) => void
}

export interface FieldControlProps {
    field: Field
    value: Primitive | undefined
    onChange: (value: Primitive) => void
}

export type OutputTab = 'snippet' | 'css'

export interface OutputProps {
    snippet: string
    css: string
}

export interface OutputTabItem {
    id: OutputTab
    label: string
    lang: string
}

export interface HighlightedOutput {
    code: string
    html: string
}

export interface LayerControlsProps {
    layer: Layer | undefined
    error?: string
    warning?: string
    dispatch: Dispatch<PlaygroundAction>
}

export interface FieldGroupProps {
    fields: Field[]
    values: Params
    onChange: (key: string, value: Primitive) => void
}

export interface PreviewProps {
    style: Record<string, string>
    error: string | null
    empty: boolean
    children?: ReactNode
}

export interface BoundaryProps {
    resetKey: string
    children: ReactNode
}

export interface BoundaryState {
    failed: boolean
    resetKey: string
}

export interface AddLayerMenuProps {
    alwaysOpen: boolean
    onAdd: (method: string) => void
}

export type PanelTab = 'layers' | 'controls' | 'code'

export interface PanelTabItem {
    id: PanelTab
    label: string
}

export interface PlaygroundProps {
    keyframes: Record<string, string>
}
