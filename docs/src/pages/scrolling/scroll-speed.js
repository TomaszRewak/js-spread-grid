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

function AutoExample() {
    const targets = [0, 80, 160, 40, 120, 199];
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
            verticalScrollSpeed="auto"
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

function SmoothExample() {
    const targets = [0, 80, 160, 40, 120, 199];
    const [targetIdx, setTargetIdx] = useState(0);
    useInterval(() => { setTargetIdx((targetIdx + 1) % targets.length); }, 3000);
    const currentTarget = targets[targetIdx];

    return (
        <SpreadGrid
            data={data}
            rows={rows}
            columns={columns}
            pinnedTop={1}
            verticalScrollTarget={{ index: currentTarget }}
            verticalScrollSpeed="smooth"
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

function NumericalExample() {
    const targets = [0, 80, 160, 40, 120, 199];
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
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

function StepsExample() {
    const targets = [0, 30, 199, 100, 5, 180];
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
            verticalScrollSpeed={[
                { scrollSpeed: 200, maxDistance: 500 },
                { scrollSpeed: 1000, maxDistance: 2000 },
                { scrollSpeed: 'smooth', maxDistance: Infinity },
            ]}
            formatting={[
                { row: { id: currentTarget }, style: { background: '#cce5ff' } }
            ]}
        />
    );
}

export default function ScrollSpeed() {
    return (
        <>
            <SubHeader>Scroll speed</SubHeader>
            <Section>
                <Paragraph>
                    The <code>verticalScrollSpeed</code> and <code>horizontalScrollSpeed</code> properties control the scrolling animation behavior when navigating to a scroll target. The speed can be set to a string mode, a numerical value, or an array of step-based rules.
                </Paragraph>
            </Section>

            <SubHeader>Smooth</SubHeader>
            <Section>
                <Paragraph>
                    Setting the scroll speed to <code>"smooth"</code> uses the browser's native smooth scrolling behavior. The animation speed and easing are determined by the browser.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-speed/smooth.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-speed/smooth.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-speed/smooth.py').default }
                ]} />
                <Example maxHeight={300}>
                    <SmoothExample />
                </Example>
            </Section>

            <SubHeader>Numerical value</SubHeader>
            <Section>
                <Paragraph>
                    A numerical value specifies the scroll speed in pixels per second. This gives you precise control over how fast the grid scrolls to the target. Lower values produce slower, more gradual animations - for example, <code>500</code> scrolls at 500 pixels per second.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-speed/numerical.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-speed/numerical.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-speed/numerical.py').default }
                ]} />
                <Example maxHeight={300}>
                    <NumericalExample />
                </Example>
            </Section>

            <SubHeader>Auto</SubHeader>
            <Section>
                <Paragraph>
                    Setting the scroll speed to <code>"auto"</code> moves the grid to the target position instantly, with no animation. This is useful when you need immediate jumps without any visual transition.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-speed/auto.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-speed/auto.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-speed/auto.py').default }
                ]} />
                <Example maxHeight={300}>
                    <AutoExample />
                </Example>
            </Section>

            <SubHeader>Speed steps</SubHeader>
            <Section>
                <Paragraph>
                    For more advanced control, you can provide an array of speed steps. Each step defines a <code>scrollSpeed</code> and a <code>maxDistance</code> threshold. The grid selects the speed based on the current distance to the target - the first step whose <code>maxDistance</code> is greater than or equal to the remaining distance is used.
                </Paragraph>
                <Paragraph>
                    This allows for adaptive scrolling: slow for short distances (precise), fast for medium distances, and instant for very large jumps.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/scroll-speed/steps.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/scroll-speed/steps.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/scroll-speed/steps.py').default }
                ]} />
                <Example maxHeight={300}>
                    <StepsExample />
                </Example>
            </Section>
        </>
    );
}
