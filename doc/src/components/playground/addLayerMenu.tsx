'use client'

import {useState} from 'react'
import {playgroundGroups, playgroundMethods} from '@/src/data/playgroundRegistry.ts'
import Button from '@cmp/buttons/button.tsx'
import classes from './playground.module.css'
import {AddLayerMenuProps} from '@/src/models/playground.ts'

const AddLayerMenu = ({alwaysOpen, onAdd}: AddLayerMenuProps) => {
    const [open, setOpen] = useState(false)
    const visible = open || alwaysOpen

    return (
        <div className={classes.addMenu}>
            {!alwaysOpen && (
                <Button size="sm" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
                    {open ? 'Close' : '+ Add layer'}
                </Button>
            )}

            {visible && playgroundGroups.map(({group, title}) => (
                <div key={group} className={classes.addGroup}>
                    <h3 className={classes.addGroupTitle}>{title}</h3>
                    <div className={classes.chips}>
                        {playgroundMethods
                            .filter((method) => method.group === group)
                            .map((method) => (
                                <button
                                    key={method.name}
                                    type="button"
                                    className={classes.chip}
                                    onClick={() => {
                                        onAdd(method.name)
                                        setOpen(false)
                                    }}
                                >
                                    {method.label}
                                </button>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AddLayerMenu
