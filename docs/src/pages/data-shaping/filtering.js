import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { defaultData, defaultDataCode } from "../../utils/defaults";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";
import { useState } from "react";

export default function Filtering() {
    return (
        <>
            <SubHeader>Filtering</SubHeader>
            <Section>
                <Paragraph>
                    To enable filtering, add a <code>{'{ type: "FILTER" }'}</code> row to your row definitions. This creates an editable row where users can type filter expressions to narrow down visible data.
                </Paragraph>
                <Paragraph>
                    By default, a row is shown if the cell's text contains the typed expression.
                </Paragraph>
                <Paragraph>
                    The filter state can be controlled externally via <code>filters</code> and <code>onFiltersChange</code> properties.
                </Paragraph>
                <CodeBlock separator={'or'} options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/filtering/simple.jsx').default,
                        equivalentCode: require('!!raw-loader!./snippets/filtering/default.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/filtering/simple.js').default,
                        equivalentCode: require('!!raw-loader!./snippets/filtering/default.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/filtering/simple.py').default,
                        equivalentCode: require('!!raw-loader!./snippets/filtering/default.py').default
                    }
                ]} />
                <Example>
                    <SimpleExample />
                </Example>
            </Section>
            <SubHeader>Custom filtering</SubHeader>
            <Section>
                <Paragraph>
                    The <code>filtering</code> property lets you override the default condition. It accepts an array of rules, similar to <code>formatting</code>. Each rule uses <code>column</code> and <code>row</code> selectors to choose which cells it applies to, and a <code>condition</code> callback that decides whether a row should be visible.
                </Paragraph>
                <Paragraph>
                    The callback receives a context object containing the cell <code>value</code>, <code>text</code>, and the filter <code>expression</code>. It also includes <code>row</code>, <code>column</code>, <code>rows</code>, <code>columns</code>, and <code>data</code> for more advanced logic.
                </Paragraph>
                <Paragraph>
                    In this example, the name column uses a starts-with condition instead of the default includes check.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/filtering/custom.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/filtering/custom.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/filtering/custom.py').default
                    }
                ]} />
                <Example>
                    <CustomFilteringExample />
                </Example>
                <Paragraph>
                    Filter expressions are strings by default. To filter against non-string data like numbers, use <code>formatting</code> rules on the FILTER row with custom <code>edit</code> behavior. The <code>parse</code> callback converts the string input into a typed value, and <code>validate</code> prevents invalid input from being committed.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/filtering/edit.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/filtering/edit.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/filtering/edit.py').default
                    }
                ]} />
                <Example>
                    <CustomEditionExample />
                </Example>
            </Section>
            <SubHeader>Disabling filtering</SubHeader>
            <Section>
                <Paragraph>
                    To disable filtering for specific columns, use <code>formatting</code> rules that set <code>edit: false</code> and <code>text: ''</code> on the FILTER row.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/filtering/disabled.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/filtering/disabled.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/filtering/disabled.py').default
                    }
                ]} />
                <Example>
                    <DisabledFilteringExample />
                </Example>
            </Section>
            <SubHeader>Custom hint</SubHeader>
            <Section>
                <Paragraph>
                    Empty filter cells show no placeholder by default. Use the <code>text</code> formatting property on the FILTER row to display a custom hint when the cell has no value.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/filtering/hint.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/filtering/hint.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/filtering/hint.py').default
                    }
                ]} />
                < Example >
                    <CustomHintExample />
                </Example>
            </Section >
        </>
    )
}

function SimpleExample() {
    const [filters, setFilters] = useState([{ columnId: 'registered', expression: true }]);

    return (
        <SpreadGrid
            data={defaultData}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            rows={[
                { type: 'HEADER' },
                { type: 'FILTER' },
                { type: 'DATA-BLOCK' }
            ]}
            filters={filters}
            onFiltersChange={setFilters}
        />
    )
}

function CustomFilteringExample() {
    const [filters, setFilters] = useState([{ columnId: 'name', expression: 'al' }]);

    return (
        <SpreadGrid
            data={defaultData}
            rows={[
                { type: 'HEADER' },
                { type: 'FILTER' },
                { type: 'DATA-BLOCK' }
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            filters={filters}
            onFiltersChange={setFilters}
            filtering={[
                {
                    column: [{ id: 'name' }],
                    condition: ({ value, expression }) => value.toLowerCase().startsWith(expression.toLowerCase())
                }
            ]}
        />
    )
}

function CustomEditionExample() {
    const [filters, setFilters] = useState([{ columnId: 'age', expression: 25 }]);

    return (
        <SpreadGrid
            data={defaultData}
            rows={[
                { type: 'HEADER' },
                { type: 'FILTER' },
                { type: 'DATA-BLOCK' }
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            filters={filters}
            onFiltersChange={setFilters}
            formatting={[
                {
                    column: [{ id: 'age' }, { id: 'score' }],
                    row: [{ type: 'FILTER' }],
                    edit: {
                        parse: ({ string }) => parseInt(string),
                        validate: ({ string }) => !isNaN(parseInt(string)),
                    }
                }
            ]}
            filtering={[
                {
                    column: [{ id: 'age' }, { id: 'score' }],
                    condition: ({ value, expression }) => value >= expression
                }
            ]}
        />
    )
}

function DisabledFilteringExample() {
    return (
        <SpreadGrid
            data={defaultData}
            rows={[
                { type: 'HEADER' },
                { type: 'FILTER' },
                { type: 'DATA-BLOCK' }
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            formatting={[
                {
                    column: [{ id: 'name' }],
                    row: [{ type: 'FILTER' }],
                    edit: false,
                    text: ''
                }
            ]}
        />
    )
}

function CustomHintExample() {
    return (
        <SpreadGrid
            data={defaultData}
            rows={[
                { type: 'HEADER' },
                { type: 'FILTER' },
                { type: 'DATA-BLOCK' }
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            formatting={[
                {
                    column: [{ id: 'name' }],
                    row: [{ type: 'FILTER' }],
                    text: ({ newValue }) => newValue || 'e.g. John'
                }
            ]}
        />
    )
}