import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { default as App } from "./apps/heatmap";


export default function AppManager() {
    return (
        <>
            <Example align="left">
                <App />
            </Example>
            <Paragraph>
                Code of this example can be found on <a href="https://github.com/TomaszRewak/js-spread-grid/blob/master/docs/src/pages/examples/apps/heatmap.js">GitHub</a>.
            </Paragraph>
        </>
    )
}