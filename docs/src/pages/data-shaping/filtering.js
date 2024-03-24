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
                The SpreadGrid component supports filtering data. You can filter data by specifying a filter function that takes a row and returns a boolean.
            </Paragraph>
            <CodeBlock options={[
                {
                    framework: 'jsx',
                    code: [
                        '<SpreadGrid',
                        '  data={[',
                        '    { name: \'John\', age: 25, score: 100 },',
                        '    { name: \'Jane\', age: 24, score: 90 },',
                        '    { name: \'Jack\', age: 26, score: 80 },',
                        '  ]}',
                        '  filter={row => row.score > 90}',
                        '/>'
                    ].join('\n')
                },
                {
                    framework: 'js',
                    code: [
                        'createGrid(div, {',
                        '  data: [',
                        '    { name: \'John\', age: 25, score: 100 },',
                        '    { name: \'Jane\', age: 24, score: 90 },',
                        '    { name: \'Jack\', age: 26, score: 80 },',
                        '  ],',
                        '  filter: row => row.score > 90',
                        '});'
                    ].join('\n')
                },
                {
                    framework: 'py',
                    code: [
                        'app.layout = DashSpreadGrid(',
                        '  data=[',
                        '    {"name": "John", "age": 25, "score": 100},',
                        '    {"name": "Jane", "age": 24, "score": 90},',
                        '    {"name": "Jack", "age": 26, "score": 80}',
                        '  ],',
                        '  filter=lambda row: row["score"] > 90',
                        ')',
                    ].join('\n')
                }
            ]} />
            <Example>
                <SpreadGrid
                    data={[
                        { name: 'John', age: 25, score: 100 },
                        { name: 'Jane', age: 24, score: 90 },
                        { name: 'Jack', age: 26, score: 80 }
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