import classes from "./guide.module.css"
import {ChildrenProps} from "@/src/models/layout.ts";

const DocLayout = ({children}: ChildrenProps) => (
    <main id="main-content" tabIndex={-1} className={classes.guideContainer}>
        <div className={classes.guideContents}>
            {children}
        </div>
    </main>
)

export default DocLayout
