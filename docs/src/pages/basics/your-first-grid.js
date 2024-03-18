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
          code: [
            'createGrid(div, {',
            '  data: [',
            '    { name: \'John\', age: 25, score: 100 },',
            '    { name: \'Jane\', age: 24, score: 90 },',
            '    { name: \'Jack\', age: 26, score: 80 },',
            '  ]',
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
            '  ]',
            ')',
          ].join('\n')
        }
      ]} />
      <Example>
        <SpreadGrid
          data={[
            { name: 'John', age: 25, score: 100 },
            { name: 'Jane', age: 24, score: 90 },
            { name: 'Jack', age: 26, score: 80 },
          ]}
        />
      </Example>
    </>
  );
}