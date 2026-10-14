'use client'

import { KeyboardEvent, useRef } from 'react'
import { SegmentedTabsProps } from '@/src/models/segmentedTabs.ts'
import classes from './segmentedTabs.module.css'

const SegmentedTabs = ({ tabs, activeId, onChange, ariaLabel, idPrefix, className }: SegmentedTabsProps) => {
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        event.preventDefault()
        const next = tabs[(index + step + tabs.length) % tabs.length]
        onChange(next.id)
        tabRefs.current[next.id]?.focus()
    }

    return (
        <div role="tablist" aria-label={ariaLabel} className={`${classes.list}${className ? ` ${className}` : ''}`}>
            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    ref={(element) => {
                        tabRefs.current[tab.id] = element
                    }}
                    type="button"
                    role="tab"
                    id={idPrefix ? `${idPrefix}-${tab.id}` : undefined}
                    aria-selected={tab.id === activeId}
                    tabIndex={tab.id === activeId ? 0 : -1}
                    className={classes.tab}
                    onClick={() => onChange(tab.id)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export default SegmentedTabs
