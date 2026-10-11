import classes from './rangeInput.module.css'

const RangeInput = ({className, ...rest}: Omit<React.ComponentProps<'input'>, 'type'>) => (
    <input type="range" className={`${classes.range}${className ? ` ${className}` : ''}`} {...rest} />
)

export default RangeInput
