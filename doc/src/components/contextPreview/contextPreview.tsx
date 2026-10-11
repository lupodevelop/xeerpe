'use client'

import {useState} from 'react'
import classes from './contextPreview.module.css'
import ContextModal from "@cmp/contextPreview/contextModal.tsx";
import {ContextPreviewProps} from "@/src/models/contextPreview.ts";

const ContextPreview = ({title, style, code, expandedCode, children, className}: ContextPreviewProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className={`${classes.trigger} ${className ?? ''}`}
                onClick={() => setOpen(true)}
                aria-label={`View ${title} in a real context`}
            >
                {children}
                <span className={classes.hint}>View in context</span>
            </button>

            <ContextModal
                open={open}
                onClose={() => setOpen(false)}
                title={title}
                style={style}
                code={code}
                expandedCode={expandedCode}
            />
        </>
    )
}

export default ContextPreview
