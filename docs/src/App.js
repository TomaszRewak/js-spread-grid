import './App.css';
import SpreadGrid from './spread-grid/components/SpreadGrid';

function App() {
  const example = <SpreadGrid
    data={[
      { name: 'John', age: 25, score: 100 },
      { name: 'Jane', age: 24, score: 90 },
      { name: 'Jack', age: 26, score: 80 },
    ]}
  />;
  const exampleCode = [
    '<SpreadGrid',
    '  data={[',
    '    { name: \'John\', age: 25, score: 100 },',
    '    { name: \'Jane\', age: 24, score: 90 },',
    '    { name: \'Jack\', age: 26, score: 80 },',
    '  ]}',
    '/>'
  ].join('\n');

  return (
    <div className="App">
      <code className="language-js">
        <pre>
          {exampleCode}
        </pre>
      </code>
      {example}
    </div>
  );
}

export default App;
