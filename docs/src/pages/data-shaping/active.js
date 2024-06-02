import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import { defaultData } from "../../utils/defaults";
import WorkInProgress from "../../components/WorkInProgress";
import Section from "../../components/Section";

export default function Active() {
    return (
        <>
            <WorkInProgress step="documentation" />
            <Section>
                {/* <Example>
                    <SpreadGrid
                        data={defaultData}
                        rows={[
                            { type: 'HEADER' },
                            { type: 'FILTER' },
                            { type: 'DATA-BLOCK' }
                        ]}
                        onActiveColumnsChange={columns => console.log('Active columns:', columns)}
                        onActiveRowsChange={rows => console.log('Active rows:', rows)}
                    />
                </Example> */}
            </Section>
        </>
    )
}