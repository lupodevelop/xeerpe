export type AnimationType = 'pulse' | 'rotate' | 'breathe' | 'aurora' | 'shimmer' | 'liquid' | 'plasma' | 'float' | 'drift'

export type AnimationTarget = 'gradients' | 'patterns' | 'all'

export interface AnimationOptions {
    duration?: string
    easing?: string
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
    iterationCount?: number | 'infinite'
    target?: AnimationTarget
}
