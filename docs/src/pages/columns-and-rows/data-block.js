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
                    The <code>DATA-BLOCK</code> type is used to dynamically generate columns or rows based on the provided data. This type simplifies the creation of grids by automatically deriving column or row definitions from the data set.
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
                    This means that when an array is encountered, each index is treated as a separate column/row. When an object is encountered, each key is treated as a separate column/row.
                </Paragraph>
            </Section>

            <SubHeader>Selectors</SubHeader>
            <Section>
                <Paragraph>
                    The <code>DATA-BLOCK</code> type supports a special <code>selector</code> property that allows for customizing the key selection process. This can be useful when you need more control over which keys are used to generate columns or rows.
                </Paragraph>
                <Paragraph>
                    When using a custom <code>DATA-BLOCK</code> selector, you might also need to provide a <code>dataSelector</code> to specify how the data should be retrieved. The <code>data-selector</code> function has access to the <code>data</code>, <code>column</code>, and <code>row</code> properties (were both the column and row are objects with an <code>selector</code> property).
                </Paragraph>
                <Paragraph>
                    For example, you can use a <code>dataSelector</code> function like this <code>column.selector * row.selector + data.offset</code> to calculate cell values (without having to store them in the data object directly).
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
                    Independently from the <code>selector</code> you can also specify a custom <code>id</code> function which will assign a unique identifier to each of the rows and/or columns.
                </Paragraph>
                <Paragraph>
                    It should accept an object with two fields (<code>data</code> and <code>selector</code>) as a parameter and produce a unique identifier of any form (a string, int, object, array...). This identifier will be used to maintain cell selection (even when the order of row changes) and to apply formatting rules.
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