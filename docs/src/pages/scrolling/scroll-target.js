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

function SimpleExample() {
    const targets = [0, 50, 100, 150, 199];
    const [targetIdx, setTargetIdx] = useState(0);
    useInterval(() => { setTargetIdx((targetIdx + 1) % targets.length); }, 2000);
    const currentTarget = targets[targetIdx];

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            verticalScrollTarget={{ index: currentTarget }}
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

function PositionExample() {
    const positions = ['BEGIN', 'MIDDLE', 'END'];
    const targets = [50, 100, 150];
    const [step, setStep] = useState(0);
    useInterval(() => { setStep(step + 1); }, 2000);
    const currentTarget = targets[step % targets.length];
    const currentPosition = positions[step % positions.length];

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            verticalScrollTarget={{ index: currentTarget, position: currentPosition }}
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

function FractionalExample() {
    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            verticalScrollTarget={{ index: 100.5, position: 'BEGIN' }}
            formatting={[
                { row: { id: 100 }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

const squareData = Array.from({ length: 50 }, (_, r) => {
    const row = {};
    for (let c = 0; c < 50; c++) {
        row[`c${c}`] = `${r},${c}`;
    }
    return row;
});

const squareRows = [
    { type: 'HEADER' },
    { type: 'DATA-BLOCK', height: 20 },
];

const squareColumns = [
    { type: 'HEADER', width: 40 },
    { type: 'DATA-BLOCK', width: 50 },
];

function BothAxesExample() {
    const targets = [
        { row: 0, col: 0 },
        { row: 25, col: 25 },
        { row: 49, col: 49 },
        { row: 10, col: 40 },
        { row: 40, col: 10 },
    ];
    const [idx, setIdx] = useState(0);
    useInterval(() => { setIdx((idx + 1) % targets.length); }, 2000);
    const { row, col } = targets[idx];

    return (
        <SpreadGrid
            data={squareData}
            rows={squareRows}
            columns={squareColumns}
            pinnedTop={1}
            pinnedLeft={1}
            verticalScrollTarget={{ index: row }}
            horizontalScrollTarget={{ index: col }}
            verticalScrollSpeed="smooth"
            horizontalScrollSpeed="smooth"
            formatting={[
                { row: { id: row }, style: { background: '#cce5ff' } },
                { column: { id: `c${col}` }, style: { background: '#cce5ff' } },
            ]}
        />
    );
}

export default function ScrollTarget() {
    return (
        <>
            <SubHeader>Scroll target</SubHeader>
            <Section>
                <Paragraph>
                    The <code>verticalScrollTarget</code> and <code>horizontalScrollTarget</code> properties allow you to programmatically control where the grid is scrolled to. Each accepts an object with an <code>index</code> property.
                </Paragraph>
                <Paragraph>
                    The <code>index</code> is the row index (for vertical target) or column index (for horizontal target) that should be scrolled into view. In the example below, the scroll target cycles through several rows on an interval.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-target/simple.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-target/simple.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-target/simple.py').default }
                ]} />
                <Example maxHeight={300}>
                    <SimpleExample />
                </Example>
            </Section>

            <SubHeader>Position</SubHeader>
            <Section>
                <Paragraph>
                    An optional <code>position</code> property determines where within the viewport the target row or column should appear. The supported values are:
                </Paragraph>
                <ul>
                    <li><code>BEGIN</code> — aligns the target row to the top of the scrollable area (the default).</li>
                    <li><code>MIDDLE</code> — centers the target row within the viewport.</li>
                    <li><code>END</code> — aligns the target row to the bottom of the scrollable area.</li>
                </ul>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-target/position.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-target/position.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-target/position.py').default }
                ]} />
                <Example maxHeight={300}>
                    <PositionExample />
                </Example>
            </Section>

            <SubHeader>Fractional indices</SubHeader>
            <Section>
                <Paragraph>
                    The <code>index</code> value supports fractional numbers. The integer part selects the row, and the fractional part indicates the offset within that row. For example, an index of <code>100.5</code> scrolls to half-way through row 100. This enables pixel-precise positioning within the grid.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-target/fractional.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-target/fractional.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-target/fractional.py').default }
                ]} />
                <Example maxHeight={100}>
                    <FractionalExample />
                </Example>
            </Section>

            <SubHeader>Both axes</SubHeader>
            <Section>
                <Paragraph>
                    You can scroll both vertically and horizontally at the same time by setting <code>verticalScrollTarget</code> and <code>horizontalScrollTarget</code> together. In the example below, the grid navigates to different row/column combinations on a 50×50 grid.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-target/both-axes.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-target/both-axes.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-target/both-axes.py').default }
                ]} />
                <Example maxHeight={300} maxWidth={500}>
                    <BothAxesExample />
                </Example>
            </Section>
        </>
    );
}
