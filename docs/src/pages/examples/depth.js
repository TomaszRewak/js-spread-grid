import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { default as App } from "./apps/depth";


export default function Depth() {
    return (
        <>
            <Example>
                <App />
            </Example>
            <Paragraph>
                Code of this example can be found on <a href="https://github.com/TomaszRewak/js-spread-grid/blob/master/docs/src/pages/examples/apps/depth.js">GitHub</a>.
            </Paragraph>
        </>
    )
}