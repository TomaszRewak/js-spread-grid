import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import { default as App } from "./apps/plotter";


export default function AppManager() {
    return (
        <>
            <Example>
                <App />
            </Example>
            <Paragraph>
                Code of this example can be found on <a href="https://github.com/TomaszRewak/js-spread-grid/blob/master/docs/src/pages/examples/apps/plotter.js">GitHub</a>.
            </Paragraph>
            <Section>
                <Paragraph>
                    <ul>
                        <li>Click on the ☐/☑ buttons to enable/disable strategies</li>
                        <li>Observe how the line-plots and the box-plots change together with the values</li>
                    </ul>
                </Paragraph>
            </Section>
        </>
    )
}