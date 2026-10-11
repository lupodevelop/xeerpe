import {FormFieldProps} from '@/src/models/formField.ts'
import classes from './formField.module.css'

const FormField = ({label, htmlFor, children}: FormFieldProps) => (
    <div className={classes.field}>
        <label htmlFor={htmlFor} className={classes.label}>{label}</label>
        {children}
    </div>
)

export default FormField
