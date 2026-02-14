import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import CodeBlock from "../../components/CodeBlock";
import SubHeader from "../../components/SubHeader";
import Section from "../../components/Section";
import { defaultData } from "../../utils/defaults";

export default function DataSelector() {
    return (
        <>
            <SubHeader>Data selector</SubHeader>
            <Section>
                <Paragraph>
                    The <code>dataSelector</code> is a grid-level function that extracts cell values from the provided data. It uses the <code>selector</code> property of each column and row to locate the value. Its default implementation is: <code>{"({ data, row, column }) => data?.[row.selector]?.[column.selector]"}</code>
                </Paragraph>
                <Paragraph>
                    In most cases the default is sufficient - it works well when data is a simple object or array. But the <code>dataSelector</code> can be customized for more complex scenarios, such as sparse data representations or fully generative data.
                </Paragraph>
            </Section>
            <SubHeader>Generative data</SubHeader>
            <Section>
                <Paragraph>
                    Consider the following example of a multiplication table. The <code>dataSelector</code> is used to dynamically generate the values:
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-selector/multiplication-table.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-selector/multiplication-table.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-selector/multiplication-table.py').default
                    }
                ]} />
                <Example>
                    <MultiplicationTableExample />
                </Example>
            </Section>
            <SubHeader>Complex data types</SubHeader>
            <Section>
                <Paragraph>
                    The <code>dataSelector</code> can also be used for handling complex data types. Imagine that you want to create a comparison table to compare entity pairs side by side. In this scenario row IDs might be represented as objects like <code>{'{left: "Alice", right: "Bob"}'}</code>, and column IDs might be represented as objects like <code>{'{side: "left", property: "name"}'}</code>. Assuming that the data is structured as a dictionary of name-object pairs, the <code>dataSelector</code> function can be customized to extract cell values based on those ids: <code>{"({ data, row, column }) => data[row.id[column.id.side]][column.id.property]"}</code>.
                </Paragraph>
                <Paragraph>
                    This approach for constructing a comparison table between two entities is illustrated in the following example:
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/data-selector/comparison-table.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/data-selector/comparison-table.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/data-selector/comparison-table.py').default
                    }
                ]} />
                <Example>
                    <ComparisonTableExample />
                </Example>
            </Section>
        </>
    );
}

// Multiplication Table Example Component
function MultiplicationTableExample() {
    const columns = [
        { type: 'HEADER' },
        ...Array.from({ length: 10 }, (_, i) => ({ id: i + 1, header: (i + 1).toString() }))
    ];

    const rows = [
        { type: 'HEADER' },
        ...Array.from({ length: 10 }, (_, i) => ({ id: i + 1, header: (i + 1).toString() }))
    ];

    const dataSelector = ({ row, column }) => row.id * column.id;

    return (
        <SpreadGrid
            columns={columns}
            rows={rows}
            dataSelector={dataSelector}
        />
    );
}

// Comparison Table Example Component
function ComparisonTableExample() {
    const data = defaultData.reduce((acc, obj) => {
        acc[obj.name] = obj;
        return acc;
    }, {});

    const columns = [
        { id: { side: 'left', property: 'name' }, header: '① Name' },
        { id: { side: 'left', property: 'age' }, header: '① Age' },
        { id: { side: 'left', property: 'score' }, header: '① Score' },
        { id: { side: 'left', property: 'registered' }, header: '① Registered' },
        { id: { side: 'right', property: 'name' }, header: '② Name' },
        { id: { side: 'right', property: 'age' }, header: '② Age' },
        { id: { side: 'right', property: 'score' }, header: '② Score' },
        { id: { side: 'right', property: 'registered' }, header: '② Registered' }
    ];

    const rows = [];
    for (const left in data) {
        for (const right in data) {
            rows.push({ id: { left, right } });
        }
    }

    const dataSelector = ({ data, row, column }) => {
        return data[row.selector[column.selector.side]][column.selector.property];
    };

    return (
        <SpreadGrid
            columns={columns}
            rows={[
                { type: 'HEADER' },
                ...rows
            ]}
            data={data}
            dataSelector={dataSelector}
        />
    );
}