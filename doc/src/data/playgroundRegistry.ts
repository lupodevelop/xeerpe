import {Field, Method, MethodGroup} from '@/src/models/playground.ts'

const backgroundSize: Field = {key: 'backgroundSize', label: 'Background size', kind: 'text', placeholder: 'auto', advanced: true}

const opacity: Field = {key: 'opacity', label: 'Opacity', kind: 'number', min: 0, max: 1, step: 0.05}

const radialPointFields: Field[] = [
    {key: 'from', label: 'From', kind: 'color', initial: '#7c3aedd9'},
    {key: 'to', label: 'To', kind: 'color', initial: 'transparent'},
    {key: 'position', label: 'Position', kind: 'text', initial: '50% 50%', placeholder: 'center'},
    {key: 'size', label: 'Size', kind: 'text', placeholder: 'farthest-corner', advanced: true},
    {key: 'colorFromPosition', label: 'From stop', kind: 'text', placeholder: '0%', advanced: true},
    {key: 'colorToPosition', label: 'To stop', kind: 'text', initial: '60%', placeholder: '100%', advanced: true},
]

const animation = (
    name: string,
    animates: string[],
    duration: string,
    easing: string,
    direction?: string
): Method => ({
    name,
    label: name.charAt(0).toUpperCase() + name.slice(1),
    group: 'animation',
    animates,
    fields: [
        {key: 'duration', label: 'Duration', kind: 'text', fallback: duration},
        ...(animates.some((property) => property === 'background-size' || property === 'background-position') ? [{
            key: 'target',
            label: 'Applies to',
            kind: 'select',
            fallback: 'gradients',
            options: animates.includes('background-position') ? ['gradients', 'patterns', 'all'] : ['gradients', 'all'],
        } satisfies Field] : []),
        {key: 'easing', label: 'Easing', kind: 'text', fallback: easing, advanced: true},
        ...(direction ? [{
            key: 'direction',
            label: 'Direction',
            kind: 'select',
            fallback: direction,
            options: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
            advanced: true,
        } satisfies Field] : []),
        {key: 'iterationCount', label: 'Iterations', kind: 'text', fallback: 'infinite', asNumber: true, advanced: true},
    ],
})

export const playgroundMethods: Method[] = [
    {
        name: 'linearGradient',
        label: 'Linear gradient',
        group: 'gradient',
        fields: [
            {key: 'from', label: 'From', kind: 'color', initial: '#2dd4bf'},
            {key: 'to', label: 'To', kind: 'color', initial: '#1e1b4b'},
            {key: 'angle', label: 'Angle', kind: 'text', placeholder: '135deg', excludes: ['direction']},
            {
                key: 'direction',
                label: 'Direction',
                kind: 'select',
                excludes: ['angle'],
                options: ['to top', 'to bottom', 'to left', 'to right', 'to top right', 'to bottom right', 'to top left', 'to bottom left'],
            },
            backgroundSize,
        ],
        pointKey: 'colors',
        pointLabel: 'Stop',
        pointFields: [
            {key: 'color', label: 'Color', kind: 'color', initial: '#f472b6'},
            {key: 'position', label: 'Position', kind: 'text', placeholder: '50%'},
        ],
        initialPoints: 0,
        minPoints: 0,
    },
    {
        name: 'radialGradient',
        label: 'Radial gradient',
        group: 'gradient',
        fields: [
            {key: 'from', label: 'From', kind: 'color', initial: '#f472b6'},
            {key: 'to', label: 'To', kind: 'color', initial: 'transparent'},
            {key: 'shape', label: 'Shape', kind: 'select', fallback: 'circle', options: ['circle', 'ellipse']},
            {key: 'position', label: 'Position', kind: 'text', placeholder: 'center'},
            {key: 'size', label: 'Size', kind: 'text', placeholder: 'farthest-corner', advanced: true},
            {key: 'colorFromPosition', label: 'From stop', kind: 'text', placeholder: '0%', advanced: true},
            {key: 'colorToPosition', label: 'To stop', kind: 'text', placeholder: '100%', advanced: true},
            backgroundSize,
        ],
    },
    {
        name: 'conicGradient',
        label: 'Conic gradient',
        group: 'gradient',
        fields: [
            {key: 'from', label: 'From', kind: 'color', initial: '#38bdf8'},
            {key: 'to', label: 'To', kind: 'color', initial: '#7c3aed'},
            {key: 'angle', label: 'Angle', kind: 'text', placeholder: '0deg'},
            {key: 'position', label: 'Position', kind: 'text', placeholder: 'center'},
            backgroundSize,
        ],
    },
    {
        name: 'meshGradient',
        label: 'Mesh gradient',
        group: 'gradient',
        fields: [
            {key: 'background', label: 'Background', kind: 'color', initial: '#070b1f'},
            backgroundSize,
        ],
        pointKey: 'layers',
        pointLabel: 'Point',
        pointFields: radialPointFields,
        initialPoints: 2,
        minPoints: 1,
        pointInitial: {
            from: '#22d3eea6',
            to: 'transparent',
            position: '80% 30%',
            colorToPosition: '55%',
        },
    },
    {
        name: 'dots',
        label: 'Dots',
        group: 'pattern',
        fields: [
            {key: 'color', label: 'Color', kind: 'color', initial: '#ffffff', fallback: '#000000'},
            {key: 'background', label: 'Background', kind: 'color', fallback: 'transparent'},
            {key: 'size', label: 'Size', kind: 'text', fallback: '20px'},
            {key: 'spacing', label: 'Spacing', kind: 'text', placeholder: '20px', advanced: true},
            {key: 'strokeWidth', label: 'Dot radius', kind: 'text', placeholder: '3px', advanced: true},
            opacity,
            backgroundSize,
        ],
    },
    {
        name: 'grid',
        label: 'Grid',
        group: 'pattern',
        fields: [
            {key: 'color', label: 'Color', kind: 'color', initial: '#00b300', fallback: '#000000'},
            {key: 'background', label: 'Background', kind: 'color', fallback: 'transparent'},
            {key: 'size', label: 'Size', kind: 'text', fallback: '40px'},
            {key: 'strokeWidth', label: 'Line width', kind: 'text', fallback: '1px', advanced: true},
            opacity,
            backgroundSize,
        ],
    },
    {
        name: 'stars',
        label: 'Stars',
        group: 'pattern',
        fields: [
            {key: 'color', label: 'Color', kind: 'color', fallback: '#ffffff'},
            {key: 'background', label: 'Background', kind: 'color', fallback: 'transparent'},
            {key: 'size', label: 'Tile size', kind: 'text', fallback: '200px'},
            {key: 'count', label: 'Count', kind: 'number', fallback: 24, min: 1, max: 200, step: 1},
            {key: 'seed', label: 'Seed', kind: 'number', fallback: 1, min: 1, max: 999, step: 1, advanced: true},
            {key: 'strokeWidth', label: 'Max radius', kind: 'text', fallback: '1.4px', advanced: true},
            opacity,
            backgroundSize,
        ],
    },
    {
        name: 'rays',
        label: 'Rays',
        group: 'pattern',
        fields: [
            {key: 'color', label: 'Color', kind: 'color', initial: '#ffffff', fallback: '#000000'},
            {key: 'background', label: 'Background', kind: 'color', fallback: 'transparent'},
            {key: 'count', label: 'Count', kind: 'number', fallback: 12, min: 1, max: 60, step: 1},
            {key: 'position', label: 'Position', kind: 'text', fallback: 'center', advanced: true},
            {key: 'angle', label: 'Angle', kind: 'text', fallback: '0deg', advanced: true},
            opacity,
            backgroundSize,
        ],
    },
    {
        name: 'noise',
        label: 'Noise',
        group: 'effect',
        fields: [
            {key: 'opacity', label: 'Opacity', kind: 'number', fallback: 0.25, min: 0, max: 1, step: 0.05},
            {key: 'scale', label: 'Scale', kind: 'number', fallback: 0.65, min: 0.01, max: 2, step: 0.01, advanced: true},
            {key: 'type', label: 'Type', kind: 'select', fallback: 'fractalNoise', options: ['fractalNoise', 'turbulence'], advanced: true},
            {key: 'octaves', label: 'Octaves', kind: 'number', fallback: 16, min: 1, max: 16, step: 1, advanced: true},
            backgroundSize,
        ],
    },
    {
        name: 'vignette',
        label: 'Vignette',
        group: 'effect',
        fields: [
            {key: 'color', label: 'Color', kind: 'color', fallback: '#000000'},
            {key: 'intensity', label: 'Intensity', kind: 'number', fallback: 0.2, min: 0, max: 1, step: 0.05},
            {key: 'spread', label: 'Spread', kind: 'number', fallback: 0.2, min: 0, max: 1, step: 0.05, advanced: true},
            backgroundSize,
        ],
    },
    {
        name: 'grain',
        label: 'Grain',
        group: 'effect',
        fields: [
            {key: 'intensity', label: 'Intensity', kind: 'number', fallback: 1, min: 0, max: 2, step: 0.1},
            {key: 'size', label: 'Size', kind: 'text', fallback: '100%', advanced: true},
            {key: 'animated', label: 'Animated', kind: 'boolean', fallback: false},
            backgroundSize,
        ],
    },
    {
        name: 'glow',
        label: 'Glow',
        group: 'effect',
        fields: [
            {key: 'color', label: 'Color', kind: 'color', initial: '#5eb847', fallback: '#ffffff'},
            {key: 'amount', label: 'Blur', kind: 'text', fallback: '20px'},
            {key: 'spread', label: 'Spread', kind: 'text', placeholder: '0px', advanced: true},
            {key: 'x', label: 'Offset X', kind: 'text', fallback: '0px', advanced: true},
            {key: 'y', label: 'Offset Y', kind: 'text', fallback: '0px', advanced: true},
            {key: 'type', label: 'Type', kind: 'select', fallback: 'outer', options: ['outer', 'inner']},
        ],
    },
    {
        name: 'blur',
        label: 'Blur',
        group: 'filter',
        fields: [
            {key: 'amount', label: 'Amount', kind: 'text', fallback: '20px'},
            {key: 'type', label: 'Type', kind: 'select', fallback: 'backdrop', options: ['backdrop', 'blur']},
        ],
    },
    animation('pulse', ['opacity'], '4s', 'ease-in-out', 'alternate'),
    animation('rotate', ['transform'], '12s', 'linear'),
    animation('breathe', ['background-size'], '12s', 'ease-in-out'),
    animation('aurora', ['background-size'], '12s', 'ease-in-out', 'alternate'),
    animation('shimmer', ['background-position'], '3s', 'linear'),
    animation('liquid', ['background-position', 'background-size', 'filter'], '8s', 'ease-in-out'),
    animation('plasma', ['filter'], '6s', 'linear'),
    animation('float', ['transform'], '6s', 'ease-in-out'),
    animation('drift', ['background-position'], '10s', 'ease-in-out'),
]

export const playgroundGroups: { group: MethodGroup; title: string }[] = [
    {group: 'gradient', title: 'Gradients'},
    {group: 'pattern', title: 'Patterns'},
    {group: 'effect', title: 'Effects'},
    {group: 'filter', title: 'Filters'},
    {group: 'animation', title: 'Animation'},
]

export const findMethod = (name: string): Method | undefined =>
    playgroundMethods.find((method) => method.name === name)
