import classes from './select.module.css'

const Select = ({ className, ...rest }: React.ComponentProps<'select'>) => (
    <select className={`${classes.select}${className ? ` ${className}` : ''}`} {...rest} />
)

export default Select
