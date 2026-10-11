import {CSSProperties, ReactNode} from "react";

export type ContextScene = 'hero' | 'card' | 'button' | 'page'

export type ContextCopyKind = 'code' | 'expanded' | 'css'

export interface ContextSceneTab {
    id: ContextScene
    label: string
}

export interface ContextSceneProps {
    scene: ContextScene
    style: CSSProperties
}

export interface ContextModalProps {
    open: boolean
    onClose: () => void
    title: string
    style: CSSProperties
    code?: string
    expandedCode?: string
    css?: string
}

export interface ContextPreviewProps {
    title: string
    style: CSSProperties
    code?: string
    expandedCode?: string
    children: ReactNode
    className?: string
}
