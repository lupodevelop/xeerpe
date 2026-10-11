'use client'

import {findMethod} from '@/src/data/playgroundRegistry.ts'
import {LayerListProps} from '@/src/models/playground.ts'
import {createId} from '@/src/utils/playground.ts'
import Button from '@cmp/buttons/button.tsx'
import classes from './playground.module.css'

const LayerList = ({layers, selectedId, errors, warnings, dispatch, onSelect}: LayerListProps) => {
    if (!layers.length) {
        return <p className={classes.empty}>Nothing here yet. Pick a layer type below, or start from a preset.</p>
    }

    return (
        <ul className={classes.layerList} aria-label="Layers, top first">
            {layers.map((layer, index) => {
                const method = findMethod(layer.method)
                const label = method?.label ?? layer.method
                const isSelected = layer.id === selectedId

                return (
                    <li
                        key={layer.id}
                        className={classes.layerItem}
                        data-selected={isSelected}
                        data-hidden={!layer.visible}
                        data-error={Boolean(errors[layer.id])}
                        data-warning={Boolean(warnings[layer.id])}
                    >
                        <button
                            type="button"
                            className={classes.layerSelect}
                            aria-pressed={isSelected}
                            onClick={() => onSelect(layer.id)}
                        >
                            <span className={classes.layerName}>{label}</span>
                            <span className={classes.layerKind}>{method?.group}</span>
                        </button>

                        <div className={classes.layerActions}>
                            <Button
                                variant="icon"
                                size="sm"
                                title={layer.visible ? 'Hide layer' : 'Show layer'}
                                aria-label={layer.visible ? `Hide ${label}` : `Show ${label}`}
                                aria-pressed={!layer.visible}
                                onClick={() => dispatch({type: 'TOGGLE_VISIBILITY', id: layer.id})}
                            >
                                {layer.visible ? '◉' : '○'}
                            </Button>
                            <Button
                                variant="icon"
                                size="sm"
                                title="Delete layer"
                                aria-label={`Delete ${label}`}
                                onClick={() => dispatch({type: 'REMOVE', id: layer.id})}
                            >
                                ✕
                            </Button>
                        </div>

                        {isSelected && (
                            <div className={classes.layerTools}>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    aria-label={`Move ${label} up`}
                                    disabled={index === 0}
                                    onClick={() => dispatch({type: 'MOVE', id: layer.id, direction: -1})}
                                >
                                    ↑ Up
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    aria-label={`Move ${label} down`}
                                    disabled={index === layers.length - 1}
                                    onClick={() => dispatch({type: 'MOVE', id: layer.id, direction: 1})}
                                >
                                    ↓ Down
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    aria-label={`Duplicate ${label}`}
                                    onClick={() => dispatch({type: 'DUPLICATE', id: layer.id, newId: createId()})}
                                >
                                    ⧉ Duplicate
                                </Button>
                            </div>
                        )}

                        {errors[layer.id] && (
                            <p role="alert" className={classes.layerError}>{errors[layer.id]}</p>
                        )}
                        {!errors[layer.id] && warnings[layer.id] && (
                            <p className={`${classes.layerError} ${classes.layerWarning}`}>{warnings[layer.id]}</p>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

export default LayerList
