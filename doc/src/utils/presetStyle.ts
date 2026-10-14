import { CSSProperties } from 'react'
import { Preset } from 'xeerpe'

const cache = new Map<string, CSSProperties>()

export const presetStyle = (name: string): CSSProperties => {
    const cached = cache.get(name)
    if (cached) return cached

    const style = new Preset(name).toStyle() as CSSProperties
    cache.set(name, style)

    return style
}
