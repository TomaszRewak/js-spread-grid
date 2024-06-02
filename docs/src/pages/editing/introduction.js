import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { defaultData, defaultDataCode, defaultDictData } from "../../utils/defaults";
import WorkInProgress from "../../components/WorkInProgress";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";
import { useState } from "react";

export default function Editing() {
    return (
        <>
            <WorkInProgress step="documentation" />
            <SubHeader>Editing</SubHeader>
            <Section>
                <CodeBlock separator={'or'} options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/simple.jsx').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/default.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/simple.js').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/default.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/simple.py').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/default.py').default
                    }
                ]} />
                <Example>
                    <SimpleExample />
                </Example>
            </Section>
            <SubHeader>Custom parsing and validation</SubHeader>
            <Section>
                <Paragraph>
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/custom.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/custom.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/custom.py').default
                    }
                ]} />
                <Example>
                    <CustomEditionExample />
                </Example>
            </Section>
            <SubHeader>New value formatting</SubHeader>
            <Section>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/formatting.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/formatting.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/formatting.py').default
                    }
                ]} />
                <Example>
                    <NewValueFormattingExample />
                </Example>
            </Section>
        </>
    )
}

function SimpleExample() {
    const [editedCells, setEditedCells] = useState([
        { columnId: 'name', rowId: 'Alice', value: 'Anastasia' },
        { columnId: 'name', rowId: 'Bob', value: 'Bogdan' }
    ]);

    return (
        <SpreadGrid
            data={defaultDictData}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            editedCells={editedCells}
            onEditedCellsChange={setEditedCells}
            formatting={[
                {
                    column: [{ id: 'name' }],
                    edit: true
                }
            ]}
        />
    )
}

function CustomEditionExample() {
    const [editedCells, setEditedCells] = useState([
        { columnId: 'age', rowId: 'Alice', value: 50 },
        { columnId: 'age', rowId: 'Bob', value: 15 }
    ]);

    return (
        <SpreadGrid
            data={defaultDictData}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            editedCells={editedCells}
            onEditedCellsChange={setEditedCells}
            formatting={[
                {
                    column: [{ id: 'age' }, { id: 'score' }],
                    edit: {
                        parse: ({ string }) => parseInt(string),
                        validate: ({ string }) => !isNaN(parseInt(string)),
                    }
                }
            ]}
        />
    )
}

function NewValueFormattingExample() {
    const [editedCells, setEditedCells] = useState([
        { columnId: 'score', rowId: 'Alice', value: 50 },
        { columnId: 'score', rowId: 'Bob', value: 60 }
    ]);

    return (
        <SpreadGrid
            data={defaultDictData}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            editedCells={editedCells}
            onEditedCellsChange={setEditedCells}
            formatting={[
                {
                    column: { id: 'score' },
                    edit: {
                        parse: ({ string }) => parseInt(string),
                        validate: ({ string }) => !isNaN(parseInt(string)),
                    },
                },
                {
                    column: { id: 'score' },
                    condition: (context) => 'newValue' in context,
                    text: ({ value, newValue }) => `${value} → ${newValue}`,
                    style: ({ value, newValue }) => value < newValue
                        ? { background: '#8fe38f' }
                        : { background: '#f07d7d' }
                }
            ]}
        />
    )
}