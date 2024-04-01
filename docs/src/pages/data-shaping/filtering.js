import SpreadGrid from "react-spread-gird";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import { defaultData, defaultDataCode } from "../../utils/defaults";

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
                        ...defaultDataCode['js'],
                        { collapse: false },
                        '  ]}',
                        '  rows={[',
                        '    { type: \'HEADER\' },',
                        '    { type: \'FILTER\' },',
                        '    { type: \'DATA-BLOCK\' }',
                        '  ]}',
                        '/>'
                    ]
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
                        ...defaultDataCode['py'],
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
                    data={defaultData}
                    rows={[
                        { type: 'HEADER' },
                        { type: 'FILTER' },
                        { type: 'DATA-BLOCK' }
                    ]}
                />
            </Example>
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
                        ...defaultDataCode['js'],
                        { collapse: false },
                        '  ]}',
                        '  rows={[',
                        '    { type: \'HEADER\' },',
                        '    { type: \'FILTER\' },',
                        '    { type: \'DATA-BLOCK\' }',
                        '  ]}',
                        '  filtering={[',
                        '    {',
                        '      column: [{ id: \'age\' }, { id: \'score\' }],',
                        '      condition: ({ value, expression }) => value >= expression',
                        '    }',
                        '  ]}',
                        '/>'
                    ]
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
                        '  rows: [',
                        '    { type: \'HEADER\' },',
                        '    { type: \'FILTER\' },',
                        '    { type: \'DATA-BLOCK\' }',
                        '  ],',
                        '  filtering: [',
                        '    {',
                        '      column: [{ id: \'age\' }, { id: \'score\' }],',
                        '      condition: ({ value, expression }) => value >= expression',
                        '    }',
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
                        ...defaultDataCode['py'],
                        { collapse: false },
                        '  ],',
                        '  rows=[',
                        '    {"type": "HEADER"},',
                        '    {"type": "FILTER"},',
                        '    {"type": "DATA-BLOCK"}',
                        '  ],',
                        '  filtering=[',
                        '    {',
                        '      "column": [{"id": "age"}, {"id": "score"}],',
                        '      "condition": "value >= expression"',
                        '    }',
                        '  ]',
                        ')',
                    ]
                }
            ]} />
            <Example>
                <SpreadGrid
                    data={defaultData}
                    rows={[
                        { type: 'HEADER' },
                        { type: 'FILTER' },
                        { type: 'DATA-BLOCK' }
                    ]}
                    filtering={[
                        {
                            column: [{ id: 'age' }, { id: 'score' }],
                            condition: ({ value, expression }) => value >= expression
                        }
                    ]}
                />
            </Example>
        </>
    )
}