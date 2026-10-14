import { ReactNode } from 'react'

export interface LinkButtonProps {
    href: string
    variant?: 'primary' | 'secondary' | 'accent'
    children: ReactNode
}
