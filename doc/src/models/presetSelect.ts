export interface PresetOption {
    name: string
    category: string
    label: string
}

export interface PresetOptionGroup {
    category: string
    label: string
    options: PresetOption[]
}

export interface PresetSelectProps {
    id?: string
    value?: string
    placeholder?: string
    className?: string
    onSelect: (name: string) => void
}

export interface PresetSwatchProps {
    name: string
    className?: string
}
