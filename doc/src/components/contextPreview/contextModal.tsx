'use client'

import {useEffect, useRef, useState} from 'react'
import classes from './contextPreview.module.css'
import Button from "@cmp/buttons/button.tsx";
import SegmentedTabs from "@cmp/segmentedTabs/segmentedTabs.tsx";
import {styleToCss} from "@/src/utils/styleToCss.ts";
import {
    ContextCopyKind,
    ContextModalProps,
    ContextScene,
    ContextSceneProps,
    ContextSceneTab,
} from "@/src/models/contextPreview.ts";

const scenes: ContextSceneTab[] = [
    {id: 'hero', label: 'Hero'},
    {id: 'card', label: 'Card'},
    {id: 'button', label: 'Button'},
    {id: 'page', label: 'Page'},
]

const Scene = ({scene, style}: ContextSceneProps) => {
    switch (scene) {
        case 'hero':
            return (
                <div className={classes.browser}>
                    <div className={classes.browserBar}><i/><i/><i/></div>
                    <section className={classes.hero}>
                        <span className={classes.layer} style={style}/>
                        <div className={classes.heroNav}>
                            <strong>Company name</strong>
                            <span>Product</span><span>Pricing</span><span>Docs</span>
                        </div>
                        <div className={classes.heroBody}>
                            <h3>Build something people love</h3>
                            <p>A short line that explains what you do and why it matters.</p>
                            <span className={classes.heroCta}>Get started</span>
                        </div>
                    </section>
                </div>
            )
        case 'card':
            return (
                <div className={classes.cardStage}>
                    <article className={classes.card}>
                        <span className={classes.layer} style={style}/>
                        <span className={classes.badge}>New</span>
                        <h3>Weekly report</h3>
                        <p>Your team shipped 24 changes and closed 18 issues this week.</p>
                    </article>
                </div>
            )
        case 'button':
            return (
                <div className={classes.cardStage}>
                    <div className={classes.buttons}>
                        <button type="button" className={classes.button}>
                            <span className={classes.layer} style={style}/>
                            <span>Get started</span>
                        </button>
                        <button type="button" className={`${classes.button} ${classes.buttonSmall}`}>
                            <span className={classes.layer} style={style}/>
                            <span>Learn more</span>
                        </button>
                    </div>
                </div>
            )
        case 'page':
            return (
                <div className={classes.page}>
                    <span className={classes.layer} style={style}/>
                    <div className={classes.pageContent}>
                        <div className={classes.pageHeader}>
                            <strong>Dashboard</strong>
                            <span className={classes.avatar}/>
                        </div>
                        <div className={classes.pageGrid}>
                            <div/><div/><div/>
                        </div>
                        <div className={classes.pageRows}>
                            <div/><div/><div/>
                        </div>
                    </div>
                </div>
            )
    }
}

const ContextModal = ({open, onClose, title, style, code, expandedCode, css}: ContextModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [copied, setCopied] = useState<ContextCopyKind | null>(null)
    const [darkText, setDarkText] = useState(false)
    const [scene, setScene] = useState<ContextScene>('hero')

    const copy = async (kind: ContextCopyKind) => {
        try {
            const text = {code: code ?? '', expanded: expandedCode ?? '', css: css ?? styleToCss(style, title)}[kind]
            await navigator.clipboard.writeText(text)
            setCopied(kind)
            setTimeout(() => setCopied(null), 1500)
        } catch {
            setCopied(null)
        }
    }

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal()
        if (!open && dialog.open) dialog.close()
    }, [open])

    useEffect(() => {
        if (!open) return
        const previous = document.documentElement.style.overflow
        document.documentElement.style.overflow = 'hidden'
        return () => {
            document.documentElement.style.overflow = previous
        }
    }, [open])

    return (
        <dialog
            ref={dialogRef}
            className={classes.dialog}
            aria-label={`${title} in context`}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === dialogRef.current) onClose()
            }}
        >
            {open && (
                <div className={classes.panel}>
                    <header className={classes.header}>
                        <strong className={classes.title}>{title}</strong>
                        <SegmentedTabs
                            tabs={scenes}
                            activeId={scene}
                            onChange={(id) => setScene(id as ContextScene)}
                            ariaLabel="Context"
                            className={classes.tabs}
                        />
                        <Button
                            size="sm"
                            aria-pressed={darkText}
                            className={`${classes.toggle} ${darkText ? classes.toggleOn : ''}`}
                            onClick={() => setDarkText((value) => !value)}
                        >
                            Dark text
                        </Button>
                        <Button size="sm" variant="icon" onClick={onClose} aria-label="Close">
                            ✕
                        </Button>
                    </header>
                    <div className={classes.stage} data-text={darkText ? 'dark' : 'light'}>
                        <Scene scene={scene} style={style}/>
                    </div>
                    <footer className={classes.footer}>
                        {code && (
                            <Button size="sm" title={code} onClick={() => copy('code')}>
                                {copied === 'code' ? '✓ Copied' : expandedCode ? 'Copy as Preset' : 'Copy code'}
                            </Button>
                        )}
                        {expandedCode && (
                            <Button size="sm" title={expandedCode} onClick={() => copy('expanded')}>
                                {copied === 'expanded' ? '✓ Copied' : 'Copy as Builder'}
                            </Button>
                        )}
                        <Button size="sm" onClick={() => copy('css')}>
                            {copied === 'css' ? '✓ Copied' : 'Copy CSS'}
                        </Button>
                    </footer>
                </div>
            )}
        </dialog>
    )
}

export default ContextModal
