'use client'

import { findMethod } from '@/src/data/playgroundRegistry.ts'
import { Field, FieldGroupProps, LayerControlsProps } from '@/src/models/playground.ts'
import Button from '@cmp/buttons/button.tsx'
import FieldControl from '@cmp/playground/fieldControl.tsx'
import classes from './playground.module.css'

const FieldGroup = ({ fields, values, onChange }: FieldGroupProps) => {
    const main = fields.filter((field) => !field.advanced)
    const advanced = fields.filter((field) => field.advanced)

    const renderField = (field: Field) => (
        <FieldControl key={field.key} field={field} value={values[field.key]} onChange={(value) => onChange(field.key, value)} />
    )

    return (
        <>
            {main.map(renderField)}
            {advanced.length > 0 && (
                <details className={classes.advanced}>
                    <summary>More options</summary>
                    <div className={classes.advancedFields}>{advanced.map(renderField)}</div>
                </details>
            )}
        </>
    )
}

const LayerControls = ({ layer, error, warning, dispatch }: LayerControlsProps) => {
    const method = layer ? findMethod(layer.method) : undefined

    if (!layer || !method) {
        return <p className={classes.empty}>Select a layer to edit its options.</p>
    }

    return (
        <div className={classes.controls}>
            {error && (
                <p role="alert" className={classes.error}>
                    {error}
                </p>
            )}
            {warning && <p className={`${classes.error} ${classes.warning}`}>{warning}</p>}

            <FieldGroup
                fields={method.fields}
                values={layer.params}
                onChange={(key, value) => dispatch({ type: 'UPDATE_PARAMS', id: layer.id, key, value })}
            />

            {method.pointFields && (
                <div className={classes.points}>
                    {layer.points.map((point, index) => (
                        <fieldset key={index} className={classes.point}>
                            <legend>
                                {method.pointLabel} {index + 1}
                            </legend>
                            <FieldGroup
                                fields={method.pointFields ?? []}
                                values={point}
                                onChange={(key, value) =>
                                    dispatch({
                                        type: 'UPDATE_POINT',
                                        id: layer.id,
                                        index,
                                        key,
                                        value,
                                    })
                                }
                            />
                            <Button
                                variant="secondary"
                                size="sm"
                                className={classes.alignStart}
                                disabled={layer.points.length <= (method.minPoints ?? 0)}
                                onClick={() => dispatch({ type: 'REMOVE_POINT', id: layer.id, index })}
                            >
                                Remove {method.pointLabel?.toLowerCase()}
                            </Button>
                        </fieldset>
                    ))}
                    <Button size="sm" onClick={() => dispatch({ type: 'ADD_POINT', id: layer.id })}>
                        Add {method.pointLabel?.toLowerCase()}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default LayerControls
