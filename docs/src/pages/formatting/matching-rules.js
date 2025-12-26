import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function MatchingRules() {
    return (
        <>
            <SubHeader>Matching Rules</SubHeader>
            <Section>
                <Paragraph>
                    Matching rules in Spread Grid are used to determine which styles should be applied to particular cells. You can specify a column and/or row matching rules for each formatting rule. If matching rules are not provided, they assume a default value of <code>{'{type: "DATA"}'}</code> - which means that the rule is applied to all data cells, but not headers nor other special cells.
                </Paragraph>
                <Paragraph>
                    A matching rule can be based on either an <code>id</code>, a <code>type</code>, or a <code>label</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/matching-rules/simple.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/matching-rules/simple.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/matching-rules/simple.py').default
                    }
                ]} />
                <Example>
                    <SimpleMatchingRuleExample />
                </Example>
            </Section>
            <SubHeader>Type rules</SubHeader>
            <Section>
                <Paragraph>
                    The <code>type</code> rules can assume one of the following simple values: <code>DATA</code>, <code>HEADER</code>, <code>FILTER</code>, or <code>CUSTOM</code>. Additionally, there are two special types that map to multiple simple types at once: <code>ANY</code> (which maps to <code>HEADER/DATA/FILTER/CUSTOM</code>) and <code>SPECIAL</code> (which maps to <code>HEADER/FILTER/CUSTOM</code>).
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/matching-rules/type.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/matching-rules/type.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/matching-rules/type.py').default
                    }
                ]} />
                <Example>
                    <TypeMatchingRuleExample />
                </Example>
            </Section>
            <SubHeader>Multiple rules</SubHeader>
            <Section>
                <Paragraph>
                    Instead of a single rule, you can provide an array of rules. For example, <code>{'column: [{id: "age"}, {id:"name"}]'}</code>. In this case, at least one of the rules needs to be satisfied for the rule to be applied.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/matching-rules/multiple.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/matching-rules/multiple.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/matching-rules/multiple.py').default
                    }
                ]} />
                <Example>
                    <MultipleMatchingRuleExample />
                </Example>
            </Section>
            <SubHeader>Performance</SubHeader>
            <Section>
                <Paragraph>
                    Formatting rules are stored internally in a lookup table, so processing even a high number of them should not negatively impact performance. Therefore, matching rules are considered to be a better choice than conditions whenever possible.
                </Paragraph>
            </Section >
        </>
    );
}

function SimpleMatchingRuleExample() {
    return (
        <SpreadGrid
            data={defaultData}
            columns={[
                { id: 'name' },
                { id: 'age', labels: ['number'] },
                { id: 'score', labels: ['number'] },
                { id: 'registered' },
                { id: 'team' }
            ]}
            formatting={[
                {
                    column: { id: 'age' },
                    row: { type: 'ANY' },
                    style: {
                        background: '#e0f7fa',
                        foreground: '#00796b'
                    }
                },
                {
                    column: { label: 'number' },
                    font: '8px Consolas',
                    style: {
                        textAlign: 'right'
                    }
                }
            ]}
        />
    );
}

function MultipleMatchingRuleExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: [{ id: 'age' }, { id: 'name' }],
                    style: {
                        background: '#e0f7fa',
                        foreground: '#00796b'
                    }
                }
            ]}
        />
    );
}

function TypeMatchingRuleExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    row: { type: 'HEADER' },
                    style: {
                        background: '#ffeb3b',
                        textAlign: 'center'
                    }
                },
                {
                    row: { type: 'ANY' },
                    column: { type: 'ANY' },
                    style: {
                        foreground: '#ff2e63'
                    }
                }
            ]}
        />
    );
}