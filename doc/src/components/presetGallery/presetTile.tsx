'use client'

import {useState} from 'react'
import classes from './presetGallery.module.css'
import ContextPreview from "@cmp/contextPreview/contextPreview.tsx";
import {PresetTileProps} from "@/src/models/presetGallery.ts";

const PresetTile = ({name, style, expandedCode}: PresetTileProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(name)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className={classes.tile}>
            <ContextPreview title={name} style={style} code={`new Preset('${name}').toStyle()`} expandedCode={expandedCode} className={classes.previewButton}>
                <span className={classes.preview} style={style} />
            </ContextPreview>
            <span className={classes.caption}>
                <code className={classes.name}>{name}</code>
                <button
                    type="button"
                    className={classes.action}
                    onClick={handleCopy}
                    aria-label={`Copy the name of the ${name} preset`}
                >
                    {copied ? '✓ Copied' : 'Copy name'}
                </button>
            </span>
        </div>
    )
}

export default PresetTile
