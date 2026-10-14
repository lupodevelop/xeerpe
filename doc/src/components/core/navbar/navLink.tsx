'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classes from './navbar.module.css'
import { NavLinkProps } from '@/src/models/navbar.ts'

const NavLink = ({ href, children }: NavLinkProps) => {
    const pathname = usePathname()
    const isActive = pathname === href || pathname.startsWith(`${href}/`)

    return (
        <Link href={href} className={isActive ? classes.active : undefined} aria-current={isActive ? 'page' : undefined}>
            {children}
        </Link>
    )
}

export default NavLink
