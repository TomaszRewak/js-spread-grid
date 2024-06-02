import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";
import { defaultData } from "../../utils/defaults";

export default function Introduction() {
    return (
        <>
            <SubHeader>Definition-drive approach</SubHeader>
            <Section>
                <Paragraph>
                    Columns and row are the building blocks of any table layout. They define the vertical and horizontal divisions of the grid.
                </Paragraph>
                <Paragraph>
                    They are especially important in case of the Spread Grid. Columns and rows are the first class concepts within this library. One can create a grid without any data, or that data can assume any form (including sparse representations or dynamic generators) - but not without column and row definitions. And even though the columns and rows can be derived from the data (in selected scenarios), they always form the backbone of how the grid is constructed. The difference between the two approached (the described <strong>definition-driven approach</strong> and an alternative data-driven approach) might be subtle, but it is good to keep it in mind when reading the remaining chapters of this documentation. It will help you understand topics like cell formatting and selectors.
                </Paragraph>
                <Paragraph>
                    Columns and rows are conceptually almost identical in case of the Spread Grid library. Most properties and behaviors of one of them is equally applicable to the other. One can pin both columns and rows, filter/sort them, annotate them with headers and more. This allows for creating more complex layouts, like pivot tables. The two most notable differences between columns and rows are: the way in which they are referred to in formatting selectors/callbacks and how one defines their sizes.
                </Paragraph>
            </Section>
            <SubHeader>Default behavior</SubHeader>
            <Section>
                <Paragraph>
                    If you don't specify columns or rows, they will assume the their default values (the two following examples are equivalent):
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/default.jsx').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-definitions.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/default.js').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-definitions.jsx').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/default.py').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-definitions.py').default
                    }
                ]} />
                <Paragraph>
                    The <code>"DATA-BLOCK"</code> column/row type is explained in more details in a dedicated section of the documentation. In short, it will be replaced by the framework with column/row definitions that are derived from the data. This means that our grid will consist of column headers and data cells (in the default configuration row headers are omitted).
                </Paragraph>
                <Paragraph>
                    Based on the provided data, the two following examples are equivalent:
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/expanded-definitions.jsx').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-blocks.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/expanded-definitions.js').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-blocks.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/expanded-definitions.py').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-blocks.py').default
                    }
                ]} />
                <Paragraph>
                    Finally, the individual columns/rows can be customized by providing additional properties. In the explored example they will assume default values of those properties. But for completeness, the fully expanded code would take the following form:
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/expanded-blocks.jsx').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-properties.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/expanded-blocks.js').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-properties.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/expanded-blocks.py').default,
                        equivalentCode: require('!!raw-loader!./snippets/introduction/expanded-properties.py').default
                    }
                ]} />
                <Paragraph>
                    As you can see, the framework will do quite some heavy lifting for you if you decide to rely on the default behaviors. But if you want to customize the grid layout, you can still do so by explicitly overriding the default values.
                </Paragraph>
            </Section>
            <SubHeader>Explicit definitions</SubHeader>
            <Section>
                <Paragraph>
                    When defining columns and rows explicitly, you are free to arrange the layout of the grid in any way you want. This is not limited to simply rearranging the order of entries. You can also enrich the grid using any of the special column/row types, like <code>'HEADER'</code> or <code>'FILTER'</code> (or even multiple of them - in any spot that suits your design).
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/introduction/explicit.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/introduction/explicit.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/introduction/explicit.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        columns={[
                            { id: 'name' },
                            { type: 'HEADER' },
                            { id: 'age' },
                            { id: 'score' },
                            { id: 'registered' },
                            { id: 'team' }
                        ]}
                        rows={[
                            { type: 'HEADER' },
                            { type: 'FILTER' },
                            { id: 0 },
                            { id: 1 },
                            { id: 2 },
                            { id: 3 },
                            { id: 4 },
                            { id: 5 },
                            { id: 6 },
                            { type: 'HEADER', id: 'footer' }
                        ]}
                    />
                </Example>
            </Section>
            <SubHeader>Properties</SubHeader>
            <Section>
                <Paragraph>
                    Columns/rows support following properties:
                    <ul>
                        <li><code>id</code> - unique identifier of the column/row</li>
                        <li><code>type</code> - type of the column/row</li>
                        <li><code>header</code> - header of the column/row</li>
                        <li><code>width</code>/<code>height</code> - width/height of the column/row</li>
                        <li><code>labels</code> - labels used to collectively refer to columns/rows</li>
                    </ul>
                </Paragraph>
            </Section>
        </>
    );
}