import { Component } from "react";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import SpreadGrid from "react-spread-gird";
import SubHeader from "../../components/SubHeader";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return {};
  }

  render() {
    return this.props.children;
  }
}

export default function ErrorOverlay() {
  return (
    <>
      <Header>Exceptions</Header>
      <SubHeader>Rendering errors</SubHeader>
      <Paragraph>
        If an exception is thrown while rendering the grid, the grid will not be rendered and the error (together with the stack trace) will be displayed instead.
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
            '  formatting={[',
            '    {',
            '      style: () => { throw new Error(\'This is an error\') }',
            '    }',
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
            '  formatting: [',
            '    {',
            '      style: () => { throw new Error(\'This is an error\') }',
            '    }',
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
            '  formatting=[',
            '    {',
            '      "style": "throw new Error(\'This is an error\')"',
            '    }',
            '  ]',
            ')',
          ].join('\n')
        }
      ]} />
      <Example>
        <ErrorBoundary>
          <SpreadGrid
            data={[
              { name: 'John', age: 25, score: 100 },
              { name: 'Jane', age: 24, score: 90 },
              { name: 'Jack', age: 26, score: 80 },
            ]}
            formatting={[
              {
                style: () => { throw new Error('This is an error') }
              }
            ]}
          />
        </ErrorBoundary>
      </Example>
      <SubHeader>Pre-render errors</SubHeader>
      <Paragraph>
        The same applies to the pre-render errors, that happen during the data processing.
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
            '  formatting=\'not an array\'',
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
            '  formatting: \'not an array\'',
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
            '  formatting="not an array"',
            ')',
          ].join('\n')
        }
      ]} />
      <Example>
        <ErrorBoundary>
          <SpreadGrid
            data={[
              { name: 'John', age: 25, score: 100 },
              { name: 'Jane', age: 24, score: 90 },
              { name: 'Jack', age: 26, score: 80 },
            ]}
            formatting='not an array'
          />
        </ErrorBoundary>
      </Example>
      <SubHeader>Event-based errors</SubHeader>
      <Paragraph>
        Finally, if an error occurs when handling an event, the same mechanism applies.
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
            '  onCellClick={() => { throw new Error(\'This is an error\') }}',
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
            '  onCellClick: () => { throw new Error(\'This is an error\') }',
            '});'
          ].join('\n')
        }
      ]} />
      <Example>
        <ErrorBoundary>
          <SpreadGrid
            data={[
              { name: 'John', age: 25, score: 100 },
              { name: 'Jane', age: 24, score: 90 },
              { name: 'Jack', age: 26, score: 80 },
            ]}
            onCellClick={() => { throw new Error('This is an error') }}
          />
        </ErrorBoundary>
      </Example>
    </>
  );
}