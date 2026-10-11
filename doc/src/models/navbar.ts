import {ReactNode} from "react";

export interface HomeLinkProps {
    className?: string
    children: ReactNode
}

export interface NavLinkProps {
    href: string
    children: ReactNode
}

export interface NavbarLink {
    title: string;
    href: string;
    external?: boolean;
}