import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { useState } from "react";
import useInterval from "../../utils/useInterval";

const data = Array.from({ length: 200 }, (_, i) => ({
    index: i,
    value: Math.round(Math.sin(i / 10) * 100) / 100,
    label: `Row ${i}`,
}));

const rows = [
    { type: 'HEADER' },
    { type: 'DATA-BLOCK', height: 15 },
];

const columns = [{ type: 'DATA-BLOCK', width: 70 }];

function DisabledExample() {
    const targets = [0, 199];
    const [targetIdx, setTargetIdx] = useState(0);
    useInterval(() => { setTargetIdx((targetIdx + 1) % targets.length); }, 4000);
    const currentTarget = targets[targetIdx];

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            verticalScrollTarget={{ index: currentTarget }}
            verticalScrollSpeed={500}
            disableScrollOnHover={true}
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

function EnabledExample() {
    const targets = [0, 199];
    const [targetIdx, setTargetIdx] = useState(0);
    useInterval(() => { setTargetIdx((targetIdx + 1) % targets.length); }, 4000);
    const currentTarget = targets[targetIdx];

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            verticalScrollTarget={{ index: currentTarget }}
            verticalScrollSpeed={500}
            disableScrollOnHover={false}
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

export default function ScrollOnHover() {
    return (
        <>
            <SubHeader>Scroll on hover</SubHeader>
            <Section>
                <Paragraph>
                    The <code>disableScrollOnHover</code> property controls whether programmatic scrolling is paused while the user's mouse hovers over the grid's scrollable area. This is enabled (<code>true</code>) by default.
                </Paragraph>
                <Paragraph>
                    When enabled, hovering over the grid body prevents the scroll target from taking effect — allowing the user to freely browse the data without being interrupted by automatic scrolling. Scrolling resumes once the mouse leaves the grid. The mouse hovering over pinned rows or columns does not disable scrolling.
                </Paragraph>
            </Section>

            <SubHeader>Disabled (default)</SubHeader>
            <Section>
                <Paragraph>
                    With <code>disableScrollOnHover</code> set to <code>true</code> (the default), hover over the grid below to pause the automatic scrolling. Move the mouse away to see it resume.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-on-hover/disabled.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-on-hover/disabled.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-on-hover/disabled.py').default }
                ]} />
                <Example maxHeight={300}>
                    <DisabledExample />
                </Example>
            </Section>

            <SubHeader>Enabled</SubHeader>
            <Section>
                <Paragraph>
                    With <code>disableScrollOnHover</code> set to <code>false</code>, the grid will continue scrolling to the target even while the user hovers over it. This can be useful for dashboards or displays where the scrolling should never be interrupted.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-on-hover/enabled.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-on-hover/enabled.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-on-hover/enabled.py').default }
                ]} />
                <Example maxHeight={300}>
                    <EnabledExample />
                </Example>
            </Section>
        </>
    );
}
