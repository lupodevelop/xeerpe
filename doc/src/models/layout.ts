import {ReactNode} from "react";

export interface ChildrenProps {
    children: ReactNode
}

export interface GuideSlugParams {
    slug: string
}

export interface GuideSlugProps {
    params: Promise<GuideSlugParams>
}
