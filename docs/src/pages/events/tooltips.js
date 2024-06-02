import SpreadGrid from "react-spread-gird";
import WorkInProgress from "../../components/WorkInProgress";
import { defaultData } from "../../utils/defaults";
import Section from "../../components/Section";
import Example from "../../components/Example";

export default function Tooltips() {
    return (
        <>
            <WorkInProgress step="design" />
            <Section>
                <Example>
                    <TooltipExample />
                </Example>
            </Section>
        </>
    );
}

function TooltipExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    tooltip: ({ value }) => value > 50 ? 'Good score' : 'Bad score'
                }
            ]}
        />
    );
}