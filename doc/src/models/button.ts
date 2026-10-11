import {ButtonHTMLAttributes, ReactNode} from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon' | 'accent';
    size?: 'md' | 'sm';
    children: ReactNode;
}