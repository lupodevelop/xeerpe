export type TocItem = { id: string; text: string; depth: number }

export interface TableOfContentsProps {
    items: TocItem[]
}
