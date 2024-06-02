import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";
import { useState, useEffect, useMemo } from 'react';

export default function Ids() {
    return (
        <>
            <SubHeader>Column and row IDs</SubHeader>
            <Section>
                <Paragraph>
                    In Spread Grid, each column and row needs to be assigned a unique identifier, or ID. These IDs are crucial for managing the grid's structure and behavior. IDs are typically numerical or text values, but they can take any form, including objects. Regardless of the type, IDs must be unique within the scope of columns or rows to ensure proper identification and manipulation.
                </Paragraph>
                <Paragraph>
                    Columns and rows also have an (auto-populated) <code>index</code> property that can be accessed in format rules and data selectors. However, it is best used only for things like alternating background colors, as indices will change together with data sorting and filtering.
                </Paragraph>
                <Paragraph>
                    Object-based IDs are especially useful when working with complex data structures, but in most cases using them will require you to define a custom <code>dataSelector</code> function to extract cell values from the <code>data</code> object based on the defined IDs.
                </Paragraph>
            </Section>

            <SubHeader>Best practices for IDs</SubHeader>
            <Section>
                <Paragraph>
                    It's best to use IDs that relate to the underlying data so that if rows are added or removed, the selection in the grid follows appropriately. This practice ensures the grid remains consistent and selections remain valid as the data changes. For example, if the IDs are based on unique data points like a primary key from a database, selections (and ongoing edition) will naturally follow the data even as rows change their position.
                </Paragraph>
                <Paragraph>
                    Consider the following example where the IDs are based on unique data points. As the rows are shifted, the selection remains consistent.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/ids/positive.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/ids/positive.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/ids/positive.py').default
                    }
                ]} />
                <Example>
                    <PositiveExample />
                </Example>
                <Paragraph>
                    In contrast, if the IDs are not based on unique data points, the selection will not follow the data as it changes. In the following example, the selection will not remain consistent as the rows are shifted.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/ids/negative.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/ids/negative.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/ids/negative.py').default
                    }
                ]} />
                <Example>
                    <NegativeExample />
                </Example>
            </Section>

            <SubHeader>Uses of IDs</SubHeader>
            <Section>
                <Paragraph>
                    IDs are not only useful for maintaining grid selection but also play a crucial role in other functionalities like data formatting and editing.
                </Paragraph>
                <Paragraph>
                    Here is an example where IDs are used for formatting a specific cell within a grid.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/ids/formatting.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/ids/formatting.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/ids/formatting.py').default
                    }
                ]} />
                <Example>
                    <FormattingExample />
                </Example>
            </Section>
        </>
    );
}

// Positive Example Component
function PositiveExample() {
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

    const dataObject = useMemo(() => {
        // {Alice: {...}, Bob: {...}
        return data.reduce((acc, item) => {
            acc[item.name] = item;
            return acc;
        }, {});
    }, [data]);

    return (
        <SpreadGrid
            data={dataObject}
            selectedCells={selectedCells}
            onSelectedCellsChange={setSelectedCells}
        />
    );
}

// Negative Example Component
function NegativeExample() {
    const [data, setData] = useState(defaultData);
    const [selectedCells, setSelectedCells] = useState([
        {
            rowId: 0,
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
        />
    );
}

// Formatting Example Component
function FormattingExample() {
    return (
        <SpreadGrid
            data={defaultData}
            formatting={
                [
                    {
                        column: { id: 'name' },
                        row: { id: 2 },
                        style: { background: '#ffcccc' }
                    }
                ]
            }
        />
    );
}