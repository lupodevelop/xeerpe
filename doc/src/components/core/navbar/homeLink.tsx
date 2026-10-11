'use client'

import Link from "next/link";
import {useSidebar} from "@/src/context/sidebarContext.tsx";
import {HomeLinkProps} from "@/src/models/navbar.ts";

const HomeLink = ({className, children}: HomeLinkProps) => {
    const {close} = useSidebar();
    return (
        <Link href="/" className={className} onClick={close}>
            {children}
        </Link>
    )
}

export default HomeLink
