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
                    By default, if no custom definitions are provided, the Spread Grid will generate ids out of indices found in the provided data.
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

            <SubHeader>Explicit IDs</SubHeader>
            <Section>
                <Paragraph>
                    You don't need to change the shape of your data in order to specify unique IDs. Even when specifying data as an array of objects, each of those objects can be assigned as explicit unique ID that is independent from the row index.
                </Paragraph>
                <Paragraph>
                    In practice, this is the difference between the <code>id</code> and the <code>selector</code> or a row/column. The <code>id</code> is used to identify the row during interactions and formatting, while <code>selector</code> is being used to extract cell values from the data.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/ids/explicit.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/ids/explicit.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/ids/explicit.py').default
                    }
                ]} />
                <Example>
                    <ExplicitExample />
                </Example>
                <Paragraph>
                    It's important to remember this distinction. As whenever the <code>selector</code> is not provided, it will just assume the same value as the <code>id</code>. But it's not always the desired behavior.
                </Paragraph>
                <Paragraph>
                    Using distinct ids and selectors is, in many cases, the only way of maintaining complex ids (which are useful when implementing grid interactions). For example IDs like <code>&#123;name: "Bob", surname: "Smith"&#125;</code> can be used only if explicit selectors are defined. This is because in JS associative arrays cannot be keyed on complex objects and therefor cannot be used as basic selectors. But when splitting them up, the selector can still be the index of a row, while the ID can assume a more complex form.
                </Paragraph>
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

function ExplicitExample() {
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
                { id: data[0].name, selector: 0 },
                { id: data[1].name, selector: 1 },
                { id: data[2].name, selector: 2 },
                { id: data[3].name, selector: 3 },
                { id: data[4].name, selector: 4 },
                { id: data[5].name, selector: 5 },
                { id: data[6].name, selector: 6 },
            ]}
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