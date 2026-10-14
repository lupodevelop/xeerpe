import classes from './checkbox.module.css'
import { CheckboxProps } from '@/src/models/checkbox.ts'

const Checkbox = ({ label, className, ...rest }: CheckboxProps) => (
    <label className={`${classes.checkbox}${className ? ` ${className}` : ''}`}>
        <input type="checkbox" {...rest} />
        <span>{label}</span>
    </label>
)

export default Checkbox
