import classes from './checkbox.module.css'

interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
    label: string
}

const Checkbox = ({label, className, ...rest}: CheckboxProps) => (
    <label className={`${classes.checkbox}${className ? ` ${className}` : ''}`}>
        <input type="checkbox" {...rest} />
        <span>{label}</span>
    </label>
)

export default Checkbox
