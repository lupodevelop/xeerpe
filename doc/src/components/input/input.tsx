import classes from './input.module.css'

const Input = ({ className, ...rest }: React.ComponentProps<'input'>) => (
    <input className={`${classes.input}${className ? ` ${className}` : ''}`} {...rest} />
)

export default Input
