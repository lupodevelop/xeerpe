'use client'

import { useId } from 'react'
import { FieldControlProps } from '@/src/models/playground.ts'
import FormField from '@cmp/formField/formField.tsx'
import Input from '@cmp/input/input.tsx'
import Select from '@cmp/select/select.tsx'
import Checkbox from '@cmp/checkbox/checkbox.tsx'
import RangeInput from '@cmp/rangeInput/rangeInput.tsx'
import ColorInput from '@cmp/colorInput/colorInput.tsx'
import classes from './playground.module.css'

const HEX_PICKER = /^#[0-9a-fA-F]{6}$/

const toPickerValue = (color: string): string => {
    if (HEX_PICKER.test(color)) return color
    if (typeof document === 'undefined') return '#000000'

    const context = document.createElement('canvas').getContext('2d')
    if (!context) return '#000000'

    context.fillStyle = '#000000'
    context.fillStyle = color
    const resolved = context.fillStyle

    if (HEX_PICKER.test(resolved)) return resolved

    const channels = resolved
        .match(/[\d.]+/g)
        ?.slice(0, 3)
        .map(Number)
    return channels?.length === 3 ? `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}` : '#000000'
}

const FieldControl = ({ field, value, onChange }: FieldControlProps) => {
    const id = useId()
    const current = value ?? field.fallback ?? ''

    if (field.kind === 'boolean') {
        return <Checkbox label={field.label} checked={Boolean(current)} onChange={(event) => onChange(event.target.checked)} />
    }

    return (
        <FormField label={field.label} htmlFor={id}>
            {field.kind === 'color' && (
                <div className={classes.row}>
                    <ColorInput
                        aria-label={`${field.label} picker`}
                        value={toPickerValue(String(current))}
                        onChange={(event) => onChange(event.target.value)}
                    />
                    <Input
                        id={id}
                        type="text"
                        value={String(current)}
                        placeholder={String(field.fallback ?? 'transparent')}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        onChange={(event) => onChange(event.target.value)}
                    />
                </div>
            )}

            {field.kind === 'text' && (
                <Input
                    id={id}
                    type="text"
                    value={String(current)}
                    placeholder={field.placeholder}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={(event) => onChange(event.target.value)}
                />
            )}

            {field.kind === 'number' && (
                <div className={classes.row}>
                    {field.min !== undefined && field.max !== undefined && (
                        <RangeInput
                            aria-label={`${field.label} slider`}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            value={Number(current)}
                            onChange={(event) => onChange(Number(event.target.value))}
                        />
                    )}
                    <Input
                        id={id}
                        type="number"
                        inputMode="decimal"
                        className={classes.numberInput}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={String(current)}
                        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
                    />
                </div>
            )}

            {field.kind === 'select' && (
                <Select id={id} value={String(current)} onChange={(event) => onChange(event.target.value)}>
                    {field.fallback === undefined && <option value="">Default</option>}
                    {field.options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            )}
        </FormField>
    )
}

export default FieldControl
