import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";
import { useState, useEffect } from 'react';

export default function DataBlock() {
    return (
        <>
            <SubHeader>Auto-generating rows and columns</SubHeader>
            <Section>
                <Paragraph>
                    The <code>DATA-BLOCK</code> type dynamically generates columns or rows based on the provided data. It derives definitions by examining the data structure, simplifying grid creation when the columns or rows directly reflect the data.
                </Paragraph>
                <Paragraph>
                    The following examples demonstrate how to use the <code>DATA-BLOCK</code> type for columns and rows.
                </Paragraph>
            </Section>

            <SubHeader>DATA-BLOCK columns</SubHeader>
            <Section>
                <Paragraph>
                    When using <code>DATA-BLOCK</code> as a column type, the columns are derived from the data keys. This can be especially useful when working with dynamic or unknown datasets where the properties are not known in advance.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-block/columns.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-block/columns.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-block/columns.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        columns={[
                            { type: 'DATA-BLOCK' },
                        ]}
                    />
                </Example>
            </Section>

            <SubHeader>DATA-BLOCK rows</SubHeader>
            <Section>
                <Paragraph>
                    Similar to columns, the <code>DATA-BLOCK</code> row type generates rows based on the provided data. This is useful when the rows are dynamic - being constantly added or removed from the dataset.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-block/rows.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-block/rows.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-block/rows.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        rows={[
                            { type: 'HEADER' },
                            { type: 'DATA-BLOCK' },
                        ]}
                    />
                </Example>
            </Section>

            <SubHeader>Unfolding columns and rows</SubHeader>
            <Section>
                <Paragraph>
                    The <code>DATA-BLOCK</code> type unfolds columns and rows based on the structure of the data:
                </Paragraph>
                <ul>
                    <li>For rows, it looks by default at the top level of the data object.</li>
                    <li>For columns, it iterates over all objects discovered as rows and gets all of their unique properties.</li>
                </ul>
                <Paragraph>
                    This means that when an array is encountered, each index is treated as a separate column/row. When an object is encountered, each property is treated as a separate column/row.
                </Paragraph>
            </Section>

            <SubHeader>Selectors</SubHeader>
            <Section>
                <Paragraph>
                    By default, <code>DATA-BLOCK</code> discovers selectors automatically - iterating over array indices or object properties. You can override this by providing a <code>selector</code> function on the <code>DATA-BLOCK</code> definition. This function receives the data and returns an array of selectors that will be used to generate the individual columns or rows.
                </Paragraph>
                <Paragraph>
                    Note that the <code>selector</code> here means something different than the <code>selector</code> property on a static column or row. On an individual dimension, <code>selector</code> is a single value used for data access. On a <code>DATA-BLOCK</code>, it is a function that returns the <em>list</em> of values used to create the dimensions.
                </Paragraph>
                <Paragraph>
                    When using custom selector generation, you will typically also need a custom <code>dataSelector</code> to define how cell values are extracted from your data structure.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-block/selector.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-block/selector.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-block/selector.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={{ columns: 10, rows: 10, offset: 5 }}
                        columns={[
                            {
                                type: 'DATA-BLOCK',
                                selector: ({ data }) => Array.from({ length: data.columns }, (_, index) => index + 1),
                            },
                        ]}
                        rows={[
                            {
                                type: 'DATA-BLOCK',
                                selector: ({ data }) => Array.from({ length: data.rows }, (_, index) => index + 1),
                            },
                        ]}
                        dataSelector={({ data, column, row }) => column.selector * row.selector + data.offset}
                    />
                </Example>
            </Section>

            <SubHeader>Generating IDs</SubHeader>
            <Section>
                <Paragraph>
                    By default, <code>DATA-BLOCK</code> uses each selector value as both the ID and selector for the generated dimensions. You can override this by providing a custom <code>id</code> function that assigns a unique identifier to each generated column or row.
                </Paragraph>
                <Paragraph>
                    The function receives an object with <code>data</code> and <code>selector</code> fields and should return a unique identifier (a string, number, object, or array). This identifier will be used for cell selection, formatting rules, and other interactions - just as described in the IDs and selectors page.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-block/ids.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-block/ids.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-block/ids.py').default
                    }
                ]} />
                <Example>
                    <IdsExample />
                </Example>
            </Section>

            <SubHeader>Property inheritance</SubHeader>
            <Section>
                <Paragraph>
                    Properties assigned to the <code>DATA-BLOCK</code> columns/rows get assigned to the unfolded ones. This means that any additional properties specified for the <code>DATA-BLOCK</code> will be inherited by the dynamically generated columns or rows.
                </Paragraph>
                <Paragraph>
                    For example, if you specify a width for a <code>DATA-BLOCK</code> column, these properties will be applied to all the unfolded columns. Similarly, if you specify a height for a <code>DATA-BLOCK</code> row, it will be applied to all the unfolded rows.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-block/inheritance.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-block/inheritance.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-block/inheritance.py').default
                    }
                ]} />
                <Example>
                    <SpreadGrid
                        data={defaultData}
                        columns={[
                            { type: 'DATA-BLOCK', width: 50 },
                        ]}
                        rows={[
                            { type: 'DATA-BLOCK', height: 50 },
                        ]}
                    />
                </Example>
            </Section>
        </>
    );
}

function IdsExample() {
    const [data, setData] = useState(defaultData);
    const [selectedCells, setSelectedCells] = useState([
        {
            rowId: 'Alice',
            columnId: 'name'
        }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setData((prevData) => {
                const length = prevData.length;
                return [prevData[length - 1], ...prevData.slice(0, length - 1)];
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SpreadGrid
            data={data}
            selectedCells={selectedCells}
            onSelectedCellsChange={setSelectedCells}
            rows={[
                { type: 'HEADER' },
                {
                    type: 'DATA-BLOCK',
                    id: ({ data, selector }) => data[selector].name
                }
            ]}
        />
    );
}