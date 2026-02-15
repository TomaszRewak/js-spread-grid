import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { defaultData, defaultDataCode, defaultDictData } from "../../utils/defaults";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";
import { useState } from "react";

export default function Editing() {
    return (
        <>
            <SubHeader>Editing</SubHeader>
            <Section>
                <Paragraph>
                    To make cells editable, set <code>edit: true</code> in a formatting rule. This enables text-input editing for the matched cells. The grid treats edited values as an overlay on top of the original data - the source data is never mutated.
                </Paragraph>
                <Paragraph>
                    Edited values are managed via the <code>editedCells</code> and <code>onEditedCellsChange</code> properties. Each entry in <code>editedCells</code> specifies a <code>columnId</code>, <code>rowId</code>, and the new <code>value</code>. When a user confirms an edit, the grid calls <code>onEditedCellsChange</code> with the updated list.
                </Paragraph>
                <Paragraph>
                    The shorthand <code>edit: true</code> uses a default configuration that accepts any string as-is.
                </Paragraph>
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
                    When <code>edit</code> is set to an object, you can provide <code>parse</code> and <code>validate</code> callbacks to control how the text input is converted into a value. The <code>validate</code> function receives <code>{'{'}  string {'}'}</code> and returns a boolean indicating whether the input is acceptable. The <code>parse</code> function receives the same context and returns the actual value to store.
                </Paragraph>
                <Paragraph>
                    While the user is typing, the grid calls <code>validate</code> on every keystroke and highlights the input with a red background when validation fails. The edit can only be confirmed when <code>validate</code> returns <code>true</code>.
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
                <Paragraph>
                    When a cell has been edited, its formatting context includes a <code>newValue</code> property alongside the original <code>value</code>. You can use this to visually distinguish modified cells - for example, showing the change as a transition or applying a color based on whether the value increased or decreased.
                </Paragraph>
                <Paragraph>
                    Use <code>condition: {"context => 'newValue' in context"}</code> to target only cells that have been edited, then reference both <code>value</code> and <code>newValue</code> in your <code>text</code> and <code>style</code> callbacks.
                </Paragraph>
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