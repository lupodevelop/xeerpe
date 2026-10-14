'use client'

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { findMethod } from '@/src/data/playgroundRegistry.ts'
import { PanelTab, PanelTabItem, PlaygroundProps, PlaygroundState } from '@/src/models/playground.ts'
import {
    buildFromState,
    createId,
    decodeState,
    encodeState,
    generateRandomState,
    presetToState,
    serializeToSnippet,
    toCss,
} from '@/src/utils/playground.ts'
import { initialHistory, playgroundReducer } from '@/src/utils/playgroundReducer.ts'
import Button from '@cmp/buttons/button.tsx'
import Panel from '@cmp/panel/panel.tsx'
import PresetSelect from '@cmp/presetSelect/presetSelect.tsx'
import SegmentedTabs from '@cmp/segmentedTabs/segmentedTabs.tsx'
import AddLayerMenu from '@cmp/playground/addLayerMenu.tsx'
import LayerList from '@cmp/playground/layerList.tsx'
import LayerControls from '@cmp/playground/layerControls.tsx'
import Preview from '@cmp/playground/preview.tsx'
import Output from '@cmp/playground/output.tsx'
import ContextModal from '@cmp/contextPreview/contextModal.tsx'
import classes from './playground.module.css'

const panelTabs: PanelTabItem[] = [
    { id: 'layers', label: 'Layers' },
    { id: 'controls', label: 'Controls' },
    { id: 'code', label: 'Code' },
]

const HASH_PREFIX = '#s='

const Playground = ({ keyframes }: PlaygroundProps) => {
    const [history, dispatch] = useReducer(playgroundReducer, initialHistory)
    const [selectedId, setSelectedId] = useState<string>()
    const [panel, setPanel] = useState<PanelTab>('layers')
    const [preset, setPreset] = useState<string>()
    const [shared, setShared] = useState(false)
    const [contextOpen, setContextOpen] = useState(false)
    const hydrated = useRef(false)

    const state = history.present
    const selected = state.layers.find((layer) => layer.id === selectedId) ?? state.layers[state.layers.length - 1]

    const result = useMemo(() => buildFromState(state), [state])
    const snippet = useMemo(() => serializeToSnippet(state), [state])
    const css = useMemo(() => toCss(result.style, keyframes), [result.style, keyframes])

    useEffect(() => {
        if (window.location.hash.startsWith(HASH_PREFIX)) {
            const decoded = decodeState(window.location.hash.slice(HASH_PREFIX.length))
            if (decoded) dispatch({ type: 'LOAD', state: decoded })
        }
        hydrated.current = true

        const onHashChange = () => {
            if (!window.location.hash.startsWith(HASH_PREFIX)) return
            const decoded = decodeState(window.location.hash.slice(HASH_PREFIX.length))
            if (!decoded) return

            setPreset(undefined)
            dispatch({ type: 'LOAD', state: decoded })
        }

        window.addEventListener('hashchange', onHashChange)
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [])

    useEffect(() => {
        if (!hydrated.current) return

        const timer = setTimeout(() => {
            const hash = state.layers.length ? `${HASH_PREFIX}${encodeState(state)}` : ''
            window.history.replaceState(null, '', `${window.location.pathname}${hash}`)
        }, 300)

        return () => clearTimeout(timer)
    }, [state])

    function handleAdd(method: string) {
        const id = createId()
        dispatch({ type: 'ADD_LAYER', id, method })
        setSelectedId(id)
        setPanel('controls')
    }

    function load(next: PlaygroundState) {
        dispatch({ type: 'LOAD', state: next })
        setSelectedId(next.layers[next.layers.length - 1]?.id)
    }

    function handlePreset(name: string) {
        setPreset(name)
        load(presetToState(name))
    }

    function handleRandom() {
        setPreset(undefined)
        load(generateRandomState())
    }

    function handleReset() {
        setPreset(undefined)
        dispatch({ type: 'RESET' })
    }

    async function handleShare() {
        const url = `${window.location.origin}${window.location.pathname}${HASH_PREFIX}${encodeState(state)}`
        try {
            await navigator.clipboard.writeText(url)
            setShared(true)
            setTimeout(() => setShared(false), 1500)
        } catch {
            window.history.replaceState(null, '', url)
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.toolbar}>
                <label className="sr-only" htmlFor="playground-preset">
                    Start from a preset
                </label>
                <PresetSelect id="playground-preset" value={preset} className={classes.preset} onSelect={handlePreset} />

                <Button variant="accent" size="sm" onClick={handleRandom}>
                    ✦ Surprise me
                </Button>

                <div className={classes.toolbarActions}>
                    <Button size="sm" disabled={!history.past.length} onClick={() => dispatch({ type: 'UNDO' })}>
                        Undo
                    </Button>
                    <Button size="sm" disabled={!history.future.length} onClick={() => dispatch({ type: 'REDO' })}>
                        Redo
                    </Button>
                    <Button size="sm" disabled={!state.layers.length} onClick={handleReset}>
                        Reset
                    </Button>
                    <Button size="sm" disabled={!state.layers.length} onClick={handleShare}>
                        {shared ? '✓ Link copied' : 'Share'}
                    </Button>
                    <span role="status" className="sr-only">
                        {shared ? 'Link copied to clipboard' : ''}
                    </span>
                </div>
            </div>

            <SegmentedTabs
                tabs={panelTabs}
                activeId={panel}
                onChange={(id) => setPanel(id as PanelTab)}
                ariaLabel="Playground panels"
                className={classes.tabs}
            />

            <div className={classes.side}>
                <Panel title="Layers" className={classes.panel} data-panel="layers" data-active={panel === 'layers'}>
                    <LayerList
                        layers={state.layers}
                        selectedId={selected?.id}
                        errors={result.errors}
                        warnings={result.warnings}
                        dispatch={dispatch}
                        onSelect={(id) => {
                            setSelectedId(id)
                            setPanel('controls')
                        }}
                    />
                    <AddLayerMenu alwaysOpen={!state.layers.length} onAdd={handleAdd} />
                </Panel>

                <Panel
                    title={selected ? findMethod(selected.method)?.label : 'Controls'}
                    className={classes.panel}
                    data-panel="controls"
                    data-active={panel === 'controls'}
                >
                    <LayerControls
                        layer={selected}
                        error={selected && result.errors[selected.id]}
                        warning={selected && result.warnings[selected.id]}
                        dispatch={dispatch}
                    />
                </Panel>
            </div>

            <div className={classes.stage}>
                <section className={classes.previewPanel} aria-label="Preview">
                    <Preview style={result.style} error={result.error} empty={!state.layers.length}>
                        <Button
                            size="sm"
                            className={classes.previewAction}
                            disabled={!state.layers.length || Boolean(result.error)}
                            onClick={() => setContextOpen(true)}
                        >
                            View in context
                        </Button>
                    </Preview>
                </section>

                <ContextModal
                    open={contextOpen}
                    onClose={() => setContextOpen(false)}
                    title="Playground"
                    style={result.style}
                    code={snippet}
                    css={css}
                />

                <Panel aria-label="Code" className={classes.panel} data-panel="code" data-active={panel === 'code'}>
                    <Output snippet={snippet} css={css} />
                </Panel>
            </div>
        </div>
    )
}

export default Playground
