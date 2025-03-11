import SpreadGrid from "react-spread-gird";
import WorkInProgress from "../../components/WorkInProgress";
import { defaultData } from "../../utils/defaults";
import Section from "../../components/Section";
import Example from "../../components/Example";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Paragraph from "../../components/Paragraph";

export default function Tooltips() {
    return (
        <>
            <WorkInProgress step="implementation" details="Firefox not fully supported - waiting for full browser support of popover anchors" />
            <SubHeader>Tooltips</SubHeader>
            <Section>
                <Paragraph>
                    The <code>tooltip</code> property in formatting rules defines the text that appears in a tooltip when the user hovers over a cell. It can be either a static string or a function that dynamically generates the tooltip text.
                </Paragraph>
                <Paragraph>
                    When specified as a function, it accepts the same context as other formatting functions: <code>{'{data, rows, columns, row, column, value, newValue, text}'}</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/tooltips/simple.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/tooltips/simple.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/tooltips/simple.py').default
                    }
                ]} />
                <Example>
                    <TooltipSimpleExample />
                </Example>
            </Section>
            <SubHeader>Custom formatting with HTML</SubHeader>
            <Section>
                <Paragraph>
                    You can also use HTML in tooltips to add more complex formatting. The HTML will be rendered as-is, so you can use inline styles and other HTML elements.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/tooltips/html.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/tooltips/html.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/tooltips/html.py').default
                    }
                ]} />
                <Example>
                    <TooltipHtmlExample />
                </Example>
            </Section>
            <SubHeader>Styling tooltips</SubHeader>
            <Section>
                <Paragraph>
                    Tooltips can be styled using CSS. The default style is minimal, but you can customize and extend it to match your application's design. You can do it by targeting the <code>.spread-grid-tooltip</code> class in your CSS.
                </Paragraph>
            </Section>
        </>
    );
}

function TooltipSimpleExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    tooltip: ({ value }) => value > 50 ? 'Good score' : 'Bad score'
                }
            ]}
        />
    );
}

function TooltipHtmlExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    tooltip: ({ value }) => value > 50
                        ? `Good score<br><i style="color: green">${value}/100</i>`
                        : `Bad score<br><i style="color: red">${value}/100</i>`
                }
            ]}
        />
    );
}