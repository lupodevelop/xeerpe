import {CSSProperties} from "react";

const toKebab = (key: string) => {
    if (key.startsWith('--')) return key
    const kebab = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
    return /^(webkit|moz|ms)-/.test(kebab) ? `-${kebab}` : kebab
}

const toClassName = (name: string) =>
    name.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')

export const styleToCss = (style: CSSProperties, className?: string) => {
    const declarations = Object.entries(style)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${toKebab(key)}: ${value};`)

    const selector = className ? toClassName(className) : ''
    if (!selector) return declarations.join('\n')

    return `.${selector} {\n${declarations.map((line) => `    ${line}`).join('\n')}\n}`
}
