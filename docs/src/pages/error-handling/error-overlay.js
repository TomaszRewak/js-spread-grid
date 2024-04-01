import { Component } from "react";
import CodeBlock from "../../components/CodeBlock";
import Example from "../../components/Example";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import SpreadGrid from "react-spread-gird";
import SubHeader from "../../components/SubHeader";
import { defaultData, defaultDataCode } from "../../utils/defaults";

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
            { collapse: false },
            '<SpreadGrid',
            '  data={[',
            { collapse: true },
            ...defaultDataCode['js'],
            { collapse: false },
            '  ]}',
            '  formatting={[',
            '    {',
            '      style: () => { throw new Error(\'This is an error\') }',
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
            '  ]',
            '  formatting: [',
            '    {',
            '      style: () => { throw new Error(\'This is an error\') }',
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
            '  ]',
            '  formatting=[',
            '    {',
            '      "style": "throw new Error(\'This is an error\')"',
            '    }',
            '  ]',
            ')',
          ]
        }
      ]} />
      <Example>
        <ErrorBoundary>
          <SpreadGrid
            data={defaultData}
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
            { collapse: false },
            '<SpreadGrid',
            '  data={[',
            { collapse: true },
            ...defaultDataCode['js'],
            { collapse: false },
            '  ]}',
            '  formatting=\'not an array\'',
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
            '  ]',
            '  formatting: \'not an array\'',
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
            '  ]',
            '  formatting="not an array"',
            ')',
          ]
        }
      ]} />
      <Example>
        <ErrorBoundary>
          <SpreadGrid
            data={defaultData}
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
            { collapse: false },
            '<SpreadGrid',
            '  data={[',
            { collapse: true },
            ...defaultDataCode['js'],
            { collapse: false },
            '  ]}',
            '  onCellClick={() => { throw new Error(\'This is an error\') }}',
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
            '  ]',
            '  onCellClick: () => { throw new Error(\'This is an error\') }',
            '});'
          ]
        }
      ]} />
      <Example>
        <ErrorBoundary>
          <SpreadGrid
            data={defaultData}
            onCellClick={() => { throw new Error('This is an error') }}
          />
        </ErrorBoundary>
      </Example>
    </>
  );
}