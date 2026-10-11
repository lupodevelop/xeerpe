import {AnimationTarget, AnimationType} from "./animation.ts";

export type LayerType = 'gradient' | 'filter' | 'effect' | 'pattern' | 'animation'

export interface CSSProperties {
    background?: string
    backgroundImage?: string,
    backgroundColor?: string,
    backgroundSize?: string
    filter?: string
    backdropFilter?: string
    boxShadow?: string
    animation?: string
}


export interface BuilderLayer {
    type: LayerType
    properties: CSSProperties
    animationType?: AnimationType
    target?: AnimationTarget
}
