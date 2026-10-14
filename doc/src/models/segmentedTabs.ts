export interface SegmentedTab {
    id: string
    label: string
}

export interface SegmentedTabsProps {
    tabs: SegmentedTab[]
    activeId: string
    onChange: (id: string) => void
    ariaLabel: string
    idPrefix?: string
    className?: string
}
