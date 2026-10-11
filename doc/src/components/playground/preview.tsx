'use client'

import {Component} from 'react'
import classes from './playground.module.css'
import {BoundaryProps, BoundaryState, PreviewProps} from '@/src/models/playground.ts'

class PreviewBoundary extends Component<BoundaryProps, BoundaryState> {
    state: BoundaryState = {failed: false, resetKey: this.props.resetKey}

    static getDerivedStateFromError(): Partial<BoundaryState> {
        return {failed: true}
    }

    static getDerivedStateFromProps(props: BoundaryProps, state: BoundaryState): BoundaryState | null {
        return props.resetKey !== state.resetKey ? {failed: false, resetKey: props.resetKey} : null
    }

    render() {
        if (this.state.failed) {
            return <p role="alert" className={classes.error}>The preview could not be rendered.</p>
        }

        return this.props.children
    }
}

const Preview = ({style, error, empty}: PreviewProps) => (
    <div className={classes.previewFrame}>
        <div className={classes.checker}>
            <PreviewBoundary resetKey={JSON.stringify(style)}>
                <div className={classes.previewSurface} style={style} />
            </PreviewBoundary>
        </div>
        {empty && <p className={classes.previewHint}>Your background appears here. Add a layer, pick a preset or hit Surprise me.</p>}
        {error && <p role="alert" className={classes.previewError}>{error}</p>}
    </div>
)

export default Preview
