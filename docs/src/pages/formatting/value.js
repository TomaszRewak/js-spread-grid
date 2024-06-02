import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function Value() {
    return (
        <>
            <SubHeader>Value Property of Formatting Rules</SubHeader>
            <Section>
                <Paragraph>
                    The <code>value</code> property in formatting rules allows you to transform or generate the value of a cell. This transformation can be based on the previous value or generated from column and row definitions.
                </Paragraph>
                <Paragraph>
                    A value assigned by a formatting rule will override the previous value in all subsequent rules. This means that the new value will be used in contexts such as <code>style</code> and <code>text</code> functions.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/value/transform.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/value/transform.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/value/transform.py').default
                    }
                ]} />
                <Example>
                    <ValueTransformExample />
                </Example>
                <Paragraph>
                    The <code>value</code> property can be a static value or a function. The function receives the same context as the <code>style</code> and <code>text</code> properties: <code>{'{data, rows, columns, row, column, value, newValue, text}'}</code>.
                </Paragraph>
                <Paragraph>
                    Even if the <code>text</code> property is set to display a different value, the original value remains unchanged and can still be accessed in subsequent formatting rules.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/value/access.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/value/access.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/value/access.py').default
                    }
                ]} />
                <Example>
                    <ValueAccessExample />
                </Example>
                <Paragraph>
                    The new value, like other properties, is calculated only after the successful match of a <code>condition</code>. If you want to have conditions based on transformed values, the value transformation needs to be split into a separate preceding rule.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/value/condition.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/value/condition.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/value/condition.py').default
                    }
                ]} />
                <Example>
                    <ValueConditionExample />
                </Example>
            </Section>
        </>
    );
}

function ValueTransformExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    value: ({ value }) => value / 100
                },
                {
                    column: { id: 'score' },
                    text: ({ value }) => `${value.toFixed(2)}`
                }
            ]}
        />
    );
}

function ValueAccessExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    value: ({ value }) => value / 100
                },
                {
                    column: { id: 'score' },
                    text: ({ value }) => `${value.toFixed(2)}`
                },
                {
                    column: { id: 'score' },
                    style: ({ value }) => ({
                        background: value > 0.5 ? '#a5d6a7' : '#ffcdd2'
                    })
                }
            ]}
        />
    );
}

function ValueConditionExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    value: ({ value }) => value / 100
                },
                {
                    column: { id: 'score' },
                    condition: ({ value }) => value > 0.5,
                    style: {
                        background: '#a5d6a7'
                    }
                }
            ]}
        />
    );
}