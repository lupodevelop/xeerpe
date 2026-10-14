'use client'

import { useEffect, useState } from 'react'
import { codeTheme } from '@/src/config/codeTheme.ts'
import Button from '@cmp/buttons/button.tsx'
import SegmentedTabs from '@cmp/segmentedTabs/segmentedTabs.tsx'
import codeBlockClasses from '@cmp/codeBlock/codeBlock.module.css'
import classes from './playground.module.css'
import { HighlightedOutput, OutputProps, OutputTab, OutputTabItem } from '@/src/models/playground.ts'

const tabs: OutputTabItem[] = [
    { id: 'snippet', label: 'Snippet', lang: 'ts' },
    { id: 'css', label: 'CSS', lang: 'css' },
]

const Output = ({ snippet, css }: OutputProps) => {
    const [active, setActive] = useState<OutputTab>('snippet')
    const [copied, setCopied] = useState(false)
    const [highlighted, setHighlighted] = useState<HighlightedOutput | null>(null)

    const tab = tabs.find((item) => item.id === active) ?? tabs[0]
    const code = active === 'snippet' ? snippet : css

    useEffect(() => {
        let cancelled = false

        const timer = setTimeout(async () => {
            const { codeToHtml } = await import('shiki')
            const html = await codeToHtml(code, { lang: tab.lang, theme: codeTheme })
            if (!cancelled) setHighlighted({ code, html })
        }, 150)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [code, tab.lang])

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className={classes.output}>
            <div className={classes.outputHeader}>
                <SegmentedTabs
                    tabs={tabs}
                    activeId={active}
                    onChange={(id) => setActive(id as OutputTab)}
                    ariaLabel="Output format"
                    idPrefix="output-tab"
                />
                <Button size="sm" onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy'}
                </Button>
                <span role="status" className="sr-only">
                    {copied ? 'Code copied to clipboard' : ''}
                </span>
            </div>

            <div
                id="output-panel"
                role="tabpanel"
                aria-labelledby={`output-tab-${active}`}
                className={`${codeBlockClasses.wrapper} ${classes.code}`}
            >
                {highlighted?.code === code ? (
                    <div dangerouslySetInnerHTML={{ __html: highlighted.html }} />
                ) : (
                    <pre tabIndex={0}>
                        <code>{code}</code>
                    </pre>
                )}
            </div>
        </div>
    )
}

export default Output
