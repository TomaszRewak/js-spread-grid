import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function Font() {
    return (
        <>
            <SubHeader>Font Property of Formatting Rules</SubHeader>
            <Section>
                <Paragraph>
                    The <code>font</code> property in formatting rules defines the font style for the text in cells. It can be either a static string that contains both the size, style, and font family, or a function that dynamically generates the font style.
                </Paragraph>
                <Paragraph>
                    When specified as a string, the <code>font</code> property should follow the CSS font property notation, such as <code>'bold 14px Arial'</code> or <code>'italic 12px Times New Roman'</code>.
                </Paragraph>
                <Paragraph>
                    When specified as a function, it accepts the same context as other formatting functions: <code>{'{data, rows, columns, row, column, value, newValue, text}'}</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/font/example.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/font/example.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/font/example.py').default
                    }
                ]} />
                <Example>
                    <FontExample />
                </Example>
            </Section>
        </>
    );
}

function FontExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    font: 'bold 14px Comic Sans MS'
                }
            ]}
        />
    );
}