import {Builder} from 'xeerpe'
import {xeerpePresets} from '../../../lib/src/presets/presets.ts'
import {findMethod} from '@/src/data/playgroundRegistry.ts'
import {
    BuildResult,
    Field,
    Layer,
    Literal,
    Method,
    Params,
    PlaygroundState,
    Primitive,
} from '@/src/models/playground.ts'

export const emptyState: PlaygroundState = {layers: []}

export const createId = (): string => Math.random().toString(36).slice(2, 8)

const initialParams = (fields: Field[]): Params =>
    Object.fromEntries(
        fields
            .filter((field) => field.initial !== undefined)
            .map((field) => [field.key, field.initial as Primitive])
    )

export const createLayer = (method: Method, id: string): Layer => ({
    id,
    method: method.name,
    visible: true,
    params: initialParams(method.fields),
    points: Array.from({length: method.initialPoints ?? 0}, (_, index) => ({
        ...initialParams(method.pointFields ?? []),
        ...(index > 0 ? method.pointInitial : {}),
    })),
})

export const createPoint = (method: Method): Params => ({
    ...initialParams(method.pointFields ?? []),
    ...method.pointInitial,
})

const isPrimitive = (value: unknown): value is Primitive =>
    ['string', 'number', 'boolean'].includes(typeof value)

const toParams = (source: unknown): Params =>
    Object.fromEntries(
        Object.entries(source && typeof source === 'object' ? source : {}).filter(([, value]) => isPrimitive(value))
    ) as Params

export const presetToState = (name: string): PlaygroundState => {
    const calls: { method: string; options: Record<string, unknown> }[] = []

    const recorder: unknown = new Proxy({}, {
        get: (_, method: string) => (options: Record<string, unknown> = {}) => {
            calls.push({method, options})
            return recorder
        },
    })

    xeerpePresets[name](recorder as Builder)

    const layers = calls.flatMap((call): Layer[] => {
        const method = findMethod(call.method)
        if (!method) return []

        const items = method.pointKey ? call.options[method.pointKey] : undefined
        const points = Array.isArray(items)
            ? items.map((item) => typeof item === 'string' ? {color: item} : toParams(item))
            : []

        return [{
            id: createId(),
            method: method.name,
            visible: true,
            params: toParams(call.options),
            points,
        }]
    })

    return {layers}
}

const random = (min: number, max: number): number => min + Math.random() * (max - min)
const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]
const chance = (probability: number): boolean => Math.random() < probability
const round = (value: number, digits = 0): number => Math.round(value * 10 ** digits) / 10 ** digits

const toHexByte = (value: number): string =>
    Math.round(value * 255).toString(16).padStart(2, '0')

const hslToHex = (hue: number, saturation: number, lightness: number, alpha?: number): string => {
    const s = saturation / 100
    const l = lightness / 100
    const a = s * Math.min(l, 1 - l)
    const channel = (n: number): number => {
        const k = (n + hue / 30) % 12
        return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    }

    return `#${toHexByte(channel(0))}${toHexByte(channel(8))}${toHexByte(channel(4))}${alpha === undefined ? '' : toHexByte(alpha)}`
}

const randomColor = (lightness: [number, number] = [35, 65], alpha?: number): string =>
    hslToHex(random(0, 360), random(55, 95), random(...lightness), alpha)

const randomPosition = (): string => `${round(random(0, 100))}% ${round(random(0, 100))}%`

const randomLayer = (name: string, params: Params = {}, points: Params[] = []): Layer => {
    const layer = createLayer(findMethod(name) as Method, createId())
    return {...layer, params: {...layer.params, ...params}, points: points.length ? points : layer.points}
}

const randomBase = (): Layer => {
    const kind = pick(['linearGradient', 'radialGradient', 'conicGradient', 'meshGradient'])

    if (kind === 'linearGradient') {
        return randomLayer(kind, {from: randomColor(), to: randomColor([10, 35]), angle: `${round(random(0, 360))}deg`})
    }

    if (kind === 'radialGradient') {
        return randomLayer(kind, {from: randomColor(), to: randomColor([5, 30]), position: randomPosition()})
    }

    if (kind === 'conicGradient') {
        return randomLayer(kind, {from: randomColor(), to: randomColor(), angle: `${round(random(0, 360))}deg`})
    }

    const points = Array.from({length: round(random(2, 4))}, () => ({
        from: randomColor([45, 65], 0.75),
        to: 'transparent',
        position: randomPosition(),
        colorToPosition: `${round(random(40, 70))}%`,
    }))

    return randomLayer(kind, {background: randomColor([5, 15])}, points)
}

const randomPattern = (): Layer => {
    const kind = pick(['dots', 'grid', 'stars', 'rays'])
    const common = {color: pick(['#ffffff', randomColor([60, 80])]), opacity: round(random(0.05, 0.25), 2)}

    if (kind === 'dots') return randomLayer(kind, {...common, size: `${round(random(10, 28))}px`})
    if (kind === 'grid') return randomLayer(kind, {...common, size: `${round(random(20, 60))}px`})
    if (kind === 'stars') return randomLayer(kind, {color: '#ffffff', count: round(random(20, 80)), seed: round(random(1, 99))})
    return randomLayer(kind, {...common, count: round(random(6, 24))})
}

const randomEffect = (): Layer => {
    const kind = pick(['grain', 'vignette', 'noise'])

    if (kind === 'grain') return randomLayer(kind, {intensity: round(random(0.5, 1.5), 1)})
    if (kind === 'vignette') return randomLayer(kind, {intensity: round(random(0.2, 0.5), 2)})
    return randomLayer(kind, {opacity: round(random(0.05, 0.2), 2)})
}

export const generateRandomState = (): PlaygroundState => {
    const effects = Array.from({length: round(random(0, 2))}, randomEffect)
    const patterns = Array.from({length: round(random(0, 1.5))}, randomPattern)
    const animations = chance(0.25)
        ? [randomLayer(pick(['aurora', 'breathe', 'drift', 'float', 'shimmer', 'pulse']))]
        : []

    return {layers: [...effects, ...patterns, randomBase(), ...animations]}
}

const NUMERIC = /^-?\d+(\.\d+)?$/

const activeOptions = (fields: Field[], params: Params): Record<string, Literal> => {
    const options: Record<string, Literal> = {}

    fields.forEach((field) => {
        const value = params[field.key]
        if (value === undefined || value === '' || value === field.fallback) return
        options[field.key] = field.asNumber && typeof value === 'string' && NUMERIC.test(value)
            ? Number(value)
            : value
    })

    return options
}

const layerOptions = (method: Method, layer: Layer): Record<string, Literal> => {
    const options = activeOptions(method.fields, layer.params)

    if (method.pointFields && method.pointKey && layer.points.length) {
        const pointFields = method.pointFields
        options[method.pointKey] = layer.points.map((point) => activeOptions(pointFields, point))
    }

    return options
}

const applyLayer = (builder: Builder, layer: Layer): Builder => {
    const method = findMethod(layer.method) as Method
    const call = builder[method.name as keyof Builder] as (options: object) => Builder
    return call.call(builder, layerOptions(method, layer))
}

const orderedLayers = (state: PlaygroundState): Layer[] => {
    const visible = state.layers.filter((layer) => layer.visible && findMethod(layer.method))
    const isAnimation = (layer: Layer) => findMethod(layer.method)?.group === 'animation'

    return [
        ...visible.filter((layer) => !isAnimation(layer)),
        ...visible.filter(isAnimation),
    ]
}

const animationWarnings = (layers: Layer[]): Record<string, string> => {
    const animations = layers.filter((layer) => findMethod(layer.method)?.animates)
    const warnings: Record<string, string> = {}

    animations.forEach((layer) => {
        const method = findMethod(layer.method) as Method
        const conflicts = animations
            .filter((other) => other.id !== layer.id)
            .flatMap((other) => {
                const otherMethod = findMethod(other.method) as Method
                const shared = method.animates?.filter((property) => otherMethod.animates?.includes(property)) ?? []
                return shared.length ? [`${otherMethod.label} (${shared.join(', ')})`] : []
            })

        if (conflicts.length) {
            warnings[layer.id] = `Animates the same property as ${conflicts.join(', ')}: only the last one takes effect.`
        }
    })

    return warnings
}

const messageOf =(error: unknown): string =>
    error instanceof Error ? error.message : String(error)

export const buildFromState = (state: PlaygroundState): BuildResult => {
    const errors: Record<string, string> = {}
    const valid: Layer[] = []
    const ordered = orderedLayers(state)
    const warnings = animationWarnings(ordered)

    ordered.forEach((layer) => {
        try {
            applyLayer(new Builder(), layer).toStyle()
            valid.push(layer)
        } catch (error) {
            errors[layer.id] = messageOf(error)
        }
    })

    try {
        const builder = valid.reduce(applyLayer, new Builder())
        return {style: builder.toStyle(), error: null, errors, warnings}
    } catch (error) {
        return {style: {}, error: messageOf(error), errors, warnings}
    }
}

const pad = (depth: number): string => '    '.repeat(depth)

const quote = (value: string): string =>
    `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const literal = (value: Literal, depth: number): string => {
    if (typeof value === 'string') return quote(value)
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)

    if (Array.isArray(value)) {
        if (!value.length) return '[]'
        const items = value.map((item) => `${pad(depth + 1)}${literal(item, depth + 1)},`)
        return `[\n${items.join('\n')}\n${pad(depth)}]`
    }

    const entries = Object.entries(value)
    if (!entries.length) return '{}'
    const lines = entries.map(([key, item]) => `${pad(depth + 1)}${key}: ${literal(item, depth + 1)},`)
    return `{\n${lines.join('\n')}\n${pad(depth)}}`
}

export const serializeToSnippet = (state: PlaygroundState): string => {
    const calls = orderedLayers(state).map((layer) => {
        const method = findMethod(layer.method) as Method
        const options = layerOptions(method, layer)
        const hasOptions = Object.keys(options).length > 0
        return `${pad(1)}.${method.name}(${hasOptions ? literal(options, 1) : ''})`
    })

    return [
        "import {Builder} from 'xeerpe'",
        '',
        'const style = new Builder()',
        ...calls,
        `${pad(1)}.toStyle()`,
    ].join('\n')
}

const toKebab = (property: string): string =>
    property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export const toCss = (style: Record<string, string>, keyframes: Record<string, string>): string => {
    const declarations = Object.entries(style).map(([property, value]) => `${pad(1)}${toKebab(property)}: ${value};`)
    const rule = `.xeerpe-bg {\n${declarations.join('\n')}\n}`

    const used = [...new Set(style.animation?.match(/xeerpe-[a-z]+/g) ?? [])]
        .map((name) => keyframes[name])
        .filter(Boolean)

    return [rule, ...used].join('\n\n')
}

export const parseKeyframes = (css: string): Record<string, string> => {
    const keyframes: Record<string, string> = {}
    const pattern = /@keyframes\s+([\w-]+)\s*\{/g
    let match: RegExpExecArray | null

    while ((match = pattern.exec(css))) {
        let depth = 1
        let index = pattern.lastIndex

        while (depth > 0 && index < css.length) {
            if (css[index] === '{') depth++
            if (css[index] === '}') depth--
            index++
        }

        keyframes[match[1]] = css.slice(match.index, index)
        pattern.lastIndex = index
    }

    return keyframes
}

const toBase64Url = (text: string): string => {
    const bytes = new TextEncoder().encode(text)
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (encoded: string): string => {
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

export const encodeState = (state: PlaygroundState): string => toBase64Url(JSON.stringify(state))

const isParams = (value: unknown): value is Params =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

export const decodeState = (encoded: string): PlaygroundState | null => {
    try {
        const parsed = JSON.parse(fromBase64Url(encoded))
        if (!Array.isArray(parsed?.layers)) return null

        const layers: Layer[] = parsed.layers
            .filter((layer: Layer) => findMethod(layer?.method) && isParams(layer.params))
            .map((layer: Layer) => ({
                id: String(layer.id || createId()),
                method: layer.method,
                visible: layer.visible !== false,
                params: layer.params,
                points: Array.isArray(layer.points) ? layer.points.filter(isParams) : [],
            }))

        return {layers}
    } catch {
        return null
    }
}
