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
            <SubHeader>IDs and selectors</SubHeader>
            <Section>
                <Paragraph>
                    Every column and row in Spread Grid has two important properties: an <code>id</code> and a <code>selector</code>.
                </Paragraph>
                <Paragraph>
                    The <code>id</code> is a unique identifier used for <strong>referencing</strong> a column or row. It appears in formatting rules, cell selection, click events, and other interactions. IDs can be numbers, strings, or even complex objects - as long as (after stringifying) they are unique within the scope of their dimension.
                </Paragraph>
                <Paragraph>
                    The <code>selector</code> is used for <strong>data access</strong>. It is the value passed to the data selector function when extracting cell values. The default data selector resolves values as <code>{"data[row.selector][column.selector]"}</code>.
                </Paragraph>
                <Paragraph>
                    When only an <code>id</code> is provided, the <code>selector</code> defaults to the same value - and vice versa. This means <code>{"{ id: 'name' }"}</code> is equivalent to <code>{"{ id: 'name', selector: 'name' }"}</code>. In many cases this default is all you need. Splitting them apart becomes useful when the value used to access data should differ from the identifier used in interactions.
                </Paragraph>
            </Section>

            <SubHeader>Indices</SubHeader>
            <Section>
                <Paragraph>
                    Columns and rows also have an auto-populated <code>index</code> property that can be accessed in formatting rules. However, the index reflects the current visual position and will change with sorting and filtering - so it is best used only for things like alternating row colors.
                </Paragraph>
            </Section>

            <SubHeader>Data-driven IDs</SubHeader>
            <Section>
                <Paragraph>
                    It is best practice to use IDs that represent the identity of the data rather than its position. When IDs are meaningful and stable, features like cell selection and editing naturally follow the data even when rows are reordered, added, or removed.
                </Paragraph>
                <Paragraph>
                    If data is provided as an <strong>object</strong> (dictionary), the object properties become both the IDs and selectors for rows. Because these are meaningful and stable, cell selection naturally follows when data is reordered.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/ids/positive.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/ids/positive.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/ids/positive.py').default }
                ]} />
                <Example>
                    <PositiveExample />
                </Example>
                <Paragraph>
                    If data is an <strong>array</strong>, row IDs default to numeric indices (<code>0</code>, <code>1</code>, <code>2</code>…). These indices describe position rather than identity - so when rows are reordered, the selection stays at the same index instead of following the data.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/ids/negative.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/ids/negative.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/ids/negative.py').default }
                ]} />
                <Example>
                    <NegativeExample />
                </Example>
            </Section>

            <SubHeader>Splitting id from selector</SubHeader>
            <Section>
                <Paragraph>
                    When data is stored as an array, selectors must be numeric indices - but numeric indices make poor IDs because they describe position, not identity. To get the best of both worlds, you can set the <code>id</code> and <code>selector</code> independently.
                </Paragraph>
                <Paragraph>
                    In the following example, each row's selector remains a numeric index (so data access works), while its ID is set to the person's name (so selection follows the data when rows move).
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/ids/explicit.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/ids/explicit.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/ids/explicit.py').default }
                ]} />
                <Example>
                    <ExplicitExample />
                </Example>
                <Paragraph>
                    IDs can also be complex objects (e.g. <code>{"{ name: 'Bob', surname: 'Smith' }"}</code>). Complex IDs require explicit selectors, since objects cannot be used as associative array indices in JavaScript.
                </Paragraph>
            </Section>

            <SubHeader>Uses of IDs</SubHeader>
            <Section>
                <Paragraph>
                    IDs appear throughout the library - in formatting rules, cell selection, click events, and editing. The following example uses a formatting rule that targets a specific cell by matching both a column ID and a row ID.
                </Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/ids/formatting.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/ids/formatting.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/ids/formatting.py').default }
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