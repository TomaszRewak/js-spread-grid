import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import { defaultData, incompleteData } from "../../utils/defaults";
import { useState } from "react";
import Section from "../../components/Section";
import SubHeader from "../../components/SubHeader";
import CodeBlock from "../../components/CodeBlock";

export default function Sorting() {
    return (
        <>
            <SubHeader>Sorting</SubHeader>
            <Section>
                <Paragraph>
                    Sorting in Spread Grid is initiated by clicking on a header.
                </Paragraph>
                <Paragraph>
                    You can provide initial sorting criteria, though they are not required.
                </Paragraph>
                <CodeBlock separator={'or'} options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/simple.jsx').default,
                        equivalentCode: require('!!raw-loader!./snippets/sorting/default.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/simple.js').default,
                        equivalentCode: require('!!raw-loader!./snippets/sorting/default.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/simple.py').default,
                        equivalentCode: require('!!raw-loader!./snippets/sorting/default.py').default
                    }
                ]} />
                <Example>
                    <SimpleExample />
                </Example>
            </Section>
            <SubHeader>Sparse data</SubHeader>
            <Section>
                <Paragraph>
                    For sparse data, the default comparator will place empty cells at the end of the block, regardless of the sort direction.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/sparse.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/sparse.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/sparse.py').default
                    }
                ]} />
                <Example>
                    <SparseExample />
                </Example>
            </Section>
            <SubHeader>Multi-column sorting</SubHeader>
            <Section>
                <Paragraph>
                    Spread Grid supports multi-column sorting. You can sort by multiple columns by clicking them while holding the <strong>ctrl</strong> key. The order of the columns clicked will determine the priority of the sorting.
                </Paragraph>
                <Example>
                    <MultiSortExample />
                </Example>
            </Section>
            <SubHeader>Custom sorting</SubHeader>
            <Section>
                <Paragraph>
                    It's possible to define custom sorting comparators through the <code>sorting</code> property. The property accepts an array that is similar in nature to the <code>formatting</code> array. The <code>column</code> and <code>row</code> properties of each element are used to <strong>select</strong> which cells the rule should apply to (see <a href="/formatting/matching-rules">selectors</a> for more information).
                </Paragraph>
                <Paragraph>
                    The comparator function should return a boolean value indicating whether the first value is smaller than the second.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/custom.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/custom.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/custom.py').default
                    }
                ]} />
                <Example>
                    <CustomSortingExample />
                </Example>
            </Section>
            <SubHeader>Directional comparators</SubHeader>
            <Section>
                <Paragraph>
                    The <code>comparatorAsc</code> and <code>comparatorDesc</code> properties let you define separate comparators for ascending and descending sort directions. When present, they take precedence over <code>comparator</code> for that direction. If only <code>comparator</code> is provided, it is used for both directions.
                </Paragraph>
                <Paragraph>
                    In this example, ascending sort orders the score column by absolute value, while descending sort uses the natural numeric order.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/directional.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/directional.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/directional.py').default
                    }
                ]} />
                <Example>
                    <DirectionalSortingExample />
                </Example>
            </Section>
            <SubHeader>Continuous data blocks</SubHeader>
            <Section>
                <Paragraph>
                    Rows and columns are only sorted within continuous data blocks. If the block is broken (or rows/columns within the continuous block use different comparators) - those subgroups will be sorted separately.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/split.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/split.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/split.py').default
                    }
                ]} />
                <Example>
                    <SplitExample />
                </Example>
            </Section>
            <SubHeader>Row sorting</SubHeader>
            <Section>
                <Paragraph>
                    Sorting can also be applied to rows (with all the same rules as column sorting).
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/row.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/row.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/row.py').default
                    }
                ]} />
                <Example>
                    <RowExample />
                </Example>
            </Section>
            <SubHeader>Multi-header sorting</SubHeader>
            <Section>
                <Paragraph>
                    Spread Grid supports multi-header sorting, where different blocks of data are sorted independently (based of different sorting criteria).
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/multi-header.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/multi-header.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/multi-header.py').default
                    }
                ]} />
                <Example>
                    <MultiHeader />
                </Example>
                <Paragraph>
                    By default, sorting criteria sort <code>by</code> the <code>"HEADER"</code> id. If the header id is renamed without providing custom sorting criteria, sorting will not work.
                </Paragraph>
            </Section>
            <SubHeader>Manual sorting</SubHeader>
            <Section>
                <Paragraph>
                    The <code>sorting</code> property can be set to <code>'manual'</code> to disable automatic sorting. In this case, the <strong>row</strong> and <strong>column</strong> order will reflect the initial data order, despite any <code>sortBy</code> criteria.
                </Paragraph>
                <CodeBlock options={[
                    {
                        framework: 'jsx',
                        code: require('!!raw-loader!./snippets/sorting/manual.jsx').default
                    },
                    {
                        framework: 'js',
                        code: require('!!raw-loader!./snippets/sorting/manual.js').default
                    },
                    {
                        framework: 'py',
                        code: require('!!raw-loader!./snippets/sorting/manual.py').default
                    }
                ]} />
                <Example>
                    <ManualExample />
                </Example>
            </Section>
        </>
    );
}

function SimpleExample() {
    const [sortBy, setSortBy] = useState([{ columnId: "age", direction: "ASC" }]);

    return (
        <SpreadGrid
            data={[
                ...defaultData
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
        />
    );
}

function SparseExample() {
    const [sortBy, setSortBy] = useState([{ columnId: "score", direction: "ASC" }]);

    return (
        <SpreadGrid
            data={[
                ...incompleteData
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
        />
    );
}

function MultiSortExample() {
    const [sortBy, setSortBy] = useState([
        { columnId: "registered", direction: "ASC" },
        { columnId: "score", direction: "DESC" }
    ]);

    return (
        <SpreadGrid
            data={[
                ...defaultData
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
        />
    );
}

function CustomSortingExample() {
    const [sortBy, setSortBy] = useState([{ columnId: "score", direction: "DESC" }]);

    return (
        <SpreadGrid
            data={[
                { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
                { name: 'Alice', age: 24, score: -70, registered: false, team: 'blue' },
                { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
                { name: 'Charlie', age: 27, score: -60, registered: false, team: 'red' },
                { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
                { name: 'Eve', age: 29, score: 80, registered: false, team: 'green' },
                { name: 'Frank', age: 30, score: -50, registered: true, team: 'blue' }
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sorting={[
                {
                    column: { id: "score" },
                    comparator: (lhs, rhs) => Math.abs(lhs.value) < Math.abs(rhs.value),
                }
            ]}
        />
    );
}

function DirectionalSortingExample() {
    const [sortBy, setSortBy] = useState([{ columnId: "score", direction: "ASC" }]);

    return (
        <SpreadGrid
            data={[
                { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
                { name: 'Alice', age: 24, score: -70, registered: false, team: 'blue' },
                { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
                { name: 'Charlie', age: 27, score: -60, registered: false, team: 'red' },
                { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
                { name: 'Eve', age: 29, score: 80, registered: false, team: 'green' },
                { name: 'Frank', age: 30, score: -50, registered: true, team: 'blue' }
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sorting={[
                {
                    column: { id: "score" },
                    comparatorAsc: (lhs, rhs) => Math.abs(lhs.value) < Math.abs(rhs.value),
                    comparatorDesc: (lhs, rhs) => lhs.value < rhs.value,
                }
            ]}
        />
    );
}

function SplitExample() {
    const [sortBy, setSortBy] = useState([{ columnId: "score", direction: "ASC" }]);

    return (
        <SpreadGrid
            data={[
                ...defaultData
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            rows={[
                { type: "HEADER" },
                { id: 0 },
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { type: "CUSTOM" },
                { id: 4 },
                { id: 5 },
                { id: 6 }
            ]}
        />
    );
}

function RowExample() {
    const [sortBy, setSortBy] = useState([{ rowId: 2, direction: "ASC" }]);

    return (
        <SpreadGrid
            data={[
                [1, 10, 5, 15, 20, 25],
                [5, 15, 10, 20, 25, 30],
                [3, 13, 8, 18, 23, 28],
                [2, 12, 7, 17, 22, 27],
                [4, 14, 9, 19, 24, 29]
            ]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            columns={[
                { type: "HEADER", width: 30 },
                { type: "DATA-BLOCK", width: 30 },
            ]}
        />
    );
}

function MultiHeader() {
    const [sortBy, setSortBy] = useState([
        { columnId: "score", rowId: "top-header", direction: "ASC" },
        { columnId: "score", rowId: "bottom-header", direction: "DESC" }
    ]);


    return (
        <SpreadGrid
            data={[
                ...defaultData
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            rows={[
                { type: "HEADER", id: "top-header" },
                { id: 0, labels: ["sort-by-top"] },
                { id: 1, labels: ["sort-by-top"] },
                { id: 2, labels: ["sort-by-top"] },
                { id: 3, labels: ["sort-by-top"] },
                { type: "HEADER", id: "bottom-header" },
                { id: 4, labels: ["sort-by-bottom"] },
                { id: 5, labels: ["sort-by-bottom"] },
                { id: 6, labels: ["sort-by-bottom"] }
            ]}
            sorting={[
                {
                    row: { label: "sort-by-top" },
                    by: "top-header",
                },
                {
                    row: { label: "sort-by-bottom" },
                    by: "bottom-header",
                }
            ]}
        />
    );
}

function ManualExample() {
    const [sortBy, setSortBy] = useState([{ columnId: "age", direction: "ASC" }]);

    return (
        <SpreadGrid
            data={[
                ...defaultData
            ]}
            columns={[{ type: 'DATA-BLOCK', width: 70 }]}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sorting='manual'
        />
    );
}