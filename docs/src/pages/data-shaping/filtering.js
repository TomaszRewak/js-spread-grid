import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { defaultData, defaultDataCode } from "../../utils/defaults";
import WorkInProgress from "../../components/WorkInProgress";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";
import { useState } from "react";

export default function Filtering() {
    return (
        <>
            <WorkInProgress step="documentation" />
            <SubHeader>Filtering</SubHeader>
            <Section>
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