import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import { useState } from "react";
import useInterval from "../../utils/useInterval";
import CodeBlock from "../../components/CodeBlock";
import { defaultData, defaultDataCode } from "../../utils/defaults";

function SizeCodeBlock({ size }) {
    return <CodeBlock options={[
        {
            framework: 'jsx',
            code: [
                { collapse: false },
                '<SpreadGrid',
                '  data={[',
                { collapse: true },
                ...defaultDataCode['js'],
                { collapse: false },
                '  ]}',
                '  columns={[',
                '    { type: \'DATA-BLOCK\', width: ' + size + ' },',
                '  ]}',
                '/>'
            ],
        },
        {
            framework: 'js',
            code: [
                { collapse: false },
                'createGrid(div, {',
                '  data: [',
                { collapse: true },
                ...defaultDataCode['js'],
                { collapse: false },
                '  ],',
                '  columns: [',
                '    { type: \'DATA-BLOCK\', width: ' + size + ' },',
                '  ]',
                '});'
            ],
        },
        {
            framework: 'py',
            code: [
                { collapse: false },
                'app.layout = DashSpreadGrid(',
                '  data=[',
                { collapse: true },
                ...defaultDataCode['py'],
                { collapse: false },
                '  ],',
                '  columns=[',
                '    DashSpreadGridColumn(type=\'DATA-BLOCK\', width=' + size + '),',
                '  ]',
                ')',
            ],
        }
    ]} />;
}

export default function Size() {
    const dataOptions = [
        defaultData,
        [
            { name: 'J', age: 25, score: 9, registered: true, team: 'r' },
            { name: 'A', age: 24, score: 7, registered: false, team: 'b' },
            { name: 'B', age: 26, score: 3, registered: true, team: 'b' },
            { name: 'C', age: 27, score: 6, registered: false, team: 'r' },
            { name: 'D', age: 18, score: 6, registered: true, team: 'r' },
            { name: 'E', age: 29, score: 8, registered: false, team: 'g' },
            { name: 'F', age: 30, score: 5, registered: true, team: 'b' }
        ],
        [
            { name: 'Jonathan Willis', age: 25, score: 100.02, registered: true, team: 'purple' },
            { name: 'Alice Johnson', age: 24, score: 70.04, registered: false, team: 'cornflower blue' },
            { name: 'Bob Smith', age: 26, score: 35.38, registered: true, team: 'cornflower blue' },
            { name: 'Charlie Brown', age: 27, score: 60.28, registered: false, team: 'purple' },
            { name: 'David White', age: 18, score: 60.73, registered: true, team: 'purple' },
            { name: 'Eve Black', age: 29, score: 80.92, registered: false, team: 'green' },
            { name: 'Frank Green', age: 30, score: 50.11, registered: true, team: 'cornflower blue' }
        ]
    ];

    const [index, setIndex] = useState(0);
    useInterval(() => { setIndex((index + 1) % 3); }, 1000);

    const data = dataOptions[index];

    return (
        <>
            <Header>Size</Header>
            <Paragraph>
                By default, rows and columns are sized to fit their initial content. If the dimensions of the text displayed within existing cells change, the columns/rows will not be resized (assuring better performance and consistent appearance).
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: [
                        { collapse: false },
                        '<SpreadGrid',
                        '  data={[',
                        { collapse: true },
                        ...defaultDataCode['js'],
                        { collapse: false },
                        '  ]}',
                        '/>'
                    ],
                },
                {
                    framework: 'js',
                    code: [
                        { collapse: false },
                        'createGrid(div, {',
                        '  data: [',
                        { collapse: true },
                        ...defaultDataCode['js'],
                        { collapse: false },
                        '  ]',
                        '});'
                    ],
                },
                {
                    framework: 'py',
                    code: [
                        { collapse: false },
                        'app.layout = DashSpreadGrid(',
                        '  data=[',
                        { collapse: true },
                        ...defaultDataCode['py'],
                        { collapse: false },
                        '  ],',
                        ')',
                    ],
                }
            ]} />
            <Example>
                <SpreadGrid
                    data={data}
                />
            </Example>
            <Paragraph>
                That's because the default value of the <code>width</code> and <code>height</code> properties is set to be <code>'fit-once'</code>.
            </Paragraph>
            <Paragraph>
                The <code>width</code> and <code>height</code> properties can be set manually to any of the following values:
                <ul>
                    <li><code>number</code> (e.g. <code>100</code>): the width/height of the column/row is set to a fixed value.</li>
                    <li><code>'fit-once'</code> (default): the width/height of the column/row is set to the maximum width/height of the text displayed within it when it's first rendered.</li>
                    <li><code>'fit'</code>: the width/height of the column/row is set to the maximum width/height of the text displayed within it, and it is updated whenever the text changes.</li>
                    <li><code>'fid-data-once'</code>: the width/height of the column/row is set to the maximum width/height of the data (so excluding headers and other special columns/rows) displayed within it when it's first rendered.</li>
                    <li><code>'fit-data'</code>: the width/height of the column/row is set to the maximum width/height of the data (so excluding headers and other special columns/rows) displayed within it, and it is updated whenever the data changes.</li>
                </ul>
            </Paragraph>
            <Paragraph>
                <code>100</code>:
            </Paragraph>
            <SizeCodeBlock size={100} />
            <Example>
                <SpreadGrid
                    data={data}
                    columns={[
                        { type: 'DATA-BLOCK', width: 100 },
                    ]}
                />
            </Example>
            <Paragraph>
                <code>'fit'</code>:
            </Paragraph>
            <SizeCodeBlock size="'fit'" />
            <Example>
                <SpreadGrid
                    data={data}
                    columns={[
                        { type: 'DATA-BLOCK', width: 'fit' },
                    ]}
                />
            </Example>
            <Paragraph>
                <code>'fit-once'</code>:
            </Paragraph>
            <SizeCodeBlock size="'fit-once'" />
            <Example>
                <SpreadGrid
                    data={data}
                    columns={[
                        { type: 'DATA-BLOCK', width: 'fit-once' },
                    ]}
                />
            </Example>
            <Paragraph>
                <code>'fit-data'</code>:
            </Paragraph>
            <SizeCodeBlock size="'fit-data'" />
            <Example>
                <SpreadGrid
                    data={data}
                    columns={[
                        { type: 'DATA-BLOCK', width: 'fit-data' },
                    ]}
                />
            </Example>
            <Paragraph>
                <code>'fit-data-once'</code>:
            </Paragraph>
            <SizeCodeBlock size="'fit-data-once'" />
            <Example>
                <SpreadGrid
                    data={data}
                    columns={[
                        { type: 'DATA-BLOCK', width: 'fit-data-once' },
                    ]}
                />
            </Example>
            <Paragraph>
                The above examples use the <code>DATA-BLOCK</code> selector to generate column definitions from provided data. The <code>width</code> and <code>height</code> properties can of course be also set on individual columns/rows.
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: [
                        { collapse: false },
                        '<SpreadGrid',
                        '  data={[',
                        { collapse: true },
                        ...defaultDataCode['js'],
                        { collapse: false },
                        '  ]}',
                        '  columns={[',
                        '    { id: \'name\', width: \'fit\' },',
                        '    { id: \'age\', width: 100 },',
                        '    { id: \'score\' },',
                        '    { id: \'registered\', width: 100 },',
                        '    { id: \'team\', width: \'fit-data\' }',
                        '  ]}',
                        '  rows={[',
                        '    { type: \'HEADER\', height: 50 },',
                        '    { id: 0 },',
                        '    { id: 1, height: 5 },',
                        '    { id: 2, height: \'fit-data\' },',
                        '    { id: 3 },',
                        '    { id: 4 },',
                        '    { id: 5, height: 50 },',
                        '    { id: 6 }',
                        '  ]}',
                        '/>'
                    ],
                },
                {
                    framework: 'js',
                    code: [
                        { collapse: false },
                        'createGrid(div, {',
                        '  data: [',
                        { collapse: true },
                        ...defaultDataCode['js'],
                        { collapse: false },
                        '  ],',
                        '  columns: [',
                        '    { id: \'name\', width: \'fit\' },',
                        '    { id: \'age\', width: 100 },',
                        '    { id: \'score\' },',
                        '    { id: \'registered\', width: 100 },',
                        '    { id: \'team\', width: \'fit-data\' }',
                        '  ],',
                        '  rows: [',
                        '    { type: \'HEADER\', height: 50 },',
                        '    { id: 0 },',
                        '    { id: 1, height: 5 },',
                        '    { id: 2, height: \'fit-data\' },',
                        '    { id: 3 },',
                        '    { id: 4 },',
                        '    { id: 5, height: 50 },',
                        '    { id: 6 }',
                        '  ]',
                        '});'
                    ],
                },
                {
                    framework: 'py',
                    code: [
                        { collapse: false },
                        'app.layout = DashSpreadGrid(',
                        '  data=[',
                        { collapse: true },
                        ...defaultDataCode['py'],
                        { collapse: false },
                        '  ],',
                        '  columns=[',
                        '    {"id": "name", "width": "fit"},',
                        '    {"id": "age", "width": 100},',
                        '    {"id": "score"},',
                        '    {"id": "registered", "width": 100},',
                        '    {"id": "team", "width": "fit-data"}',
                        '  ],',
                        '  rows=[',
                        '    {"type": "HEADER", "height": 50},',
                        '    {"id": 0},',
                        '    {"id": 1, "height": 5},',
                        '    {"id": 2, "height": "fit-data"},',
                        '    {"id": 3},',
                        '    {"id": 4},',
                        '    {"id": 5, "height": 50},',
                        '    {"id": 6}',
                        '  ]',
                        ')',
                    ],
                }
            ]} />
            <Example>
                <SpreadGrid
                    data={data}
                    columns={[
                        { id: 'name', width: 'fit' },
                        { id: 'age', width: 100 },
                        { id: 'score' },
                        { id: 'registered', width: 100 },
                        { id: 'team', width: 'fit-data' }
                    ]}
                    rows={[
                        { type: 'HEADER', height: 50 },
                        { id: 0},
                        { id: 1, height: 5  },
                        { id: 2, height: 'fit-data' },
                        { id: 3 },
                        { id: 4 },
                        { id: 5, height: 50 },
                        { id: 6 }
                    ]}
                />
            </Example>
        </>
    )
}