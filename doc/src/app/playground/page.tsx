import fs from 'node:fs/promises'
import path from 'node:path'
import type {Metadata} from 'next'
import {socialMetadata} from '@/src/config/site.ts'
import {parseKeyframes} from '@/src/utils/playground.ts'
import Playground from '@cmp/playground/playground.tsx'
import classes from './playground.module.css'

const title = 'xeerpe playground: build CSS backgrounds visually'
const description =
    'Stack gradients, patterns, effects, filters and animations visually, then copy the xeerpe snippet or the plain CSS. Share any background with a link.'

export const metadata: Metadata = {
    title: {absolute: title},
    description,
    alternates: {canonical: '/playground'},
    ...socialMetadata({title, description, path: '/playground'}),
}

const PlaygroundPage = async () => {
    const source = await fs.readFile(
        path.join(process.cwd(), '../lib/src/css/animations.css'),
        'utf-8'
    )

    return (
        <main id="main-content" tabIndex={-1} className={classes.page}>
            <h1 className="sr-only">xeerpe playground</h1>
            <Playground keyframes={parseKeyframes(source)} />
        </main>
    )
}

export default PlaygroundPage
