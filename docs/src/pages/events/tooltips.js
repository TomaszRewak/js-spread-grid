import SpreadGrid from "react-spread-gird";
import WorkInProgress from "../../components/WorkInProgress";
import { defaultData } from "../../utils/defaults";
import Section from "../../components/Section";
import Example from "../../components/Example";

export default function Tooltips() {
    return (
        <>
            <WorkInProgress step="implementation" details="Firefox not fully supported - waiting for full browser support of popover anchors" />
            <Section>
                <Example>
                    <TooltipSimpleExample />
                </Example>
            </Section>
            <Section>
                <Example>
                    <TooltipHtmlExample />
                </Example>
            </Section>
        </>
    );
}

function TooltipSimpleExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    tooltip: ({ value }) => value > 50 ? `Good score` : `Bad score`
                }
            ]}
        />
    );
}

function TooltipHtmlExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    tooltip: ({ value }) => value > 50 ? `Good score<br><i style="color: green">${value}/100</i>` : `Bad score<br><i style="color: red">${value}/100</i>`
                }
            ]}
        />
    );
}