import {ComponentProps} from "react";

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
    label: string
}
