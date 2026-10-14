'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { SidebarContextValue } from '@/src/models/sidebar.ts'
import { ChildrenProps } from '@/src/models/layout.ts'

const SidebarContext = createContext<SidebarContextValue | null>(null)

export const SidebarProvider = ({ children }: ChildrenProps) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [open])

    return (
        <SidebarContext.Provider value={{ open, toggle: () => setOpen((o) => !o), close: () => setOpen(false) }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const ctx = useContext(SidebarContext)
    if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
    return ctx
}
