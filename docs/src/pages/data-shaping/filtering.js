import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";

export default function Filtering() {
    return (
        <>
            <Header>Filtering</Header>
            <Paragraph>
                TODO
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: [
                        { collapse: false },
                        '<SpreadGrid',
                        '  data={[',
                        { collapse: true },
                        '    { name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
                        '    { name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
                        '    { name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
                        '    { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
                        '    { name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
                        '    { name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
                        '    { name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }',
                        { collapse: false },
                        '  ]}',
                        '  rows={[',
                        '    { type: \'HEADER\' },',
                        '    { type: \'FILTER\' },',
                        '    { type: \'DATA-BLOCK\' }',
                        '  ]}',
                        '/>'
                    ],
                    collapse: [3, 9]
                },
                {
                    framework: 'js',
                    code: [
                        { collapse: false },
                        'createGrid(div, {',
                        '  data: [',
                        { collapse: true },
                        '    { name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
                        '    { name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
                        '    { name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
                        '    { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
                        '    { name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
                        '    { name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
                        '    { name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }',
                        { collapse: false },
                        '  ],',
                        '  rows: [',
                        '    { type: \'HEADER\' },',
                        '    { type: \'FILTER\' },',
                        '    { type: \'DATA-BLOCK\' }',
                        '  ]',
                        '});'
                    ]
                },
                {
                    framework: 'py',
                    code: [
                        { collapse: false },
                        'app.layout = DashSpreadGrid(',
                        '  data=[',
                        { collapse: true },
                        '    {"name": "John", "age": 25, "score": 100, "registered": True, "team": "red"},',
                        '    {"name": "Alice", "age": 24, "score": 70, "registered": False, "team": "blue"},',
                        '    {"name": "Bob", "age": 26, "score": 35, "registered": True, "team": "blue"},',
                        '    {"name": "Charlie", "age": 27, "score": 60, "registered": False, "team": "red"},',
                        '    {"name": "David", "age": 18, "score": 60, "registered": True, "team": "red"},',
                        '    {"name": "Eve", "age": 29, "score": 80, "registered": False, "team": "green"},',
                        '    {"name": "Frank", "age": 30, "score": 50, "registered": True, "team": "blue"}',
                        { collapse: false },
                        '  ],',
                        '  rows=[',
                        '    {"type": "HEADER"},',
                        '    {"type": "FILTER"},',
                        '    {"type": "DATA-BLOCK"}',
                        '  ]',
                        ')',
                    ]
                }
            ]} />
            <Example>
                <SpreadGrid
                    data={[
                        { name: 'John', age: 25, score: 100, registered: true, team: 'red' },
                        { name: 'Alice', age: 24, score: 70, registered: false, team: 'blue' },
                        { name: 'Bob', age: 26, score: 35, registered: true, team: 'blue' },
                        { name: 'Charlie', age: 27, score: 60, registered: false, team: 'red' },
                        { name: 'David', age: 18, score: 60, registered: true, team: 'red' },
                        { name: 'Eve', age: 29, score: 80, registered: false, team: 'green' },
                        { name: 'Frank', age: 30, score: 50, registered: true, team: 'blue' }
                    ]}
                    rows={[
                        { type: 'HEADER' },
                        { type: 'FILTER' },
                        { type: 'DATA-BLOCK' }
                    ]}
                />
            </Example>
        </>
    )
}