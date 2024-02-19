import './App.css';
import SpreadGrid from './spread-grid/components/SpreadGrid';
import CodeBlock from './CodeBlock';
import { Drawer, List, ListItem, ListItemButton } from '@mui/material';

function App() {
  const example = <SpreadGrid
    data={[
      { name: 'John', age: 25, score: 100 },
      { name: 'Jane', age: 24, score: 90 },
      { name: 'Jack', age: 26, score: 80 },
    ]}
  />;
  const exampleCode = [
    {
      framework: 'React',
      grammar: 'javascript',
      language: 'jsx',
      code: [
        '<SpreadGrid',
        '  data={[',
        '    { name: \'John\', age: 25, score: 100 },',
        '    { name: \'Jane\', age: 24, score: 90 },',
        '    { name: \'Jack\', age: 26, score: 80 },',
        '  ]}',
        '/>'
      ].join('\n')
    },
    {
      framework: 'js',
      grammar: 'javascript',
      language: 'javascript',
      code: [
        'createGrid(div, {',
        '  data: [',
        '    { name: \'John\', age: 25, score: 100 },',
        '    { name: \'Jane\', age: 24, score: 90 },',
        '    { name: \'Jack\', age: 26, score: 80 },',
        '  ]',
        '});'
      ].join('\n')
    }
  ];

  return (
    <>
      <Drawer variant="permanent">
        <List>
          <ListItemButton>Item 1</ListItemButton>
          <ListItemButton>Item 2</ListItemButton>
          <ListItemButton>Item 3</ListItemButton>
        </List>
      </Drawer>
      <main className="App">
        <CodeBlock language="javascript" options={exampleCode} />
        {example}
      </main>
    </>
  );
}

export default App;
