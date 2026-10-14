import fs from 'node:fs/promises'
import path from 'node:path'
import { demos } from '@/src/data/examples.ts'

let source: Promise<string> | undefined

const dedent = (code: string) => {
    const lines = code.split('\n')
    const indent = Math.min(
        ...lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => line.match(/^ */)![0].length),
    )
    return lines.map((line, i) => (i === 0 ? line : line.slice(Number.isFinite(indent) ? indent - 4 : 0))).join('\n')
}

export const getDemoCode = async (example: keyof typeof demos): Promise<string | undefined> => {
    source ??= fs.readFile(path.join(process.cwd(), 'src/data/examples.ts'), 'utf-8')
    const text = await source

    const marker = `'${example}': () => `
    const start = text.indexOf(marker)
    if (start === -1) return undefined

    const from = start + marker.length
    const endToken = '.toStyle()'
    const end = text.indexOf(endToken, from)
    if (end === -1) return undefined

    return dedent(text.slice(from, end + endToken.length))
}
