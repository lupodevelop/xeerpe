import { findMethod } from '@/src/data/playgroundRegistry.ts'
import { Layer, Method, Params, PlaygroundAction, PlaygroundHistory, PlaygroundState, Primitive } from '@/src/models/playground.ts'
import { createLayer, createPoint, emptyState } from '@/src/utils/playground.ts'

const HISTORY_LIMIT = 100

export const initialHistory: PlaygroundHistory = {
    past: [],
    present: emptyState,
    future: [],
    lastKey: null,
}

const updateLayer = (state: PlaygroundState, id: string, update: (layer: Layer) => Layer): PlaygroundState => ({
    layers: state.layers.map((layer) => (layer.id === id ? update(layer) : layer)),
})

const withExclusions = (layer: Layer, key: string, value: Primitive): Params => {
    const fields = findMethod(layer.method)?.fields ?? []
    const excluded = value === '' ? [] : (fields.find((field) => field.key === key)?.excludes ?? [])

    return {
        ...Object.fromEntries(Object.entries(layer.params).filter(([name]) => !excluded.includes(name))),
        [key]: value,
    }
}

const reduceState = (state: PlaygroundState, action: PlaygroundAction): PlaygroundState => {
    switch (action.type) {
        case 'ADD_LAYER': {
            const method = findMethod(action.method) as Method
            return { layers: [...state.layers, createLayer(method, action.id)] }
        }
        case 'UPDATE_PARAMS':
            return updateLayer(state, action.id, (layer) => ({
                ...layer,
                params: withExclusions(layer, action.key, action.value),
            }))
        case 'ADD_POINT':
            return updateLayer(state, action.id, (layer) => ({
                ...layer,
                points: [...layer.points, createPoint(findMethod(layer.method) as Method)],
            }))
        case 'UPDATE_POINT':
            return updateLayer(state, action.id, (layer) => ({
                ...layer,
                points: layer.points.map((point, index) => (index === action.index ? { ...point, [action.key]: action.value } : point)),
            }))
        case 'REMOVE_POINT':
            return updateLayer(state, action.id, (layer) => ({
                ...layer,
                points: layer.points.filter((_, index) => index !== action.index),
            }))
        case 'REMOVE':
            return { layers: state.layers.filter((layer) => layer.id !== action.id) }
        case 'MOVE': {
            const from = state.layers.findIndex((layer) => layer.id === action.id)
            const to = from + action.direction
            if (from < 0 || to < 0 || to >= state.layers.length) return state
            const layers = [...state.layers]
            ;[layers[from], layers[to]] = [layers[to], layers[from]]
            return { layers }
        }
        case 'DUPLICATE': {
            const index = state.layers.findIndex((layer) => layer.id === action.id)
            if (index < 0) return state
            const source = state.layers[index]
            const copy: Layer = {
                ...source,
                id: action.newId,
                params: { ...source.params },
                points: source.points.map((point) => ({ ...point })),
            }
            const layers = [...state.layers]
            layers.splice(index + 1, 0, copy)
            return { layers }
        }
        case 'TOGGLE_VISIBILITY':
            return updateLayer(state, action.id, (layer) => ({ ...layer, visible: !layer.visible }))
        case 'LOAD':
            return action.state
        case 'RESET':
            return emptyState
        default:
            return state
    }
}

const coalesceKey = (action: PlaygroundAction): string | null => {
    if (action.type === 'UPDATE_PARAMS') return `${action.id}:${action.key}`
    if (action.type === 'UPDATE_POINT') return `${action.id}:${action.index}:${action.key}`
    return null
}

export const playgroundReducer = (history: PlaygroundHistory, action: PlaygroundAction): PlaygroundHistory => {
    if (action.type === 'UNDO') {
        if (!history.past.length) return history
        const previous = history.past[history.past.length - 1]
        return {
            past: history.past.slice(0, -1),
            present: previous,
            future: [history.present, ...history.future],
            lastKey: null,
        }
    }

    if (action.type === 'REDO') {
        if (!history.future.length) return history
        const [next, ...future] = history.future
        return {
            past: [...history.past, history.present],
            present: next,
            future,
            lastKey: null,
        }
    }

    const present = reduceState(history.present, action)
    if (present === history.present) return history

    const key = coalesceKey(action)

    if (key && key === history.lastKey) {
        return { ...history, present }
    }

    return {
        past: [...history.past, history.present].slice(-HISTORY_LIMIT),
        present,
        future: [],
        lastKey: key,
    }
}
