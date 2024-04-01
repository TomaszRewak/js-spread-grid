import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import SpreadGrid from "react-spread-gird";

export default function YourFirstGrid() {
  return (
    <>
      <Header>Your first grid</Header>
      <Paragraph>
        The SpreadGrid component is a simple way to display a grid of data in a table format. It is designed to be easy to use and easy to understand.
      </Paragraph>
      <CodeBlock options={[
        {
          framework: 'jsx',
          code: [
            { collapse: false},
            'function YourFirstGrid() {',
            '  return (',
            '    <SpreadGrid',
            '      data={[',
            '        { name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
            '        { name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
            '        { name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
            '        { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
            '        { name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
            '        { name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
            '        { name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }',
            '      ]}',
            '    />',
            '  );',
            '}'
          ]
        },
        {
          framework: 'js',
          code: [
            { collapse: false},
            'const div = document.getElementById(\'grid\');',
            '',
            'createGrid(div, {',
            '  data: [',
            '    { name: \'John\', age: 25, score: 100, registered: true, team: \'red\' },',
            '    { name: \'Alice\', age: 24, score: 70, registered: false, team: \'blue\' },',
            '    { name: \'Bob\', age: 26, score: 35, registered: true, team: \'blue\' },',
            '    { name: \'Charlie\', age: 27, score: 60, registered: false, team: \'red\' },',
            '    { name: \'David\', age: 18, score: 60, registered: true, team: \'red\' },',
            '    { name: \'Eve\', age: 29, score: 80, registered: false, team: \'green\' },',
            '    { name: \'Frank\', age: 30, score: 50, registered: true, team: \'blue\' }',
            '  ]',
            '});'
          ]
        },
        {
          framework: 'py',
          code: [
            { collapse: false},
            'import dash',
            '',
            'app = dash.Dash(__name__)',
            '',
            'app.layout = DashSpreadGrid(',
            '  data=[',
            '    {"name": "John", "age": 25, "score": 100, "registered": True, "team": "red"},',
            '    {"name": "Alice", "age": 24, "score": 70, "registered": False, "team": "blue"},',
            '    {"name": "Bob", "age": 26, "score": 35, "registered": True, "team": "blue"},',
            '    {"name": "Charlie", "age": 27, "score": 60, "registered": False, "team": "red"},',
            '    {"name": "David", "age": 18, "score": 60, "registered": True, "team": "red"},',
            '    {"name": "Eve", "age": 29, "score": 80, "registered": False, "team": "green"},',
            '    {"name": "Frank", "age": 30, "score": 50, "registered": True, "team": "blue"}',
            '  ]',
            ')',
            '',
            'if __name__ == \'__main__\':',
            '    app.run_server(debug=True)'
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
        />
      </Example>
    </>
  );
}