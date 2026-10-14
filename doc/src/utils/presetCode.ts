import fs from 'node:fs/promises'
import path from 'node:path'

const libraryDir = path.join(process.cwd(), '..', 'lib', 'src', 'presets', 'library')

let sources: Promise<string[]> | undefined

const readLibrary = () => {
    sources ??= fs
        .readdir(libraryDir)
        .then((files) =>
            Promise.all(files.filter((file) => file.endsWith('.ts')).map((file) => fs.readFile(path.join(libraryDir, file), 'utf-8'))),
        )
        .catch(() => [])
    return sources
}

const toChain = (body: string) => {
    const lines = body.split('\n')
    const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length))
    const code = lines
        .map((line) => line.slice(indent))
        .join('\n')
        .trim()

    return code.replace(/^builder\b/m, 'new Builder()').replace(/;\s*$/, '') + '\n    .toStyle()'
}

export const getPresetCode = async (name: string): Promise<string | undefined> => {
    const marker = `'${name}': (builder) => {\n`

    for (const source of await readLibrary()) {
        const start = source.indexOf(marker)
        if (start === -1) continue

        const from = start + marker.length
        const end = source.indexOf('\n    }', from)
        if (end === -1) return undefined

        return toChain(source.slice(from, end))
    }
    return undefined
}
