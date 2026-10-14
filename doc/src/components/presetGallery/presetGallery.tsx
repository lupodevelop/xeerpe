import { Preset, presetCategories } from 'xeerpe'
import classes from './presetGallery.module.css'
import PresetTile from './presetTile.tsx'
import { PresetGalleryProps } from '@/src/models/presetGallery.ts'
import { getPresetCode } from '@/src/utils/presetCode.ts'

const PresetGallery = async ({ category }: PresetGalleryProps) => {
    const names = presetCategories[category] ?? []
    const expandedCodes = await Promise.all(names.map(getPresetCode))

    return (
        <div className={classes.gallery}>
            {names.map((name, index) => (
                <PresetTile key={name} name={name} style={new Preset(name).toStyle()} expandedCode={expandedCodes[index]} />
            ))}
        </div>
    )
}

export default PresetGallery
