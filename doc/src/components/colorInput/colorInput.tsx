import classes from './colorInput.module.css'

const ColorInput = ({className, ...rest}: Omit<React.ComponentProps<'input'>, 'type'>) => (
    <input type="color" className={`${classes.color}${className ? ` ${className}` : ''}`} {...rest} />
)

export default ColorInput
