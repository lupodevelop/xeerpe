'use client';

import classes from './button.module.css';
import {ButtonProps} from "@/src/models/button.ts";

const Button = ({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) => {
    return (
        <button
            type="button"
            className={`${classes.xeerpeButton} ${classes[variant]}${size === 'sm' ? ` ${classes.sm}` : ''}${className ? ` ${className}` : ''}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;