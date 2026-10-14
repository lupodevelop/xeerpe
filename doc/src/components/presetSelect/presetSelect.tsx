'use client'

import { ChangeEvent, KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { presetCategories } from 'xeerpe'
import { PresetOption, PresetOptionGroup, PresetSelectProps } from '@/src/models/presetSelect.ts'
import Input from '@cmp/input/input.tsx'
import PresetSwatch from './presetSwatch.tsx'
import classes from './presetSelect.module.css'

const CHUNK = 36

const titleOf = (category: string): string => category.charAt(0).toUpperCase() + category.slice(1)

const allOptions: PresetOption[] = Object.entries(presetCategories).flatMap(([category, names]) =>
    names.map((name) => ({ name, category, label: titleOf(category) })),
)

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const haystacks = new Map(allOptions.map(({ name, category }) => [name, normalize(`${name}${category}`)]))

const toGroups = (options: PresetOption[]): PresetOptionGroup[] =>
    options.reduce<PresetOptionGroup[]>((groups, option) => {
        const last = groups[groups.length - 1]

        if (last?.category === option.category) last.options.push(option)
        else groups.push({ category: option.category, label: option.label, options: [option] })

        return groups
    }, [])

const PresetSelect = ({ id, value, placeholder = 'Start from a preset…', className, onSelect }: PresetSelectProps) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [count, setCount] = useState(CHUNK)
    const [activeName, setActiveName] = useState<string>()

    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const baseId = useId()
    const listId = `${baseId}-list`
    const optionId = (name: string): string => `${baseId}-${name}`

    const matches = useMemo(() => {
        const term = normalize(query)
        return term ? allOptions.filter(({ name }) => haystacks.get(name)?.includes(term)) : allOptions
    }, [query])

    const groups = useMemo(() => toGroups(matches.slice(0, count)), [matches, count])
    const active = activeName && matches.some(({ name }) => name === activeName) ? activeName : matches[0]?.name

    useEffect(() => {
        if (open) searchRef.current?.focus({ preventScroll: true })
    }, [open])

    useEffect(() => {
        if (!open || !active) return
        listRef.current?.querySelector(`[data-name="${active}"]`)?.scrollIntoView({ block: 'nearest' })
    }, [open, active])

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!open || !sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) setCount((current) => current + CHUNK)
            },
            { root: listRef.current, rootMargin: '200px' },
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [open, count, matches.length])

    useEffect(() => {
        if (!open) return

        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
        }

        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [open])

    function expand() {
        const selected = value ? allOptions.findIndex(({ name }) => name === value) : -1

        setQuery('')
        setCount(Math.max(CHUNK, selected + CHUNK))
        setActiveName(value)
        setOpen(true)
    }

    function collapse() {
        setOpen(false)
        triggerRef.current?.focus()
    }

    function choose(name: string) {
        setOpen(false)
        setActiveName(name)
        onSelect(name)
        triggerRef.current?.focus()
    }

    function moveTo(index: number) {
        const next = matches[Math.min(Math.max(index, 0), matches.length - 1)]
        if (!next) return

        setActiveName(next.name)
        setCount((current) => Math.max(current, index + CHUNK))
    }

    function handleQuery(event: ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value)
        setCount(CHUNK)
        setActiveName(undefined)
        if (listRef.current) listRef.current.scrollTop = 0
    }

    function handleKeys(event: KeyboardEvent<HTMLInputElement>) {
        const index = matches.findIndex(({ name }) => name === active)

        if (event.key === 'ArrowDown') moveTo(index + 1)
        else if (event.key === 'ArrowUp') moveTo(index - 1)
        else if (event.key === 'Home') moveTo(0)
        else if (event.key === 'End') moveTo(matches.length - 1)
        else if (event.key === 'Enter' && active) choose(active)
        else if (event.key === 'Escape') collapse()
        else return

        event.preventDefault()
    }

    return (
        <div
            ref={rootRef}
            className={`${classes.root}${className ? ` ${className}` : ''}`}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
            }}
        >
            <button
                ref={triggerRef}
                id={id}
                type="button"
                className={classes.trigger}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => (open ? collapse() : expand())}
                onKeyDown={(event) => {
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                    event.preventDefault()
                    expand()
                }}
            >
                {value && <PresetSwatch name={value} className={classes.triggerSwatch} />}
                <span className={classes.triggerLabel} data-placeholder={!value}>
                    {value || placeholder}
                </span>
            </button>

            {open && (
                <div className={classes.popover}>
                    <div className={classes.search}>
                        <Input
                            ref={searchRef}
                            type="text"
                            role="combobox"
                            value={query}
                            placeholder="Search presets…"
                            autoComplete="off"
                            aria-label="Search presets"
                            aria-controls={listId}
                            aria-expanded="true"
                            aria-autocomplete="list"
                            aria-activedescendant={active ? optionId(active) : undefined}
                            onChange={handleQuery}
                            onKeyDown={handleKeys}
                        />
                        <p role="status" className={classes.meta}>
                            {matches.length} {matches.length === 1 ? 'preset' : 'presets'}
                        </p>
                    </div>

                    <div ref={listRef} id={listId} role="listbox" aria-label="Presets" className={classes.list}>
                        {groups.map((group) => (
                            <div
                                key={group.category}
                                role="group"
                                aria-labelledby={`${baseId}-${group.category}-label`}
                                className={classes.group}
                            >
                                <p id={`${baseId}-${group.category}-label`} className={classes.groupLabel}>
                                    {group.label}
                                </p>

                                {group.options.map((option) => (
                                    <button
                                        key={option.name}
                                        type="button"
                                        role="option"
                                        tabIndex={-1}
                                        id={optionId(option.name)}
                                        data-name={option.name}
                                        data-active={option.name === active}
                                        aria-selected={option.name === value}
                                        className={classes.option}
                                        onMouseMove={() => setActiveName(option.name)}
                                        onClick={() => choose(option.name)}
                                    >
                                        <PresetSwatch name={option.name} />
                                        <code className={classes.name}>{option.name}</code>
                                        {option.name === value && (
                                            <span aria-hidden="true" className={classes.check}>
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ))}

                        {matches.length > count && (
                            <div ref={sentinelRef} aria-hidden="true" className={classes.sentinel}>
                                Loading more presets…
                            </div>
                        )}

                        {!matches.length && <p className={classes.empty}>No preset matches “{query}”.</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PresetSelect
