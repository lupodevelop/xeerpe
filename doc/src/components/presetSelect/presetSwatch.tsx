import { PresetSwatchProps } from '@/src/models/presetSelect.ts'
import { presetStyle } from '@/src/utils/presetStyle.ts'
import classes from './presetSelect.module.css'

const PresetSwatch = ({ name, className }: PresetSwatchProps) => (
    <span aria-hidden="true" className={`${classes.swatch}${className ? ` ${className}` : ''}`} style={presetStyle(name)} />
)

export default PresetSwatch
