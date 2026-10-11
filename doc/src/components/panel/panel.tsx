import {PanelProps} from '@/src/models/panel.ts'
import classes from './panel.module.css'

const Panel = ({title, className, children, ...rest}: PanelProps) => (
    <section className={`${classes.panel}${className ? ` ${className}` : ''}`} {...rest}>
        {title && <h2 className={classes.title}>{title}</h2>}
        {children}
    </section>
)

export default Panel
