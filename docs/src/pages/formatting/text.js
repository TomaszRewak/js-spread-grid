import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function Text() {
    return (
        <>
            <SubHeader>Text</SubHeader>
            <Section>
                <Paragraph>
                    The <code>text</code> property in formatting rules defines the text content of cells. It can be either a static string or a function that dynamically generates the text based on the cell context.
                </Paragraph>
                <Paragraph>
                    When the <code>text</code> property is a function, it accepts a context object containing the following properties: <code>{'{data, rows, columns, row, column, value, newValue, text}'}</code>. The <code>newValue</code> property is only available after the cell has been edited.
                </Paragraph>
                <Paragraph>
                    The default value of the <code>text</code> property is <code>{'`${newValue}`'}</code> if the cell has been edited, or <code>{'`${value}`'}</code> otherwise.
                </Paragraph>
                <Paragraph>
                    As a hint: you can use unicode characters within the text (e.g. <code>'✓'</code>) for icons.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/text/example.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/text/example.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/text/example.py').default
                    }
                ]} />
                <Example>
                    <TextExample />
                </Example>
            </Section>

            <SubHeader>Selection Text</SubHeader>
            <Section>
                <Paragraph>
                    The optional <code>selectionText</code> property supplies text for copying cells and populating the editor on double-click, without changing the displayed text. It accepts a string or a function with the same context as <code>text</code>. When omitted, these interactions use regular <code>text</code>; an empty string is respected. For example, <code>{"{ text: ({ value }) => value + '%', selectionText: ({ value }) => String(value) }"}</code> displays a percentage but copies the unformatted number. In Dash, use <code>selection_text</code> with a JavaScript expression, such as <code>'String(value)'</code>.
                </Paragraph>
                <Paragraph>
                    Filter cells with a falsy <code>newValue</code> default to an empty <code>selectionText</code>, so their placeholders remain visible but are not copied or inserted into the editor. User formatting can override this default.
                </Paragraph>
            </Section>
        </>
    );
}

function TextExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    text: ({ value }) => `${value}%`
                },
                {
                    column: { id: 'registered' },
                    text: ''
                },
                {
                    column: { id: 'registered' },
                    condition: ({ value }) => value,
                    text: '✓'
                }
            ]}
        />
    );
}