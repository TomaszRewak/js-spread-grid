import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function FormattingIntro() {
    return (
        <>
            <SubHeader>Introduction to formatting</SubHeader>
            <Section>
                <Paragraph>
                    Formatting in Spread Grid is a powerful feature that goes beyond simple styling. It allows for data transformation, text formatting, and even defining which cells should be editable.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/functionalities.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/functionalities.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/functionalities.py').default
                    }
                ]} />
                <Example>
                    <FunctionalitiesExample />
                </Example>
            </Section>
            <SubHeader>Order of rules</SubHeader>
            <Section>
                <Paragraph>
                    Formatting rules are executed from top to bottom. The results of subsequent rules are concatenated, and in cases where properties overlap, the latter rule overrides the previous ones.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/override.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/override.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/override.py').default
                    }
                ]} />
                <Example>
                    <OverrideExample />
                </Example>
            </Section>
            <SubHeader>Selectors and conditions</SubHeader>
            <Section>
                <Paragraph>
                    Rules are matched based on selectors. Selectors can be applied using IDs, types, or labels. This flexibility allows for precise control over which cells the formatting rules apply to.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/selectors.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/selectors.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/selectors.py').default
                    }
                ]} />
                <Example>
                    <SelectorExample />
                </Example>
                <Paragraph>
                    It's also possible to make rules conditional. However, it's best to avoid excessive use of conditions since they are evaluated for all columns and rows that match the selectors. Selectors themselves are matched based on a lookup, which is more efficient.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/conditional.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/conditional.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/conditional.py').default
                    }
                ]} />
                <Example>
                    <ConditionalFormattingExample />
                </Example>
            </Section>
            <SubHeader>Generative formatting</SubHeader>
            <Section>
                <Paragraph>
                    Values generated through formatting rules can be generative. For example, you can create a heatmap based on cell values without a need for creating separate rules for each color. This allows for dynamic and responsive formatting based on the data.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/heatmap.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/heatmap.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/heatmap.py').default
                    }
                ]} />
                <Example>
                    <HeatmapExample />
                </Example>
            </Section>
        </>
    );
}

function FunctionalitiesExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'registered' },
                    text: ({ value }) => value ? '✓' : '✗',
                    style: ({ value }) => ({
                        background: value ? '#a5d6a7' : '#ffcdd2',
                        foreground: value ? 'green' : 'red',
                        textAlign: 'center'
                    })
                },
                {
                    column: { id: 'team' },
                    style: ({ value }) => ({
                        foreground: value
                    })
                },
                {
                    column: { id: 'score' },
                    value: ({ value }) => value / 100,
                    text: ({ value }) => `${value.toFixed(2)}`,
                },
                {
                    row: { id: 1 },
                    style: {
                        background: 'lightgray',
                        foreground: 'gray'
                    }
                },
                {
                    column: { id: 'age' },
                    edit: {
                        validate: ({ string }) => !isNaN(Number(string)),
                        parse: ({ string }) => Number(string),
                    },
                    style: { textAlign: 'right' }
                }
            ]}
        />
    );
}

function SelectorExample() {
    return (
        <SpreadGrid
            data={defaultData}
            columns={[
                { id: 'name' },
                { id: 'age', labels: ['numeric'], width: 50 },
                { id: 'score', labels: ['numeric'], width: 50 },
                { id: 'registered' },
                { id: 'team' }
            ]}
            formatting={[
                {
                    column: { label: 'numeric' },
                    style: { textAlign: 'right', background: '#a5d6a7' }
                },
                {
                    column: { id: 'name' },
                    row: { id: 1 },
                    style: { background: '#ffcdd2' }
                },
                {
                    row: { type: 'HEADER' },
                    style: { foreground: 'red' }
                }
            ]}
        />
    );
}

function OverrideExample() {
    const formatting = [
        {
            column: { id: 'age' },
            style: { background: '#a5d6a7', foreground: '#ff4081' }
        },
        {
            row: { id: 1 },
            style: { background: '#ffcdd2' }
        }
    ];

    return (
        <SpreadGrid
            data={defaultData}
            formatting={formatting}
        />
    );
}

function ConditionalFormattingExample() {
    const formatting = [
        {
            column: { id: 'registered' },
            condition: ({ value }) => value,
            style: { background: '#a5d6a7' }
        },
        {
            column: { id: 'score' },
            condition: ({ value }) => value <= 50,
            style: { background: '#ffcdd2' }
        }
    ];

    return (
        <SpreadGrid
            data={defaultData}
            formatting={formatting}
        />
    );
}

function HeatmapExample() {
    const formatting = [
        {
            column: { id: 'score' },
            style: ({ value }) => ({
                background: `hsl(${value * 1}, 100%, 50%)`
            })
        }
    ];

    return (
        <SpreadGrid
            data={defaultData}
            formatting={formatting}
        />
    );
}