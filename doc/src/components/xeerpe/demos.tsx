import { demos } from '@/src/data/examples.ts'
import { XeerpeDemoOptions } from '@/src/models/xeerpeDemo.ts'
import { getDemoCode } from '@/src/utils/demoCode.ts'
import ContextPreview from '@cmp/contextPreview/contextPreview.tsx'

export const XeerpeDemo = async ({ example, width = '300px', height = '100px', borderRadius = '16px' }: XeerpeDemoOptions) => {
    const style = demos[example]()
    const code = await getDemoCode(example)

    return (
        <ContextPreview title={example} style={style} code={code}>
            <div
                className="xeerpe-demo-preview"
                style={{
                    ...style,
                    width,
                    height,
                    borderRadius,
                }}
            />
        </ContextPreview>
    )
}
