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