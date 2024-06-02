import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function StyleProperty() {
    return (
        <>
            <SubHeader>Style property of formatting rules</SubHeader>
            <Section>
                <Paragraph>
                    The <code>style</code> property in formatting rules controls the visual aspect of cells in the Spread Grid table. It can be either a static object with a pre-defined structure or a function that dynamically generates this object based on the cell's context.
                </Paragraph>
            </Section>
            <SubHeader>Properties</SubHeader>
            <Section>
                <Paragraph>
                    The <code>style</code> object can define several properties, including:
                </Paragraph>
            </Section>
            <Section>
                <Paragraph>
                    <code>background</code>
                </Paragraph>
                <Paragraph>
                    The background color of the cell. For example, <code>'#e0f7fa'</code> or <code>'rgb(255, 0, 0)'</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/background.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/background.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/background.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        formatting={[
                            {
                                style: { background: 'cornflowerblue' }
                            }
                        ]}
                    />
                </Example>
            </Section>
            <Section>
                <Paragraph>
                    <code>foreground</code>
                </Paragraph>
                <Paragraph>
                    The text color of the cell. For example, <code>'#00796b'</code> or <code>'red'</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/foreground.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/foreground.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/foreground.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        formatting={[
                            {
                                style: { foreground: 'darkorange' }
                            }
                        ]}
                    />
                </Example>
            </Section>
            <Section>
                <Paragraph>
                    <code>textAlign</code>
                </Paragraph>
                <Paragraph>
                    The horizontal alignment of the text within the cell. Possible values are <code>'left'</code>, <code>'center'</code>, or <code>'right'</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/text-align.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/text-align.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/text-align.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        columns={[
                            { type: 'DATA-BLOCK', width: 80 },
                        ]}
                        formatting={[
                            {
                                column: { id: 'name' },
                                style: { textAlign: 'left' }
                            },
                            {
                                column: { id: 'age' },
                                style: { textAlign: 'center' }
                            },
                            {
                                column: { id: 'score' },
                                style: { textAlign: 'right' }
                            },
                        ]}
                    />
                </Example>
            </Section>
            <Section>
                <Paragraph>
                    <code>textBaseline</code>
                </Paragraph>
                <Paragraph>
                    The vertical alignment of the text within the cell. Possible values are <code>'top'</code>, <code>'middle'</code>, or <code>'bottom'</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/text-baseline.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/text-baseline.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/text-baseline.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        rows={[
                            { type: 'HEADER' },
                            { type: 'DATA-BLOCK', height: 40 },
                        ]}
                        formatting={[
                            {
                                column: { id: 'name' },
                                style: { textBaseline: 'top' }
                            },
                            {
                                column: { id: 'age' },
                                style: { textBaseline: 'middle' }
                            },
                            {
                                column: { id: 'score' },
                                style: { textBaseline: 'bottom' }
                            },
                        ]}
                    />
                </Example>
            </Section>
            <Section>
                <Paragraph>
                    <code>highlight</code>
                </Paragraph>
                <Paragraph>
                    The color used to highlight the cell. For example, <code>'rgba(255, 235, 59, 0.5)'</code>. This property is mainly used internally by the framework to highlight cells on hover or selection.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/highlight.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/highlight.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/highlight.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        formatting={[
                            {
                                style: { highlight: 'rgba(255, 0, 0, 0.5)' }
                            }
                        ]}
                    />
                </Example>
            </Section>
            <Section>
                <Paragraph>
                    <code>border[Top/Bottom/Left/Right]</code>
                </Paragraph>
                <Paragraph>
                    The style for the border of the cell. For example, <code>{"{width: 1, color: 'red'}"}</code>.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/border.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/border.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/border.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        formatting={[
                            {
                                style: {
                                    border: { width: 3, color: 'red' },
                                }
                            }
                        ]}
                    />
                </Example>
            </Section>
            <SubHeader>Context</SubHeader>
            <Section>
                <Paragraph>
                    If the <code>style</code> is a function, it will be provided with a context object containing the following properties: <code>{'{data, rows, columns, row, column, value, newValue, text}'}</code>. Both <code>column</code> and <code>row</code> objects include an <code>id</code> property. The newValue property is only available after the cell has been edited.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/style/style.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/style/style.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/style/style.py').default
                    }
                ]} />
                <Example>
                    <StyleExample />
                </Example>
            </Section>
        </>
    );
}

function StyleExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={[
                {
                    column: { id: 'score' },
                    style: ({ value, row, data }) => ({
                        background: value > 50 ? '#a5d6a7' : '#ffcdd2',
                        foreground: value > 50 ? 'green' : 'red',
                        textAlign: 'center',
                        textBaseline: 'middle',
                        borderTop: row.id > 0 && (value > 50 ^ data[row.id - 1].score > 50)
                            ? { width: 3, color: 'purple' }
                            : { width: 1, color: 'green' }
                    })
                }
            ]}
        />
    );
}