import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import { default as App } from "./apps/app-manager";


export default function AppManager() {
    return (
        <>
            <Example>
                <App />
            </Example>
            <Paragraph>
                Code of this example can be found on <a href="https://github.com/TomaszRewak/js-spread-grid/blob/master/docs/src/pages/examples/apps/app-manager.js">GitHub</a>.
            </Paragraph>
            <Section>
                <Paragraph>
                    <lu>
                        <li>Click on the header to sort by the column</li>
                        <li>Click ▷/⟳/▢ buttons next to an app to start/restart/stop it</li>
                        <li>Click ▷/⟳/▢ buttons at the bottom to start/restart/stop all apps</li>
                        <li>Scroll through the list (while the top and bottom rows remain visible)</li>
                        <li>Search for application names using fuzzy-matching</li>
                        <li>Toggle the "required" search state by clicking on the search field</li>
                        <li>Search for tags using a set of values</li>
                    </lu>
                </Paragraph>
            </Section>
        </>
    )
}